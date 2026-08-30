export interface Brand {
  name: string;
  keys: string[];
  domains: string[];
  sector: 'bank' | 'payment' | 'tech' | 'shipping' | 'gov' | 'retail' | 'social' | 'crypto' | 'telecom';
}

export const BRANDS: Brand[] = [
  { name: 'PayPal', keys: ['paypal'], domains: ['paypal.com', 'paypal.me', 'paypalobjects.com'], sector: 'payment' },
  { name: 'Venmo', keys: ['venmo'], domains: ['venmo.com'], sector: 'payment' },
  { name: 'Zelle', keys: ['zelle'], domains: ['zellepay.com'], sector: 'payment' },
  { name: 'Cash App', keys: ['cashapp', 'cash app'], domains: ['cash.app', 'squareup.com'], sector: 'payment' },
  { name: 'Stripe', keys: ['stripe'], domains: ['stripe.com'], sector: 'payment' },
  { name: 'Apple', keys: ['apple', 'icloud', 'itunes', 'apple id'], domains: ['apple.com', 'icloud.com', 'itunes.com'], sector: 'tech' },
  { name: 'Microsoft', keys: ['microsoft', 'office365', 'outlook', 'onedrive'], domains: ['microsoft.com', 'office.com', 'live.com', 'outlook.com', 'microsoftonline.com'], sector: 'tech' },
  { name: 'Google', keys: ['google', 'gmail', 'google drive'], domains: ['google.com', 'gmail.com', 'goo.gl', 'youtube.com'], sector: 'tech' },
  { name: 'Amazon', keys: ['amazon', 'prime video'], domains: ['amazon.com', 'amazon.co.uk', 'aws.amazon.com', 'a.co'], sector: 'retail' },
  { name: 'Netflix', keys: ['netflix'], domains: ['netflix.com'], sector: 'tech' },
  { name: 'Meta', keys: ['facebook', 'instagram', 'whatsapp', 'meta'], domains: ['facebook.com', 'instagram.com', 'whatsapp.com', 'meta.com', 'fb.com'], sector: 'social' },
  { name: 'LinkedIn', keys: ['linkedin'], domains: ['linkedin.com', 'lnkd.in'], sector: 'social' },
  { name: 'TikTok', keys: ['tiktok'], domains: ['tiktok.com'], sector: 'social' },
  { name: 'Snapchat', keys: ['snapchat'], domains: ['snapchat.com'], sector: 'social' },
  { name: 'X (Twitter)', keys: ['twitter'], domains: ['twitter.com', 'x.com', 't.co'], sector: 'social' },
  { name: 'Telegram', keys: ['telegram'], domains: ['telegram.org', 't.me'], sector: 'social' },
  { name: 'Chase', keys: ['chase'], domains: ['chase.com', 'jpmorgan.com'], sector: 'bank' },
  { name: 'Bank of America', keys: ['bank of america', 'bankofamerica', 'bofa'], domains: ['bankofamerica.com', 'bofa.com'], sector: 'bank' },
  { name: 'Wells Fargo', keys: ['wells fargo', 'wellsfargo'], domains: ['wellsfargo.com'], sector: 'bank' },
  { name: 'Citibank', keys: ['citibank', 'citi'], domains: ['citi.com', 'citibank.com'], sector: 'bank' },
  { name: 'Capital One', keys: ['capital one', 'capitalone'], domains: ['capitalone.com'], sector: 'bank' },
  { name: 'U.S. Bank', keys: ['us bank', 'usbank'], domains: ['usbank.com'], sector: 'bank' },
  { name: 'American Express', keys: ['american express', 'amex'], domains: ['americanexpress.com', 'aexp.com'], sector: 'bank' },
  { name: 'Discover', keys: ['discover card'], domains: ['discover.com'], sector: 'bank' },
  { name: 'Coinbase', keys: ['coinbase'], domains: ['coinbase.com'], sector: 'crypto' },
  { name: 'Binance', keys: ['binance'], domains: ['binance.com'], sector: 'crypto' },
  { name: 'MetaMask', keys: ['metamask'], domains: ['metamask.io'], sector: 'crypto' },
  { name: 'USPS', keys: ['usps', 'postal service'], domains: ['usps.com', 'usps.gov'], sector: 'shipping' },
  { name: 'UPS', keys: ['ups '], domains: ['ups.com'], sector: 'shipping' },
  { name: 'FedEx', keys: ['fedex'], domains: ['fedex.com'], sector: 'shipping' },
  { name: 'DHL', keys: ['dhl'], domains: ['dhl.com', 'dhl.de'], sector: 'shipping' },
  { name: 'Royal Mail', keys: ['royal mail', 'royalmail'], domains: ['royalmail.com'], sector: 'shipping' },
  { name: 'IRS', keys: ['irs', 'internal revenue'], domains: ['irs.gov'], sector: 'gov' },
  { name: 'Social Security Administration', keys: ['social security', 'ssa'], domains: ['ssa.gov'], sector: 'gov' },
  { name: 'Medicare', keys: ['medicare'], domains: ['medicare.gov'], sector: 'gov' },
  { name: 'DMV', keys: ['dmv', 'motor vehicles'], domains: ['dmv.ca.gov', 'dmv.org'], sector: 'gov' },
  { name: 'Walmart', keys: ['walmart'], domains: ['walmart.com'], sector: 'retail' },
  { name: 'Target', keys: ['target.com'], domains: ['target.com'], sector: 'retail' },
  { name: 'Costco', keys: ['costco'], domains: ['costco.com'], sector: 'retail' },
  { name: 'eBay', keys: ['ebay'], domains: ['ebay.com'], sector: 'retail' },
  { name: 'Best Buy', keys: ['best buy', 'bestbuy', 'geek squad', 'geeksquad'], domains: ['bestbuy.com'], sector: 'retail' },
  { name: 'Temu', keys: ['temu'], domains: ['temu.com'], sector: 'retail' },
  { name: 'Norton', keys: ['norton', 'nortonlifelock'], domains: ['norton.com', 'nortonlifelock.com'], sector: 'tech' },
  { name: 'McAfee', keys: ['mcafee'], domains: ['mcafee.com'], sector: 'tech' },
  { name: 'DocuSign', keys: ['docusign'], domains: ['docusign.com', 'docusign.net'], sector: 'tech' },
  { name: 'Dropbox', keys: ['dropbox'], domains: ['dropbox.com'], sector: 'tech' },
  { name: 'Adobe', keys: ['adobe'], domains: ['adobe.com'], sector: 'tech' },
  { name: 'Steam', keys: ['steam community', 'steamcommunity'], domains: ['steampowered.com', 'steamcommunity.com'], sector: 'tech' },
  { name: 'Roblox', keys: ['roblox'], domains: ['roblox.com'], sector: 'tech' },
  { name: 'Spotify', keys: ['spotify'], domains: ['spotify.com'], sector: 'tech' },
  { name: 'AT&T', keys: ['at&t', 'att.com'], domains: ['att.com'], sector: 'telecom' },
  { name: 'Verizon', keys: ['verizon'], domains: ['verizon.com'], sector: 'telecom' },
  { name: 'T-Mobile', keys: ['t-mobile', 'tmobile'], domains: ['t-mobile.com'], sector: 'telecom' },
  { name: 'Xfinity', keys: ['xfinity', 'comcast'], domains: ['xfinity.com', 'comcast.net'], sector: 'telecom' },
];

export const DOMAIN_TO_BRAND = new Map<string, Brand>();
for (const b of BRANDS) for (const d of b.domains) DOMAIN_TO_BRAND.set(d, b);

export const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly',
  'rebrand.ly', 'cutt.ly', 'shorturl.at', 'rb.gy', 'tiny.cc', 'bl.ink',
  's.id', 'linktr.ee', 'x.gd', 'v.gd', 'shrtco.de', 'short.gy', 'trib.al',
]);

export const HIGH_ABUSE_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'icu', 'cyou', 'sbs', 'cfd',
  'quest', 'monster', 'rest', 'buzz', 'click', 'link', 'work', 'loan', 'men',
  'racing', 'win', 'bid', 'stream', 'download', 'review', 'party', 'gdn',
  'zip', 'mov', 'lol', 'makeup', 'skin', 'hair', 'beauty', 'autos', 'boats',
]);

export const MULTI_SUFFIXES = new Set([
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'me.uk', 'net.uk', 'sch.uk',
  'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au', 'co.nz', 'net.nz',
  'org.nz', 'govt.nz', 'co.jp', 'or.jp', 'ne.jp', 'ac.jp', 'go.jp',
  'com.br', 'net.br', 'org.br', 'gov.br', 'com.mx', 'com.ar', 'com.co',
  'com.pe', 'com.ve', 'co.za', 'org.za', 'co.in', 'net.in', 'org.in',
  'gov.in', 'com.cn', 'net.cn', 'org.cn', 'gov.cn', 'com.tr', 'com.sg',
  'com.hk', 'com.tw', 'com.my', 'co.id', 'co.kr', 'com.ph', 'com.pk',
  'co.il', 'com.es', 'com.pl', 'com.ua', 'com.ru', 'ca.gov', 'ny.gov',
  'tx.gov', 'fl.gov',
]);
