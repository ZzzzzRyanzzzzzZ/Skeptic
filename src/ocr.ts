export interface OcrProgress {
  progress?: number;
  stage: 'loading' | 'recognising';
}

let workerPromise: Promise<import('tesseract.js').Worker> | null = null;

async function getWorker(onProgress: (p: OcrProgress) => void) {
  if (workerPromise) return workerPromise;

  workerPromise = (async () => {
    const { createWorker } = await import('tesseract.js');
    const base = `${import.meta.env.BASE_URL}ocr/`;
    return createWorker('eng', 1, {
      workerPath: `${base}worker.min.js`,
      corePath: base,
      langPath: base,
      gzip: true,
      logger: (m: { status: string; progress: number }) => {
        onProgress({
          stage: m.status === 'recognizing text' ? 'recognising' : 'loading',
          progress: Number.isFinite(m.progress) ? m.progress : undefined,
        });
      },
    });
  })();

  try {
    return await workerPromise;
  } catch (err) {
    workerPromise = null;
    throw err;
  }
}

export function tidyOcrText(raw: string): string {
  const lines = raw
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 0);

  const out: string[] = [];
  for (const line of lines) {
    const prev = out[out.length - 1];
    const continues =
      prev !== undefined &&
      !/[.!?:;]$/.test(prev) &&
      /^[a-z(]/.test(line) &&
      prev.length > 25;
    if (continues) out[out.length - 1] = `${prev} ${line}`;
    else out.push(line);
  }
  return out.join('\n');
}

export async function recogniseImage(
  image: Blob | File,
  onProgress: (p: OcrProgress) => void,
): Promise<string> {
  const worker = await getWorker(onProgress);
  onProgress({ stage: 'recognising', progress: 0 });
  const { data } = await worker.recognize(image);
  return tidyOcrText(data.text ?? '');
}

export async function releaseOcr() {
  const pending = workerPromise;
  workerPromise = null;
  try {
    (await pending)?.terminate();
  } catch {
  }
}
