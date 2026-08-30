export interface LabeledMessage {
  text: string;
  label: 0 | 1;
  category: string;
}

const scam: [string, string][] = [
  ['delivery', `usps we couldnt deliver ur package today. confirm address here usps-redelivery.icu/track fee 1.95`],
  ['delivery', `Royal Mail: your item is waiting. A £2.99 shipping charge is outstanding. Settle it before Friday or the parcel goes back. royalmail-parcel.top/pay`],
  ['delivery', `Hi, this is the courier. I'm outside but the address on the label is smudged. Can you send me your full address and card details so I can update the system?`],
  ['impersonation-bank', `Chase: we blocked a $840 charge. Reply 1 to approve, 2 to decline. If you reply 2 an agent will call to move your balance to a protected account.`],
  ['impersonation-bank', `Hello, I'm calling from the fraud team at your bank. Please stay on the line and don't discuss this with the branch staff, they may be involved.`],
  ['impersonation-bank', `WELLS FARGO NOTICE your online access expires today. reactivate wellsfargo.secure-login-portal.sbs`],
  ['impersonation-bank', `Your debit card has been restricted. Confirm your PIN and the 3 digits on the back to lift the restriction.`],
  ['phishing', `Dear User, we detected an irregular activity on your account. Kindly click below to re-validate your informations within 24hrs to avoid permanent closure.`],
  ['phishing', `Netflix: your payment method was declined. Update it now to keep watching netflix-billing-update.click/renew`],
  ['phishing', `Someone tried to log into your Instagram from Russia. Secure it now: instagram.com.login-secure.xyz`],
  ['phishing', `apple id locked. verify at apple-support-id.top or account deleted in 24 hours`],
  ['phishing', `Your mailbox storage is full and outgoing mail is blocked. Re-authenticate with your email password to restore service.`],
  ['phishing', `Hi, IT here. We're migrating accounts tonight. Reply with your username and password so we don't lock you out in the morning.`],
  ['phishing', `You have (3) undelivered messages held in quarantine. Release them by signing in: mail-quarantine-release.cfd`],
  ['impersonation-gov', `This is the final notice before enforcement. The IRS has filed a lien against you. Call 888-402-7719 now. Do not ignore this message.`],
  ['impersonation-gov', `SSA: your social security number was used in a fraud case in Texas. Your benefits are suspended pending verification. Press 1 to speak to an officer.`],
  ['impersonation-gov', `You have an unpaid toll of $6.99. Late fees apply after today. Pay: tollservice-pay.sbs/us`],
  ['impersonation-gov', `Medicare needs to confirm your details before your new card ships. Please read me your social security number and date of birth.`],
  ['tech-support', `!!! CRITICAL ALERT !!! Your PC is infected with 5 viruses. Your banking passwords are exposed. Do NOT shut down. Call support now: 1-866-331-0284`],
  ['tech-support', `Microsoft has detected unusual traffic from this device. A technician will need to connect remotely. Please download AnyDesk and give me the code on your screen.`],
  ['tech-support', `Your Norton subscription auto-renewed for $389.42. If you did not authorise this, call our billing line within 24 hours for a full refund.`],
  ['refund', `We attempted to refund $512 to your account but the transfer failed. Please confirm your routing and account number so we can reissue it.`],
  ['refund', `Hi, our accountant sent you too much money by mistake. Could you send back the difference in gift cards? It's easier than a bank reversal.`],
  ['prize', `CONGRATULATIONS!!! Your number was drawn in our promo. You've won a brand new iPhone. Just pay $3.95 postage to claim.`],
  ['prize', `Dear Beneficiary, my late client left an estate of $3.5 million with no next of kin. You share his surname. I propose we present you as the heir. Absolute confidentiality is required.`],
  ['prize', `You have unclaimed funds waiting. To release them we need a small clearance fee paid in Bitcoin.`],
  ['romance', `My darling I have never felt this way. I want to fly to you but customs is holding my inheritance. Please, only you can help me now. Send whatever you can.`],
  ['romance', `Good morning beautiful. My aunt works at an exchange and she gives me signals. I made $12,000 last week. Start with $500 and I will show you how.`],
  ['romance', `Hi! Sorry wrong number I think. But you seem nice, where are you from? I am an analyst living in Singapore.`],
  ['investment', `Last call for the presale. 40x guaranteed. Deposit closes at midnight. Connect wallet: claimtoken-presale.cfd`],
  ['investment', `Your wallet has been flagged for a security sync. Enter your 12 word recovery phrase to restore access.`],
  ['investment', `Join the VIP group. We post entries every morning. Members made 300% this month. Zero risk, capital protected.`],
  ['job-task', `Hiring: remote data entry, $300/day, no experience required, flexible hours. Message me on Telegram @hr_recruit88 to start.`],
  ['job-task', `Welcome aboard! Your first task is to receive packages at home and forward them to the addresses we send. Payment weekly.`],
  ['job-task', `We're sending you a check for equipment. Deposit it, keep $200, and wire the rest to our supplier today.`],
  ['family-emergency', `Mom its me my phone broke this is my new number. Im ok but i need help with something. can you text me back`],
  ['family-emergency', `Grandpa, I was in a car accident and I'm in custody. My lawyer says I need $2,750 for bail this morning. Please don't tell mom and dad, I'll explain everything later.`],
  ['invoice-bec', `Are you at your desk? I need a favour and I'm heading into a board meeting so I can only text. Don't call me.`],
  ['invoice-bec', `Please hold payment on the last invoice. Our bank changed. New details attached, process today so we don't miss the cut off.`],
  ['invoice-bec', `Can you pick up 4 Apple gift cards for a client thank you gift? Scratch the back and send me photos of the codes. I'll expense it.`],
  ['extortion', `I know your password. I placed malware on the adult site you visited and recorded you. You have 48 hours to send $1,900 in Bitcoin or the video goes to your contacts.`],
  ['charity', `Emergency appeal for the earthquake victims. Our card processor is down so we can only accept gift cards or crypto right now. Please give what you can tonight.`],
  ['phishing', `Amаzon: your prime membership will renew at $139. Cancel here: amazon-prime-cancel.top`],
  ['phishing', `Your DocuSign document is ready to sign. This link expires in 2 hours: docu-sign-secure.buzz/d/8812`],
  ['impersonation-bank', `Zelle alert: $600 sent to Marcus T. If you did not authorise this, call us back on this number immediately and do not use your banking app until we clear it.`],
  ['phishing', `Steam Support: your account is under review for trade fraud. Verify ownership by sending the code from your authenticator.`],
  ['phishing', `Hi love, my Facebook got hacked so this is my backup account. Can you vote for me in this contest? Just enter your login to vote.`],
  ['prize', `You've been selected for a $500 Walmart gift card. Limited spots. Claim: walmart-rewards.icu/claim`],
  ['tech-support', `Refund department calling about your expired antivirus. We will need remote access to process the refund into your online banking.`],
  ['delivery', `DHL: parcel held at customs, duty of $2.14 unpaid. dhl-clearance.gq/pay`],
  ['job-task', `Congratulations on being shortlisted! Before the interview, purchase the training software with the link we send and we'll reimburse you.`],
  ['investment', `Your Coinbase account shows an unauthorised withdrawal. Secure it now by moving your funds to the vault address below.`],
  ['phishing', `URGENT: Your email account will be shut down today. Confirm your identity: webmail-verify-now.top`],
  ['impersonation-gov', `Immigration Services: there is a problem with your file. Failure to respond will result in deportation proceedings. Call this number now.`],
  ['family-emergency', `Hey dad, dropped my phone in the sink. Using a friends. Can you send me money for a replacement, I'll pay you back Friday. New number btw.`],
  ['romance', `I cannot log into my account because I am offshore on the rig. Could you receive a payment for me and forward it? I trust only you.`],
  ['refund', `Your subscription renewed. Charge $149.99. To cancel and get a full refund call 877-214-9930 within 24 hours before it posts.`],
  ['phishing', `Two-factor is being disabled on your account. If this wasn't you, reply with the 6 digit code we just sent to stop it.`],
  ['investment', `Congratulations, your account has generated $45,000 in profit. To withdraw, first pay the 8% liquidity tax.`],
  ['prize', `You're our 10,000th visitor! Claim your reward now before the timer runs out.`],
  ['phishing', `Dear Customer, kindly find attached the payment advice and confirm your bank particulars for onward remittance.`],
  ['delivery', `Your package is on hold. Update your delivery preference: usps.com-trackid8817.live`],
  ['impersonation-bank', `Bank of America: unusual sign in detected. If this wasn't you, secure your account: bofa-alerts-secure.xyz/id`],
  ['phishing', `Return-Path: <bounce@sec-alert-9f.icu>
Authentication-Results: mx.example.com; spf=fail smtp.mailfrom=sec-alert-9f.icu; dkim=fail header.d=micros0ft-account.top; dmarc=fail (p=REJECT)
From: "Microsoft Account Team" <security@micros0ft-account.top>
Reply-To: helpdesk.recovery@yandex.ru
Subject: Unusual sign-in activity on your account

We detected a sign-in from an unrecognised device. If this wasn't you, verify your password now to keep your account active.`],
  ['invoice-bec', `From: "Daniel Okafor" <d.okafor@northwind-logistics.cfd>
Reply-To: accounts.payable@mail.com
Authentication-Results: mx.example.com; spf=softfail; dkim=none; dmarc=fail
Subject: Updated remittance details - invoice 40182

Hi, please note our bank has changed. Use the new account details below for invoice 40182 and process it today so we don't miss the cut off.`],
  ['delivery', `Return-Path: <noreply@parcel-notice.sbs>
Received-SPF: Fail (domain of parcel-notice.sbs does not designate 198.51.100.7 as permitted sender)
From: DHL Express <tracking@parcel-notice.sbs>
Subject: Your parcel is held - customs charge outstanding

Your shipment cannot be released until the outstanding charge of $2.14 is settled. Pay now to avoid return to sender.`],
  ['impersonation-bank', `From: "Wells Fargo Online" <alerts@wellsfargo.secure-msg.xyz>
Reply-To: verification.team@gmx.com
Authentication-Results: mx.example.com; spf=fail; dkim=fail; dmarc=fail header.from=wellsfargo.secure-msg.xyz
Subject: Action required: your online access expires today

To keep your online banking active, confirm your card number and PIN using the secure form.`],
  ['refund', `From: "Norton Billing Department" <norton.invoice.dept@gmail.com>
Subject: Your subscription has been renewed - $389.42
Date: Tue, 25 Aug 2026 04:02:11 +0000

Thank you for renewing Norton 360 Deluxe. Your card has been charged $389.42. If you did not authorise this, call our refund department within 24 hours.`],
  ['prize', `Return-Path: <claims@lottery-payout.gq>
From: "International Promotions Board" <claims@lottery-payout.gq>
Reply-To: barrister.adeyemi@rediffmail.com
Authentication-Results: mx.example.com; spf=none; dkim=none; dmarc=none
Subject: FINAL NOTICE - unclaimed award reference 88213

Your email was drawn in our annual promotion. To release the funds we require a small clearance fee. Kindly keep this confidential until the transfer completes.`],
  ['phishing', `From: "IT Helpdesk" <it-helpdesk@brightline-health.click>
Reply-To: helpdesk.sync@proton.me
Authentication-Results: mx.example.com; spf=fail; dkim=fail; dmarc=fail
Subject: Mailbox migration tonight - action needed

We are migrating mailboxes this evening. Reply to this message with your username and password so we can carry your account across without locking you out.`],
];

const ham: [string, string][] = [
  ['legit-2fa', `G-773821 is your Google verification code. Don't share it with anyone.`],
  ['legit-2fa', `Your verification code is 482913. This code expires in 5 minutes. If you didn't request it, ignore this message.`],
  ['legit-2fa', `Chase: your one-time code is 905174. We will never call and ask you for this code.`],
  ['legit-security', `New sign-in on Chrome, Windows. Location: Denver, CO. If this was you, you're all set. If not, change your password from the app.`],
  ['legit-security', `Your password was successfully changed. If you didn't make this change, contact support through the app.`],
  ['legit-security', `We declined a $217.40 charge at a gas station in Phoenix on your card ending 4471 because it looked unusual. Reply YES if it was you, NO if it wasn't.`],
  ['legit-security', `Heads up: your account balance is $18.75. A scheduled payment of $120 is due Thursday and may overdraw the account.`],
  ['legit-security', `You added a new recipient to your payee list. If this wasn't you, call the number on the back of your card.`],
  ['legit-delivery', `Your package was delivered and left in the mailroom. Photo attached.`],
  ['legit-delivery', `UPS: 1Z9X8V7L0394827361 is out for delivery today between 1pm and 5pm. No signature required.`],
  ['legit-delivery', `We tried to deliver your parcel but no one was home. We'll try again tomorrow, or you can collect it from the depot with photo ID. No fee is due.`],
  ['legit-delivery', `Your order shipped! Track it in the app. Estimated delivery Tuesday.`],
  ['legit-commerce', `Thanks for your order. We charged $64.20 to your card ending 1180. Your receipt is in your account under Orders.`],
  ['legit-commerce', `Your subscription renews on October 2 for $9.99. You can cancel any time in Settings.`],
  ['legit-commerce', `Your refund of $34.99 has been processed and should appear on your statement within 5 business days.`],
  ['legit-commerce', `Your pickup order is ready. We'll hold it at the desk for 3 days. Bring your ID.`],
  ['legit-commerce', `Table for 4 confirmed at 7:30 tonight. Reply CANCEL if your plans change.`],
  ['legit-appointment', `Reminder: dental cleaning tomorrow at 2:40 PM with Dr. Rossi. Reply C to confirm.`],
  ['legit-appointment', `Your prescription is ready for pickup. The pharmacy closes at 8pm.`],
  ['legit-appointment', `Your car service is booked for June 14. The shuttle leaves at 8am if you need a ride.`],
  ['legit-appointment', `Lab results are available in your patient portal. Your doctor will call if anything needs follow-up.`],
  ['legit-work', `Hi Maria, can you send the updated deck before the 2pm call? Want to read it first. Thanks`],
  ['legit-work', `Need this today if possible — client is asking. Sorry for the short notice, I know it's tight.`],
  ['legit-work', `Timesheets are due Friday. Submit in the HR portal, ping me if it won't let you in.`],
  ['legit-work', `IT will push updates tonight. Save your work before you leave. We'll never ask you for your password.`],
  ['legit-work', `Following up on invoice #INV-2291 for $2,400, due the 30th. Bank details are the same as always.`],
  ['legit-work', `Standup moved to 9:45. Same link.`],
  ['legit-work', `Can you approve the PO before end of day? Finance closes the books tomorrow morning and it's urgent.`],
  ['legit-work', `Welcome to the team! Your laptop ships Monday. HR will email your onboarding checklist from their official address.`],
  ['legit-personal', `Are we still on for dinner Thursday? I can pick you up at 6.`],
  ['legit-personal', `Running late, bus is stuck. Start without me.`],
  ['legit-personal', `Happy birthday!! Call me when you're free.`],
  ['legit-personal', `Sent you $40 for the tickets, let me know it landed.`],
  ['legit-personal', `Landed safe. Long flight. Will call tomorrow.`],
  ['legit-personal', `can you grab milk on the way home. and coffee, we're out`],
  ['legit-personal', `Mom I'm staying at Sam's tonight, we finished late. See you in the morning.`],
  ['legit-personal', `Hey it's Dan from the gym, this is my number. Nice meeting you today.`],
  ['legit-personal', `The cat threw up on the rug again. I'm not dealing with it this time.`],
  ['legit-personal', `Just so you know grandma's surgery went fine. She's resting.`],
  ['legit-personal', `I'll be late, don't wait up, love you`],
  ['legit-civic', `Your ballot has been received and counted. No further action needed.`],
  ['legit-civic', `Reminder: the tax filing deadline is April 15. The IRS will never text you asking for payment or card numbers.`],
  ['legit-civic', `Your library books are due Friday. Renew online any time.`],
  ['legit-civic', `Scheduled power maintenance in your area Tuesday 9am-11am. No action needed.`],
  ['legit-civic', `Jury duty: you are excused for this term. Do not report.`],
  ['legit-civic', `Snow route parking restrictions are in effect tonight. Move vehicles off marked streets by 10pm.`],
  ['legit-marketing', `Weekly deals are live. Save on kitchen gear through Sunday. Reply STOP to unsubscribe.`],
  ['legit-marketing', `Your monthly statement is ready in the app. Manage notification preferences in Settings.`],
  ['legit-marketing', `New episodes are out. Browse the catalogue at https://www.netflix.com/browse`],
  ['legit-marketing', `Thanks for subscribing! Here's the guide we promised. You can unsubscribe from these emails at any time.`],
  ['legit-security', `We noticed a login from a new device. If it was you, no action needed. Review activity at https://www.google.com/security`],
  ['legit-commerce', `Your flight AB1204 is delayed 40 minutes. New departure 6:05 PM, gate unchanged.`],
  ['legit-commerce', `Your hotel booking for August 8 is confirmed. Check-in from 3pm. Free cancellation until the 6th.`],
  ['legit-commerce', `Your rideshare is arriving. Silver Corolla, plate 7KJ 221.`],
  ['legit-security', `Someone requested a password reset. If it wasn't you, you can safely ignore this — no changes have been made and the link expires in 30 minutes.`],
  ['legit-work', `Payroll note: direct deposit lands a day early this month because of the holiday.`],
  ['legit-appointment', `Your appointment at Brightline Health is confirmed for March 3 at 9:15 AM. Please arrive 10 minutes early with your insurance card.`],
  ['legit-personal', `Do you still have the drill? Need it this weekend if so.`],
  ['legit-civic', `School is closed tomorrow due to weather. Buses are not running.`],
  ['legit-delivery', `Delivery exception: address needs a unit number. Update it in the app or reply with the unit — there's no charge.`],
  ['legit-commerce', `We couldn't process your card for the renewal. Update it in Settings whenever you get a chance; your account stays active until the 30th.`],
  ['legit-security', `Your account was locked after too many failed sign-in attempts. It unlocks automatically in 15 minutes.`],
  ['legit-work', `Reminder that open enrolment closes Friday. Benefits portal link is on the intranet homepage.`],
  ['legit-personal', `wrong number sorry!`],
  ['legit-security', `Return-Path: <bounce-9931@accounts.google.com>
Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=accounts.google.com; dkim=pass header.d=google.com; dmarc=pass header.from=google.com
From: Google <no-reply@accounts.google.com>
Subject: New sign-in on Chrome, Windows

Your Google Account was just signed in to from a new Windows device. If this was you, no action is needed. If not, review your activity from the app.`],
  ['legit-commerce', `Return-Path: <bounces@amazonses.com>
Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=amazonses.com; dkim=pass header.d=amazon.com; dmarc=pass header.from=amazon.com
From: Amazon.com <auto-confirm@amazon.com>
Subject: Your order has shipped

Your order 114-3392847 is on its way and should arrive Tuesday. You can track it from Your Orders.`],
  ['legit-work', `From: Priya Patel <priya.patel@cedar-and-vale.com>
Authentication-Results: mx.example.com; spf=pass; dkim=pass header.d=cedar-and-vale.com; dmarc=pass
Subject: Deck for tomorrow

Hi, can you take a look at the deck before the 2pm call? No rush tonight, tomorrow morning is fine. Thanks!`],
  ['legit-work', `From: Accounts <billing@northwind-logistics.com>
Authentication-Results: mx.example.com; spf=pass; dkim=pass header.d=northwind-logistics.com; dmarc=pass
Subject: Invoice INV-2291 due 30th

Attaching this quarter's invoice for $2,400, due on the 30th. Our bank details are unchanged. Let me know if you need a PO reference added.`],
  ['legit-marketing', `Return-Path: <bounce@e.netflix.com>
Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=e.netflix.com; dkim=pass header.d=netflix.com; dmarc=pass
From: Netflix <info@netflix.com>
Subject: New this week

Three new titles we think you'll like. Browse the catalogue any time. You can unsubscribe from these emails in your account settings.`],
  ['legit-security', `Return-Path: <no-reply@chase.com>
Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=chase.com; dkim=pass header.d=chase.com; dmarc=pass header.from=chase.com
From: Chase <no-reply@chase.com>
Subject: We declined a charge on your card

We declined a $217.40 charge at a merchant in Phoenix because it looked unusual. If it was you, no action is needed. We will never call and ask you to move money to another account.`],
  ['legit-appointment', `From: Maple Grove Dental <reception@maplegrovedental.com>
Authentication-Results: mx.example.com; spf=pass; dkim=pass; dmarc=pass
Subject: Appointment reminder - June 14

This is a reminder of your cleaning on June 14 at 2:40 PM with Dr. Rossi. Reply C to confirm or call the office to reschedule.`],
];

export const MESSAGES: LabeledMessage[] = [
  ...scam.map(([category, text]): LabeledMessage => ({ text, label: 1, category })),
  ...ham.map(([category, text]): LabeledMessage => ({ text, label: 0, category })),
];
