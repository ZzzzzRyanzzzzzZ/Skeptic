import type { Evidence, Family, Span } from './types';
import { foldForSpans } from './text';

export interface Rule {
  key: string;
  kind: 'rule' | 'structure';
  severity: Evidence['severity'];
  points: number;
  patterns: RegExp[];
  family?: Family;
}

const phrases = (...list: string[]): RegExp[] => {
  const alts = list.map((raw) => {
    const body = raw.replace(/ +/g, '\\s+');
    const lead = /^[\p{L}\p{N}]/u.test(body) ? '\\b' : '';
    const tail = /[\p{L}\p{N}]$/u.test(body) ? '\\b' : '';
    return `${lead}(?:${body})${tail}`;
  });
  return [new RegExp(`(?:${alts.join('|')})`, 'giu')];
};

export const RULES: Rule[] = [
  {
    key: 'ev.rule.urgency',
    kind: 'rule',
    severity: 'medium',
    points: 14,
    patterns: phrases(
      'act now', 'immediately', 'right away', 'within 24 hours', 'within 48 hours',
      'expires today', 'expires in', 'final notice', 'last warning', 'urgent action',
      'urgently', 'time sensitive', 'time-sensitive', 'as soon as possible',
      'before it is too late', 'before it’s too late', 'do not delay', "don't delay",
      'limited time', 'only a few hours', 'respond now', 'reply immediately',
      'inmediatamente', 'urgente', 'acci[oó]n inmediata', 'antes de que sea tarde',
      '[uú]ltimo aviso', 'en las pr[oó]ximas 24 horas',
    ),
  },
  {
    key: 'ev.rule.threat',
    kind: 'rule',
    severity: 'high',
    points: 20,
    patterns: phrases(
      'account will be suspended', 'account has been suspended', 'account will be closed',
      'will be locked', 'has been locked', 'will be terminated', 'will be deactivated',
      'legal action', 'lawsuit', 'arrest warrant', 'warrant for your arrest',
      'you will be arrested', 'law enforcement', 'criminal charges', 'court',
      'deported', 'benefits will be stopped', 'permanently deleted', 'service disruption',
      'sera suspendida', 'ser[aá] suspendida', 'acci[oó]n legal', 'orden de arresto',
      'ser[aá] bloqueada', 'cargos criminales',
    ),
  },
  {
    key: 'ev.rule.safeAccount',
    kind: 'rule',
    severity: 'high',
    points: 34,
    family: 'impersonation-bank',
    patterns: phrases(
      'safe account', 'protected account', 'secure account we provide',
      'move your (?:money|funds|balance)', 'transfer your (?:money|funds|balance) to',
      'move it to a new account', 'move the funds to', 'vault address',
      'cuenta segura', 'transfiera sus fondos',
    ),
  },
  {
    key: 'ev.rule.untraceablePayment',
    kind: 'rule',
    severity: 'high',
    points: 30,
    patterns: phrases(
      'gift card', 'gift cards', 'google play card', 'apple gift', 'itunes card',
      'steam card', 'steam wallet', 'ebay gift', 'target gift', 'walmart gift',
      'prepaid card', 'wire transfer', 'western union', 'moneygram', 'money order',
      'bitcoin', 'btc wallet', 'ethereum', 'usdt', 'tether', 'crypto wallet',
      'cryptocurrency', 'bitcoin atm', 'send crypto', 'zelle me', 'cash app me',
      'tarjeta de regalo', 'giro postal', 'transferencia bancaria urgente',
    ),
  },
  {
    key: 'ev.rule.credentialRequest',
    kind: 'rule',
    severity: 'high',
    points: 38,
    family: 'phishing',
    patterns: phrases(
      '(?:verify|confirm|enter|update|provide|send|share|reply with|give|read|text|forward|submit|need)' +
        '(?: (?:me|us|back|your|the|a|an|full|us your))*' +
        ' (?:password|passwords|pin|pin number|ssn|social security number|card number|cvv|' +
        'security code|one[- ]time code|otp|verification code|seed phrase|recovery phrase|' +
        'private key|login credentials|credentials|username and password|banking details|' +
        'routing number|date of birth|full card details|security question)',
      'your username and password', 'reply with the \\d+ ?digit code',
      'send me the code', 'text me the code', 'forward the code', 'give me the code',
      'read me the code', 'read the code back', 'read me the numbers',
      'confirm your username', 'validate your wallet', 'sync your wallet',
      'enter your login', 'my (?:facebook|instagram|whatsapp|account) (?:got|was) hacked',
      'vote for me', 'this is my backup account',
      'contrase[nñ]a', 'frase de recuperaci[oó]n',
    ),
  },
  {
    key: 'ev.rule.sensitiveData',
    kind: 'rule',
    severity: 'medium',
    points: 14,
    patterns: phrases(
      'social security number', 'ssn', 'card number', 'cvv',
      'security code on the back', 'pin number', 'your pin', 'seed phrase',
      'recovery phrase', 'private key', 'wallet passphrase', 'banking details',
      'account and routing number', "mother's maiden name", 'security question',
      'n[uú]mero de seguro social', 'datos bancarios',
    ),
  },
  {
    key: 'ev.rule.secrecy',
    kind: 'rule',
    severity: 'high',
    points: 24,
    patterns: phrases(
      'do not tell anyone', "don't tell anyone", 'keep this confidential',
      'keep this between us', 'do not discuss this', 'do not tell your family',
      "don't tell your parents", 'stay on the line', 'do not hang up',
      "don't hang up", 'this is confidential', 'do not tell the bank',
      'no le digas a nadie', 'mant[eé]n esto en secreto', 'no cuelgues',
    ),
  },
  {
    key: 'ev.rule.tooGood',
    kind: 'rule',
    severity: 'medium',
    points: 20,
    family: 'prize',
    patterns: phrases(
      'you have won', 'you won', 'congratulations you', 'selected as a winner',
      'lottery winner', 'claim your prize', 'claim your reward', 'free gift',
      'free iphone', 'you are eligible for', 'unclaimed funds', 'inheritance',
      'guaranteed returns', 'guaranteed profit', 'risk[- ]free investment',
      'double your money', 'triple your', 'no risk', '100% profit',
      'was awarded', 'have been awarded', 'bonus caller prize', 'guaranteed cash',
      'cash prize', 'prize guaranteed', 'to claim call', 'to claim,? call',
      'claim code', 'you have been selected to receive', 'won an? (?:award|prize|guaranteed)',
      'call 09\\d{8,9}', 'valid 12 ?hrs only', 'our final try to contact',
      'has ganado', 'ha sido seleccionado', 'premio', 'ganancias garantizadas',
    ),
  },
  {
    key: 'ev.rule.advanceFee',
    kind: 'rule',
    severity: 'high',
    points: 26,
    family: 'delivery',
    patterns: phrases(
      'small fee', 'processing fee', 'customs fee', 'clearance fee', 'release fee',
      'redelivery fee', 'shipping fee', 'handling fee', 'delivery charge',
      'insurance fee', 'transfer fee', 'activation fee', 'unlock fee',
      'pay a fee to receive', 'to release your',
      'tarifa de env[ií]o', 'cargo de aduana', 'peque[nñ]a tarifa',
    ),
  },
  {
    key: 'ev.rule.techSupport',
    kind: 'rule',
    severity: 'high',
    points: 26,
    family: 'tech-support',
    patterns: phrases(
      'your computer is infected', 'virus detected', 'malware detected',
      'your device has been compromised', 'security alert from microsoft',
      'call this number immediately', 'call our support line', 'do not restart your computer',
      'remote access', 'anydesk', 'teamviewer', 'ultraviewer', 'install this tool so i can',
      'su computadora est[aá] infectada', 'virus detectado',
    ),
  },
  {
    key: 'ev.rule.extortion',
    kind: 'rule',
    severity: 'high',
    points: 30,
    family: 'extortion',
    patterns: phrases(
      'i recorded you', 'i have a video of you', 'your webcam', 'i have your contacts',
      'i will send the video', 'i will expose', 'compromising footage',
      'i installed a trojan', 'i have been watching you', 'pay or i will',
      'he grabado', 'tengo un video tuyo',
    ),
  },
  {
    key: 'ev.rule.jobTask',
    kind: 'rule',
    severity: 'medium',
    points: 22,
    family: 'job-task',
    patterns: phrases(
      'earn \\$?\\d+ (?:a|per) day', 'daily salary', 'part[- ]time online job',
      'no experience needed', 'work from home opportunity', 'simple tasks',
      'complete tasks and earn', 'like videos and get paid', 'app rating job',
      'add me on telegram', 'contact me on whatsapp for details',
      "we(?:'ll| will) reimburse you", 'before the interview', 'purchase the training',
      'buy the (?:software|equipment) and', 'reshipping', 'forward the packages',
      'trabajo desde casa', 'gana \\$?\\d+ al d[ií]a',
    ),
  },
  {
    key: 'ev.rule.romance',
    kind: 'rule',
    severity: 'medium',
    points: 20,
    family: 'romance',
    patterns: phrases(
      'i feel a connection', 'i want to meet you but', 'my uncle taught me',
      'my aunt taught me', 'i can teach you how to trade', 'my trading mentor',
      'guaranteed signals', 'gives? me signals', 'works? at an exchange',
      'i made \\$?[\\d,]+ (?:last|this) (?:week|month)', 'start with \\$?[\\d,]+ and i', 'i need money for a flight', 'stuck in another country',
      'i cannot log ?in to my account because', 'receive a payment for me',
      'my card is blocked', 'customs is holding', 'i am on (?:the|an oil) rig',
      'necesito dinero para el vuelo', 'estoy atrapad[oa] en otro pa[ií]s',
    ),
  },
  {
    key: 'ev.rule.investment',
    kind: 'rule',
    severity: 'medium',
    points: 20,
    family: 'investment',
    patterns: phrases(
      'insider tip', 'presale opportunity', 'exclusive investment', 'vip signal group',
      'withdraw your profits after', 'minimum deposit', 'liquidity mining',
      'airdrop claim', 'connect your wallet to claim', 'validate your wallet',
      'connect wallet', 'vip group', 'zero risk', 'capital protected',
      'members made \\d+%', 'deposit closes', 'last call for the presale',
      '\\d+x guaranteed', 'we post entries',
      'sincroniza tu billetera', 'grupo vip de se[nñ]ales',
    ),
  },
  {
    key: 'ev.rule.familyEmergency',
    kind: 'rule',
    severity: 'high',
    points: 24,
    family: 'family-emergency',
    patterns: phrases(
      'this is my new number', 'i lost my phone', 'mom i need', 'dad i need',
      'new number btw', 'this is my (?:temporary|backup) number', 'using a friend',
      'dropped my phone', 'broke my phone', 'my phone (?:broke|died|is broken)',
      'save my new number', 'text me back on this number',
      'i am in trouble and need', "i'm in jail", 'bail money', 'i had an accident and need',
      'grandma it', 'grandpa it', 'please help me quickly',
      'este es mi nuevo n[uú]mero', 'perd[ií] mi tel[eé]fono', 'necesito dinero para la fianza',
    ),
  },
  {
    key: 'ev.rule.govImpersonation',
    kind: 'rule',
    severity: 'high',
    points: 22,
    family: 'impersonation-gov',
    patterns: phrases(
      'internal revenue service', 'irs', 'social security administration',
      'your social security number has been suspended', 'medicare benefits',
      'immigration services', 'sheriff', 'federal agent', 'unpaid toll',
      'traffic violation notice', 'dmv record',
      'servicio de impuestos internos', 'seguro social',
    ),
  },
  {
    key: 'ev.rule.refund',
    kind: 'rule',
    severity: 'medium',
    points: 18,
    family: 'refund',
    patterns: phrases(
      'your subscription has been renewed', 'auto[- ]renewal', 'you were charged',
      'to cancel this order call', 'to cancel please call', 'refund department',
      'we overcharged you', 'refund of', 'antivirus renewal',
      'para cancelar llame', 'reembolso',
    ),
  },
  {
    key: 'ev.rule.invoiceBec',
    kind: 'rule',
    severity: 'high',
    points: 24,
    family: 'invoice-bec',
    patterns: phrases(
      'updated banking details', 'change of bank account', 'new account details for payment',
      'our bank (?:has )?changed', 'hold payment on', 'new details attached',
      'bank details have changed', 'remit to the new account',
      'please process this payment', 'wire the funds to', 'urgent payment request',
      'i need you to do something for me', 'purchase gift cards for the team',
      'i need a favou?r', 'handle this discreetly', 'keep this off the books',
      'nuevos datos bancarios',
    ),
  },
  {
    key: 'ev.rule.channelSwitch',
    kind: 'rule',
    severity: 'medium',
    points: 14,
    patterns: phrases(
      'message me on telegram', 'add me on whatsapp', 'contact me on signal',
      'text me at', 'reply to this number', 'chat with me privately',
      'escr[ií]beme por whatsapp', 'cont[aá]ctame por telegram',
    ),
  },
  {
    key: 'ev.rule.genericGreeting',
    kind: 'structure',
    severity: 'low',
    points: 10,
    patterns: phrases(
      'dear customer', 'dear user', 'dear client', 'valued customer', 'valued client',
      'dear account holder', 'dear member', 'dear sir/madam', 'dear beneficiary',
      'estimado cliente', 'estimado usuario',
    ),
  },
  {
    key: 'ev.rule.wrongNumber',
    kind: 'rule',
    severity: 'low',
    points: 10,
    patterns: phrases(
      'is this .{0,20}\\?', 'sorry,? who is this', 'am i speaking with',
      'i think i (?:have|got) the wrong number',
      'wrong number', 'n[uú]mero equivocado',
      'hello dear', 'hi dear', 'good day dear',
      'do i know you\\?', 'who is this please',
    ),
  },
  {
    key: 'ev.rule.rapportProbe',
    kind: 'rule',
    severity: 'low',
    points: 12,
    patterns: phrases(
      'you seem nice', 'where are you from', 'what do you do for (?:a )?(?:living|work)',
      'are you single', 'how old are you', 'maybe we can be friends',
      'can we be friends', 'i am an? (?:financial )?(?:analyst|trader|investor)',
      'i work in (?:crypto|trading|investment)', 'do you invest',
      'de d[oó]nde eres', 'a qu[eé] te dedicas',
    ),
  },
  {
    key: 'ev.rule.availabilityProbe',
    kind: 'rule',
    severity: 'low',
    points: 8,
    patterns: phrases(
      'are you at your desk', 'are you available\\?', 'are you free at the moment',
      'are you around\\?', 'do you have a (?:minute|moment)', 'are you in the office',
      'est[aá]s disponible\\?',
    ),
  },
  {
    key: 'ev.rule.channelRestriction',
    kind: 'rule',
    severity: 'medium',
    points: 14,
    patterns: phrases(
      'i can only text', 'i can only communicate by (?:text|email)',
      'do not call me', "don't call me", 'cannot take calls', "can't take calls",
      'do not phone me', 'no me llames', 'do not try to (?:call|ring) me',
      'i cannot take (?:a |any )?calls?',
    ),
  },

  {
    key: 'ev.rule.neverAsksCode',
    kind: 'rule',
    severity: 'info',
    points: -18,
    patterns: phrases(
      '(?:we|[a-z]+) will never (?:call(?: you)? and )?ask (?:you )?for (?:this|your|the)' +
        ' (?:code|password|pin|passcode)',
      'never (?:share|give out) (?:this|your) (?:code|password|pin|passcode)',
      "do(?:n't| not) share (?:this|it|your) ?(?:code|password|pin)?(?: with anyone)?",
      'we will never ask for your password', 'will never text you asking',
      'will never (?:call|email|text) you (?:and )?ask',
      'nunca compartas este c[oó]digo', 'nunca le pediremos',
    ),
  },
  {
    key: 'ev.rule.legitOptOut',
    kind: 'rule',
    severity: 'info',
    points: -6,
    patterns: phrases(
      'reply stop to unsubscribe', 'text stop to opt out', 'reply stop to cancel',
      'unsubscribe from these emails', 'manage your notification preferences',
    ),
  },
];

export function runRules(text: string): Evidence[] {
  const hay = foldForSpans(text);
  const out: Evidence[] = [];

  for (const rule of RULES) {
    const spans: Span[] = [];
    const samples: string[] = [];
    for (const re of rule.patterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(hay)) !== null) {
        if (m[0].length === 0) {
          re.lastIndex++;
          continue;
        }
        spans.push({ start: m.index, end: m.index + m[0].length });
        if (samples.length < 3) samples.push(text.slice(m.index, m.index + m[0].length));
        if (spans.length > 40) break;
      }
    }
    if (spans.length === 0) continue;
    out.push({
      id: `${rule.key}`,
      kind: rule.kind,
      severity: rule.severity,
      key: rule.key,
      points: rule.points,
      params: { quote: samples.join('”, “'), count: spans.length },
      spans,
    });
  }

  return out;
}

const ENDEARMENT =
  /\b(?:my (?:dear|love|darling|sweetheart)|dear(?:est)? one|babe|baby|honey|sweetie|mi amor|mi cari[nñ]o|querid[oa])\b/iu;

export const hasEndearment = (text: string): boolean => ENDEARMENT.test(text);

export const RULE_FAMILY = new Map<string, Family>(
  RULES.filter((r) => r.family).map((r) => [r.key, r.family!]),
);
