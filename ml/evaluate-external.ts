import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeMessage } from '../src/engine/index.ts';
import { wilson } from '../src/engine/stats.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSV = resolve(ROOT, 'data/external/spam.csv');
const OUT = resolve(ROOT, 'src/data/external-eval.json');

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function main() {
  if (!existsSync(CSV)) {
    console.error('No corpus found. Run: npm run fetch:external');
    process.exit(1);
  }

  const text = new TextDecoder('windows-1252').decode(readFileSync(CSV));
  const rows = parseCsv(text).slice(1);

  const samples = rows
    .map((r) => ({ label: (r[0] ?? '').trim().toLowerCase(), text: (r[1] ?? '').trim() }))
    .filter((s) => (s.label === 'ham' || s.label === 'spam') && s.text.length > 0)
    .map((s) => ({ y: s.label === 'spam' ? 1 : 0, text: s.text }));

  console.log(`Scoring ${samples.length} real SMS messages…`);
  const scored = samples.map((s) => ({ ...s, score: analyzeMessage(s.text).score }));

  const at = (threshold: number) => {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    for (const s of scored) {
      const flagged = s.score >= threshold;
      if (s.y === 1 && flagged) tp++;
      else if (s.y === 0 && flagged) fp++;
      else if (s.y === 0) tn++;
      else fn++;
    }
    const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
    return {
      threshold,
      accuracy: (tp + tn) / scored.length,
      precision,
      recall,
      f1: precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall),
      falseAlarmRate: fp / (fp + tn),
      confusion: [[tn, fp], [fn, tp]] as [[number, number], [number, number]],
    };
  };

  const flagged = at(50);
  const caution = at(25);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const show = (name: string, m: ReturnType<typeof at>) => {
    const n = scored.length;
    const ci = wilson(Math.round(m.accuracy * n), n);
    console.log(
      `  ${name.padEnd(28)} acc ${pct(m.accuracy)} (${pct(ci.low)}–${pct(ci.high)})  ` +
        `P ${pct(m.precision)}  R ${pct(m.recall)}  false alarms ${pct(m.falseAlarmRate)}`,
    );
  };

  const spam = scored.filter((s) => s.y === 1).length;
  console.log(`\n${scored.length} messages · ${spam} spam · ${scored.length - spam} ham\n`);
  show('flagged (score >= 50)', flagged);
  show('warned  (score >= 25)', caution);

  const worstHam = scored.filter((s) => s.y === 0).sort((a, b) => b.score - a.score).slice(0, 8);
  const worstSpam = scored.filter((s) => s.y === 1).sort((a, b) => a.score - b.score).slice(0, 8);

  console.log('\nHighest-scoring legitimate messages (our false alarms):');
  for (const s of worstHam) console.log(`  ${String(s.score).padStart(3)}  ${s.text.slice(0, 96)}`);
  console.log('\nLowest-scoring spam (our misses — mostly commercial, not fraud):');
  for (const s of worstSpam) console.log(`  ${String(s.score).padStart(3)}  ${s.text.slice(0, 96)}`);

  const report = {
    source: 'SMS Spam Collection (Almeida, Gómez Hidalgo & Yamakami, 2011)',
    generatedAt: new Date(Date.UTC(2026, 7, 26)).toISOString(),
    total: scored.length,
    spam,
    ham: scored.length - spam,
    flagged,
    caution,
    examples: {
      falseAlarms: worstHam.slice(0, 5).map((s) => ({ score: s.score, text: s.text.slice(0, 140) })),
    },
  };
  writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${OUT}`);
}

main();
