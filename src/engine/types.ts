export type Band = 'safe' | 'caution' | 'likely-scam' | 'dangerous';

export interface Span {
  start: number;
  end: number;
}

export type EvidenceKind = 'model' | 'rule' | 'link' | 'structure' | 'header';
export type Severity = 'info' | 'low' | 'medium' | 'high';

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  severity: Severity;
  key: string;
  params?: Record<string, string | number>;
  points: number;
  spans?: Span[];
}

export interface TokenContribution {
  token: string;
  weight: number;
}

export type Family =
  | 'phishing'
  | 'impersonation-gov'
  | 'impersonation-bank'
  | 'delivery'
  | 'tech-support'
  | 'romance'
  | 'investment'
  | 'job-task'
  | 'prize'
  | 'family-emergency'
  | 'invoice-bec'
  | 'refund'
  | 'extortion'
  | 'charity'
  | 'unknown';

export interface LinkFinding {
  url: string;
  host: string;
  registrable: string;
  impersonates?: string;
  issues: Evidence[];
  risk: number;
}

export interface Analysis {
  text: string;
  score: number;
  rawPoints: number;
  band: Band;
  modelProbability: number;
  confidence: 'low' | 'medium' | 'high';
  family: Family;
  evidence: Evidence[];
  links: LinkFinding[];
  contributions: TokenContribution[];
  highlights: Span[];
}
