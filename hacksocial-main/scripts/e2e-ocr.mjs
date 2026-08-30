import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PORT = 4179;
const ORIGIN = `http://localhost:${PORT}`;

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('e2e: playwright is not installed. Run: npm i --no-save playwright');
  process.exit(1);
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
});
const stop = () => server.kill();
process.on('exit', stop);

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(ORIGIN)).ok) return;
    } catch {
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('preview server did not start');
}
await waitForServer();

const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const browser = await chromium.launch(launch);

const shotDir = mkdtempSync(join(tmpdir(), 'skeptic-'));
const shotPath = join(shotDir, 'sms.png');
{
  const page = await browser.newPage({ viewport: { width: 400, height: 620 }, deviceScaleFactor: 2 });
  await page.setContent(`<body style="margin:0;font-family:Helvetica,Arial;background:#fff">
    <div style="padding:18px 14px">
      <div style="background:#e9e9eb;border-radius:18px;padding:11px 14px;font-size:16px;line-height:1.42;max-width:290px">
        USPS: Your package is on hold because the delivery address is incomplete.
        Please update your details within 24 hours or the parcel will be returned to sender.
      </div>
      <div style="height:8px"></div>
      <div style="background:#e9e9eb;border-radius:18px;padding:11px 14px;font-size:16px;line-height:1.42;max-width:290px">
        Pay the $1.95 redelivery fee here: http://usps-redelivery-a7f2.icu/track
      </div>
    </div></body>`);
  await page.screenshot({ path: shotPath });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1360, height: 1000 } });
const offOrigin = [];
page.on('request', (r) => {
  const url = r.url();
  if (!url.startsWith(ORIGIN) && !url.startsWith('blob:') && !url.startsWith('data:')) {
    offOrigin.push(url);
  }
});

await page.goto(ORIGIN, { waitUntil: 'networkidle' });
await page.setInputFiles('input[type=file]', shotPath);
await page.waitForFunction(
  () => document.querySelector('#message-input')?.value?.length > 20,
  null,
  { timeout: 180_000 },
);

const text = await page.inputValue('#message-input');
await page.waitForTimeout(1500);
const verdict = await page.locator('svg[role=img]').first().getAttribute('aria-label');

await browser.close();
stop();

const failures = [];
if (offOrigin.length) failures.push(`requests left the origin:\n  ${offOrigin.join('\n  ')}`);
if (!/redelivery|package|hold/i.test(text)) failures.push(`OCR produced nothing usable:\n${text}`);
if (!/Dangerous|scam/i.test(verdict ?? '')) failures.push(`unexpected verdict: ${verdict}`);

console.log(`\nOCR text:\n${text}\n\nVerdict: ${verdict}`);
console.log(`Off-origin requests: ${offOrigin.length}`);

if (failures.length) {
  console.error('\ne2e FAILED\n' + failures.join('\n'));
  process.exit(1);
}
console.log('\ne2e passed: screenshot read on-device, nothing left the origin.');
