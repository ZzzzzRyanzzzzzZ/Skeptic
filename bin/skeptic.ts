#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { analyzeMessage } from '../src/engine/index.ts';
import { bandFor, SENSITIVITY_OFFSET, type Sensitivity } from '../src/engine/analyze.ts';
import { en } from '../src/i18n/en.ts';
import { es } from '../src/i18n/es.ts';
import type { Analysis, Band } from '../src/engine/types.ts';

const LOCALES = { en, es };

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  orange: '\x1b[38;5;208m',
  cyan: '\x1b[36m',
};

const BAND_COLOUR: Record<Band, string> = {
  safe: C.green,
  caution: C.yellow,
  'likely-scam': C.orange,
  dangerous: C.red,
};

const EXIT: Record<Band, number> = { safe: 0, caution: 0, 'likely-scam': 1, dangerous: 2 };

function usage(): never {
  process.stdout.write(
    `Skeptic — offline scam detector\n\n` +
      `Usage:\n` +
      `  skeptic "message text"\n` +
      `  skeptic --file message.eml\n` +
      `  cat message.txt | skeptic\n\n` +
      `Options:\n` +
      `  --file <path>          read the message from a file\n` +
      `  --batch <path>         scan many messages, separated by lines of ---\n` +
      `  --json                 emit JSON instead of a report\n` +
      `  --lang <en|es>         language for the explanations (default en)\n` +
      `  --sensitivity <s>      cautious | balanced | strict (default balanced)\n` +
      `  --quiet                verdict line only\n` +
      `  -h, --help             this text\n\n` +
      `Exit code: 0 safe or caution, 1 likely scam, 2 dangerous, 3 bad usage.\n`,
  );
  process.exit(3);
}

function readStdin(): string {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function report(analysis: Analysis, band: Band, locale: typeof en, quiet: boolean): string {
  const t = (key: string, params?: Record<string, string | number>) => {
    const raw = locale.strings[key] ?? en.strings[key] ?? key;
    return params
      ? raw.replace(/\{(\w+)\}/g, (m, k: string) => (params[k] === undefined ? m : String(params[k])))
      : raw;
  };

  const colour = BAND_COLOUR[band];
  const bar = '█'.repeat(Math.round(analysis.score / 5)).padEnd(20, '░');
  const lines = [
    '',
    `  ${colour}${C.bold}${bar}${C.reset}  ${C.bold}${analysis.score}/100${C.reset}`,
    `  ${colour}${C.bold}${t(`band.${band}`)}${C.reset}`,
    `  ${C.dim}${t(`band.${band}.body`)}${C.reset}`,
  ];

  if (quiet) return lines.join('\n') + '\n';

  if (analysis.family !== 'unknown') {
    lines.push('', `  ${C.cyan}${t('analyze.family', { family: locale.families[analysis.family].name })}${C.reset}`);
  }

  lines.push('', `  ${C.bold}${t('analyze.evidence')}${C.reset}`);
  for (const e of analysis.evidence) {
    const sign = e.points > 0 ? `+${e.points}` : `${e.points}`;
    const tone = e.points > 0 ? colour : C.green;
    lines.push(
      `   ${tone}${sign.padStart(4)}${C.reset} ${C.dim}[${e.kind}]${C.reset} ${t(`${e.key}.title`, e.params)}`,
    );
  }

  if (analysis.links.length) {
    lines.push('', `  ${C.bold}${t('analyze.links')}${C.reset}`);
    for (const l of analysis.links) {
      const tone = l.risk > 0 ? colour : C.green;
      lines.push(`   ${tone}${l.risk > 0 ? '▲' : '▼'}${C.reset} ${l.url}  ${C.dim}→ ${l.registrable}${C.reset}`);
    }
  }

  lines.push('', `  ${C.bold}${t('analyze.actions')}${C.reset}`);
  locale.advice[analysis.family].forEach((step, i) => lines.push(`   ${C.dim}${i + 1}.${C.reset} ${step}`));
  lines.push('');

  return lines.join('\n') + '\n';
}

function batch(path: string, locale: typeof en, sensitivity: Sensitivity, json: boolean): never {
  let raw = '';
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    process.stderr.write(`skeptic: cannot read ${path}\n`);
    process.exit(3);
  }

  const messages = raw
    .split(/^-{3,}\s*$/m)
    .map((m) => m.trim())
    .filter((m) => m.length > 0);

  if (messages.length === 0) {
    process.stderr.write('skeptic: no messages found (separate them with lines of ---)\n');
    process.exit(3);
  }

  const rows = messages.map((text) => {
    const a = analyzeMessage(text);
    return { text, analysis: a, band: bandFor(a.score, SENSITIVITY_OFFSET[sensitivity]) };
  });

  if (json) {
    process.stdout.write(
      JSON.stringify(
        rows.map((r) => ({
          score: r.analysis.score,
          band: r.band,
          family: r.analysis.family,
          preview: r.text.split('\n')[0]?.slice(0, 80) ?? '',
        })),
        null,
        2,
      ) + '\n',
    );
  } else {
    const t = (key: string) => locale.strings[key] ?? en.strings[key] ?? key;
    process.stdout.write('\n');
    for (const [i, r] of rows.entries()) {
      const colour = BAND_COLOUR[r.band];
      const preview = (r.text.split('\n').find((l) => l.trim()) ?? '').slice(0, 62);
      process.stdout.write(
        `  ${C.dim}${String(i + 1).padStart(3)}${C.reset} ` +
          `${colour}${C.bold}${String(r.analysis.score).padStart(3)}${C.reset} ` +
          `${colour}${t(`band.${r.band}`).padEnd(36)}${C.reset}  ` +
          `${C.dim}${preview}${C.reset}\n`,
      );
    }

    const counts = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.band] = (acc[r.band] ?? 0) + 1;
      return acc;
    }, {});
    process.stdout.write(
      `\n  ${C.bold}${rows.length}${C.reset} messages · ` +
        (['dangerous', 'likely-scam', 'caution', 'safe'] as const)
          .filter((b) => counts[b])
          .map((b) => `${BAND_COLOUR[b]}${counts[b]} ${t(`band.${b}`).toLowerCase()}${C.reset}`)
          .join(' · ') +
        '\n\n',
    );
  }

  const worst = rows.reduce((w, r) => Math.max(w, EXIT[r.band]), 0);
  process.exit(worst);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('-h') || argv.includes('--help')) usage();

  let text = '';
  let batchPath = '';
  let json = false;
  let quiet = false;
  let lang: keyof typeof LOCALES = 'en';
  let sensitivity: Sensitivity = 'balanced';
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === '--json') json = true;
    else if (arg === '--quiet') quiet = true;
    else if (arg === '--batch') {
      const path = argv[++i];
      if (!path) usage();
      batchPath = path;
    } else if (arg === '--file') {
      const path = argv[++i];
      if (!path) usage();
      try {
        text = readFileSync(path, 'utf8');
      } catch {
        process.stderr.write(`skeptic: cannot read ${path}\n`);
        process.exit(3);
      }
    } else if (arg === '--lang') {
      const v = argv[++i];
      if (v !== 'en' && v !== 'es') usage();
      lang = v;
    } else if (arg === '--sensitivity') {
      const v = argv[++i];
      if (v !== 'cautious' && v !== 'balanced' && v !== 'strict') usage();
      sensitivity = v;
    } else if (arg.startsWith('--')) usage();
    else positional.push(arg);
  }

  if (batchPath) batch(batchPath, LOCALES[lang], sensitivity, json);
  if (!text) text = positional.join(' ');
  if (!text && !process.stdin.isTTY) text = readStdin();
  if (!text.trim()) usage();

  const analysis = analyzeMessage(text);
  const band = bandFor(analysis.score, SENSITIVITY_OFFSET[sensitivity]);

  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          score: analysis.score,
          band,
          rawPoints: analysis.rawPoints,
          modelProbability: +analysis.modelProbability.toFixed(4),
          confidence: analysis.confidence,
          family: analysis.family,
          evidence: analysis.evidence.map((e) => ({
            key: e.key,
            kind: e.kind,
            severity: e.severity,
            points: e.points,
          })),
          links: analysis.links.map((l) => ({
            url: l.url,
            registrable: l.registrable,
            risk: l.risk,
            impersonates: l.impersonates,
          })),
        },
        null,
        2,
      ) + '\n',
    );
  } else {
    process.stdout.write(report(analysis, band, LOCALES[lang], quiet));
  }

  process.exit(EXIT[band]);
}

main();
