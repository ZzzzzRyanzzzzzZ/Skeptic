import { tokenize } from './text';
import type { TokenContribution } from './types';

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  confusion: [[number, number], [number, number]];
  calibration: { bin: number; predicted: number; observed: number; n: number }[];
  sweep: { threshold: number; precision: number; recall: number }[];
}

export interface ModelFile {
  version: string;
  createdAt: string;
  vocab: string[];
  idf: number[];
  nbLogLik: [number[], number[]];
  nbLogPrior: [number, number];
  lrWeights: number[];
  lrBias: number;
  stacker: [number, number, number];
  train: { total: number; scam: number; ham: number; vocabSize: number };
  metrics: ModelMetrics;
  metricsInternal: ModelMetrics;
  metricsPipeline?: ModelMetrics;
  ablation?: { id: string; metrics: ModelMetrics }[];
}

export const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, z))));

export interface Scored {
  probability: number;
  z: number;
  zLr: number;
  zNb: number;
  known: number;
  contributions: TokenContribution[];
}

function vectorize(model: ModelFile, tokens: string[], index: Map<string, number>) {
  const counts = new Map<number, number>();
  let known = 0;
  for (const t of tokens) {
    const i = index.get(t);
    if (i === undefined) continue;
    counts.set(i, (counts.get(i) ?? 0) + 1);
    known++;
  }
  const entries: [number, number][] = [];
  let norm = 0;
  for (const [i, c] of counts) {
    const v = (1 + Math.log(c)) * (model.idf[i] ?? 0);
    entries.push([i, v]);
    norm += v * v;
  }
  norm = Math.sqrt(norm) || 1;
  for (const e of entries) e[1] /= norm;
  return { entries, counts, known };
}

let cachedIndex: { model: ModelFile; index: Map<string, number> } | null = null;
function indexFor(model: ModelFile) {
  if (cachedIndex?.model === model) return cachedIndex.index;
  const index = new Map<string, number>();
  model.vocab.forEach((t, i) => index.set(t, i));
  cachedIndex = { model, index };
  return index;
}

export function scoreText(model: ModelFile, text: string): Scored {
  const tokens = tokenize(text);
  const index = indexFor(model);
  const { entries, counts, known } = vectorize(model, tokens, index);

  let zLr = model.lrBias;
  const contribs: TokenContribution[] = [];
  for (const [i, v] of entries) {
    const c = (model.lrWeights[i] ?? 0) * v;
    zLr += c;
    if (c !== 0) contribs.push({ token: model.vocab[i] ?? '', weight: c });
  }

  let nbHam = model.nbLogPrior[0];
  let nbScam = model.nbLogPrior[1];
  let n = 0;
  for (const [i, c] of counts) {
    nbHam += c * (model.nbLogLik[0][i] ?? 0);
    nbScam += c * (model.nbLogLik[1][i] ?? 0);
    n += c;
  }
  const zNb = n > 0 ? (nbScam - nbHam) / Math.sqrt(n) : 0;

  const [s0, s1, s2] = model.stacker;
  const z = s0 + s1 * zLr + s2 * zNb;

  contribs.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  return {
    probability: sigmoid(z),
    z,
    zLr,
    zNb,
    known,
    contributions: contribs.slice(0, 14).map((c) => ({ ...c, weight: c.weight * s1 })),
  };
}
