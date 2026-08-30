import type { Evidence, LinkFinding } from './types';
import {
  BRANDS,
  DOMAIN_TO_BRAND,
  HIGH_ABUSE_TLDS,
  MULTI_SUFFIXES,
  SHORTENERS,
  type Brand,
} from './brands';
import { extractUrls, hasMixedScript, foldForSpans } from './text';

export function splitHost(host: string): { registrable: string; sub: string; tld: string } {
  const labels = host.toLowerCase().replace(/\.$/, '').split('.');
  if (labels.length <= 1) return { registrable: host.toLowerCase(), sub: '', tld: '' };

  const lastTwo = labels.slice(-2).join('.');
  const take = MULTI_SUFFIXES.has(lastTwo) && labels.length >= 3 ? 3 : 2;
  const registrable = labels.slice(-take).join('.');
  return {
    registrable,
    sub: labels.slice(0, Math.max(0, labels.length - take)).join('.'),
    tld: labels[labels.length - 1] ?? '',
  };
}

export function editDistance(a: string, b: string, cap = 3): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const prev2: number[] = [];
  let prev: number[] = [];
  let cur: number[] = [];
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(cur[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, (prev2[j - 2] ?? Infinity) + 1);
      }
      cur[j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > cap) return cap + 1;
    prev2.length = 0;
    prev2.push(...prev);
    prev = cur;
  }
  return prev[b.length]!;
}

export function deLeet(s: string): string {
  return s
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/\$/g, 's')
    .replace(/[-_.]/g, '');
}

const CRED_PATH_WORDS =
  /\b(login|signin|sign-in|verify|verification|secure|security|account|update|confirm|billing|payment|unlock|recover|reset|auth|wallet|validate|suspend)\b/i;

export type ImpersonationKind =
  | 'spoof'
  | 'near'
  | 'embedded';

export interface DomainImpersonation {
  brand: Brand;
  kind: ImpersonationKind;
  real: string;
}

export function domainImpersonation(registrable: string): DomainImpersonation | undefined {
  if (DOMAIN_TO_BRAND.has(registrable)) return undefined;
  const sld = registrable.split('.')[0] ?? '';
  const flat = deLeet(sld);

  for (const b of BRANDS) {
    for (const d of b.domains) {
      const realSld = d.split('.')[0] ?? '';
      if (realSld.length < 5) continue;
      const realFlat = deLeet(realSld);
      if (flat === realFlat && sld !== realSld) return { brand: b, kind: 'spoof', real: d };
      const maxDist = realSld.length >= 10 ? 2 : 1;
      const dist = editDistance(flat, realFlat, maxDist);
      if (dist > 0 && dist <= maxDist && realSld.length >= 6) {
        return { brand: b, kind: 'near', real: d };
      }
    }
  }

  for (const b of BRANDS) {
    const key = b.keys.map((k) => deLeet(k.trim())).find((k) => k.length >= 6 && flat.includes(k));
    if (key) return { brand: b, kind: 'embedded', real: b.domains[0] ?? '' };
  }

  return undefined;
}

interface ParsedLink {
  raw: string;
  scheme: string;
  userinfo: string;
  host: string;
  port: string;
  path: string;
}

export function parseLink(raw: string): ParsedLink | null {
  const m = /^(?:([a-z][a-z0-9+.-]*):\/\/)?([^/?#]*)([/?#].*)?$/i.exec(raw.trim());
  if (!m) return null;
  const scheme = (m[1] ?? (raw.startsWith('www.') ? 'http' : 'http')).toLowerCase();
  const authority = m[2] ?? '';
  const path = m[3] ?? '';
  const at = authority.lastIndexOf('@');
  const userinfo = at >= 0 ? authority.slice(0, at) : '';
  const hostPort = at >= 0 ? authority.slice(at + 1) : authority;
  const pm = /^(\[[^\]]+\]|[^:]*)(?::(\d+))?$/.exec(hostPort);
  return {
    raw,
    scheme,
    userinfo,
    host: (pm?.[1] ?? hostPort).toLowerCase(),
    port: pm?.[2] ?? '',
    path,
  };
}

function brandMentionedIn(text: string): Brand | undefined {
  const hay = deLeet(text.toLowerCase());
  for (const b of BRANDS) {
    for (const k of b.keys) {
      if (hay.includes(deLeet(k))) return b;
    }
  }
  return undefined;
}

let uid = 0;
const ev = (
  kind: Evidence['kind'],
  severity: Evidence['severity'],
  key: string,
  points: number,
  params?: Evidence['params'],
  spans?: Evidence['spans'],
): Evidence => ({ id: `${key}#${uid++}`, kind, severity, key, points, params, spans });

export function analyzeLink(
  raw: string,
  span: { start: number; end: number },
  messageBrand?: Brand,
  original: string = raw,
): LinkFinding {
  const issues: Evidence[] = [];
  const p = parseLink(raw);
  const host = p?.host ?? '';
  const { registrable, sub, tld } = splitHost(host);
  const spans = [span];
  let impersonates: string | undefined;

  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
  const legitBrand = DOMAIN_TO_BRAND.get(registrable);

  if (p && (p.scheme === 'javascript' || p.scheme === 'data')) {
    issues.push(ev('link', 'high', 'ev.link.scriptUri', 40, { url: raw }, spans));
  }

  if (host.includes('xn--')) {
    issues.push(ev('link', 'high', 'ev.link.punycode', 30, { host }, spans));
  }

  const originalHost = parseLink(original)?.host ?? '';
  if (hasMixedScript(originalHost.replace(/\./g, ''))) {
    issues.push(
      ev('link', 'high', 'ev.link.mixedScript', 32, { host: originalHost }, spans),
    );
  }

  if (isIp) {
    issues.push(ev('link', 'high', 'ev.link.ipHost', 26, { host }, spans));
  }

  if (p?.userinfo) {
    issues.push(
      ev('link', 'high', 'ev.link.userinfo', 30, { shown: p.userinfo, real: host }, spans),
    );
  }

  if (!legitBrand) {
    const outsideRegistrable = `${sub} ${p?.path ?? ''}`;
    const impostor = brandMentionedIn(outsideRegistrable);
    if (impostor) {
      impersonates = impostor.name;
      issues.push(
        ev('link', 'high', 'ev.link.brandOutsideDomain', 34,
          { brand: impostor.name, registrable, host }, spans),
      );
    }

    const imp = domainImpersonation(registrable);
    if (imp) {
      impersonates ??= imp.brand.name;
      const contextual = messageBrand?.name === imp.brand.name;
      if (imp.kind === 'embedded') {
        issues.push(
          ev('link', 'high', 'ev.link.brandInDomain', 30,
            { brand: imp.brand.name, host: registrable }, spans),
        );
      } else {
        const strong = imp.kind === 'spoof' || contextual;
        issues.push(
          ev('link', strong ? 'high' : 'medium', 'ev.link.lookalike', strong ? 34 : 22, {
            brand: imp.brand.name,
            fake: registrable,
            real: imp.real,
          }, spans),
        );
      }
    }
  }

  if (SHORTENERS.has(registrable)) {
    issues.push(ev('link', 'medium', 'ev.link.shortener', 14, { host: registrable }, spans));
  }

  if (HIGH_ABUSE_TLDS.has(tld) && !legitBrand) {
    issues.push(ev('link', 'medium', 'ev.link.abuseTld', 16, { tld }, spans));
  }

  const subDepth = sub ? sub.split('.').length : 0;
  if (subDepth >= 3 && !legitBrand) {
    issues.push(ev('link', 'low', 'ev.link.deepSubdomain', 10, { host, count: subDepth }, spans));
  }

  if (!legitBrand && CRED_PATH_WORDS.test(`${sub}.${p?.path ?? ''}`)) {
    issues.push(ev('link', 'medium', 'ev.link.credentialPath', 14, { host }, spans));
  }

  if (p?.port && p.port !== '80' && p.port !== '443') {
    issues.push(ev('link', 'low', 'ev.link.oddPort', 10, { port: p.port }, spans));
  }

  if (p?.scheme === 'http' && /^https?:\/\//i.test(raw)) {
    issues.push(ev('link', 'low', 'ev.link.noTls', 8, { host }, spans));
  }

  if (messageBrand && legitBrand && legitBrand.name !== messageBrand.name) {
    issues.push(
      ev('link', 'medium', 'ev.link.brandMismatch', 18,
        { claimed: messageBrand.name, actual: registrable }, spans),
    );
  } else if (messageBrand && !legitBrand && !impersonates) {
    issues.push(
      ev('link', 'medium', 'ev.link.unrelatedDomain', 20,
        { claimed: messageBrand.name, actual: registrable }, spans),
    );
  }

  if (legitBrand && issues.length === 0) {
    issues.push(
      ev('link', 'info', 'ev.link.knownGood', -8, { brand: legitBrand.name, host: registrable }, spans),
    );
  }

  const risk = Math.max(0, Math.min(100, issues.reduce((a, e) => a + e.points, 0)));
  return { url: raw, host, registrable, impersonates, issues, risk };
}

export function analyzeLinks(text: string, messageBrand?: Brand): LinkFinding[] {
  const folded = foldForSpans(text);
  return extractUrls(folded).map((u) => {
    const original = text.slice(u.start, u.end);
    const finding = analyzeLink(u.text, { start: u.start, end: u.end }, messageBrand, original);
    return { ...finding, url: original };
  });
}

export { brandMentionedIn };
