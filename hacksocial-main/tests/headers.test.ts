import { describe, expect, it } from 'vitest';
import { parseHeaders, parseMailbox, analyzeHeaders } from '../src/engine/headers';
import { analyzeMessage } from '../src/engine';
import { bandFor, SENSITIVITY_OFFSET } from '../src/engine/analyze';
import { tidyOcrText } from '../src/ocr';

const PHISH = `Return-Path: <bounce@mailer-7x.icu>
Authentication-Results: mx.example.com; spf=fail smtp.mailfrom=mailer-7x.icu; dkim=fail header.d=paypal-billing.top; dmarc=fail (p=REJECT) header.from=paypal-billing.top
From: "PayPal Service" <service@paypal-billing.top>
Reply-To: recovery-desk@mail.ru
Subject: Your account has been limited

Confirm your password to restore access: https://paypal-billing.top/verify`;

const GENUINE = `Return-Path: <bounce-1182@chase.com>
Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=chase.com; dkim=pass header.d=chase.com; dmarc=pass header.from=chase.com
From: Chase <no-reply@chase.com>
Subject: Your statement is ready

Your August statement is available at https://www.chase.com/account`;

describe('header parsing', () => {
  it('reads folded continuation lines as one value', () => {
    const h = parseHeaders('From: a@b.com\nSubject: part one\n  and part two\n\nbody');
    expect(h.fields.get('subject')?.value).toBe('part one and part two');
  });

  it('locates the body after the blank line', () => {
    const text = 'From: a@b.com\nSubject: hi\n\nthe body';
    const h = parseHeaders(text);
    expect(text.slice(h.bodyOffset)).toBe('the body');
  });

  it('does not mistake ordinary prose for an email', () => {
    expect(parseHeaders('Hey, are we still on for dinner Thursday?').present).toBe(false);
    expect(parseHeaders('Note: bring the tickets tomorrow').present).toBe(false);
  });

  it('splits a mailbox into display name and address', () => {
    const m = parseMailbox('"PayPal Service" <service@paypal-billing.top>')!;
    expect(m.display).toBe('PayPal Service');
    expect(m.address).toBe('service@paypal-billing.top');
    expect(m.registrable).toBe('paypal-billing.top');
  });
});

describe('header analysis', () => {
  const keys = (text: string) => analyzeHeaders(text).evidence.map((e) => e.key);

  it('reports every authentication failure', () => {
    expect(keys(PHISH)).toEqual(
      expect.arrayContaining(['ev.hdr.spfFail', 'ev.hdr.dkimFail', 'ev.hdr.dmarcFail']),
    );
  });

  it('catches a display name claiming a brand it does not own', () => {
    expect(keys(PHISH)).toContain('ev.hdr.displayNameSpoof');
  });

  it('catches a Reply-To pointing at a different domain', () => {
    expect(keys(PHISH)).toContain('ev.hdr.replyToMismatch');
  });

  it('credits a fully authenticated sender', () => {
    const found = keys(GENUINE);
    expect(found).toContain('ev.hdr.authPass');
    expect(found).not.toContain('ev.hdr.spfFail');
    expect(found).not.toContain('ev.hdr.replyToMismatch');
  });

  it('flags a brand claim from a consumer mailbox', () => {
    expect(keys('From: "Chase Fraud Team" <chase.security.dept@gmail.com>\nSubject: alert\n\nhi')).toContain(
      'ev.hdr.freemailBrand',
    );
  });

  it('reports spans that point at the header value it read', () => {
    const ev = analyzeHeaders(PHISH).evidence.find((e) => e.key === 'ev.hdr.replyToMismatch')!;
    expect(PHISH.slice(ev.spans![0]!.start, ev.spans![0]!.end)).toBe('recovery-desk@mail.ru');
  });
});

describe('headers inside the full pipeline', () => {
  it('condemns a forged email', () => {
    expect(analyzeMessage(PHISH).band).toBe('dangerous');
  });

  it('clears an authenticated one', () => {
    expect(analyzeMessage(GENUINE).band).toBe('safe');
  });

  it('scans the subject line as well as the body', () => {
    const withSubject = analyzeMessage(
      'From: x@y.com\nSubject: URGENT act now or your account will be suspended\nTo: me@z.com\n\nRegards',
    );
    expect(withSubject.evidence.map((e) => e.key)).toEqual(
      expect.arrayContaining(['ev.rule.urgency', 'ev.rule.threat']),
    );
  });

  it('keeps subject-line spans pointing into the original text', () => {
    const text = 'From: x@y.com\nSubject: your account will be suspended\nTo: me@z.com\n\nRegards';
    const ev = analyzeMessage(text).evidence.find((e) => e.key === 'ev.rule.threat')!;
    expect(text.slice(ev.spans![0]!.start, ev.spans![0]!.end)).toBe('account will be suspended');
  });
});

describe('sensitivity', () => {
  it('shifts thresholds without touching the score', () => {
    expect(bandFor(45, SENSITIVITY_OFFSET.cautious)).toBe('likely-scam');
    expect(bandFor(45, SENSITIVITY_OFFSET.balanced)).toBe('caution');
    expect(bandFor(55, SENSITIVITY_OFFSET.strict)).toBe('caution');
  });
});

describe('OCR text tidying', () => {
  it('rejoins a line wrapped mid-sentence', () => {
    expect(
      tidyOcrText('USPS: your package is on hold because the address is\nincomplete. Pay now.'),
    ).toBe('USPS: your package is on hold because the address is incomplete. Pay now.');
  });

  it('keeps genuine line breaks between sentences', () => {
    expect(tidyOcrText('Pay the fee here:\nhttp://example.icu/track')).toBe(
      'Pay the fee here:\nhttp://example.icu/track',
    );
  });

  it('drops blank lines and collapses runs of spaces', () => {
    expect(tidyOcrText('  Hello   there \n\n\n  Bye  ')).toBe('Hello there\nBye');
  });
});

describe('statistics', () => {
  it('gives a Wilson interval that stays inside [0, 1] at the extremes', async () => {
    const { wilson } = await import('../src/engine/stats');
    const perfect = wilson(63, 63);
    expect(perfect.point).toBe(1);
    expect(perfect.low).toBeGreaterThan(0.9);
    expect(perfect.low).toBeLessThan(1);
    expect(perfect.high).toBeCloseTo(1, 12);

    const none = wilson(0, 40);
    expect(none.low).toBe(0);
    expect(none.high).toBeGreaterThan(0);

    expect(wilson(90, 100).high - wilson(90, 100).low).toBeGreaterThan(
      wilson(900, 1000).high - wilson(900, 1000).low,
    );
  });
});

describe('layer masking', () => {
  it('lets each detector be switched off independently', async () => {
    const { analyze } = await import('../src/engine/analyze');
    const { MODEL } = await import('../src/engine');
    const kinds = (layers: object) =>
      new Set(analyze(MODEL, PHISH, layers).evidence.map((e) => e.kind));

    expect(kinds({ headers: false }).has('header')).toBe(false);
    expect(kinds({ links: false }).has('link')).toBe(false);
    expect(kinds({ rules: false }).has('rule')).toBe(false);
    const all = kinds({});
    expect(all.has('header')).toBe(true);
    expect(all.has('link')).toBe(true);
    expect(all.has('rule')).toBe(true);
  });

  it('scores lower with layers removed than with all of them', async () => {
    const { analyze } = await import('../src/engine/analyze');
    const { MODEL } = await import('../src/engine');
    const full = analyze(MODEL, PHISH).score;
    const modelOnly = analyze(MODEL, PHISH, {
      rules: false,
      links: false,
      headers: false,
    }).score;
    expect(full).toBeGreaterThan(modelOnly);
  });
});
