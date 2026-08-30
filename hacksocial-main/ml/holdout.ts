import type { Sample } from './corpus.ts';
import { MESSAGES } from '../src/data/messages.ts';

export const HOLDOUT: Sample[] = MESSAGES.map((m) => ({
  text: m.text,
  label: m.label,
  category: m.category,
}));
