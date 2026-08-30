import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tokenize } from '../src/engine/text.ts';
import type { ModelFile, ModelMetrics } from '../src/engine/model.ts';
import { buildCorpus, mulberry32, TEMPLATE_COUNTS, type Sample } from './corpus.ts';
import { HOLDOUT } from './holdout.ts';
import { analyze, type LayerMask } from '../src/engine/analyze.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/model.json');

const MIN_DF = 3;
const MAX_VOCAB = 6000;
const NB_ALPHA = 0.2;
const LR_EPOCHS = 60;
const LR_L2 = 1e-4;
const SEED = 20260825;

const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, z))));

interface Doc {
  counts: Map<number, number>;
  vec: [number, number][];
  label: 0 | 1;
  category: string;
}

function buildVocab(docs: string[][]): { vocab: string[]; idf: number[] } {
  const df = new Map<string, number>();
  for (const toks of docs) {
    for (const t of new Set(toks)) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const n = docs.length;
  const kept = [...df.entries()]
    .filter(([, c]) => c >= MIN_DF && c <= n * 0.92)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .slice(0, MAX_VOCAB);
  const vocab = kept.map(([t]) => t);
  const idf = kept.map(([, c]) => Math.log((1 + n) / (1 + c)) + 1);
  return { vocab, idf };
}

function vectorize(
  toks: string[],
  index: Map<string, number>,
  idf: number[],
): { counts: Map<number, number>; vec: [number, number][] } {
  const counts = new Map<number, number>();
  for (const t of toks) {
    const i = index.get(t);
    if (i !== undefined) counts.set(i, (counts.get(i) ?? 0) + 1);
  }
  const vec: [number, number][] = [];
  let norm = 0;
  for (const [i, c] of counts) {
    const v = (1 + Math.log(c)) * idf[i]!;
    vec.push([i, v]);
    norm += v * v;
  }
  norm = Math.sqrt(norm) || 1;
  for (const e of vec) e[1] /= norm;
  return { counts, vec };
}

function fitLogistic(docs: Doc[], dim: number, seed: number) {
  const w = new Float64Array(dim);
  let b = 0;
  const rnd = mulberry32(seed);
  const order = docs.map((_, i) => i);

  for (let epoch = 0; epoch < LR_EPOCHS; epoch++) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    const lr = 0.6 / (1 + 0.06 * epoch);
    for (const idx of order) {
      const d = docs[idx]!;
      let z = b;
      for (const [k, v] of d.vec) z += w[k]! * v;
      const err = sigmoid(z) - d.label;
      for (const [k, v] of d.vec) w[k]! -= lr * (err * v + LR_L2 * w[k]!);
      b -= lr * err;
    }
  }
  return { w: Array.from(w), b };
}

function fitNaiveBayes(docs: Doc[], dim: number) {
  const totals = [new Float64Array(dim), new Float64Array(dim)];
  const sums = [0, 0];
  const priors = [0, 0];
  for (const d of docs) {
    priors[d.label]!++;
    for (const [k, c] of d.counts) {
      totals[d.label]![k]! += c;
      sums[d.label]! += c;
    }
  }
  const logLik = totals.map((t, c) =>
    Array.from(t, (v) => Math.log((v + NB_ALPHA) / (sums[c]! + NB_ALPHA * dim))),
  ) as [number[], number[]];
  const n = docs.length;
  return {
    logLik,
    logPrior: [Math.log(priors[0]! / n), Math.log(priors[1]! / n)] as [number, number],
  };
}

function zScores(
  d: Doc,
  lr: { w: number[]; b: number },
  nb: { logLik: [number[], number[]]; logPrior: [number, number] },
) {
  let zLr = lr.b;
  for (const [k, v] of d.vec) zLr += lr.w[k]! * v;
  let ham = nb.logPrior[0];
  let scam = nb.logPrior[1];
  let n = 0;
  for (const [k, c] of d.counts) {
    ham += c * nb.logLik[0]![k]!;
    scam += c * nb.logLik[1]![k]!;
    n += c;
  }
  return { zLr, zNb: n > 0 ? (scam - ham) / Math.sqrt(n) : 0 };
}

function fitStacker(rows: { zLr: number; zNb: number; label: 0 | 1 }[]): [number, number, number] {
  let s0 = 0;
  let s1 = 1;
  let s2 = 1;
  for (let epoch = 0; epoch < 4000; epoch++) {
    let g0 = 0;
    let g1 = 0;
    let g2 = 0;
    for (const r of rows) {
      const e = sigmoid(s0 + s1 * r.zLr + s2 * r.zNb) - r.label;
      g0 += e;
      g1 += e * r.zLr;
      g2 += e * r.zNb;
    }
    const n = rows.length;
    const lr = 0.5;
    s0 -= (lr * g0) / n;
    s1 -= (lr * g1) / n;
    s2 -= (lr * g2) / n;
  }
  return [s0, s1, s2];
}

function rocAuc(scores: number[], labels: number[]): number {
  const pairs = scores.map((s, i) => ({ s, y: labels[i]! })).sort((a, b) => a.s - b.s);
  const ranks = new Array<number>(pairs.length);
  for (let i = 0; i < pairs.length; ) {
    let j = i;
    while (j + 1 < pairs.length && pairs[j + 1]!.s === pairs[i]!.s) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) ranks[k] = avg;
    i = j + 1;
  }
  let sumPos = 0;
  let nPos = 0;
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i]!.y === 1) {
      sumPos += ranks[i]!;
      nPos++;
    }
  }
  const nNeg = pairs.length - nPos;
  if (nPos === 0 || nNeg === 0) return 0.5;
  return (sumPos - (nPos * (nPos + 1)) / 2) / (nPos * nNeg);
}

function metrics(probs: number[], labels: number[], threshold = 0.5): ModelMetrics {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  probs.forEach((p, i) => {
    const yhat = p >= threshold ? 1 : 0;
    const y = labels[i]!;
    if (y === 1 && yhat === 1) tp++;
    else if (y === 0 && yhat === 1) fp++;
    else if (y === 0 && yhat === 0) tn++;
    else fn++;
  });
  const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 1 : tp / (tp + fn);

  const calibration: ModelMetrics['calibration'] = [];
  for (let b = 0; b < 10; b++) {
    const lo = b / 10;
    const hi = (b + 1) / 10;
    const idx = probs
      .map((p, i) => ({ p, y: labels[i]!, i }))
      .filter((r) => (b === 9 ? r.p >= lo && r.p <= 1 : r.p >= lo && r.p < hi));
    if (idx.length === 0) continue;
    calibration.push({
      bin: +((lo + hi) / 2).toFixed(2),
      predicted: +(idx.reduce((a, r) => a + r.p, 0) / idx.length).toFixed(4),
      observed: +(idx.reduce((a, r) => a + r.y, 0) / idx.length).toFixed(4),
      n: idx.length,
    });
  }

  const sweep: ModelMetrics['sweep'] = [];
  for (let t = 5; t <= 95; t += 5) {
    const th = t / 100;
    let a = 0;
    let bfp = 0;
    let cfn = 0;
    probs.forEach((p, i) => {
      const yhat = p >= th ? 1 : 0;
      const y = labels[i]!;
      if (y === 1 && yhat === 1) a++;
      else if (y === 0 && yhat === 1) bfp++;
      else if (y === 1 && yhat === 0) cfn++;
    });
    sweep.push({
      threshold: th,
      precision: +(a + bfp === 0 ? 1 : a / (a + bfp)).toFixed(4),
      recall: +(a + cfn === 0 ? 1 : a / (a + cfn)).toFixed(4),
    });
  }

  return {
    accuracy: +((tp + tn) / probs.length).toFixed(4),
    precision: +precision.toFixed(4),
    recall: +recall.toFixed(4),
    f1: +(precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall)).toFixed(4),
    rocAuc: +rocAuc(probs, labels).toFixed(4),
    confusion: [
      [tn, fp],
      [fn, tp],
    ],
    calibration,
    sweep,
  };
}

function main() {
  console.log('Building corpus…');
  const corpus = buildCorpus(SEED);
  const rnd = mulberry32(SEED + 7);
  const shuffled = corpus.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const nTrain = Math.floor(shuffled.length * 0.7);
  const nStack = Math.floor(shuffled.length * 0.15);
  const trainRaw = shuffled.slice(0, nTrain);
  const stackRaw = shuffled.slice(nTrain, nTrain + nStack);
  const testRaw = shuffled.slice(nTrain + nStack);
  console.log(
    `  ${corpus.length} messages from ${TEMPLATE_COUNTS.scam} scam + ${TEMPLATE_COUNTS.ham} legitimate templates`,
  );
  console.log(`  split: train ${trainRaw.length} / stack ${stackRaw.length} / test ${testRaw.length}`);

  const trainToks = trainRaw.map((s) => tokenize(s.text));
  const { vocab, idf } = buildVocab(trainToks);
  const index = new Map(vocab.map((t, i) => [t, i]));
  console.log(`  vocabulary: ${vocab.length} features`);

  const toDoc = (s: Sample): Doc => {
    const { counts, vec } = vectorize(tokenize(s.text), index, idf);
    return { counts, vec, label: s.label, category: s.category };
  };
  const train = trainRaw.map(toDoc);
  const stack = stackRaw.map(toDoc);
  const test = testRaw.map(toDoc);
  const holdout = HOLDOUT.map(toDoc);

  console.log('Fitting logistic regression…');
  const lr = fitLogistic(train, vocab.length, SEED + 11);
  console.log('Fitting naive Bayes…');
  const nb = fitNaiveBayes(train, vocab.length);
  console.log('Fitting stacker / calibration…');
  const stacker = fitStacker(
    stack.map((d) => ({ ...zScores(d, lr, nb), label: d.label })),
  );

  const predict = (d: Doc) => {
    const { zLr, zNb } = zScores(d, lr, nb);
    return sigmoid(stacker[0] + stacker[1] * zLr + stacker[2] * zNb);
  };

  const internal = metrics(test.map(predict), test.map((d) => d.label));
  const external = metrics(holdout.map(predict), holdout.map((d) => d.label));

  const show = (name: string, m: ModelMetrics) =>
    console.log(
      `  ${name.padEnd(22)} acc ${m.accuracy.toFixed(3)}  P ${m.precision.toFixed(3)}  ` +
        `R ${m.recall.toFixed(3)}  F1 ${m.f1.toFixed(3)}  AUC ${m.rocAuc.toFixed(3)}`,
    );
  console.log('\nResults');
  show('internal test split', internal);
  show('hand-written holdout', external);

  const byCat = new Map<string, { n: number; ok: number }>();
  holdout.forEach((d) => {
    const p = predict(d);
    const ok = (p >= 0.5 ? 1 : 0) === d.label;
    const rec = byCat.get(d.category) ?? { n: 0, ok: 0 };
    rec.n++;
    if (ok) rec.ok++;
    byCat.set(d.category, rec);
  });
  console.log('\nHoldout accuracy by category');
  [...byCat.entries()]
    .sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n)
    .forEach(([c, r]) => console.log(`  ${c.padEnd(22)} ${r.ok}/${r.n}`));

  const misses = HOLDOUT.map((s, i) => ({ s, p: predict(holdout[i]!) })).filter(
    (r) => (r.p >= 0.5 ? 1 : 0) !== r.s.label,
  );
  if (misses.length) {
    console.log(`\n${misses.length} holdout errors (model layer alone):`);
    for (const m of misses.slice(0, 12)) {
      console.log(`  [${m.s.label} -> ${m.p.toFixed(2)}] ${m.s.text.slice(0, 92)}`);
    }
  }

  const provisional: ModelFile = {
    version: '1.0.0',
    createdAt: '',
    vocab,
    idf,
    nbLogLik: nb.logLik,
    nbLogPrior: nb.logPrior,
    lrWeights: lr.w,
    lrBias: lr.b,
    stacker,
    train: { total: 0, scam: 0, ham: 0, vocabSize: vocab.length },
    metrics: external,
    metricsInternal: internal,
  };
  const fused = HOLDOUT.map((s) => analyze(provisional, s.text).score / 100);
  const fusedMetrics = metrics(fused, HOLDOUT.map((s) => s.label), 0.5);
  show('full pipeline (holdout)', fusedMetrics);

  const CONFIGS: { id: string; layers: LayerMask }[] = [
    { id: 'model', layers: { model: true, rules: false, links: false, headers: false } },
    { id: 'rules', layers: { model: false, rules: true, links: false, headers: false } },
    { id: 'links', layers: { model: false, rules: false, links: true, headers: false } },
    { id: 'headers', layers: { model: false, rules: false, links: false, headers: true } },
    { id: 'model+rules', layers: { model: true, rules: true, links: false, headers: false } },
    { id: 'model+rules+links', layers: { model: true, rules: true, links: true, headers: false } },
    { id: 'all', layers: {} },
  ];

  const labels = HOLDOUT.map((h) => h.label);
  const ablation = CONFIGS.map(({ id, layers }) => ({
    id,
    metrics: metrics(
      HOLDOUT.map((h) => analyze(provisional, h.text, layers).score / 100),
      labels,
    ),
  }));

  console.log('\nAblation on the holdout (threshold 0.50)');
  for (const a of ablation) {
    const m = a.metrics;
    console.log(
      `  ${a.id.padEnd(19)} acc ${m.accuracy.toFixed(3)}  P ${m.precision.toFixed(3)}  ` +
        `R ${m.recall.toFixed(3)}  F1 ${m.f1.toFixed(3)}`,
    );
  }

  const fusedMisses = HOLDOUT.map((s, i) => ({ s, p: fused[i]! })).filter(
    (r) => (r.p >= 0.5 ? 1 : 0) !== r.s.label,
  );
  console.log(`\nFull pipeline: ${fusedMisses.length}/${HOLDOUT.length} holdout errors`);
  for (const m of fusedMisses.slice(0, 12)) {
    console.log(`  [${m.s.label} -> ${(m.p * 100).toFixed(0)}] ${m.s.text.slice(0, 92)}`);
  }

  const r4 = (v: number) => +v.toFixed(4);
  const model: ModelFile = {
    version: '1.0.0',
    createdAt: new Date(Date.UTC(2026, 7, 25)).toISOString(),
    vocab,
    idf: idf.map(r4),
    nbLogLik: [nb.logLik[0].map(r4), nb.logLik[1].map(r4)],
    nbLogPrior: [r4(nb.logPrior[0]), r4(nb.logPrior[1])],
    lrWeights: lr.w.map(r4),
    lrBias: r4(lr.b),
    stacker: [r4(stacker[0]), r4(stacker[1]), r4(stacker[2])],
    train: {
      total: corpus.length,
      scam: corpus.filter((s) => s.label === 1).length,
      ham: corpus.filter((s) => s.label === 0).length,
      vocabSize: vocab.length,
    },
    metrics: external,
    metricsInternal: internal,
    metricsPipeline: fusedMetrics,
    ablation,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(model));
  const kb = (Buffer.byteLength(JSON.stringify(model)) / 1024).toFixed(0);
  console.log(`\nWrote ${OUT} (${kb} KB)`);
}

main();
