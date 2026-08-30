import modelJson from '../data/model.json';
import type { ModelFile } from './model';
import { analyze as analyzeWith } from './analyze';
import type { Analysis } from './types';

export const MODEL = modelJson as unknown as ModelFile;

export function analyzeMessage(text: string): Analysis {
  return analyzeWith(MODEL, text);
}

export * from './types';
export { compress, bandFor, SENSITIVITY_OFFSET, type Sensitivity } from './analyze';
