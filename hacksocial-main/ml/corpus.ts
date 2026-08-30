export interface Sample {
  text: string;
  label: 0 | 1;
  category: string;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const P: Record<string, string[]> = {
  first: 'James Maria Robert Linda Michael Patricia David Barbara John Susan Carlos Ana Wei Priya Ahmed Fatima Emily Daniel Grace Tom Rosa Miguel Hannah Noah Olivia Ethan Sofia Liam Chloe Ruth Walter Doris Frank Helen'.split(' '),
  last: 'Smith Johnson Williams Brown Jones Garcia Miller Davis Rodriguez Martinez Chen Patel Okafor Nguyen Kim Silva Novak Haddad Rossi Andersen'.split(' '),
  bank: ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One', 'U.S. Bank', 'American Express', 'PNC Bank', 'TD Bank'],
  bankDomain: ['chase.com', 'bankofamerica.com', 'wellsfargo.com', 'citi.com', 'capitalone.com', 'usbank.com', 'americanexpress.com'],
  ship: ['USPS', 'UPS', 'FedEx', 'DHL', 'Royal Mail', 'Amazon Logistics'],
  shipDomain: ['usps.com', 'ups.com', 'fedex.com', 'dhl.com', 'royalmail.com'],
  tech: ['Apple', 'Microsoft', 'Google', 'Netflix', 'PayPal', 'Amazon', 'Adobe', 'Dropbox', 'Instagram', 'Coinbase'],
  techDomain: ['apple.com', 'microsoft.com', 'google.com', 'netflix.com', 'paypal.com', 'amazon.com', 'adobe.com', 'dropbox.com', 'instagram.com', 'coinbase.com'],
  gov: ['the IRS', 'the Social Security Administration', 'Medicare', 'the DMV', 'the State Toll Authority'],
  retailDomain: ['walmart.com', 'target.com', 'costco.com', 'bestbuy.com', 'ebay.com', 'homedepot.com'],
  retail: ['Walmart', 'Target', 'Costco', 'Best Buy', 'eBay', 'Home Depot'],
  amount: ['$49.99', '$99.00', '$149.99', '$249.00', '$389.42', '$512.00', '$1,240.00', '$2,750.00', '$4,999.00', '$18.75', '$3.95', '$1.99'],
  bigAmount: ['$8,500', '$12,000', '$45,000', '$250,000', '$1.2 million', '$3.5 million', '$750,000'],
  day: ['today', 'tomorrow', 'within 24 hours', 'within 48 hours', 'by 5pm today', 'by the end of the day', 'this evening'],
  date: ['March 3', 'June 14', 'October 2', 'January 29', 'August 8', 'December 11', 'May 22'],
  time: ['9:15 AM', '2:40 PM', '6:05 PM', '11:22 AM', '8:47 PM'],
  order: ['#114-3392847', '#702-9938471', '#AMZ-88213', '#TG-772391', '#SO-40182', '#INV-2291'],
  track: ['1Z9X8V7L0394827361', 'US9514901185421', '9400111899223197428490', '7749 2831 0044'],
  code: ['482913', '905174', '337209', '661048', '218837', '740592'],
  city: ['Denver', 'Lagos', 'Kuala Lumpur', 'Toronto', 'Manila', 'Bucharest', 'Phoenix', 'Leeds', 'Bogotá'],
  company: ['Northwind Logistics', 'Cedar & Vale', 'Brightline Health', 'Orion Partners', 'Maple Grove Dental', 'Kestrel Media'],
  product: ['a 65" TV', 'an iPhone 15', 'a Dyson vacuum', 'AirPods Pro', 'a Nintendo Switch', 'a KitchenAid mixer'],
  jobTitle: ['Data Entry Assistant', 'Remote Product Reviewer', 'Package Reshipping Agent', 'Social Media Evaluator', 'Personal Assistant'],
  phone: ['(888) 402-7719', '(866) 331-0284', '1-800-555-0142', '(877) 214-9930', '+1 (415) 555-0199'],
  crypto: ['Bitcoin', 'USDT', 'Ethereum'],
  giftcard: ['Apple gift cards', 'Google Play cards', 'Steam gift cards', 'Target gift cards', 'Amazon gift cards'],
  rand: 'a7f2 k93x zq81 m40p x7r2 b19v n55t j62d w03h q84c'.split(' '),
  abuseTld: ['tk', 'xyz', 'top', 'icu', 'cfd', 'sbs', 'click', 'live', 'shop', 'buzz'],
  shortener: ['bit.ly', 'tinyurl.com', 'cutt.ly', 'rb.gy', 'is.gd'],
};

export function render(tpl: string, rnd: () => number): string {
  let s = tpl;
  for (let guard = 0; guard < 12; guard++) {
    const before = s;
    s = s.replace(/\{([^{}<>]*)\}/g, (_, body: string) => {
      const opts = body.split('|');
      return opts[Math.floor(rnd() * opts.length)] ?? '';
    });
    s = s.replace(/<([a-zA-Z]+)>/g, (m, name: string) => {
      const pool = P[name];
      if (!pool) return m;
      return pool[Math.floor(rnd() * pool.length)] ?? '';
    });
    if (s === before) break;
  }
  return s.replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n').trim();
}

function badUrl(brandDomain: string, rnd: () => number): string {
  const sld = brandDomain.split('.')[0]!;
  const r = () => P.rand![Math.floor(rnd() * P.rand!.length)]!;
  const tld = () => P.abuseTld![Math.floor(rnd() * P.abuseTld!.length)]!;
  const short = () => P.shortener![Math.floor(rnd() * P.shortener!.length)]!;
  const shapes = [
    () => `http://${sld}-secure-${r()}.${tld()}/verify`,
    () => `https://${sld}.com.account-${r()}.${tld()}/login`,
    () => `https://secure-${sld}-support.${tld()}/update`,
    () => `https://${short()}/${r()}${r()}`,
    () => `http://${sld.replace(/l/g, '1').replace(/o/g, '0')}.com/signin`,
    () => `https://${sld}${r().slice(0, 2)}.${tld()}/confirm-identity`,
    () => `http://192.168.${Math.floor(rnd() * 250)}.${Math.floor(rnd() * 250)}/${sld}/auth`,
    () => `https://account-verification-${sld}.${tld()}/session/${r()}${r()}`,
  ];
  return shapes[Math.floor(rnd() * shapes.length)]!();
}

function goodUrl(brandDomain: string, path: string): string {
  return `https://www.${brandDomain}/${path}`;
}

interface Template {
  category: string;
  label: 0 | 1;
  body: string;
  domainSlot?: string;
}

const SCAM: Template[] = [
  { category: 'delivery', label: 1, domainSlot: 'shipDomain', body:
    `<ship>: Your package <track> is on hold at our facility because the {shipping|delivery} address is incomplete. Please update your details {today|within 24 hours} or the parcel will be returned to sender. <badurl>` },
  { category: 'delivery', label: 1, domainSlot: 'shipDomain', body:
    `{Dear customer|Dear client}, your parcel could not be delivered on <date>. A redelivery fee of <amount> is required to release the shipment. Pay here: <badurl>` },
  { category: 'delivery', label: 1, domainSlot: 'shipDomain', body:
    `<ship> ALERT: unpaid customs fee of <amount> on order <order>. Your item will be destroyed if the charge is not settled {within 48 hours|by <day>}. <badurl>` },
  { category: 'delivery', label: 1, domainSlot: 'shipDomain', body:
    `Your <ship> delivery is suspended. Confirm your address and pay the <amount> handling fee to reschedule: <badurl> Reply YES to confirm.` },

  { category: 'impersonation-bank', label: 1, domainSlot: 'bankDomain', body:
    `<bank> Alert: A payment of <amount> to an unrecognised recipient was authorised on your account. If you did not approve this, verify your identity immediately or your account will be suspended. <badurl>` },
  { category: 'impersonation-bank', label: 1, domainSlot: 'bankDomain', body:
    `<bank> Security: we have temporarily locked your debit card ending <code>. To restore access please confirm your card number, PIN and the security code on the back at <badurl>` },
  { category: 'impersonation-bank', label: 1, domainSlot: 'bankDomain', body:
    `This is <bank> fraud department. We are calling about suspicious activity. Do not hang up and do not tell anyone about this call. To secure your funds you must move them to the safe account we provide. Call <phone> now.` },
  { category: 'impersonation-bank', label: 1, domainSlot: 'bankDomain', body:
    `Dear valued customer, your <bank> online banking will be deactivated <day> due to a failed security review. Reactivate now: <badurl>` },

  { category: 'phishing', label: 1, domainSlot: 'techDomain', body:
    `<tech> ID: Your account was signed in from a new device in <city>. If this wasn't you, verify your password now or your account will be permanently deleted. <badurl>` },
  { category: 'phishing', label: 1, domainSlot: 'techDomain', body:
    `Your <tech> subscription payment of <amount> failed. Update your billing details within 24 hours to avoid service disruption: <badurl>` },
  { category: 'phishing', label: 1, domainSlot: 'techDomain', body:
    `Action required: your <tech> storage is full and your files will be deleted <day>. Sign in to confirm your account: <badurl>` },
  { category: 'phishing', label: 1, domainSlot: 'techDomain', body:
    `Someone requested a password reset for your <tech> account. To cancel the request, confirm your current password and one-time code here: <badurl>` },
  { category: 'phishing', label: 1, domainSlot: 'techDomain', body:
    `<tech> Security Team: unusual login attempt detected. Your account has been limited. Restore access: <badurl> Failure to act will result in permanent closure.` },

  { category: 'impersonation-gov', label: 1, body:
    `FINAL NOTICE from <gov>: you owe <amount> in unpaid taxes. An arrest warrant will be issued if payment is not received <day>. Call <phone> immediately. Do not discuss this with anyone.` },
  { category: 'impersonation-gov', label: 1, body:
    `Your Social Security number has been suspended due to suspicious activity linked to a case in <city>. Press 1 or call <phone> to speak with a federal agent and avoid legal action.` },
  { category: 'impersonation-gov', label: 1, body:
    `<gov> notice: you have an unpaid toll of <amount>. Settle now to avoid a late fee and traffic violation notice: <badurl>`, domainSlot: 'techDomain' },
  { category: 'impersonation-gov', label: 1, body:
    `Medicare: your benefits will be stopped unless you confirm your Social Security number and date of birth with our representative. Call <phone> today.` },

  { category: 'tech-support', label: 1, body:
    `WARNING! Your computer is infected with a virus. Do not restart your computer. Call Microsoft certified support at <phone> immediately. Your personal files and banking details are at risk.` },
  { category: 'tech-support', label: 1, body:
    `Security alert from Microsoft: malware detected on your device. Our technician needs remote access to remove it. Install AnyDesk and call <phone>.` },
  { category: 'tech-support', label: 1, body:
    `<tech> Support: 3 threats found. Your license expired on <date>. Renew for <amount> or your device will be locked. Call <phone> and have your card ready.` },

  { category: 'refund', label: 1, body:
    `Thank you. Your <tech> antivirus renewal of <amount> has been charged to your account. If you did not authorise this, call our refund department at <phone> within 24 hours to cancel.` },
  { category: 'refund', label: 1, body:
    `We overcharged you <amount> for order <order>. To receive your refund we need your bank account and routing number. Reply with the details or call <phone>.` },
  { category: 'refund', label: 1, body:
    `Invoice attached: <bigAmount> for services rendered. Auto-renewal is active. To cancel this order call <phone> before <day>.` },

  { category: 'prize', label: 1, body:
    `CONGRATULATIONS! You have won <bigAmount> in the international lottery. To claim your prize send a processing fee of <amount> by <giftcard>. Keep this confidential until funds are released.` },
  { category: 'prize', label: 1, body:
    `You are eligible for a free gift! You have been selected to receive <product>. Just cover the <amount> shipping fee here: <badurl>`, domainSlot: 'retailDomain' },
  { category: 'prize', label: 1, body:
    `<retail> Rewards: you won a loyalty prize! Claim your reward <day> before it expires: <badurl>`, domainSlot: 'techDomain' },

  { category: 'prize', label: 1, body:
    `Dear beneficiary, I am a barrister in <city> handling the estate of a late client who shares your surname. Unclaimed funds of <bigAmount> can be transferred to you. A small fee covers the legal paperwork. Please keep this strictly confidential.` },

  { category: 'romance', label: 1, body:
    `My dear, I feel a connection with you that I cannot explain. I want to meet you but I am stuck in another country and my card is blocked. Could you send <amount> by wire transfer? I will pay you back, I promise.` },
  { category: 'romance', label: 1, body:
    `My love, my uncle taught me how to trade and I have made <bigAmount> this month. I can teach you. Just start with a minimum deposit and I will guide you. Trust me, it is risk-free.` },
  { category: 'romance', label: 1, body:
    `Hello dear, I saw your profile and felt we should talk. Please add me on WhatsApp so we can chat privately, I do not use this app often.` },

  { category: 'investment', label: 1, body:
    `VIP signal group: guaranteed returns of 30% weekly. Exclusive presale opportunity closing <day>. Minimum deposit <amount> in <crypto>. Withdraw your profits after 7 days. <badurl>`, domainSlot: 'techDomain' },
  { category: 'investment', label: 1, body:
    `Your wallet is eligible for an airdrop claim of <bigAmount>. Connect your wallet to claim before <day>: <badurl>`, domainSlot: 'techDomain' },
  { category: 'investment', label: 1, body:
    `Coinbase Security: your wallet will be frozen. Validate your seed phrase to keep access: <badurl>`, domainSlot: 'techDomain' },

  { category: 'job-task', label: 1, body:
    `We found your resume. Hiring now: <jobTitle>, work from home, no experience needed. Earn $350 a day completing simple tasks. Add me on Telegram for details.` },
  { category: 'job-task', label: 1, body:
    `Part-time online job: like videos and get paid <amount> per task. Daily salary paid same day. Contact me on WhatsApp for details.` },
  { category: 'job-task', label: 1, body:
    `Congratulations, you are hired as a <jobTitle> at <company>. We will send a check to cover your home office equipment. Deposit it and wire the remainder to our vendor.` },

  { category: 'family-emergency', label: 1, body:
    `Hi mom, this is my new number, I lost my phone. I am in trouble and need <amount> urgently. Please do not tell dad. Can you send it right away?` },
  { category: 'family-emergency', label: 1, body:
    `Grandma it's me, I had an accident and I'm in jail in <city>. I need bail money <day>. My lawyer will call you. Please don't tell anyone, I'm so embarrassed.` },

  { category: 'invoice-bec', label: 1, body:
    `Hi <first>, I am in a meeting and cannot talk. I need you to do something for me. Please purchase <giftcard> worth <amount> for the team and send me the codes. I will reimburse you <day>.` },
  { category: 'invoice-bec', label: 1, body:
    `Please note our updated banking details for invoice <order>. Wire the funds to the new account below before <day>. This is an urgent payment request from the director.` },

  { category: 'extortion', label: 1, body:
    `I have been watching you. I installed a trojan and I recorded you through your webcam. I also have your contacts. Pay <bigAmount> in <crypto> within 48 hours or I will send the video to everyone you know.` },

  { category: 'charity', label: 1, body:
    `Urgent appeal for the disaster in <city>. Donations by <giftcard> or <crypto> only, as our bank account is being processed. Every hour counts, please act now. <badurl>`, domainSlot: 'techDomain' },

  { category: 'phishing', label: 1, body:
    `Is this <first>? Sorry, who is this? I got your number from a friend. I am a financial analyst in <city>, maybe we can talk about opportunities.` },
  { category: 'phishing', label: 1, body:
    `<bank>: Did you attempt a transfer of <amount>? Reply Y or N. If N, we will call you from <phone> to verify your login credentials.` },
];

const HAM: Template[] = [
  { category: 'legit-2fa', label: 0, body:
    `<code> is your <tech> verification code. Do not share this code with anyone. We will never ask you for this code.` },
  { category: 'legit-2fa', label: 0, body:
    `Your <bank> one-time passcode is <code>. It expires in 10 minutes. <bank> will never ask for your password or this code.` },
  { category: 'legit-security', label: 0, domainSlot: 'techDomain', body:
    `New sign-in to your <tech> account on a Windows device at <time>. If this was you, no action is needed. If not, review your recent activity at <goodurl>` },
  { category: 'legit-security', label: 0, domainSlot: 'techDomain', body:
    `Your password for <tech> was changed on <date>. If you made this change you can ignore this email. Otherwise, reset it from the app or at <goodurl>` },
  { category: 'legit-security', label: 0, domainSlot: 'bankDomain', body:
    `<bank> fraud alert: we declined a <amount> charge at a merchant in <city> on your card ending <code>. Reply YES if this was you or NO if it was not. We will never ask you to move money to another account.` },
  { category: 'legit-security', label: 0, domainSlot: 'bankDomain', body:
    `Your <bank> account balance is below <amount>. To avoid an overdraft fee, transfer funds using the app. Log in only through the official app or <goodurl>` },

  { category: 'legit-delivery', label: 0, domainSlot: 'shipDomain', body:
    `<ship>: Your package <track> is out for delivery and should arrive by <time>. Track it at <goodurl>` },
  { category: 'legit-delivery', label: 0, domainSlot: 'shipDomain', body:
    `Delivery exception: we attempted delivery of <track> on <date> but no one was available. We will try again <day>. No payment is required. <goodurl>` },
  { category: 'legit-delivery', label: 0, domainSlot: 'techDomain', body:
    `Your order <order> has shipped. Estimated arrival <date>. View details in the app or at <goodurl>` },

  { category: 'legit-commerce', label: 0, domainSlot: 'techDomain', body:
    `Thanks for your order. We charged <amount> to the card ending <code> for order <order>. Your receipt is available at <goodurl>` },
  { category: 'legit-commerce', label: 0, domainSlot: 'techDomain', body:
    `Your <tech> subscription renews on <date> for <amount>. To change your plan or cancel, open Settings in the app. Reply STOP to unsubscribe from these alerts.` },
  { category: 'legit-commerce', label: 0, domainSlot: 'retailDomain', body:
    `Your <retail> pickup order <order> is ready. Bring a photo ID to the customer service desk. The store closes at <time>.` },
  { category: 'legit-commerce', label: 0, body:
    `Your return for order <order> was received. A refund of <amount> will appear on your original payment method in 3-5 business days. No action is needed.` },

  { category: 'legit-appointment', label: 0, body:
    `Reminder: you have an appointment at <company> on <date> at <time>. Reply C to confirm or call <phone> to reschedule.` },
  { category: 'legit-appointment', label: 0, body:
    `Your prescription is ready for pickup at the pharmacy on <date>. Please bring your insurance card. Questions? Call <phone>.` },
  { category: 'legit-appointment', label: 0, body:
    `<company>: your service visit is scheduled for <date> between <time> and <time>. The technician will call before arriving.` },

  { category: 'legit-work', label: 0, body:
    `Hi <first>, can you send me the updated deck before the <time> call? I want to review it beforehand. Thanks, <first>` },
  { category: 'legit-work', label: 0, body:
    `Reminder: timesheets are due <day>. Please submit through the HR portal. Let me know if you have trouble logging in.` },
  { category: 'legit-work', label: 0, body:
    `<company> IT: we are rolling out laptop updates on <date>. Save your work before you leave <day>. No credentials are needed and we will never ask for your password.` },
  { category: 'legit-work', label: 0, body:
    `Following up on invoice <order> for <amount>, due <date>. Our bank details are unchanged from last quarter. Let me know if you need a copy.` },
  { category: 'legit-work', label: 0, body:
    `Hi <first>, the client moved the meeting to <time> on <date>. Urgent, but nothing is on fire — just wanted you to see it before the standup.` },

  { category: 'legit-personal', label: 0, body:
    `Hey, are we still on for dinner <day>? I can pick you up around <time> if that helps.` },
  { category: 'legit-personal', label: 0, body:
    `Mom, I'm going to be late tonight, the bus is delayed. Don't wait up. Love you.` },
  { category: 'legit-personal', label: 0, body:
    `Happy birthday <first>! Hope you have a great day. Call me when you get a chance.` },
  { category: 'legit-personal', label: 0, body:
    `I sent you <amount> for the concert tickets. Let me know if it came through.` },
  { category: 'legit-personal', label: 0, body:
    `Just landed in <city>. Long flight but everything is fine. I'll message you tomorrow.` },
  { category: 'legit-personal', label: 0, body:
    `Can you grab milk and eggs on the way home? Also we're out of coffee.` },

  { category: 'legit-civic', label: 0, body:
    `Your ballot for the <date> election has been received and counted. No further action is required. Check your status at vote.gov` },
  { category: 'legit-civic', label: 0, body:
    `IRS reminder: the filing deadline is <date>. The IRS does not initiate contact by text or email asking for payment. Visit irs.gov for official forms.` },
  { category: 'legit-civic', label: 0, body:
    `Your library book is due <day>. Renew online or call <phone>. Late fees are 10 cents per day.` },
  { category: 'legit-civic', label: 0, body:
    `<company> utility notice: scheduled maintenance in your area on <date> from <time>. Power may be interrupted for up to two hours.` },

  { category: 'legit-marketing', label: 0, domainSlot: 'retailDomain', body:
    `<retail> weekly deals: save on <product> through <date>. Shop in store or online. Reply STOP to unsubscribe.` },
  { category: 'legit-marketing', label: 0, body:
    `Your monthly statement is ready. Log in to the app to view it. Manage your notification preferences in Settings.` },
  { category: 'legit-marketing', label: 0, domainSlot: 'techDomain', body:
    `New this week on <tech>: three shows we think you'll like. Browse the catalogue at <goodurl>. Unsubscribe from these emails at any time.` },

  { category: 'legit-work', label: 0, body:
    `Payroll note: direct deposit lands a day early this month because of the holiday. No action needed.` },
  { category: 'legit-work', label: 0, body:
    `Open enrolment closes <day>. The benefits portal link is on the intranet homepage.` },
  { category: 'legit-work', label: 0, body:
    `<first>, the client moved things up. Can you approve the PO before end of day? Finance closes the books <day> and it is urgent.` },
  { category: 'legit-work', label: 0, body:
    `Need this <day> if possible, the client is asking. Sorry for the short notice, I know it is tight.` },
  { category: 'legit-work', label: 0, body:
    `Standup moved to <time>. Same link. No agenda changes.` },
  { category: 'legit-work', label: 0, body:
    `Welcome to <company>! Your laptop ships <day>. HR will email your onboarding checklist from their official address.` },
  { category: 'legit-work', label: 0, body:
    `Offsite is confirmed for <date>. Book your travel through the usual portal and keep receipts.` },
  { category: 'legit-work', label: 0, body:
    `Heads up, the deploy is frozen until <date>. Anything urgent goes through <first>.` },
  { category: 'legit-civic', label: 0, body:
    `School is closed <day> due to weather. Buses are not running and after-school activities are cancelled.` },
  { category: 'legit-civic', label: 0, body:
    `Jury duty: you are excused for this term. Do not report.` },
  { category: 'legit-civic', label: 0, body:
    `Street sweeping <day> on your block. Move vehicles by <time> to avoid a ticket.` },
  { category: 'legit-civic', label: 0, body:
    `Recycling collection moves to <day> this week because of the holiday.` },
  { category: 'legit-civic', label: 0, body:
    `Boil water advisory lifted for your area as of <time>. Tap water is safe to drink.` },
  { category: 'legit-civic', label: 0, body:
    `<company>: your water meter reading is due. A technician will visit on <date>; no one needs to be home.` },
  { category: 'legit-personal', label: 0, body:
    `Hey it's <first> from the gym, this is my number. Nice meeting you today.` },
  { category: 'legit-personal', label: 0, body:
    `Do you still have the drill? I need it <day> if so.` },
  { category: 'legit-personal', label: 0, body:
    `Practice is cancelled <day>, field is flooded. Next session <date>.` },
  { category: 'legit-personal', label: 0, body:
    `I'm at the store, do we need anything else? They have the good bread.` },
  { category: 'legit-personal', label: 0, body:
    `Grandma's surgery went fine, she's resting. I'll call you <day>.` },
  { category: 'legit-personal', label: 0, body:
    `Book club moved to <date> at <time>. <first> is hosting this time.` },
  { category: 'legit-personal', label: 0, body:
    `Thanks again for <day>! Let me know what I owe you for the tickets.` },
  { category: 'legit-personal', label: 0, body:
    `Wrong number, sorry!` },
  { category: 'legit-personal', label: 0, body:
    `Running late, traffic on the bridge. Start without me.` },
  { category: 'legit-commerce', label: 0, body:
    `Your flight is delayed 40 minutes. New departure <time>, gate unchanged.` },
  { category: 'legit-commerce', label: 0, body:
    `Your hotel booking for <date> is confirmed. Check-in from <time>. Free cancellation until the day before.` },
  { category: 'legit-commerce', label: 0, body:
    `Your ride is arriving now. Silver sedan, plate 7KJ 221.` },
  { category: 'legit-commerce', label: 0, body:
    `Table for four confirmed at <time>. Reply CANCEL if your plans change.` },
  { category: 'legit-commerce', label: 0, body:
    `Your tickets for <date> are in the app. Doors open an hour before the show.` },
  { category: 'legit-security', label: 0, domainSlot: 'bankDomain', body:
    `You added a new payee to your account. If this wasn't you, call the number on the back of your card.` },
  { category: 'legit-security', label: 0, body:
    `Your account was locked after too many failed sign-in attempts. It unlocks automatically in 15 minutes.` },
  { category: 'legit-security', label: 0, body:
    `Someone requested a password reset. If it wasn't you, ignore this — no changes have been made and the link expires in 30 minutes.` },
  { category: 'legit-delivery', label: 0, body:
    `Your package was delivered and left in the mailroom. Photo attached.` },
  { category: 'legit-delivery', label: 0, domainSlot: 'shipDomain', body:
    `Delivery exception: the address needs a unit number. Update it in the app or reply with the unit. There is no charge.` },
  { category: 'legit-appointment', label: 0, body:
    `Lab results are available in your patient portal. Your doctor will call if anything needs follow-up.` },
  { category: 'legit-appointment', label: 0, body:
    `<company>: your pet's vaccination is due. Call <phone> to book, or reply and we'll ring you back.` },
  { category: 'legit-appointment', label: 0, body:
    `Your car is ready for pickup. Total came to <amount>, less than the estimate.` },

  { category: 'legit-personal', label: 0, body:
    `Good night my dear, sleep well and take care.` },
  { category: 'legit-personal', label: 0, body:
    `Good morning my love. Hope today is kinder than yesterday.` },
  { category: 'legit-personal', label: 0, body:
    `Happy new year my dear brother! I really do miss you. Give my love to everyone.` },
  { category: 'legit-personal', label: 0, body:
    `Happy birthday darling! Have a wonderful day, see you <day>.` },
  { category: 'legit-personal', label: 0, body:
    `God bless. Get some good sleep, I will be praying for you.` },
  { category: 'legit-personal', label: 0, body:
    `Have a blessed day dear. Thinking of you always.` },
  { category: 'legit-personal', label: 0, body:
    `Miss you loads. Call me when you land, doesn't matter how late.` },
  { category: 'legit-personal', label: 0, body:
    `Love you too. Don't work too hard <first>.` },
  { category: 'legit-personal', label: 0, body:
    `Take care of yourself sweetheart. Text me when you get home safe.` },
  { category: 'legit-personal', label: 0, body:
    `Thinking of you today. I know it's hard. I'm here whenever you want to talk.` },
  { category: 'legit-personal', label: 0, body:
    `So proud of you my dear. Well done, truly.` },
  { category: 'legit-personal', label: 0, body:
    `Sorry babe, phone died. Just got home. Talk tomorrow? x` },
  { category: 'legit-personal', label: 0, body:
    `Wishing you and the family a lovely <day>. Hope to see you all soon.` },
  { category: 'legit-personal', label: 0, body:
    `Get well soon dear, rest as much as you can. Don't rush back.` },
  { category: 'legit-personal', label: 0, body:
    `Congratulations! So happy for you both. Can't wait to celebrate.` },
  { category: 'legit-personal', label: 0, body:
    `u free 2nite? thinking of getting food` },
  { category: 'legit-personal', label: 0, body:
    `k lor, see u there. wat time u reaching?` },
  { category: 'legit-personal', label: 0, body:
    `haha ok ok. i'll ask her and let u know` },
  { category: 'legit-personal', label: 0, body:
    `im on the bus already. shd be there in 20 mins` },
  { category: 'legit-personal', label: 0, body:
    `oh no, sorry to hear that. u ok?` },
  { category: 'legit-personal', label: 0, body:
    `no worries at all, take ur time` },
  { category: 'legit-personal', label: 0, body:
    `Sorry, wrong number! I was trying to reach my sister.` },
  { category: 'legit-personal', label: 0, body:
    `Wrong number I think, sorry to bother you.` },
  { category: 'legit-work', label: 0, body:
    `Are you at your desk? I'll bring the printouts over in a minute.` },
  { category: 'legit-work', label: 0, body:
    `I'm in a meeting until <time>, can we talk after? Call me then if easier.` },
  { category: 'legit-work', label: 0, body:
    `Are you free at the moment? Happy to jump on a call if it's quicker.` },
];

const GOOD_PATHS = ['account', 'orders', 'track', 'help', 'security', 'settings', 'receipts'];

function fill(t: Template, rnd: () => number): string {
  let text = render(t.body, rnd);
  const domainPool = t.domainSlot ? P[t.domainSlot] : undefined;
  const domain =
    domainPool?.[Math.floor(rnd() * domainPool.length)] ??
    P.techDomain![Math.floor(rnd() * P.techDomain!.length)]!;
  text = text.replace(/<badurl>/g, () => badUrl(domain, rnd));
  text = text.replace(
    /<goodurl>/g,
    () => goodUrl(domain, GOOD_PATHS[Math.floor(rnd() * GOOD_PATHS.length)]!),
  );
  return text;
}

function jitter(text: string, rnd: () => number): string {
  let s = text;
  if (rnd() < 0.12) s = s.toUpperCase();
  if (rnd() < 0.1) s = s.replace(/\./g, '!');
  if (rnd() < 0.15) s = s.replace(/,/g, '');
  if (rnd() < 0.08) s = s + ' ' + s.split(' ').slice(0, 4).join(' ');
  return s;
}

export function buildCorpus(seed = 20260825, perTemplate = 34): Sample[] {
  const rnd = mulberry32(seed);
  const out: Sample[] = [];
  const seen = new Set<string>();

  const emit = (list: Template[], copies: number) => {
    for (const t of list) {
      for (let i = 0; i < copies; i++) {
        const text = jitter(fill(t, rnd), rnd);
        const key = text.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ text, label: t.label, category: t.category });
      }
    }
  };

  emit(SCAM, perTemplate);
  emit(HAM, Math.round((perTemplate * SCAM.length) / HAM.length));

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export const TEMPLATE_COUNTS = { scam: SCAM.length, ham: HAM.length };
