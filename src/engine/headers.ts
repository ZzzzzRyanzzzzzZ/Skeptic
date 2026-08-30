import type { Evidence, Span } from './types';
import { BRANDS, DOMAIN_TO_BRAND, HIGH_ABUSE_TLDS, type Brand } from './brands';
import { domainImpersonation, splitHost } from './url';
import { deLeet } from './url';

export const FREEMAIL = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'ymail.com',
  'hotmail.com', 'hotmail.co.uk', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'proton.me', 'protonmail.com', 'gmx.com', 'gmx.net', 'gmx.de', 'mail.com',
  'mail.ru', 'yandex.ru', 'yandex.com', 'zoho.com', 'msn.com', 'inbox.com',
  'rediffmail.com', 'qq.com', '163.com', '126.com', 'naver.com', 'daum.net',
  'tutanota.com', 'hushmail.com', 'fastmail.com', 'aim.com',
]);

export interface HeaderField {
  name: string;
  value: string;
  valueStart: number;
  valueEnd: number;
}

export interface ParsedHeaders {
  present: boolean;
  fields: Map<string, HeaderField>;
  bodyOffset: number;
}

const EMAIL_MARKERS = [
  'from', 'to', 'subject', 'date', 'received', 'return-path', 'message-id',
  'authentication-results', 'reply-to', 'dkim-signature', 'received-spf',
  'mime-version', 'content-type', 'x-mailer', 'delivered-to', 'sender',
];

const HEADER_LINE = /^([A-Za-z][A-Za-z0-9-]{1,48}):[ \t]?/;

export function parseHeaders(text: string): ParsedHeaders {
  const fields = new Map<string, HeaderField>();
  let offset = 0;
  let bodyOffset = 0;
  let sawBlank = false;
  let current: HeaderField | null = null;

  const lines = text.split('\n');
  for (const line of lines) {
    const lineStart = offset;
    offset += line.length + 1;
    const stripped = line.replace(/\r$/, '');

    if (stripped.trim() === '') {
      sawBlank = true;
      bodyOffset = offset;
      break;
    }

    if (/^[ \t]/.test(stripped) && current) {
      current.value += ' ' + stripped.trim();
      current.valueEnd = lineStart + stripped.length;
      continue;
    }

    const m = HEADER_LINE.exec(stripped);
    if (!m) {
      bodyOffset = lineStart;
      break;
    }

    const name = m[1]!.toLowerCase();
    const valueStart = lineStart + m[0].length;
    current = {
      name,
      value: stripped.slice(m[0].length),
      valueStart,
      valueEnd: lineStart + stripped.length,
    };
    if (!fields.has(name)) fields.set(name, current);
    bodyOffset = offset;
  }

  const markers = EMAIL_MARKERS.filter((k) => fields.has(k)).length;
  const present = markers >= 2 && fields.has('from') && (sawBlank || fields.size >= 3);
  return { present, fields: present ? fields : new Map(), bodyOffset: present ? bodyOffset : 0 };
}

export interface Mailbox {
  display: string;
  address: string;
  domain: string;
  registrable: string;
}

export function parseMailbox(value: string): Mailbox | undefined {
  const angled = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(value);
  const display = angled ? angled[1]!.replace(/^["']|["']$/g, '').trim() : '';
  const address = (angled ? angled[2]! : value).trim().replace(/^<|>$/g, '');
  if (!address.includes('@')) return undefined;
  const domain = (address.split('@').pop() ?? '').toLowerCase().replace(/[>,;]+$/, '');
  if (!domain.includes('.')) return undefined;
  return { display, address, domain, registrable: splitHost(domain).registrable };
}

function brandIn(text: string): Brand | undefined {
  const hay = deLeet(text.toLowerCase());
  for (const b of BRANDS) {
    if (b.keys.some((k) => hay.includes(deLeet(k.trim())))) return b;
  }
  return undefined;
}

function authResult(value: string, mech: 'spf' | 'dkim' | 'dmarc'): string | undefined {
  const m = new RegExp(`\\b${mech}\\s*=\\s*([a-z]+)`, 'i').exec(value);
  return m?.[1]?.toLowerCase();
}

let uid = 0;
const ev = (
  severity: Evidence['severity'],
  key: string,
  points: number,
  params?: Evidence['params'],
  spans?: Span[],
): Evidence => ({ id: `${key}#${uid++}`, kind: 'header', severity, key, points, params, spans });

export interface HeaderAnalysis {
  headers: ParsedHeaders;
  evidence: Evidence[];
  claimedBrand?: Brand;
  from?: Mailbox;
}

export function analyzeHeaders(text: string): HeaderAnalysis {
  const headers = parseHeaders(text);
  if (!headers.present) return { headers, evidence: [] };

  const evidence: Evidence[] = [];
  const field = (n: string) => headers.fields.get(n);
  const spanOf = (f?: HeaderField): Span[] | undefined =>
    f ? [{ start: f.valueStart, end: f.valueEnd }] : undefined;

  const fromField = field('from');
  const from = fromField ? parseMailbox(fromField.value) : undefined;
  let claimedBrand: Brand | undefined;

  const authField = field('authentication-results');
  const spfField = field('received-spf');
  const authValue = `${authField?.value ?? ''} ${spfField?.value ?? ''}`.trim();

  const spf = authResult(authValue, 'spf') ?? /^\s*(pass|fail|softfail|neutral|none)/i.exec(spfField?.value ?? '')?.[1]?.toLowerCase();
  const dkim = authResult(authValue, 'dkim');
  const dmarc = authResult(authValue, 'dmarc');
  const authSpans = spanOf(authField ?? spfField);

  if (spf === 'fail' || spf === 'softfail') {
    evidence.push(ev('high', 'ev.hdr.spfFail', 26, { result: spf }, authSpans));
  }
  if (dkim === 'fail') {
    evidence.push(ev('high', 'ev.hdr.dkimFail', 24, { result: dkim }, authSpans));
  }
  if (dmarc === 'fail') {
    evidence.push(ev('high', 'ev.hdr.dmarcFail', 28, { result: dmarc }, authSpans));
  }
  if (spf === 'pass' && dkim === 'pass' && dmarc === 'pass') {
    evidence.push(
      ev('info', 'ev.hdr.authPass', -14, { domain: from?.registrable ?? '' }, authSpans),
    );
  }
  if (!authField && !spfField) {
    evidence.push(ev('low', 'ev.hdr.noAuth', 8, {}));
  }

  if (from) {
    const legit = DOMAIN_TO_BRAND.get(from.registrable);
    const displayBrand = from.display ? brandIn(from.display) : undefined;
    claimedBrand = displayBrand ?? legit;

    const displayAsAddress = parseMailbox(from.display);
    if (displayAsAddress && displayAsAddress.address.toLowerCase() !== from.address.toLowerCase()) {
      evidence.push(
        ev('high', 'ev.hdr.displayNameEmail', 26, {
          display: from.display,
          real: from.address,
        }, spanOf(fromField)),
      );
    } else if (displayBrand && !displayBrand.domains.includes(from.registrable)) {
      const key = FREEMAIL.has(from.registrable)
        ? 'ev.hdr.freemailBrand'
        : 'ev.hdr.displayNameSpoof';
      evidence.push(
        ev('high', key, FREEMAIL.has(from.registrable) ? 30 : 28, {
          brand: displayBrand.name,
          domain: from.registrable,
          address: from.address,
        }, spanOf(fromField)),
      );
    }

    const imp = domainImpersonation(from.registrable);
    if (imp) {
      claimedBrand ??= imp.brand;
      evidence.push(
        ev('high', 'ev.hdr.lookalikeFrom', 32, {
          brand: imp.brand.name,
          fake: from.registrable,
          real: imp.real,
        }, spanOf(fromField)),
      );
    }

    const tld = from.registrable.split('.').pop() ?? '';
    if (HIGH_ABUSE_TLDS.has(tld) && !legit) {
      evidence.push(ev('medium', 'ev.hdr.abuseTldFrom', 16, { tld }, spanOf(fromField)));
    }
  }

  const replyField = field('reply-to');
  const replyTo = replyField ? parseMailbox(replyField.value) : undefined;
  if (from && replyTo && replyTo.registrable !== from.registrable) {
    evidence.push(
      ev('high', 'ev.hdr.replyToMismatch', 24, {
        from: from.registrable,
        replyTo: replyTo.registrable,
        address: replyTo.address,
      }, spanOf(replyField)),
    );
  }

  const returnField = field('return-path');
  const returnPath = returnField ? parseMailbox(returnField.value) : undefined;
  if (from && returnPath && returnPath.registrable !== from.registrable) {
    evidence.push(
      ev('medium', 'ev.hdr.returnPathMismatch', 14, {
        from: from.registrable,
        returnPath: returnPath.registrable,
      }, spanOf(returnField)),
    );
  }

  return { headers, evidence, claimedBrand, from };
}
