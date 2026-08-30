export interface SampleMessage {
  label: string;
  labelEs: string;
  text: string;
}

export const SAMPLES: SampleMessage[] = [
  {
    label: 'Lookalike domain',
    labelEs: 'Dominio falso',
    text: `Chase Security Alert: we detected a login to your account from a new device in Bucharest. If this was not you, your account will be suspended within 24 hours. Verify your identity now: http://chase.com.secure-verify-a7f2.icu/login`,
  },
  {
    label: 'Invisible characters',
    labelEs: 'Caracteres ocultos',
    text:
      'P\u200bay\u200bPal: Your account has been limited.\u200b Confirm your password and the ' +
      'security code on the back of your card to restore access: ' +
      'https://p\u0430ypal-resolution-centre.top/verify',
  },
  {
    label: 'Grandparent scam',
    labelEs: 'Estafa del abuelo',
    text: `Grandma it's me, I'm so sorry. I had an accident and I'm in jail in Denver. I need $2,750 for bail this morning and my lawyer will call you at 9:15 AM. Please don't tell mom and dad, I'm too embarrassed. Can you send it by wire transfer right away?`,
  },
  {
    label: 'Gift card / boss',
    labelEs: 'Jefe y tarjetas',
    text: `Hi, are you at your desk? I'm heading into a board meeting so I can only text. I need you to purchase 4 Apple gift cards worth $500 for a client thank-you. Scratch the back and send me photos of the codes. I'll reimburse you today. Please handle this discreetly.`,
  },
  {
    label: 'Raw email headers',
    labelEs: 'Cabeceras de correo',
    text: `Delivered-To: you@example.com
Return-Path: <bounce@mailer-7x.icu>
Authentication-Results: mx.example.com; spf=fail smtp.mailfrom=mailer-7x.icu; dkim=fail header.d=paypal-billing.top; dmarc=fail (p=REJECT) header.from=paypal-billing.top
Received-SPF: Fail (domain of mailer-7x.icu does not designate 203.0.113.44 as permitted sender)
From: "PayPal Service" <service@paypal-billing.top>
Reply-To: recovery-desk@mail.ru
To: you@example.com
Subject: Your account has been limited - action required within 24 hours
Date: Tue, 25 Aug 2026 09:15:02 +0000

Dear Customer,

We detected unusual activity on your account. Confirm your password and the
security code on the back of your card to restore access:

https://paypal-billing.top/verify/session/a7f2

PayPal Security Team`,
  },
  {
    label: 'Genuine message',
    labelEs: 'Mensaje auténtico',
    text: `Chase: your one-time code is 905174. It expires in 10 minutes. We will never call and ask you for this code. If you did not request it, review your recent activity at https://www.chase.com/security`,
  },
  {
    label: 'Estafa en español',
    labelEs: 'Estafa en español',
    text: `URGENTE: Su cuenta será suspendida hoy. Para evitar acción legal debe confirmar su contraseña y su número de seguro social inmediatamente. No le diga a nadie sobre este mensaje. Verifique aquí: http://banco-seguridad-verificar.sbs/acceso`,
  },
];
