import type { Family } from '../engine/types';

export interface Locale {
  code: string;
  name: string;
  strings: Record<string, string>;
  families: Record<Family, { name: string; summary: string; flags: string[] }>;
  advice: Record<Family, string[]>;
}

const strings: Record<string, string> = {
  'welcome.title': 'Welcome to Skeptic',
  'welcome.sub':
    'Paste a suspicious message and find out why it is a scam — not just whether it is.',
  'welcome.p1': 'Works on texts, emails, DMs, or a screenshot of one.',
  'welcome.p2': 'Explains every point of its reasoning, in plain language.',
  'welcome.p3': 'Runs entirely on your device. Nothing is ever uploaded.',
  'welcome.start': 'Get started',
  'welcome.note': 'No account. No tracking. Works offline.',
  'app.name': 'Skeptic',
  'app.tagline': 'Paste a suspicious message. Find out why it is a scam.',
  'app.offline': 'Runs entirely on your device',
  'nav.analyze': 'Check a message',
  'nav.practice': 'Practise',
  'nav.model': 'How it works',
  'nav.learn': 'Scam guide',
  'settings.title': 'Display',
  'settings.language': 'Language',
  'settings.textSize': 'Text size',
  'settings.textSize.normal': 'Normal',
  'settings.textSize.large': 'Large',
  'settings.textSize.huge': 'Largest',
  'settings.contrast': 'High contrast',
  'settings.theme': 'Theme',

  'analyze.heading': 'Check a message',
  'analyze.intro':
    'Paste a text message, email or DM. Nothing you type is uploaded — the analysis runs in this browser tab.',
  'analyze.placeholder':
    'Paste the message here…\n\nFor example: "USPS: your package is on hold. Pay the $1.95 redelivery fee at usps-redelivery.icu/track"',
  'analyze.clear': 'Clear',
  'analyze.paste': 'Paste from clipboard',
  'analyze.samples': 'Or try an example:',
  'analyze.empty.title': 'Waiting for a message',
  'analyze.empty.body':
    'The result appears here as you type. Your message never leaves this device.',
  'analyze.evidence': 'Why',
  'analyze.evidence.none': 'No warning signs found.',
  'analyze.links': 'Links in this message',
  'analyze.links.none': 'No links found.',
  'analyze.actions': 'What to do now',
  'analyze.message': 'The message, with warning signs marked',
  'analyze.model': 'What the model saw',
  'analyze.model.intro':
    'These are the exact words and word-pairs that moved the trained model, and by how much. Nothing here is an estimate — they are the model’s own weights.',
  'analyze.model.toward': 'Toward scam',
  'analyze.model.away': 'Toward legitimate',
  'analyze.copy': 'Copy report',
  'analyze.copied': 'Report copied',
  'analyze.report': 'Report it',
  'analyze.confidence.low': 'Low confidence — this message is very short',
  'analyze.confidence.medium': 'Moderate confidence',
  'analyze.confidence.high': 'High confidence',
  'analyze.without': 'Without this signal: {score}',
  'analyze.points': '{points} points',
  'analyze.scoreLabel': 'Risk score',
  'analyze.family': 'Looks like: {family}',
  'analyze.breakdown': 'Score breakdown',
  'analyze.breakdown.note':
    'Signals add up to {raw} points, which map onto the 0–100 scale below. The curve flattens on purpose: no single signal can push the score to the top, and a pile of weak ones cannot either.',

  'band.safe': 'No warning signs',
  'band.safe.body': 'Nothing here matches a known scam pattern. Stay alert anyway — no tool catches everything.',
  'band.caution': 'Be careful',
  'band.caution.body': 'Some warning signs. Do not act on this message until you have checked it another way.',
  'band.likely-scam': 'Likely a scam',
  'band.likely-scam.body': 'This has the shape of a scam. Do not click, reply, call, or pay.',
  'band.dangerous': 'Dangerous — almost certainly a scam',
  'band.dangerous.body': 'Multiple strong warning signs. Do not click, reply, call, or pay. Delete it.',

  'ev.model.language.title': 'The wording matches scam messages',
  'ev.model.language.detail':
    'The trained model puts this message at {percent}% likely to be a scam, based on its wording alone.',

  'ev.rule.urgency.title': 'Manufactured urgency',
  'ev.rule.urgency.detail':
    'Pressure to act before you can think, e.g. “{quote}”. Real organisations give you time.',
  'ev.rule.threat.title': 'Threat of consequences',
  'ev.rule.threat.detail':
    'Threatens loss, closure or legal trouble: “{quote}”. Fear is the point — it stops you checking.',
  'ev.rule.safeAccount.title': 'Asks you to move your money',
  'ev.rule.safeAccount.detail':
    '“{quote}”. No bank, police force or government agency ever asks you to move money to a “safe account”. This request only ever comes from a criminal.',
  'ev.rule.untraceablePayment.title': 'Wants an untraceable payment',
  'ev.rule.untraceablePayment.detail':
    'Mentions {quote}. Gift cards, wire transfers and crypto are demanded because they cannot be reversed once sent.',
  'ev.rule.credentialRequest.title': 'Asks for a password, PIN or code',
  'ev.rule.credentialRequest.detail':
    '“{quote}”. No legitimate organisation asks for your password, PIN or a one-time code — not by text, not by email, not on the phone.',
  'ev.rule.sensitiveData.title': 'Mentions sensitive personal details',
  'ev.rule.sensitiveData.detail':
    'Refers to {quote}. On its own this is common; combined with pressure or a link it is a red flag.',
  'ev.rule.secrecy.title': 'Asks you to keep it secret',
  'ev.rule.secrecy.detail':
    '“{quote}”. Secrecy exists to keep you away from the people who would tell you it is a scam.',
  'ev.rule.tooGood.title': 'Too good to be true',
  'ev.rule.tooGood.detail':
    '“{quote}”. Unexpected winnings and guaranteed returns are the oldest hook there is.',
  'ev.rule.advanceFee.title': 'Wants a fee before you receive something',
  'ev.rule.advanceFee.detail':
    '“{quote}”. Paying a small fee to unlock a larger sum, a parcel or a prize is the advance-fee scam.',
  'ev.rule.techSupport.title': 'Fake technical support',
  'ev.rule.techSupport.detail':
    '“{quote}”. Pop-ups and messages never detect real viruses, and no real company asks for remote access this way.',
  'ev.rule.extortion.title': 'Blackmail / sextortion',
  'ev.rule.extortion.detail':
    '“{quote}”. These messages are sent in bulk to millions of addresses. There is no video.',
  'ev.rule.jobTask.title': 'Job or task scam',
  'ev.rule.jobTask.detail':
    '“{quote}”. Easy money for simple tasks, upfront purchases or reshipping packages are all recruitment for fraud.',
  'ev.rule.romance.title': 'Romance / long-con language',
  'ev.rule.romance.detail':
    '“{quote}”. Affection followed by an investment tip or a request for money is the pattern of a long-running scam.',
  'ev.rule.investment.title': 'Investment scam language',
  'ev.rule.investment.detail':
    '“{quote}”. Guaranteed returns do not exist. Wallet “validation” exists only to empty the wallet.',
  'ev.rule.familyEmergency.title': 'Family emergency pretext',
  'ev.rule.familyEmergency.detail':
    '“{quote}”. A relative in sudden trouble, from a new number, who needs money now — call the person on their old number to check.',
  'ev.rule.govImpersonation.title': 'Impersonates a government agency',
  'ev.rule.govImpersonation.detail':
    'Claims to be {quote}. Agencies contact you by post first and never demand immediate payment by phone.',
  'ev.rule.refund.title': 'Fake charge or refund',
  'ev.rule.refund.detail':
    '“{quote}”. A charge you do not recognise, with a number to call, is bait to get you on the phone.',
  'ev.rule.invoiceBec.title': 'Business email compromise pattern',
  'ev.rule.invoiceBec.detail':
    '“{quote}”. A boss or supplier who can only text, needs it urgently and changed their bank details is the classic invoice fraud.',
  'ev.rule.channelSwitch.title': 'Wants to move to another app',
  'ev.rule.channelSwitch.detail':
    '“{quote}”. Moving to WhatsApp or Telegram gets you away from a platform that can moderate or warn you.',
  'ev.rule.genericGreeting.title': 'Generic greeting',
  'ev.rule.genericGreeting.detail':
    '“{quote}”. An organisation you actually have an account with knows your name.',
  'ev.rule.wrongNumber.title': 'Wrong-number opener',
  'ev.rule.wrongNumber.detail':
    '“{quote}”. A stranger who reached you “by accident” and keeps chatting is opening a long-con scam.',
  'ev.rule.rapportProbe.title': 'Personal questions from someone you don’t know',
  'ev.rule.rapportProbe.detail':
    '“{quote}”. On its own this is just friendliness. Straight after an unexpected first contact, it is how a long con opens.',
  'ev.rule.availabilityProbe.title': 'Checking whether you’re reachable',
  'ev.rule.availabilityProbe.detail':
    '“{quote}”. Ordinary between colleagues. It matters here only because of what it is paired with.',
  'ev.rule.channelRestriction.title': 'Rules out talking to you directly',
  'ev.rule.channelRestriction.detail':
    '“{quote}”. A real colleague who is busy says “call me later”. Removing the phone removes the one check that would expose an impersonation.',
  'ev.combo.strangerOpener.title': 'Accidental contact, then immediate personal questions',
  'ev.combo.strangerOpener.detail':
    'A wrong number is innocent. Friendly questions are innocent. Both in the same message is the documented opening of an investment or romance con — and the first message is the only part of it you can see yet.',
  'ev.combo.pretextHandshake.title': 'Asks if you’re free, then rules out a phone call',
  'ev.combo.pretextHandshake.detail':
    'This pair is the opening move of business email compromise: confirm the target is reachable and alone, then close the one channel that would prove who is really writing. Ring the person on a number you already have.',
  'ev.combo.romanceMoney.title': 'Affection paired with a request for money',
  'ev.combo.romanceMoney.detail':
    'Warmth on its own means nothing — it is how people talk to people they love. Warmth arriving together with a crisis, a transfer or an investment tip is the shape of romance fraud.',

  'ev.rule.neverAsksCode.title': 'Says it will never ask for your code',
  'ev.rule.neverAsksCode.detail':
    '“{quote}”. Genuine security messages tell you this. Scam messages ask for the code instead.',
  'ev.rule.legitOptOut.title': 'Has a real unsubscribe option',
  'ev.rule.legitOptOut.detail':
    'Offers a normal way to opt out — something scam messages rarely bother with.',

  'ev.combo.credentialLink.title': 'Asks for credentials *and* links somewhere suspicious',
  'ev.combo.credentialLink.detail':
    'Either half would be a warning. Together they are the definition of a phishing attempt.',
  'ev.combo.pressurePayment.title': 'Pressure plus an untraceable payment',
  'ev.combo.pressurePayment.detail':
    'Urgency exists to stop you thinking; an irreversible payment method exists to stop you recovering the money.',
  'ev.combo.brandCallback.title': 'Claims to be {brand} and wants you to call',
  'ev.combo.brandCallback.detail':
    'The number in the message is the scammer’s. Look up {brand}’s real number yourself — on your card, your statement, or their official site.',
  'ev.combo.secretPayment.title': 'Secrecy plus a money request',
  'ev.combo.secretPayment.detail':
    'Being asked to send money and tell no one is the signature of both grandparent scams and romance fraud.',

  'ev.link.scriptUri.title': 'Link runs code instead of opening a page',
  'ev.link.scriptUri.detail': '{url} is not an ordinary web address. Never open it.',
  'ev.link.punycode.title': 'Disguised international domain',
  'ev.link.punycode.detail':
    '{host} uses punycode (“xn--”), which lets a domain display as one thing and resolve as another.',
  'ev.link.mixedScript.title': 'Lookalike letters in the address',
  'ev.link.mixedScript.detail':
    '{host} mixes alphabets — letters from another script that look identical to English ones. This is done for one reason only.',
  'ev.link.ipHost.title': 'Link points at a bare IP address',
  'ev.link.ipHost.detail':
    '{host} is a raw address, not a domain name. Legitimate companies do not send these.',
  'ev.link.userinfo.title': 'Address hides its real destination',
  'ev.link.userinfo.detail':
    'Everything before the “@” is decoration. This link actually goes to {real}, not {shown}.',
  'ev.link.brandOutsideDomain.title': '{brand} appears, but the site belongs to someone else',
  'ev.link.brandOutsideDomain.detail':
    '“{brand}” sits in the subdomain or path, but the actual owner of this address is {registrable}. Only the part immediately before the first single slash tells you who you are visiting.',
  'ev.link.brandInDomain.title': '{brand}’s name in a domain {brand} does not own',
  'ev.link.brandInDomain.detail':
    '{host} borrows the brand name, but it is not one of {brand}’s real addresses.',
  'ev.link.lookalike.title': 'Address imitates {brand}',
  'ev.link.lookalike.detail': '{fake} is a near-copy of the real {real}.',
  'ev.link.shortener.title': 'Shortened link hides the destination',
  'ev.link.shortener.detail':
    '{host} conceals where you will actually end up. Legitimate account notices do not need to hide this.',
  'ev.link.abuseTld.title': 'Domain ending associated with abuse',
  'ev.link.abuseTld.detail':
    '“.{tld}” addresses are cheap or free and disposable, which is why fraud campaigns favour them.',
  'ev.link.deepSubdomain.title': 'Unusually deep subdomain',
  'ev.link.deepSubdomain.detail':
    '{host} stacks {count} subdomains, usually to push the real domain out of sight on a phone screen.',
  'ev.link.credentialPath.title': 'Sign-in wording on an unrecognised site',
  'ev.link.credentialPath.detail':
    '{host} advertises a login or verification page, but it is not a domain we recognise.',
  'ev.link.oddPort.title': 'Non-standard port',
  'ev.link.oddPort.detail': 'The link connects on port {port} rather than the usual 80 or 443.',
  'ev.link.noTls.title': 'Unencrypted connection',
  'ev.link.noTls.detail': '{host} is served over plain http, so anything you type travels in the clear.',
  'ev.link.brandMismatch.title': 'Message says {claimed}, link goes to {actual}',
  'ev.link.brandMismatch.detail': 'The brand in the text and the destination do not match.',
  'ev.link.unrelatedDomain.title': 'Claims to be {claimed} but links to {actual}',
  'ev.link.unrelatedDomain.detail':
    '{actual} is not an address belonging to {claimed}.',
  'ev.link.knownGood.title': 'Link goes to {brand}’s real domain',
  'ev.link.knownGood.detail':
    '{host} is a genuine {brand} address. Useful, but not proof on its own — check the rest of the message too.',

  'ev.hdr.spfFail.title': 'Sender failed SPF authentication',
  'ev.hdr.spfFail.detail':
    'The receiving mail server checked whether this message was sent by a machine the claimed domain authorises, and the answer was “{result}”. Genuine mail from a real company passes.',
  'ev.hdr.dkimFail.title': 'Broken or missing DKIM signature',
  'ev.hdr.dkimFail.detail':
    'DKIM is the sending domain’s cryptographic signature on the message. Here it came back “{result}”, meaning it was forged or altered in transit.',
  'ev.hdr.dmarcFail.title': 'Failed DMARC — the domain disowns this message',
  'ev.hdr.dmarcFail.detail':
    'DMARC is the domain owner’s own policy for mail claiming to be from them. This message failed it, so the domain it names is saying it did not send this.',
  'ev.hdr.authPass.title': 'Sender authentication passed',
  'ev.hdr.authPass.detail':
    'SPF, DKIM and DMARC all passed for {domain}, so this really was sent by that domain. That is meaningful, but a real domain can still send you a bad message — read the rest.',
  'ev.hdr.noAuth.title': 'No authentication results to check',
  'ev.hdr.noAuth.detail':
    'These headers carry no SPF/DKIM/DMARC verdict, so the sender could not be verified either way. Often it just means the headers were pasted only in part.',
  'ev.hdr.displayNameEmail.title': 'Sender name is a fake address',
  'ev.hdr.displayNameEmail.detail':
    'Your mail app will show “{display}”, but the message actually came from {real}. Putting an address in the name field is done purely so the real one stays hidden.',
  'ev.hdr.displayNameSpoof.title': 'Claims to be {brand}, sent from {domain}',
  'ev.hdr.displayNameSpoof.detail':
    'The sender name says {brand}, but the address is {address}. {domain} is not a {brand} domain — and the name field can be set to anything at all.',
  'ev.hdr.freemailBrand.title': '{brand} would not email you from a free mailbox',
  'ev.hdr.freemailBrand.detail':
    'The sender name says {brand}, but {address} is an ordinary consumer email account that anyone can open in two minutes.',
  'ev.hdr.lookalikeFrom.title': 'Sender domain imitates {brand}',
  'ev.hdr.lookalikeFrom.detail':
    '{fake} is a near-copy of the genuine {real}. The address was registered to be misread at a glance.',
  'ev.hdr.abuseTldFrom.title': 'Sender domain uses a disposable ending',
  'ev.hdr.abuseTldFrom.detail':
    'The address is on a “.{tld}” domain — cheap, disposable, and heavily favoured by fraud campaigns.',
  'ev.hdr.replyToMismatch.title': 'Your reply would go somewhere else',
  'ev.hdr.replyToMismatch.detail':
    'The message appears to come from {from}, but pressing Reply sends to {address} at {replyTo}. This is how a conversation gets quietly handed to the attacker.',
  'ev.hdr.returnPathMismatch.title': 'Bounce address does not match the sender',
  'ev.hdr.returnPathMismatch.detail':
    'The message claims to be from {from} but bounces go to {returnPath}. Bulk senders do this legitimately, so it counts for little on its own.',

  'ev.struct.invisible.title': 'Hidden invisible characters',
  'ev.struct.invisible.detail':
    'Contains {count} zero-width character(s) you cannot see. These are inserted to slip past spam filters.',
  'ev.struct.mixedScript.title': 'Lookalike letters in the text',
  'ev.struct.mixedScript.detail':
    '“{quote}” mixes alphabets. Letters from other scripts are swapped in to defeat filters while still looking normal to you.',
  'ev.struct.shouting.title': 'Mostly capital letters',
  'ev.struct.shouting.detail': '{percent}% of the letters are capitals — shouting to create alarm.',
  'ev.struct.punctuation.title': 'Excessive punctuation',
  'ev.struct.punctuation.detail': 'Runs of exclamation or question marks, used to manufacture urgency.',

  'intro.step1.title': 'Paste anything suspicious',
  'intro.step1.body':
    'A text message, a DM, or a whole email including its headers. Or drop in a screenshot and the text is read on your device.',
  'intro.step2.title': 'See exactly why',
  'intro.step2.body':
    'Every point of the score traces back to a named signal, with the words that triggered it marked inside the message.',
  'intro.step3.title': 'Know what to do next',
  'intro.step3.body':
    'Steps tailored to the kind of scam, plus a plain-language warning you can forward to whoever received it.',
  'intro.privacy':
    'No account, no tracking, no uploads. The detector is a few hundred kilobytes of maths running in this tab, and it works with the network off.',

  'ocr.title': 'Or drop in a screenshot',
  'ocr.hint':
    'Drag an image here, paste one, or choose a file. The text is read on your device — the picture is never uploaded.',
  'ocr.choose': 'Choose an image',
  'ocr.loading': 'Starting the text reader…',
  'ocr.recognising': 'Reading the text…',
  'ocr.empty': 'No readable text found in that image. Try a sharper screenshot, or type the message instead.',
  'ocr.failed': 'The text reader could not start. You can still paste the message as text.',
  'ocr.done': 'Text read from the image — check it below and fix anything that came out wrong.',
  'ocr.drop': 'Drop the image to read it',

  'settings.sensitivity': 'Sensitivity',
  'settings.sensitivity.cautious': 'Cautious',
  'settings.sensitivity.balanced': 'Balanced',
  'settings.sensitivity.strict': 'Strict',
  'settings.sensitivity.hint':
    'Cautious warns earlier and cries wolf more often. Strict only warns when it is sure. Balanced is the tested default.',
  'analyze.speak': 'Read aloud',
  'analyze.stop': 'Stop',
  'analyze.print': 'Print',
  'analyze.share': 'Share this warning',
  'analyze.share.intro':
    'Plain-language text you can forward to whoever received the message.',
  'analyze.share.copy': 'Copy warning',
  'analyze.share.copied': 'Copied',
  'share.header.dangerous': 'This message is almost certainly a scam. Do not click, reply, call, or pay.',
  'share.header.likely-scam': 'This message looks like a scam. Do not click, reply, call, or pay.',
  'share.header.caution': 'Be careful with this message — it has warning signs.',
  'share.header.safe': 'No scam warning signs were found in this message.',
  'share.why': 'Why:',
  'share.do': 'What to do:',
  'share.footer': 'Checked with Skeptic, an offline scam detector. Nothing was uploaded.',
  'history.title': 'Recent checks',
  'history.empty': 'Messages you check will be listed here.',
  'history.clear': 'Clear history',
  'history.note':
    'Stored only in this browser, first line only, never uploaded. Clear it any time.',
  'history.restore': 'Open again',

  'practice.heading': 'Practise spotting scams',
  'practice.intro':
    'The tool is not always going to be there. This drill trains the instinct — real scam and real legitimate messages, mixed. Difficulty adapts to how you do.',
  'practice.start': 'Start drill',
  'practice.scam': 'Scam',
  'practice.legit': 'Legitimate',
  'practice.next': 'Next message',
  'practice.correct': 'Correct',
  'practice.wrong': 'Not quite',
  'practice.wasScam': 'This one was a scam.',
  'practice.wasLegit': 'This one was genuine.',
  'practice.score': 'Score',
  'practice.streak': 'Streak',
  'practice.level': 'Level',
  'practice.seen': 'Seen',
  'practice.reset': 'Reset progress',
  'practice.weakest': 'Where you are weakest',
  'practice.noWeak': 'Answer a few more to see where you are weakest.',
  'practice.done': 'You have seen every message in the drill. Reset to go again.',
  'practice.explain': 'Why',
  'practice.q': 'Is this a scam, or a genuine message?',
  'practice.keys': 'Keyboard: S for scam, L for legitimate, N for next.',
  'practice.accuracy': 'Accuracy',

  'model.heading': 'How Skeptic decides',
  'model.intro':
    'Four independent detectors vote on every message. Each one is wrong in different situations, which is exactly why there are four.',
  'model.layer1.title': '1. A trained language model',
  'model.layer1.body':
    'Naive Bayes and logistic regression are fitted on TF-IDF features, then stacked so a third model learns how far to trust each. Stacking also calibrates the output, so a message scored 0.8 really is a scam about 80% of the time.',
  'model.layer2.title': '2. A rule engine for tactics',
  'model.layer2.body':
    'Hand-built patterns for the moves a scammer cannot drop: manufactured urgency, secrecy, untraceable payment, credential harvesting. These keep working on brands and pretexts that did not exist when the model was trained.',
  'model.layer3.title': '3. A link analyser',
  'model.layer3.body':
    'Every address is pulled apart: lookalike characters, punycode, brand names in the wrong position, edit-distance to real domains, disposable TLDs, shorteners, raw IPs and the “@” trick.',
  'model.layer4.title': '4. An email header analyser',
  'model.layer4.body':
    'When the input is a raw email, the headers are read too: SPF, DKIM and DMARC verdicts, a Reply-To pointing somewhere else, a display name claiming a bank over a free mailbox. The body is written to persuade you; the headers are machine-checkable facts the sender cannot rewrite.',
  'model.surfaces': 'Where it runs',
  'model.surfaces.body':
    'The detector is a plain TypeScript module with no browser dependency, so the same code runs in this page, in the test suite, and in a terminal (`npm run check -- "message"`, which exits non-zero on a scam and can gate a pipeline). Screenshots are read by a WebAssembly OCR engine served from this origin, so dropping in a picture of a text message still sends nothing anywhere.',
  'model.metrics': 'Measured performance',
  'model.metrics.intro':
    'Three rows, and the gaps between them are the point. The internal split is drawn from the same generator as the training data, so it is close to meaningless. The holdout is {n} messages written by hand, in a different voice, and never used to fit anything — the second row is what the model alone can do with them, and the third is what the four layers do together.',
  'model.metrics.internal': 'Internal split',
  'model.metrics.holdout': 'Holdout — model layer only',
  'model.metrics.pipeline': 'Holdout — all four layers',
  'model.accuracy': 'Accuracy',
  'model.precision': 'Precision',
  'model.recall': 'Recall',
  'model.f1': 'F1',
  'model.auc': 'ROC AUC',
  'model.external': 'Tested against real messages',
  'model.external.intro':
    'Everything above is measured on messages we wrote. That is a real limitation, and stating a limitation is not the same as bounding it — so here it is bounded. {n} SMS messages that actual people actually received, from the SMS Spam Collection (Almeida, Gómez Hidalgo & Yamakami, 2011), scored by the shipped detector with nothing retrained and nothing excluded.',
  'model.external.flagged': 'Flagged (score ≥ 50)',
  'model.external.warned': 'Warned (score ≥ 25)',
  'model.external.falseAlarms': 'False alarms',
  'model.external.caveat':
    'Read the recall figure carefully: “spam” in that corpus means unsolicited *commercial* SMS — ringtone offers, competition entries, premium-rate marketing. Skeptic looks for fraud, so a large share of what it declines to flag is legal advertising it arguably should ignore. The corpus is also from the UK and Singapore around 2011, an era of premium-rate shortcodes rather than lookalike domains, which leaves the link analyser almost nothing to read.',
  'model.external.found': 'What it found',
  'model.external.found.body':
    'The first run was bad in a way that mattered: the tool fired on one legitimate message in three, because it read ordinary terms of affection as romance fraud. “Good night my dear” scored 72 out of 100. The cause was in the training data — the synthetic corpus contained appointments and logistics and not one warm message between people who love each other, so the model had never seen how people actually talk. Adding that register, and taking endearments out of the romance rule, cut the false-alarm rate from 32.8% to 5.5%.',
  'model.external.cost':
    'It cost something. Teaching the model that warmth is ordinary lost about three points of outright recall on our own holdout. That is the right side of the trade for this tool: a missed scam that still reads “Caution” leaves someone warned, while a false alarm teaches them to ignore every warning after it.',
  'model.external.residual':
    'The remaining {rate} is the honest cost of synthetic training data. Those misfires come from the model layer alone, on registers of everyday English the generated corpus does not reach. Chasing them by adding more templates would only mean tuning to this corpus, at which point it stops being an external test.',
  'model.external.examples': 'Legitimate messages it still gets wrong',

  'model.ablation': 'What each layer is worth',
  'model.ablation.intro':
    '"Four detectors are better than one" is a claim, and claims about architecture are the easiest kind to get away with unmeasured. So here is the measurement: every layer alone, then each one added in turn, over the same held-out messages. Note the last row — the header layer removes the final false alarm.',
  'model.ablation.config': 'Layers',
  'model.ablation.note':
    'This is also how the evaluation set got better. The first run reported 0.000 recall for the header layer — not because it was broken, but because the holdout was almost all SMS and gave it nothing to read. Fourteen raw emails were added, and the layer became measurable. A measurement that cannot see a component is a fault in the measurement.',
  'abl.model': 'Model only',
  'abl.rules': 'Rules only',
  'abl.links': 'Links only',
  'abl.headers': 'Headers only',
  'abl.model+rules': 'Model + rules',
  'abl.model+rules+links': 'Model + rules + links',
  'abl.all': 'All four layers',
  'model.interval': 'Ranges are 95% Wilson intervals — with {n} messages, a point estimate on its own would overstate what is known.',

  'model.confusion': 'Confusion matrix',
  'model.confusion.intro': 'Full pipeline, on the {n} held-out messages.',
  'model.predicted': 'Predicted',
  'model.actual': 'Actual',
  'model.legit': 'Legitimate',
  'model.scam': 'Scam',
  'model.calibration': 'Calibration',
  'model.calibration.intro':
    'Points on the diagonal mean the stated probability matches reality. A tool that says “80% sure” should be right 80% of the time. Point size is the number of messages in that bin — the middle bins hold very few, because the holdout separates cleanly.',
  'model.calibration.predicted': 'Predicted probability',
  'model.calibration.observed': 'Observed frequency',
  'model.sweep': 'Precision / recall trade-off',
  'model.sweep.intro':
    'Where the threshold sits decides which mistake you make. For this tool a false alarm is expensive — it teaches people to ignore warnings — so the operating point favours precision.',
  'model.features': 'Strongest learned features',
  'model.features.intro':
    'The tokens with the largest learned weights. “zurlz” means “a link appeared here”; entities are collapsed so the model learns shapes rather than memorising specific domains.',
  'model.features.scam': 'Push toward scam',
  'model.features.legit': 'Push toward legitimate',
  'model.data': 'Training data',
  'model.data.intro':
    'Real scam corpora are full of live victim data and cannot be redistributed, so the training set is generated from message shapes documented in consumer-protection advisories. The negative class is deliberately adversarial: genuine 2FA codes, genuine fraud alerts, genuine delivery exceptions, a genuine boss asking for something urgently. Without those, a classifier just learns “mentions a bank ⇒ scam”.',
  'model.data.messages': 'training messages',
  'model.data.scam': 'scam',
  'model.data.ham': 'legitimate',
  'model.data.vocab': 'features',
  'model.limits': 'Honest limitations',
  'model.limits.body':
    'Training data is synthetic, so absolute numbers are optimistic against a live inbox — the external validation above measures what that costs, and 5.5% false alarms on real messages is still too high for anything unsupervised. The rule lexicon was extended after reviewing holdout errors, which makes the four-layer figure an upper bound — the model-only column is the clean estimate. Coverage is strongest for English and Spanish consumer scams and weakest for targeted, well-written attacks on individuals. Skeptic is a second opinion, not an authority: it will miss things, and a low score is never permission to send money.',

  'learn.heading': 'Scam guide',
  'learn.intro':
    'Every scam family below, what it looks like, and what to do. No account needed, no tracking, works offline.',
  'learn.flags': 'What it looks like',
  'learn.actions': 'What to do',
  'learn.rules.title': 'Three rules that stop almost everything',
  'learn.rules.1':
    'Slow down. Every scam needs you to act before you check. Nothing genuine is destroyed by a ten-minute pause.',
  'learn.rules.2':
    'Hang up and call back on a number you found yourself — on your card, your statement, or the official site. Never the number in the message.',
  'learn.rules.3':
    'Nobody legitimate ever needs your password, your PIN, or a code that was texted to you. Nobody. Ever.',
  'learn.report.title': 'Where to report a scam',
  'learn.report.us': 'United States — FTC: reportfraud.ftc.gov · FBI IC3: ic3.gov · Forward scam texts to 7726 (SPAM)',
  'learn.report.uk': 'United Kingdom — Action Fraud: actionfraud.police.uk · Forward scam texts to 7726',
  'learn.report.eu': 'EU / elsewhere — report to your national consumer protection authority and your bank',
  'learn.report.bank': 'If you have already sent money or shared a code, call your bank immediately. Speed matters more than embarrassment.',

  'common.close': 'Close',
  'common.of': 'of',
  'footer.privacy':
    'No accounts, no tracking, and nothing you paste is ever uploaded. The page only ever requests its own files, and works with the network off.',
  'footer.source': 'Source code',
};

const families: Locale['families'] = {
  phishing: {
    name: 'Phishing',
    summary: 'A message pretending to be a service you use, aiming to capture your login.',
    flags: [
      'An account problem you did not know about, with a deadline',
      'A link whose domain is not quite the real one',
      'Asks you to “verify”, “confirm” or “re-validate” your details',
    ],
  },
  'impersonation-bank': {
    name: 'Bank impersonation',
    summary: 'Someone claiming to be your bank’s fraud team, steering you into moving money.',
    flags: [
      'A transaction you do not recognise, needing an immediate decision',
      'Asks you to move money to a “safe account”',
      'Tells you to stay on the line or not to speak to branch staff',
    ],
  },
  'impersonation-gov': {
    name: 'Government impersonation',
    summary: 'A tax office, benefits agency or police force threatening you over an alleged debt.',
    flags: [
      'Threat of arrest, deportation, or benefits being stopped',
      'Demands payment today, often by card, transfer or gift card',
      'Contacts you first by phone or text rather than by post',
    ],
  },
  delivery: {
    name: 'Delivery / parcel scam',
    summary: 'A fake missed-delivery notice that collects a small fee and your card details.',
    flags: [
      'A parcel you were not expecting is “held”',
      'A small fee — a few pounds or dollars — to release it',
      'A tracking link on a domain that is not the courier’s',
    ],
  },
  'tech-support': {
    name: 'Tech support scam',
    summary: 'A fake virus warning that ends with a stranger controlling your computer.',
    flags: [
      'A pop-up or message claiming your device is infected',
      'A phone number to call “immediately”',
      'Asks you to install remote-access software',
    ],
  },
  romance: {
    name: 'Romance / long con',
    summary: 'Weeks of affection, then a crisis or an investment opportunity.',
    flags: [
      'Moves fast emotionally and always has a reason not to meet',
      'Eventually mentions trading, crypto, or a sudden emergency',
      'Wants to move the conversation to WhatsApp or Telegram',
    ],
  },
  investment: {
    name: 'Investment / crypto fraud',
    summary: 'Guaranteed returns, a platform that shows profits, and withdrawals that never arrive.',
    flags: [
      'Guaranteed or fixed returns, “risk-free”',
      'A fee or tax demanded before you can withdraw',
      'Asks for your wallet recovery phrase to “validate” it',
    ],
  },
  'job-task': {
    name: 'Job / task scam',
    summary: 'Easy money for simple tasks that turns into money laundering or an upfront payment.',
    flags: [
      'High daily pay for unskilled remote work, no interview',
      'Recruitment happens on Telegram or WhatsApp',
      'You must buy equipment, deposit a cheque, or reship packages',
    ],
  },
  prize: {
    name: 'Prize, lottery and inheritance',
    summary: 'You have won or inherited something, and just need to pay a fee to release it.',
    flags: [
      'You never entered the competition',
      'A processing, clearance or shipping fee comes first',
      'You are asked to keep it confidential',
    ],
  },
  'family-emergency': {
    name: 'Family emergency',
    summary: 'A relative in sudden trouble, texting from a new number, needing money now.',
    flags: [
      '“This is my new number” or “I lost my phone”',
      'An accident, arrest or hospital, needing money immediately',
      'Asks you not to tell the rest of the family',
    ],
  },
  'invoice-bec': {
    name: 'Invoice and business email fraud',
    summary: 'A supplier or boss whose bank details have suddenly changed.',
    flags: [
      'Changed payment details on an otherwise normal invoice',
      'A senior colleague who can only communicate by text',
      'Urgency plus a request to keep it between you',
    ],
  },
  refund: {
    name: 'Fake charge or refund',
    summary: 'A subscription you never bought, and a number to call to cancel it.',
    flags: [
      'A charge you do not recognise for a service you do not use',
      'A phone number rather than an account page',
      'The “refund” requires bank details or remote access',
    ],
  },
  extortion: {
    name: 'Blackmail and sextortion',
    summary: 'A claim to have compromising footage, sent in bulk to millions of addresses.',
    flags: [
      'Claims to have hacked your webcam or device',
      'Quotes an old password from a public data breach',
      'Demands payment in cryptocurrency within a deadline',
    ],
  },
  charity: {
    name: 'Charity fraud',
    summary: 'An urgent appeal after a disaster, taking payment in ways charities do not use.',
    flags: [
      'Appears immediately after a disaster in the news',
      'Accepts only gift cards, crypto or transfers',
      'Pressure to give right now, no verifiable charity number',
    ],
  },
  unknown: {
    name: 'Unclear',
    summary: 'The signals here do not match one particular scam family.',
    flags: [
      'Treat any unexpected request for money or details with suspicion',
      'Verify through a channel you chose yourself',
      'Ask someone you trust before acting',
    ],
  },
};

const advice: Locale['advice'] = {
  phishing: [
    'Do not click the link. Open the app or type the address yourself.',
    'If you already entered your password, change it now, and change it anywhere else you reused it.',
    'Turn on two-factor authentication on that account.',
    'Report the message, then delete it.',
  ],
  'impersonation-bank': [
    'Hang up or stop replying. Do not use any number or link in the message.',
    'Call your bank on the number printed on your card or statement.',
    'No genuine bank will ever ask you to move money to another account.',
    'If you have already moved money, call your bank immediately — same day matters.',
  ],
  'impersonation-gov': [
    'Do not pay and do not call the number in the message.',
    'Agencies write to you first. Look up the official number yourself and ask.',
    'No agency takes payment in gift cards, crypto or wire transfers.',
    'Report it to your national fraud reporting service.',
  ],
  delivery: [
    'Do not pay the fee. Couriers collect duties through their own app or a card left at your door.',
    'Check the tracking number on the courier’s real website, typed in yourself.',
    'If you entered card details, call your bank and cancel the card.',
  ],
  'tech-support': [
    'Do not call the number. Close the page or restart the device.',
    'Never install remote-access software for someone who contacted you.',
    'If you gave someone access, disconnect from the internet and have the device checked.',
    'If you paid, contact your bank about a chargeback.',
  ],
  romance: [
    'Do not send money, and do not receive or forward money for them.',
    'Reverse-image search their photos.',
    'Tell one person you trust — isolation is how this scam works.',
    'Never invest through a platform someone you met online recommends.',
  ],
  investment: [
    'Stop depositing. A platform showing profits proves nothing.',
    'Never share a wallet recovery phrase. Anyone asking is stealing from you.',
    'A withdrawal that requires a payment first is not a withdrawal.',
    'Report it — recovery services that contact you afterwards are the same criminals.',
  ],
  'job-task': [
    'Never pay to start a job, and never buy equipment upfront.',
    'Do not deposit cheques and forward money — that is money laundering, and you are liable.',
    'Do not receive and reship packages for an employer.',
    'Verify the company through its official site, not a link you were sent.',
  ],
  prize: [
    'You cannot win a competition you did not enter.',
    'No legitimate prize requires a payment to release it.',
    'Do not send documents or ID.',
  ],
  'family-emergency': [
    'Stop. Call your relative on the number you already have for them.',
    'Ask something only they would know.',
    'Tell another family member before you send anything — the secrecy request is the tell.',
  ],
  'invoice-bec': [
    'Do not pay. Verify the change by phoning a number you already had.',
    'Confirm face to face or by voice — never by replying to the message.',
    'Alert your finance team; this is usually part of a wider attempt.',
  ],
  refund: [
    'Do not call the number. Check your real bank or card statement for the charge.',
    'A genuine refund never needs remote access to your computer.',
    'If nothing was actually charged, there is nothing to cancel.',
  ],
  extortion: [
    'Do not pay. These are sent in bulk; there is almost never any footage.',
    'If a real password of yours is quoted, change it everywhere.',
    'Keep the message as evidence and report it.',
  ],
  charity: [
    'Give directly through the charity’s own website, typed in yourself.',
    'Check the charity register for your country.',
    'No real charity requires payment in gift cards or crypto.',
  ],
  unknown: [
    'Do not click, reply or pay yet.',
    'Verify through a channel you chose — an official app, or a number you looked up.',
    'Ask someone you trust to look at it with you.',
  ],
};

export const en: Locale = { code: 'en', name: 'English', strings, families, advice };
