import { mkdirSync, existsSync, statSync, createWriteStream } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'data/external');
const OUT = resolve(OUT_DIR, 'spam.csv');

const SOURCE =
  'https://raw.githubusercontent.com/mohitgupta-omg/Kaggle-SMS-Spam-Collection-Dataset-/master/spam.csv';

if (existsSync(OUT) && statSync(OUT).size > 400_000) {
  console.log(`fetch-external: already have ${OUT}`);
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });
console.log('fetch-external: downloading the SMS Spam Collection…');

const res = await fetch(SOURCE);
if (!res.ok) {
  console.error(`fetch-external: ${res.status} ${res.statusText}`);
  console.error('The corpus is optional — npm test and npm run train do not need it.');
  process.exit(1);
}
await pipeline(Readable.fromWeb(res.body), createWriteStream(OUT));
console.log(`fetch-external: wrote ${OUT} (${(statSync(OUT).size / 1024).toFixed(0)} KB)`);
