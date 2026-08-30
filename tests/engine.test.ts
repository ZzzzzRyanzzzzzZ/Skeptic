import { describe, expect, it } from 'vitest';
import { tokenize, extractUrls, normalizeText, hasMixedScript, mergeSpans } from '../src/engine/text';
import { splitHost, editDistance, parseLink, analyzeLink, analyzeLinks } from '../src/engine/url';
import { runRules } from '../src/engine/rules';
import { analyzeMessage } from '../src/engine';
import { compress, bandFor } from '../src/engine/analyze';
import { MESSAGES } from '../src/data/messages';

const span = { start: 0, end: 0 };

describe('tokeniser', () => {
  it('collapses entities so the model learns shapes, not specific values', () => {
    const toks = tokenize('Pay $49.99 at https://evil.example/login or call (888) 402-7719');
    expect(toks).toContain('zmoneyz');
    expect(toks).toContain('zurlz');
    expect(toks).toContain('zphonez');
    expect(toks).not.toContain('evil');
  });

  it('emits bigrams as well as unigrams', () => {
    expect(tokenize('verify your account')).toContain('verify_your');
  });

  it('strips invisible characters and folds lookalike letters', () => {
    expect(normalizeText('pаy​pal')).toBe('paypal');
  });
});

describe('URL extraction', () => {
  it('finds bare hostnames with a real TLD but not sentence fragments', () => {
    const found = extractUrls('Go to usps-redelivery.icu/track now. Thanks.Then reply.');
    expect(found.map((u) => u.text)).toEqual(['usps-redelivery.icu/track']);
  });

  it('trims trailing sentence punctuation off a link', () => {
    expect(extractUrls('see https://example.com/a.')[0]!.text).toBe('https://example.com/a');
  });

  it('reports offsets that index into the original string', () => {
    const text = 'hello https://example.com bye';
    const u = extractUrls(text)[0]!;
    expect(text.slice(u.start, u.end)).toBe('https://example.com');
  });
});

describe('host parsing', () => {
  it('handles multi-label public suffixes', () => {
    expect(splitHost('shop.example.co.uk').registrable).toBe('example.co.uk');
    expect(splitHost('mail.google.com').registrable).toBe('google.com');
  });

  it('parses the userinfo trick', () => {
    const p = parseLink('http://www.paypal.com@203.0.113.9/login')!;
    expect(p.userinfo).toBe('www.paypal.com');
    expect(p.host).toBe('203.0.113.9');
  });

  it('counts a transposition as one edit', () => {
    expect(editDistance('gogole', 'google')).toBe(1);
    expect(editDistance('paypal', 'paypal')).toBe(0);
  });
});

describe('link analysis', () => {
  it('flags a brand name sitting outside the registrable domain', () => {
    const f = analyzeLink('https://chase.com.secure-verify.icu/login', span);
    expect(f.registrable).toBe('secure-verify.icu');
    expect(f.issues.map((i) => i.key)).toContain('ev.link.brandOutsideDomain');
    expect(f.impersonates).toBe('Chase');
  });

  it('flags character-substitution spoofs', () => {
    const f = analyzeLink('http://paypa1.com/signin', span);
    expect(f.issues.map((i) => i.key)).toContain('ev.link.lookalike');
  });

  it('flags a brand name baked into an unrelated domain', () => {
    const f = analyzeLink('https://docu-sign-secure.buzz/d/8812', span);
    expect(f.issues.map((i) => i.key)).toContain('ev.link.brandInDomain');
  });

  it('does not fire on short brand keys inside ordinary words', () => {
    const f = analyzeLink('https://firstbank-purchases.com/', span);
    expect(f.issues.map((i) => i.key)).not.toContain('ev.link.brandInDomain');
  });

  it('detects homoglyph hostnames through the folding step', () => {
    const findings = analyzeLinks('go to https://pаypal.com/verify now');
    expect(findings).toHaveLength(1);
    expect(findings[0]!.issues.map((i) => i.key)).toContain('ev.link.mixedScript');
  });

  it('treats a genuine brand domain as mild positive evidence', () => {
    const f = analyzeLink('https://www.chase.com/security', span);
    expect(f.risk).toBe(0);
    expect(f.issues.map((i) => i.key)).toEqual(['ev.link.knownGood']);
  });
});

describe('rule engine', () => {
  it('separates asking for a code from merely mentioning one', () => {
    const genuine = runRules('Chase: your one-time code is 905174. We will never call and ask you for this code.');
    const scam = runRules('Two-factor is being disabled. Reply with the 6 digit code we sent you.');
    expect(genuine.map((e) => e.key)).not.toContain('ev.rule.credentialRequest');
    expect(scam.map((e) => e.key)).toContain('ev.rule.credentialRequest');
  });

  it('does not fire "irs" on the middle of another word', () => {
    expect(runRules('Please review the first draft.').map((e) => e.key)).not.toContain(
      'ev.rule.govImpersonation',
    );
  });

  it('matches Spanish-language tactics', () => {
    const keys = runRules('URGENTE: debe confirmar su contraseña inmediatamente.').map((e) => e.key);
    expect(keys).toContain('ev.rule.urgency');
    expect(keys).toContain('ev.rule.credentialRequest');
  });

  it('returns spans that point at the matched text', () => {
    const text = 'You must act now or your account will be suspended.';
    const ev = runRules(text).find((e) => e.key === 'ev.rule.threat')!;
    expect(text.slice(ev.spans![0]!.start, ev.spans![0]!.end)).toBe('account will be suspended');
  });
});

describe('scoring', () => {
  it('compresses monotonically and stays inside 0-100', () => {
    let prev = -1;
    for (let raw = -50; raw <= 300; raw += 5) {
      const v = compress(raw);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it('maps scores onto the right bands', () => {
    expect(bandFor(0)).toBe('safe');
    expect(bandFor(30)).toBe('caution');
    expect(bandFor(60)).toBe('likely-scam');
    expect(bandFor(90)).toBe('dangerous');
  });

  it('returns a neutral result for empty input', () => {
    const a = analyzeMessage('   ');
    expect(a.score).toBe(0);
    expect(a.evidence).toHaveLength(0);
  });

  it('every point of the score is attributable to one piece of evidence', () => {
    const a = analyzeMessage(MESSAGES.find((m) => m.label === 1)!.text);
    expect(a.evidence.reduce((sum, e) => sum + e.points, 0)).toBe(a.rawPoints);
    expect(a.score).toBe(compress(a.rawPoints));
  });

  it('does not let the model veto a hard tactic signal', () => {
    const a = analyzeMessage(
      "Hi, IT here. We're migrating accounts tonight. Reply with your username and password so we don't lock you out in the morning.",
    );
    expect(a.score).toBeGreaterThanOrEqual(50);
  });

  it('leaves a genuine 2FA message alone', () => {
    const a = analyzeMessage(
      'Chase: your one-time code is 905174. It expires in 10 minutes. We will never call and ask you for this code.',
    );
    expect(a.band).toBe('safe');
  });
});

describe('pipeline quality on the held-out set', () => {
  const results = MESSAGES.map((m) => ({ ...m, score: analyzeMessage(m.text).score }));
  const flagged = (score: number) => (score >= 50 ? 1 : 0);
  const tp = results.filter((r) => r.label === 1 && flagged(r.score)).length;
  const fp = results.filter((r) => r.label === 0 && flagged(r.score)).length;
  const fn = results.filter((r) => r.label === 1 && !flagged(r.score)).length;

  it('raises no false alarms', () => {
    const offenders = results.filter((r) => r.label === 0 && flagged(r.score));
    expect(offenders.map((o) => `${o.score} ${o.text.slice(0, 60)}`)).toEqual([]);
    expect(fp).toBe(0);
  });

  it('catches at least 93% of scams outright', () => {
    expect(tp / (tp + fn)).toBeGreaterThanOrEqual(0.93);
  });

  it('warns about every scam it does not fully flag', () => {
    for (const r of results.filter((x) => x.label === 1 && !flagged(x.score))) {
      expect(r.score, r.text.slice(0, 70)).toBeGreaterThanOrEqual(25);
    }
  });
});

describe('span merging', () => {
  it('collapses overlapping ranges', () => {
    expect(mergeSpans([{ start: 5, end: 10 }, { start: 0, end: 6 }, { start: 20, end: 22 }])).toEqual([
      { start: 0, end: 10 },
      { start: 20, end: 22 },
    ]);
  });

  it('recognises mixed-script words', () => {
    expect(hasMixedScript('pаypal')).toBe(true);
    expect(hasMixedScript('paypal')).toBe(false);
  });
});

describe('regressions found by external validation', () => {
  const affection = [
    'Good night my dear.. Sleepwell&Take care',
    'Happy New year my dear brother. I really do miss you.',
    'Good morning my love, hope you slept well',
    'Miss you babe, call me when you finish work',
    'God bless. get good sleep my dear...i will pray!',
  ];

  it.each(affection)('does not treat affection as fraud: %s', (text) => {
    expect(analyzeMessage(text).band).toBe('safe');
  });

  it('does not flag a colleague who is simply busy', () => {
    expect(analyzeMessage("I'm in a meeting until 3, can we talk after?").band).toBe('safe');
    expect(analyzeMessage('Are you at your desk? I will bring the printouts over.').band).toBe(
      'safe',
    );
  });

  it('leaves a genuine wrong number alone', () => {
    expect(analyzeMessage('wrong number sorry!').band).toBe('safe');
    expect(analyzeMessage('Sorry, wrong number! I was trying to reach my sister.').band).toBe(
      'safe',
    );
  });
});

describe('opener pairs', () => {
  const pigButchering = [
    'Hi! Sorry wrong number I think. But you seem nice, where are you from? I am an analyst living in Singapore.',
    'Sorry who is this? Oh — my mistake. You seem nice though, what do you do for a living?',
    'Is this Michael? Wrong number then, sorry! Where are you from anyway, maybe we can be friends.',
  ];
  const becOpeners = [
    "Are you at your desk? I need a favour and I'm heading into a board meeting so I can only text. Don't call me.",
    'Are you available? I can only text right now, please do not call me.',
    'Do you have a minute? Cannot take calls today, text only.',
  ];

  it.each(pigButchering)('flags a stranger opener: %s', (text) => {
    expect(analyzeMessage(text).score).toBeGreaterThanOrEqual(50);
  });

  it.each(becOpeners)('flags a pretext handshake: %s', (text) => {
    expect(analyzeMessage(text).score).toBeGreaterThanOrEqual(50);
  });

  it('needs both halves — neither alone is enough', () => {
    expect(analyzeMessage('Sorry, wrong number.').band).toBe('safe');
    expect(analyzeMessage('Are you free at the moment?').band).toBe('safe');
  });
});
