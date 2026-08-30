import type { Analysis, Band, Evidence, Family, Span } from './types';
import { hasEndearment, RULE_FAMILY, runRules } from './rules';
import { analyzeLinks, brandMentionedIn } from './url';
import { BRANDS } from './brands';
import { INVISIBLE_RE, foldForSpans, hasMixedScript, mergeSpans, tokenize } from './text';
import { scoreText, type ModelFile } from './model';
import { analyzeHeaders, type HeaderAnalysis } from './headers';

export function compress(raw: number): number {
  if (raw <= 0) return Math.max(0, Math.round(raw / 2 + 8));
  return Math.round(100 * (1 - Math.exp(-raw / 38)));
}

export function bandFor(score: number, offset = 0): Band {
  if (score >= 75 + offset) return 'dangerous';
  if (score >= 50 + offset) return 'likely-scam';
  if (score >= 25 + offset) return 'caution';
  return 'safe';
}

export const SENSITIVITY_OFFSET = { cautious: -10, balanced: 0, strict: 10 } as const;
export type Sensitivity = keyof typeof SENSITIVITY_OFFSET;

function modelPoints(p: number): number {
  return Math.round(Math.max(-18, Math.min(48, 70 * p - 22)));
}

const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g;

interface Region {
  text: string;
  offset: number;
}

const shift = (spans: Span[] | undefined, by: number): Span[] | undefined =>
  by === 0 || !spans ? spans : spans.map((s) => ({ start: s.start + by, end: s.end + by }));

function mergeByKey(items: Evidence[]): Evidence[] {
  const out = new Map<string, Evidence>();
  for (const e of items) {
    const seen = out.get(e.key);
    if (!seen) {
      out.set(e.key, { ...e, spans: e.spans ? [...e.spans] : undefined });
      continue;
    }
    seen.spans = [...(seen.spans ?? []), ...(e.spans ?? [])];
    seen.params = { ...seen.params, ...e.params };
  }
  return [...out.values()];
}

function structureEvidence(text: string): Evidence[] {
  const out: Evidence[] = [];
  const folded = foldForSpans(text);

  const invisible: Span[] = [];
  INVISIBLE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = INVISIBLE_RE.exec(text)) !== null) {
    invisible.push({ start: m.index, end: m.index + m[0].length });
  }
  if (invisible.length) {
    out.push({
      id: 'struct.invisible',
      kind: 'structure',
      severity: 'high',
      key: 'ev.struct.invisible',
      points: 20,
      params: { count: invisible.length },
      spans: invisible,
    });
  }

  const mixed: Span[] = [];
  const wordRe = /[\p{L}]{3,}/gu;
  let w: RegExpExecArray | null;
  while ((w = wordRe.exec(text)) !== null) {
    if (hasMixedScript(w[0])) mixed.push({ start: w.index, end: w.index + w[0].length });
  }
  if (mixed.length) {
    out.push({
      id: 'struct.mixedScript',
      kind: 'structure',
      severity: 'high',
      key: 'ev.struct.mixedScript',
      points: 22,
      params: { count: mixed.length, quote: text.slice(mixed[0]!.start, mixed[0]!.end) },
      spans: mixed,
    });
  }

  const letters = folded.replace(/[^A-Za-z]/g, '');
  const upper = folded.replace(/[^A-Z]/g, '');
  if (letters.length >= 40 && upper.length / letters.length > 0.6) {
    out.push({
      id: 'struct.shouting',
      kind: 'structure',
      severity: 'low',
      key: 'ev.struct.shouting',
      points: 8,
      params: { percent: Math.round((upper.length / letters.length) * 100) },
    });
  }

  const bangs = folded.match(/[!?]{3,}/g);
  if (bangs) {
    out.push({
      id: 'struct.punctuation',
      kind: 'structure',
      severity: 'low',
      key: 'ev.struct.punctuation',
      points: 6,
      params: { count: bangs.length },
    });
  }

  return out;
}

function comboEvidence(fired: Set<string>, ctx: {
  hasSuspiciousLink: boolean;
  hasPhone: boolean;
  brand?: string;
  hasGoodLink: boolean;
  endearment: boolean;
}): Evidence[] {
  const out: Evidence[] = [];
  const has = (k: string) => fired.has(k);
  const pressure = has('ev.rule.urgency') || has('ev.rule.threat');

  if (has('ev.rule.credentialRequest') && ctx.hasSuspiciousLink) {
    out.push({
      id: 'combo.credentialLink', kind: 'rule', severity: 'high',
      key: 'ev.combo.credentialLink', points: 14,
    });
  }
  if (pressure && has('ev.rule.untraceablePayment')) {
    out.push({
      id: 'combo.pressurePayment', kind: 'rule', severity: 'high',
      key: 'ev.combo.pressurePayment', points: 16,
    });
  }
  if (pressure && ctx.brand && ctx.hasPhone && !ctx.hasGoodLink) {
    out.push({
      id: 'combo.brandCallback', kind: 'rule', severity: 'medium',
      key: 'ev.combo.brandCallback', points: 14, params: { brand: ctx.brand },
    });
  }
  if (has('ev.rule.secrecy') && (has('ev.rule.untraceablePayment') || has('ev.rule.familyEmergency'))) {
    out.push({
      id: 'combo.secretPayment', kind: 'rule', severity: 'high',
      key: 'ev.combo.secretPayment', points: 16,
    });
  }

  if (has('ev.rule.wrongNumber') && has('ev.rule.rapportProbe')) {
    out.push({
      id: 'combo.strangerOpener', kind: 'rule', severity: 'high',
      key: 'ev.combo.strangerOpener', points: 22,
    });
  }

  if (has('ev.rule.availabilityProbe') && has('ev.rule.channelRestriction')) {
    out.push({
      id: 'combo.pretextHandshake', kind: 'rule', severity: 'high',
      key: 'ev.combo.pretextHandshake', points: 24,
    });
  }

  if (
    ctx.endearment &&
    (has('ev.rule.untraceablePayment') || has('ev.rule.advanceFee') || has('ev.rule.romance'))
  ) {
    out.push({
      id: 'combo.romanceMoney', kind: 'rule', severity: 'high',
      key: 'ev.combo.romanceMoney', points: 20,
    });
  }

  return out;
}

function inferFamily(evidence: Evidence[], linkBrandSector?: string): Family {
  const tally = new Map<Family, number>();
  for (const e of evidence) {
    const fam = RULE_FAMILY.get(e.key);
    if (fam && e.points > 0) tally.set(fam, (tally.get(fam) ?? 0) + e.points);
  }
  let best: Family = 'unknown';
  let bestScore = 0;
  for (const [f, v] of tally) {
    if (v > bestScore) {
      best = f;
      bestScore = v;
    }
  }
  if (best !== 'unknown') return best;
  if (linkBrandSector === 'bank' || linkBrandSector === 'payment') return 'impersonation-bank';
  if (linkBrandSector === 'shipping') return 'delivery';
  if (linkBrandSector === 'gov') return 'impersonation-gov';
  if (evidence.some((e) => (e.kind === 'link' || e.kind === 'header') && e.points > 0)) {
    return 'phishing';
  }
  return 'unknown';
}

export interface LayerMask {
  model?: boolean;
  rules?: boolean;
  links?: boolean;
  headers?: boolean;
}

const ALL_LAYERS: Required<LayerMask> = {
  model: true,
  rules: true,
  links: true,
  headers: true,
};

export function analyze(model: ModelFile, text: string, layers: LayerMask = {}): Analysis {
  const on = { ...ALL_LAYERS, ...layers };
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      text, score: 0, rawPoints: 0, band: 'safe', modelProbability: 0,
      confidence: 'low', family: 'unknown', evidence: [], links: [],
      contributions: [], highlights: [],
    };
  }

  const header: HeaderAnalysis = on.headers
    ? analyzeHeaders(text)
    : { headers: { present: false, fields: new Map(), bodyOffset: 0 }, evidence: [] };
  const regions: Region[] = [];
  if (header.headers.present) {
    const subject = header.headers.fields.get('subject');
    if (subject) regions.push({ text: subject.value, offset: subject.valueStart });
    regions.push({ text: text.slice(header.headers.bodyOffset), offset: header.headers.bodyOffset });
  } else {
    regions.push({ text, offset: 0 });
  }
  const prose = regions.map((r) => r.text).join('\n');

  const brand = header.claimedBrand ?? brandMentionedIn(prose);
  const links = on.links
    ? regions.flatMap((r) =>
        analyzeLinks(r.text, brand).map((l) => ({
          ...l,
          issues: l.issues.map((i) => ({ ...i, spans: shift(i.spans, r.offset) })),
        })),
      )
    : [];
  const scored = scoreText(model, prose);
  const ruleEvidence = on.rules
    ? mergeByKey(
        regions.flatMap((r) =>
          runRules(r.text).map((e) => ({ ...e, spans: shift(e.spans, r.offset) })),
        ),
      )
    : [];
  const structEvidence = on.rules
    ? mergeByKey(
        regions.flatMap((r) =>
          structureEvidence(r.text).map((e) => ({ ...e, spans: shift(e.spans, r.offset) })),
        ),
      )
    : [];
  const headerEvidence = header.evidence;

  const fired = new Set(ruleEvidence.map((e) => e.key));
  const linkEvidence = links.flatMap((l) => l.issues);
  const hasSuspiciousLink = links.some((l) => l.risk > 0);
  const hasGoodLink = links.some((l) => l.issues.some((i) => i.key === 'ev.link.knownGood'));
  PHONE_RE.lastIndex = 0;
  const hasPhone = PHONE_RE.test(foldForSpans(prose));

  const combos = comboEvidence(fired, {
    hasSuspiciousLink,
    hasPhone,
    brand: brand?.name,
    hasGoodLink,
    endearment: on.rules && hasEndearment(prose),
  });

  const hardSignal = [
    ...ruleEvidence, ...combos, ...linkEvidence, ...structEvidence, ...headerEvidence,
  ].some((e) => e.severity === 'high' && e.points > 0);
  let mp = on.model ? modelPoints(scored.probability) : 0;
  if (hardSignal) mp = Math.max(mp, -6);
  const modelEvidence: Evidence = {
    id: 'model',
    kind: 'model',
    severity: mp >= 30 ? 'high' : mp >= 12 ? 'medium' : mp > 0 ? 'low' : 'info',
    key: 'ev.model.language',
    points: mp,
    params: { percent: Math.round(scored.probability * 100) },
  };

  const evidence = [
    modelEvidence, ...headerEvidence, ...ruleEvidence, ...combos, ...linkEvidence, ...structEvidence,
  ]
    .filter((e) => e.points !== 0)
    .sort((a, b) => b.points - a.points);

  const rawPoints = evidence.reduce((a, e) => a + e.points, 0);
  const score = compress(rawPoints);

  const tokenCount = tokenize(prose).length;
  const confidence: Analysis['confidence'] =
    tokenCount < 10 ? 'low' : scored.known >= 12 || evidence.length >= 4 ? 'high' : 'medium';

  const impersonated = links.find((l) => l.impersonates)?.impersonates;
  const linkSector = BRANDS.find((b) => b.name === impersonated)?.sector;

  return {
    text,
    score,
    rawPoints,
    band: bandFor(score),
    modelProbability: scored.probability,
    confidence,
    family: inferFamily(evidence, linkSector),
    evidence,
    links,
    contributions: scored.contributions,
    highlights: mergeSpans(evidence.flatMap((e) => (e.points > 0 ? (e.spans ?? []) : []))),
  };
}
