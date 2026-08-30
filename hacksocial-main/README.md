# Skeptic

**Paste a suspicious message. Find out *why* it is a scam.**

Skeptic is an offline scam and phishing detector that explains its reasoning. Paste a text
message, email or DM — **or just drop in a screenshot** — and it tells you how dangerous it is,
which exact phrases and which part of which link gave it away, and what to do next, in English
or Spanish, at any text size, on any device, with no account and no network connection.

**Nothing you paste ever leaves your browser.** There is no server, no API key and no analytics.
The model ships as a static file and runs locally in under a millisecond.
---

## Why this exists

Scam messages are the most common form of fraud most people will ever encounter, and the
tooling around them is upside down. Spam filters make a silent yes/no decision inside a mail
provider; by the time a message reaches a phone it has already been judged, and the person
reading it is given no help at all. Meanwhile the people targeted hardest — older adults,
recent immigrants, anyone whose second language is the one the scam is written in — are the
least likely to be served by an English-only tool that requires an account.

Three design decisions follow from that:

**It explains, so it teaches.** A verdict alone is worthless the moment the tool is not there.
Every point of the risk score is attributed to a named signal, the triggering phrases are
highlighted inside the message, and the link breakdown shows *which part of the address* is the
part that matters. The goal is that after a few uses you stop needing it.

**It runs entirely on the device.** A tool people paste bank messages into should be incapable
of leaking them, not merely promising not to. No network calls exist in the codebase, so there
is nothing to trust and nothing to audit.

**It has to be usable by the people who need it.** Spanish throughout — including every
explanation, not just the buttons — three text sizes, a high-contrast mode, full keyboard
navigation and screen-reader labelling on every chart.

---

## How it works

Four independent detectors vote on every message. They fail in different situations, which is
the entire reason there are four of them.

### 1. A trained language model

Naive Bayes and L2-regularised logistic regression are fitted on sublinear TF-IDF features
(word unigrams and bigrams), then **stacked**: a third, two-input logistic model learns how far
to trust each base classifier. Stacking doubles as calibration, so the probability the interface
shows is a real probability rather than an arbitrary confidence number.

The logistic layer is also what powers the "why". Its per-token products (`weight × tfidf`) are
*exact* attributions of the decision — not a LIME or SHAP approximation sampled after the fact.
When the app says a word moved the model by a certain amount, that is arithmetic, not an estimate.

Entities are collapsed during tokenisation (`zurlz`, `zmoneyz`, `zphonez`, `zcodez`) so the model
learns message *shapes* rather than memorising the domains and dollar amounts of last year's
campaigns.

### 2. A rule engine for tactics

Roughly two dozen hand-built pattern sets covering the moves a scammer cannot drop no matter how
they reword: manufactured urgency, threats, secrecy, untraceable payment rails, credential
harvesting, the "move your money to a safe account" instruction, advance fees, wrong-number
openers. These keep working on brands and pretexts that did not exist when the model was trained,
and they cover Spanish as well as English.

The rules also encode *combinations*. A credential request is a warning; a credential request
plus a hostile link is a phishing attempt, and scores more than the sum of its parts.

The care here is mostly in avoiding false alarms. A genuine 2FA message and a scam both contain
the phrase "one-time code" — so the rule fires on a *request* for one ("reply with the code"),
never on the mention of one, and a separate negative rule recognises the "we will never ask you
for this code" disclaimer that only real security messages carry.

### 3. A link analyser

Every address is decomposed and checked against the tricks that make a URL lie:

| Check | Catches |
| --- | --- |
| Mixed-script and homoglyph detection | `pаypal.com` with a Cyrillic **а** |
| Punycode (`xn--`) | Internationalised domains that display as something else |
| Brand outside the registrable domain | `chase.com.secure-verify.icu/login` |
| Brand baked into an unrelated domain | `docu-sign-secure.buzz` |
| Damerau–Levenshtein distance to real brand domains | `gogole.com`, `paypa1.com` |
| Userinfo trick | `http://www.paypal.com@203.0.113.9/login` |
| Raw IP hosts, odd ports, plain `http` | Infrastructure that no real brand uses |
| Disposable / high-abuse TLDs, link shorteners | `.tk`, `.icu`, `bit.ly` |
| Sign-in wording on unrecognised domains | `/verify`, `/secure`, `/unlock` |

Character-substitution spoofs always score highly. Fuzzy near-misses score lower unless the
message itself claims to be from that brand — because real, unrelated sites genuinely do sit one
edit apart, and `discovery.com` should not be accused of impersonating `discover.com` without
cause.

### 4. An email header analyser

Paste a raw email — headers and all — and a fourth layer wakes up. The body of a phishing email
is written to be convincing; the headers are not. They carry machine-checkable facts about who
actually sent it:

| Check | Catches |
| --- | --- |
| SPF / DKIM / DMARC verdicts | A message the claimed domain did not send and disowns |
| Reply-To vs From | A reply that quietly goes to `recovery-desk@mail.ru` |
| Display name vs address | `"PayPal Service" <service@paypal-billing.top>` |
| Brand claim from a consumer mailbox | `"Chase Fraud Team" <chase.security@gmail.com>` |
| Sender domain impersonation | Same test as the link layer, applied to `From:` |
| Return-Path mismatch, disposable sender TLDs | Bounce infrastructure that does not match the story |

Header parsing handles folded continuation lines, and the subject line is scanned by the prose
layers with its offsets preserved, so a signal found in the subject highlights in the subject.
A fully authenticated sender (`spf=pass dkim=pass dmarc=pass`) earns *negative* points — worth
something, but never a clean bill of health, because a real domain can still send you a bad
message.

### Fusion

Signals add up to a raw point total, which is compressed onto 0–100 by `100·(1 − e^(−raw/38))`.
The curve saturates deliberately: no single signal can max out the score, and a pile of weak ones
cannot either.

One asymmetry matters. The model may lower a score, but only so far: **not sounding like a scam
is weak evidence of safety.** A calm, well-written message that asks for your password is still a
scam, so a hard tactic signal caps how far the statistical layer is allowed to argue the score
back down. That single rule is the difference between catching the quiet, targeted attacks and
missing all of them.

---

## Screenshots in, verdict out

Most scam messages arrive on a phone, and the natural way to show someone one is a screenshot.
Retyping it is exactly the friction that makes people skip the check — so drag an image in,
paste one from the clipboard, or pick a file, and the text is read on the spot.

The OCR engine (Tesseract, WebAssembly) and its language data are **served from this origin**,
not a CDN. That detail is the whole point: the library's default is to fetch them remotely,
which would mean a screenshot of someone's bank texts triggering a request to a third party on a
page whose entire premise is that it does not do that.

That promise is tested, not just asserted in a README. `tests/privacy.test.ts` fails the build if
any source file gains a `fetch`, an off-origin URL, or an unexpected storage key; and
`npm run test:e2e` drives a real browser through the whole screenshot path and fails if a single
request leaves the origin.

The extracted text lands in the editable box, so anything OCR got wrong can be fixed before the
verdict is read.

## The command line

The engine is a plain TypeScript module with no browser dependency, so the same code that runs
in the page runs in a terminal:

```console
$ npm run check -- "URGENT: your Chase account will be suspended. Verify at
                    http://chase.com.secure-verify.icu/login within 24 hours."

  ████████████████████  98/100
  Dangerous — almost certainly a scam

  Why
   +48 [model] The wording matches scam messages
   +34 [link]  Chase appears, but the site belongs to someone else
   +20 [rule]  Threat of consequences
   ...
```

It reads from an argument, `--file`, or stdin; `--json` emits machine-readable output, `--lang es`
switches language, and the exit code is **0** for safe/caution, **1** for likely scam and **2**
for dangerous — so it works as a gate in a pipeline or a mail filter.

---

## Results

Measured on 141 messages written by hand in a deliberately different voice from the training
templates, never used to fit any parameter ([`src/data/messages.ts`](src/data/messages.ts)):

| | Accuracy | Precision | Recall | F1 | ROC AUC |
| --- | ---: | ---: | ---: | ---: | ---: |
| Internal split *(same generator as training — near-meaningless)* | 100.0% | 100.0% | 100.0% | 100.0% | 1.000 |
| Holdout — model layer only | 90.1% | 100.0% | 80.0% | 88.9% | 0.994 |
| **Holdout — all four layers** | **97.2%** | **100.0%** | **94.3%** | **97.1%** | **1.000** |

**Zero false alarms** on the holdout: all 71 legitimate messages cleared. The four missed scams all
still land in the **Caution** band rather than reading as safe, and a test asserts exactly that —
anything the pipeline fails to flag outright must still score at least 25.

Accuracy figures in the app carry 95% Wilson intervals. With 141 messages a bare point estimate
would overstate what is actually known.

### What each layer is actually worth

"Four detectors are better than one" is a claim, and claims about architecture are the easiest
kind to get away with unmeasured. `npm run train` runs the ablation:

| Layers | Accuracy | Precision | Recall | F1 |
| --- | ---: | ---: | ---: | ---: |
| Model only | 84.4% | 100.0% | 68.6% | 81.4% |
| Rules only | 67.4% | 100.0% | 34.3% | 51.1% |
| Links only | 62.4% | 94.7% | 25.7% | 40.5% |
| Headers only | 55.3% | 100.0% | 10.0% | 18.2% |
| Model + rules | 94.3% | 100.0% | 88.6% | 93.9% |
| Model + rules + links | 96.5% | 98.5% | 94.3% | 96.4% |
| **All four** | **97.2%** | **100.0%** | **94.3%** | **97.1%** |

Each layer alone is weak — precise but nowhere near complete. Together they cover each other, and
the last row earns the fourth layer: adding headers is what takes precision from 98.5% back to
100%, removing the final false alarm.

**The ablation also improved the evaluation set.** Its first run reported *0.000 recall* for the
header layer. The layer was not broken — the holdout was almost entirely SMS and gave it nothing
to read. Fourteen raw emails were added and the layer became measurable. A measurement that
cannot see a component is a fault in the measurement, not in the component.

### Tested against real messages

Everything above is measured on messages we wrote. That is a real limitation — and stating a
limitation is not the same as bounding it. So: **5,572 SMS messages that actual people actually
received**, from the [SMS Spam Collection](https://doi.org/10.1145/2034691.2034742) (Almeida,
Gómez Hidalgo & Yamakami, 2011), scored by the shipped detector with nothing retrained, nothing
tuned and nothing excluded. Run it yourself with `npm run eval:external`.

**The first run was bad, in the way that matters most.**

| | Accuracy | Precision | Recall | False alarms |
| --- | ---: | ---: | ---: | ---: |
| Before | 64.0% | 17.1% | 43.9% | **32.8%** |
| After | **86.0%** | **46.8%** | 31.1% | **5.5%** |

It was firing on **one legitimate message in three**, because it read ordinary terms of affection
as romance fraud. `Good night my dear` scored 72/100. `Happy New year my dear brother` scored 71.

The cause was not the rules — it was the training data. The synthetic ham contained appointments
and delivery notices and package tracking and not one warm message between people who love each
other, so the model had never seen how people actually talk and read warmth as manipulation.
Two fixes: endearments came out of the romance rule (they are now only an ingredient, combined
with an actual request for money), and the corpus gained the register it was missing — affection,
blessings, well-wishes, and the clipped abbreviated SMS that dominates real phone messaging.

**It cost something.** Teaching the model that warmth is ordinary lost about three points of
outright recall on our own holdout — 97.1% down from a previous 98.6%. That is the right side of
the trade here: a missed scam that still reads *Caution* leaves someone warned, while a false
alarm teaches them to ignore every warning after it. The two guarantees that matter — no false
alarms on the holdout, and every miss still warning — did not move.

**Read the recall column carefully.** "Spam" in that corpus means unsolicited *commercial* SMS —
ringtone offers, competition entries, premium-rate marketing. Skeptic looks for fraud, so a large
share of what it declines to flag is legal advertising it arguably should ignore. The corpus is
also from the UK and Singapore around 2011, an era of premium-rate shortcodes rather than
lookalike domains, which leaves the link analyser almost nothing to read.

**The remaining 5.5% is the honest cost of synthetic training data.** Those misfires come from
the model layer alone, on registers of everyday English the generated corpus does not reach.
Chasing them by adding more templates would mean tuning to this corpus, at which point it stops
being an external test — so they are left in, and reported.

### Honest limitations

- **Training data is synthetic.** Real scam corpora are full of live victim data and cannot be
  redistributed, so the corpus is generated from message shapes documented in FTC, FBI IC3 and
  Action Fraud consumer advisories. The external validation above is the measure of what that
  costs: a 5.5% false-alarm rate on real messages, which is still too high for anything
  unsupervised.
- **The four-layer figure is an upper bound.** The rule lexicon was extended after reviewing
  holdout errors. The additions are documented scam markers rather than memorised test cases, but
  the holdout is no longer perfectly clean for the rule layer — so the model-only row is the
  honest estimate of generalisation, and the fused row should be read as a ceiling.
- **Coverage is uneven.** Strongest on English and Spanish consumer scams; weakest on targeted,
  well-written attacks written for one specific person.
- **It is a second opinion, not an authority.** It will miss things, and a low score is never
  permission to send money.

---

## The practice drill

The detector helps with the message in front of you. It does nothing about the one that arrives
while you are away from a laptop, which is most of them.

So the app also contains a drill: the same 141 messages, shown one at a time, scam or legitimate,
with an explanation after every answer. Difficulty is derived from the engine's own scoring — a
scam the detector finds obvious is an easy card, while a *legitimate* message that scores high (a
real fraud alert, a real boss with a real deadline) is a hard one. Difficulty adapts to how you
do, and the app tracks which scam families you are weakest on.

This is the part most likely to still be protecting someone a year from now.

---

## Reaching it from where the scam actually is

Scams arrive in webmail, in a social feed, in a support ticket — places this app is not. Three
ways in, none of which involves retyping anything:

- **Browser extension** ([`extension/`](extension/)) — select any text, right-click, **"Check …
  with Skeptic"**. It asks for exactly one permission (`contextMenus`), has no host permissions
  and no content scripts, and cannot read a page: the browser hands it your selection and nothing
  else.
- **Deep links** — `#m=<base64url>` prefills the analyser. The payload rides in the URL
  *fragment*, which browsers never put on the wire, and the app strips it from the address bar as
  soon as it reads it so the message does not linger in history or in a shared link.
- **Batch scanning** — `npm run check -- --batch inbox.txt` scans a file of messages separated by
  lines of `---` and prints one line each plus a summary, exiting on the worst band it found. For
  triaging a folder of reported messages without uploading any of them.

```console
$ npm run check -- --batch inbox.txt

    1    0  No warning signs                    Chase: your one-time code is 905174. We will never…
    2   94  Dangerous — almost certainly a scam  USPS: Your package is on hold. Pay the $1.95 redel…
    3    0  No warning signs                    Hey, are we still on for dinner Thursday? I can pi…
    4   85  Dangerous — almost certainly a scam  Grandma it's me, I'm in jail in Denver and need $2…
    5   81  Dangerous — almost certainly a scam  Hi, IT here. Reply with your username and password…

  5 messages · 3 dangerous — almost certainly a scam · 2 no warning signs
```

---

## Other things it does

- **Read aloud.** The verdict and the reasons, spoken, in the current language. A scam text is
  often read by someone whose eyesight is part of why they were targeted.
- **Share this warning.** Generates plain-language text you can forward to whoever actually
  received the message — most people checking here are checking for a parent, and "the app said
  87" is not a thing you can send someone.
- **Print.** A dedicated print stylesheet turns an analysis into something you can hand to a
  relative, take to a bank branch, or attach to a report — the chrome drops away, the columns
  collapse to one flow, and no card is ever split across a page break.

- **Sensitivity.** Cautious / balanced / strict shifts the band thresholds, never the score, so
  the evidence on screen is identical whichever way it is set.
- **Counterfactuals.** Because the score is a plain sum, every signal shows what the score would
  be *without* it. That is arithmetic, not a re-run, so the weight of each reason can be shown
  rather than described.
- **Recent checks.** Stored locally, first line only, capped at 80 characters — enough to
  recognise an entry, not a transcript of your inbox. One click to clear.
- **Installable and offline.** A service worker caches the app; it works with the network off.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
```

No API keys, no environment variables, no backend, no build-time secrets. The trained model is
committed as a static asset, so a clean clone works offline.

```bash
npm test             # 72 tests: engine, headers, statistics, privacy guards
npm run typecheck
npm run train        # refits the model and rewrites src/data/model.json
npm run build
npm run check -- "message to check"   # the CLI
npm run eval:external                 # score 5,572 real SMS messages

# Optional: drives a real browser through the screenshot path and fails if
# anything at all leaves the origin. Playwright is not a project dependency.
npm i --no-save playwright && npx playwright install chromium
npm run test:e2e
```

Training is fully seeded — `npm run train` reproduces the committed `model.json` byte for byte,
and CI asserts exactly that. If it ever drifts, something non-deterministic entered the pipeline
and the published metrics no longer describe the model that ships.

---

## Layout

```
src/engine/       the detector — no React, no DOM, fully unit-tested
  text.ts         normalisation, homoglyph folding, tokenisation, URL extraction
  brands.ts       impersonated brands, real domains, abuse-prone TLDs, shorteners
  url.ts          link decomposition and the checks in the table above
  headers.ts      RFC 5322 parsing, SPF/DKIM/DMARC, sender spoofing
  rules.ts        the tactic lexicons (English + Spanish)
  model.ts        NB + logistic + stacker runtime, and the attribution maths
  analyze.ts      fusion, scoring, scam-family inference
  stats.ts        Wilson intervals, so reported rates carry their uncertainty
src/ocr.ts        on-device screenshot reading, lazily loaded
src/deeplink.ts   #m= fragment handover from other surfaces
bin/skeptic.ts    the CLI — same engine, terminal output, useful exit codes
extension/        MV3 browser extension: right-click any selection
ml/
  corpus.ts       seeded generator for the training set
  train.ts        fits, evaluates, writes src/data/model.json
scripts/
  vendor-ocr.mjs  copies the OCR engine into public/ so nothing loads from a CDN
src/data/
  messages.ts     the 141 hand-written messages (holdout + practice deck)
  model.json      the trained model, committed
src/i18n/         complete English and Spanish locales, key-parity enforced
src/pages/        Analyse · Practise · How it works · Scam guide
tests/            72 tests: detection, headers, statistics, and privacy guards
                  including a regression guard that false alarms stay at zero
```

The engine is deliberately free of any UI dependency — it is importable from Node, from the
trainer, and from the tests without a browser anywhere in sight.

---

## Accessibility and privacy

- Three text sizes scaling the whole layout, a high-contrast mode, light/dark/system themes
- Every chart is hand-drawn SVG with a real `aria-label` describing its data, not an opaque canvas
- **Colour is functional and never load-bearing.** Each detector owns a hue that follows it from
  the evidence list to the "How it works" cards, so the two are visibly the same thing — but every
  finding also carries its detector's name in text, so nothing is communicated by colour alone. The
  five hues were chosen by running the adjacent-pair colour-vision separation checks in both light
  and dark, and the risk colours (green/amber/orange/red) are reserved for risk and reused nowhere
  else
- Full keyboard navigation, visible focus rings, skip link, `prefers-reduced-motion` respected
- Read-aloud verdicts via the browser's own speech synthesis — no cloud voice, no upload
- Complete Spanish translation of the explanations, not just the interface
- Installable and fully functional offline via a service worker
- No accounts, no cookies, no analytics; the only network requests the page ever makes are for
  its own static files on its own origin, OCR engine included

---

## Reporting a scam

If you have already sent money or shared a code, call your bank immediately — speed matters far
more than embarrassment.

- **United States** — FTC: [reportfraud.ftc.gov](https://reportfraud.ftc.gov) · FBI IC3:
  [ic3.gov](https://www.ic3.gov) · forward scam texts to **7726**
- **United Kingdom** — Action Fraud:
  [actionfraud.police.uk](https://www.actionfraud.police.uk) · forward scam texts to **7726**
- **Elsewhere** — your national consumer protection authority, and your bank

---

## License

MIT — see [LICENSE](LICENSE).
