import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = resolve(import.meta.dirname, '../src');
const BIN = resolve(import.meta.dirname, '../bin');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

const FILES = [...sourceFiles(SRC), ...sourceFiles(BIN)].map((path) => ({
  path,
  text: readFileSync(path, 'utf8'),
}));

const DATA_ONLY = /brands\.ts$|messages\.ts$|samples\.ts$|i18n\/(en|es)\.ts$/;

describe('nothing is ever sent anywhere', () => {
  it('contains no network calls at all', () => {
    const offenders = FILES.filter((f) =>
      /\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/.test(f.text),
    ).map((f) => f.path);
    expect(offenders).toEqual([]);
  });

  it('loads the OCR engine only from this origin', () => {
    const ocr = FILES.find((f) => f.path.endsWith('ocr.ts'))!;
    expect(ocr.text).toMatch(/import\.meta\.env\.BASE_URL/);
    expect(ocr.text).not.toMatch(/https?:\/\//);
    for (const key of ['workerPath', 'corePath', 'langPath']) {
      expect(ocr.text, `${key} must be same-origin`).toMatch(
        new RegExp(`${key}:\\s*\`?\\$?\\{?base`),
      );
    }
  });

  it('embeds no third-party endpoints outside reference data', () => {
    const offenders = FILES.filter(
      (f) =>
        !DATA_ONLY.test(f.path) &&
        /https?:\/\/(?!github\.com|www\.w3\.org|reportfraud|www\.ic3|www\.actionfraud)/.test(f.text),
    ).map((f) => f.path);
    expect(offenders).toEqual([]);
  });

  it('stores nothing in browser storage beyond the known keys', () => {
    const keys = FILES.flatMap((f) => [...f.text.matchAll(/'(skeptic\.[\w.]+)'/g)].map((m) => m[1]));
    expect([...new Set(keys)].sort()).toEqual([
      'skeptic.history.v1',
      'skeptic.practice.v1',
      'skeptic.prefs.v1',
      'skeptic.welcomed.v1',
    ]);
  });
});

describe('deep links', () => {
  it('round-trips a message through the fragment', async () => {
    const { encodeMessage } = await import('../src/deeplink');
    const text = 'URGENT: confirm your password — ¿es una estafa? 🛡️';
    const frag = encodeMessage(text);
    expect(frag.startsWith('#m=')).toBe(true);
    const b64 = frag.slice(3).replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    expect(new TextDecoder().decode(Buffer.from(padded, 'base64'))).toBe(text);
  });

  it('keeps the payload in the fragment, which browsers never send', async () => {
    const src = readFileSync(resolve(import.meta.dirname, '../src/deeplink.ts'), 'utf8');
    expect(src).toMatch(/window\.location\.hash/);
    expect(src).not.toMatch(/location\.search\s*=/);
  });

  it('the extension asks for no host permissions and no content scripts', () => {
    const manifest = JSON.parse(
      readFileSync(resolve(import.meta.dirname, '../extension/manifest.json'), 'utf8'),
    );
    expect(manifest.permissions).toEqual(['contextMenus']);
    expect(manifest.host_permissions).toBeUndefined();
    expect(manifest.content_scripts).toBeUndefined();
  });
});
