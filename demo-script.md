# Skeptic — demo narration
**Target: 2 min 30 s.** Bracketed lines are actions, not spoken.
Speak slightly slower than feels natural. Pause where marked (//).

---

## 0:00 – 0:20 · The problem

> [Screen already on the Analyze tab, empty. Click **Grandparent scam**.]

"Grandma, it's me. I'm in jail in Denver and I need two thousand seven
hundred and fifty dollars for bail this morning. Please don't tell mom and dad."

//

"Somebody's grandmother got that text this week. //
Every spam filter in the world makes a decision about a message like this —
silently, inside a mail server, before anyone sees it. And the person actually
holding the phone gets nothing. No reason. No explanation. Just a message that
either arrived or didn't."

"This is Skeptic. It explains."

---

## 0:20 – 1:10 · The core demo

> [Click **Lookalike domain**. Let the score land on 98.]

"Ninety-eight out of a hundred. Dangerous. //
But the number isn't the point — this is."

> [Scroll slowly down the "Why" panel. Don't rush. Let two or three cards sit
> on screen.]

"Every single point of that score traces back to a named signal.
It found the word 'Chase' in the link — but the actual owner of that address
is `secure-verify-a7f2.icu`. //
It found manufactured urgency. It found a threat. It found a disposable domain."

> [Point at / hover the yellow highlighted text in the message panel on the left.]

"And it marks the exact words inside the message that did it."

"Four separate detectors vote on this. A trained model for how scam language
reads. A rule engine for the tactics — pressure, secrecy, untraceable payment.
A link analyser. And when it's a real email, a header analyser that checks
SPF, DKIM and DMARC. //
On its own the model gets eighty-four percent. All four together: ninety-seven."

---

## 1:10 – 1:40 · The screenshot

> [Drag a phone screenshot of a scam text onto the drop zone. Let the progress
> bar run — don't cut this, the wait is part of the point.]

"Most scams arrive on a phone. So you can just drop the screenshot in."

> [Text appears in the box, score lands.]

"That was read entirely on your device. WebAssembly, in the browser tab. //
The picture never left this machine — which matters, because the alternative
is uploading a photograph of your bank messages to somebody's API."

---

## 1:40 – 2:10 · The honest part

> [Click **How it works**. Scroll to **Tested against real messages**.]

"Here's the part I'd want to know about if I were you."

"Everything I've shown you was measured on messages I wrote myself. So I
pointed it at five and a half thousand real SMS messages that actual people
actually received. //
And it failed."

"It fired on one legitimate message in three. It was scoring 'Good night my
dear' as romance fraud — because my own training data had appointments and
delivery notices in it, and not one warm message between people who love each
other. It had never seen how people actually talk."

> [Point at the before/after numbers.]

"I fixed the cause, not the symptom. False alarms went from thirty-two point
eight percent down to five point five. //
It cost me three points of recall, and that's published right here too — along
with the five percent it still gets wrong."

---

## 2:10 – 2:30 · Close

> [Click **Practise**. Answer one card.]

"And because the tool won't be there next time, it also trains you to spot
them without it. Real messages, adaptive difficulty, an explanation after
every answer."

//

"No account. No server. No network requests. English and Spanish, three text
sizes, high contrast, works offline."

"It's a second opinion — not an authority. It says so itself."

> [Stop recording.]

---

## Numbers, if a judge asks

| | |
|---|---|
| Holdout | 141 hand-written messages, never trained on |
| Result | 97.2% accuracy · 100% precision · **zero** false alarms (71/71 legit cleared) |
| Model layer alone | 84.4% — the gap is the case for four layers |
| Real-world test | 5,572 real SMS · false alarms 32.8% → 5.5% |
| Tests | 72, incl. a regression guard that false alarms stay at zero |

## Three answers worth memorising

**"Why cap the model's negative score?"**
Not sounding like a scam is weak evidence of safety. A calm, well-written
message that asks for your password is still a scam — so a hard tactic signal
limits how far the statistical layer can argue the score back down.

**"Why does a wrong number score low on its own?"**
Because a genuine wrong number is common and harmless. It's the *pair* that
matters — arriving by accident, then immediately asking personal questions.
Each half is priced at almost nothing; the combination carries the weight.

**"Isn't 5.5% false alarms bad?"**
Yes. That's the measured cost of training on synthetic data, and it's why the
app says it's a second opinion. I could have hidden it by tuning against that
corpus — then it would have stopped being an independent test.
