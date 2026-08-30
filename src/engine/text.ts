export const INVISIBLE_RE =
  /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF\u00AD\u180E]/g;

const CONFUSABLES: Record<string, string> = {
  а: 'a', в: 'b', с: 'c', е: 'e', ѕ: 's', і: 'i', ј: 'j', к: 'k', м: 'm',
  н: 'h', о: 'o', р: 'p', т: 't', у: 'y', х: 'x', ԁ: 'd', ɡ: 'g', ӏ: 'l',
  А: 'A', В: 'B', С: 'C', Е: 'E', Ѕ: 'S', І: 'I', Ј: 'J', К: 'K', М: 'M',
  Н: 'H', О: 'O', Р: 'P', Т: 'T', У: 'Y', Х: 'X',
  α: 'a', ο: 'o', ρ: 'p', ν: 'v', τ: 't', ι: 'i', κ: 'k', Α: 'A', Β: 'B',
  Ε: 'E', Ζ: 'Z', Η: 'H', Ι: 'I', Κ: 'K', Μ: 'M', Ν: 'N', Ο: 'O', Ρ: 'P',
  Τ: 'T', Υ: 'Y', Χ: 'X',
  ｅ: 'e', ｏ: 'o',
};

export function scriptOf(ch: string): 'latin' | 'cyrillic' | 'greek' | 'other' {
  const c = ch.codePointAt(0)!;
  if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) return 'latin';
  if (c >= 0x0400 && c <= 0x04ff) return 'cyrillic';
  if (c >= 0x0370 && c <= 0x03ff) return 'greek';
  return 'other';
}

export function foldConfusables(s: string): string {
  let out = '';
  for (const ch of s) out += CONFUSABLES[ch] ?? ch;
  return out;
}

export function hasMixedScript(word: string): boolean {
  const seen = new Set<string>();
  for (const ch of word) {
    const s = scriptOf(ch);
    if (s !== 'other') seen.add(s);
  }
  return seen.size > 1;
}

export function normalizeText(s: string): string {
  return foldConfusables(s.normalize('NFKC').replace(INVISIBLE_RE, ''));
}

export function foldForSpans(s: string): string {
  return foldConfusables(s);
}

import { HIGH_ABUSE_TLDS } from './brands';

export const KNOWN_TLDS = new Set(
  ('com net org edu gov mil int info biz io co ai app dev me tv cc us uk ca au de fr es it nl se no fi dk pl ru br mx jp cn in kr ch at be pt gr cz ro hu ie nz za tr il sg hk tw th vn id ph my cl ar pe ve nu ly to sh gg gl st am fm re tk ml ga cf gq xyz top club online site shop store live life world today icu vip work link click buy rest fit men loan date racing win bid stream download review country party gdn kim mom cyou sbs quest monster cfd lol makeup skin hair beauty autos boats motorcycles yachts christmas bar rip zip mov')
    .split(/\s+/),
);
for (const t of HIGH_ABUSE_TLDS) KNOWN_TLDS.add(t);

const URL_RE = new RegExp(
  '(?:\\b(?:https?|ftp):\\/\\/[^\\s<>"\'`\\]\\)]+)' +
    '|' +
    '(?:\\bwww\\.[a-z0-9-]+(?:\\.[a-z0-9-]+)+(?:\\/[^\\s<>"\'`\\]\\)]*)?)' +
    '|' +
    '(?:\\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\\.[a-z]{2,24}\\b(?:\\/[^\\s<>"\'`\\]\\)]*)?)',
  'gi',
);

const TRAILING_JUNK = /[.,;:!?»"'’”)\]}]+$/;

export interface RawUrl {
  text: string;
  start: number;
  end: number;
}

export function extractUrls(text: string): RawUrl[] {
  const out: RawUrl[] = [];
  URL_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = URL_RE.exec(text)) !== null) {
    let raw = m[0];
    const start = m.index;
    const trimmed = raw.replace(TRAILING_JUNK, '');
    if (trimmed.length < 4) continue;
    raw = trimmed;

    const hostPart = raw.replace(/^[a-z]+:\/\//i, '').split(/[/?#]/)[0] ?? '';
    const labels = hostPart.split('.');
    const tld = (labels[labels.length - 1] ?? '').toLowerCase();
    const isIpLiteral = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostPart.split(':')[0] ?? '');
    const schemeQualified = /^[a-z]+:\/\//i.test(m[0]);

    if (!schemeQualified && !isIpLiteral && !KNOWN_TLDS.has(tld)) continue;
    if (labels.length < 2 && !isIpLiteral) continue;

    out.push({ text: raw, start, end: start + raw.length });
  }
  return out;
}

const EMAIL_RE = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
const MONEY_RE =
  /(?:[$€£¥]\s?\d[\d,.]*(?:\s?(?:k|m|mil|million|thousand))?)|(?:\b\d[\d,.]*\s?(?:usd|eur|gbp|dollars?|euros?|pounds?|d[oó]lares)\b)/gi;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
const CODE_RE = /\b\d{4,8}\b/g;
const NUM_RE = /\b\d[\d,.]*\b/g;

export const PLACEHOLDERS = {
  url: 'zurlz',
  email: 'zemailz',
  money: 'zmoneyz',
  phone: 'zphonez',
  code: 'zcodez',
  num: 'znumz',
} as const;

export function tokenize(input: string): string[] {
  let s = normalizeText(input).toLowerCase();

  s = s.replace(EMAIL_RE, ` ${PLACEHOLDERS.email} `);
  for (const u of extractUrls(s).reverse()) {
    s = s.slice(0, u.start) + ` ${PLACEHOLDERS.url} ` + s.slice(u.end);
  }
  s = s.replace(MONEY_RE, ` ${PLACEHOLDERS.money} `);
  s = s.replace(PHONE_RE, ` ${PLACEHOLDERS.phone} `);
  s = s.replace(CODE_RE, ` ${PLACEHOLDERS.code} `);
  s = s.replace(NUM_RE, ` ${PLACEHOLDERS.num} `);

  const unigrams = s
    .split(/[^\p{L}\p{N}_']+/u)
    .map((t) => t.replace(/^'+|'+$/g, ''))
    .filter((t) => t.length > 0 && t.length <= 24);

  const out = unigrams.slice();
  for (let i = 0; i + 1 < unigrams.length; i++) {
    out.push(`${unigrams[i]}_${unigrams[i + 1]}`);
  }
  return out;
}

export function mergeSpans(spans: { start: number; end: number }[]) {
  const sorted = spans
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const out: { start: number; end: number }[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end) last.end = Math.max(last.end, s.end);
    else out.push({ ...s });
  }
  return out;
}
