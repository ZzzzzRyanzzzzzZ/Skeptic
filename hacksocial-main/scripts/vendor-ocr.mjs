import { copyFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/ocr');

const CORE_DIR = 'node_modules/tesseract.js-core';

const cores = existsSync(resolve(ROOT, CORE_DIR))
  ? readdirSync(resolve(ROOT, CORE_DIR))
      .filter((f) => f.startsWith('tesseract-core') && f.includes('lstm'))
      .map((f) => `${CORE_DIR}/${f}`)
  : [];

const ASSETS = [
  'node_modules/tesseract.js/dist/worker.min.js',
  ...cores,
  'node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz',
];

mkdirSync(OUT, { recursive: true });

let total = 0;
let missing = 0;
for (const rel of ASSETS) {
  const from = resolve(ROOT, rel);
  const to = resolve(OUT, rel.split('/').pop());
  if (!existsSync(from)) {
    console.warn(`vendor-ocr: missing ${rel} — screenshot input will be unavailable`);
    missing++;
    continue;
  }
  copyFileSync(from, to);
  total += statSync(to).size;
}

console.log(
  `vendor-ocr: ${ASSETS.length - missing}/${ASSETS.length} assets -> public/ocr (${(
    total / 1048576
  ).toFixed(1)} MB)`,
);
