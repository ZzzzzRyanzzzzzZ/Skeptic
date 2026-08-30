import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { recogniseImage, releaseOcr, type OcrProgress } from '../ocr';
import { Button, Muted } from './ui';

type State =
  | { kind: 'idle' }
  | { kind: 'busy'; progress: OcrProgress }
  | { kind: 'error'; message: string }
  | { kind: 'done' };

export function ImageInput({ onText }: { onText: (text: string) => void }) {
  const { t } = useI18n();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(
    async (file: Blob) => {
      setState({ kind: 'busy', progress: { stage: 'loading' } });
      try {
        const text = await recogniseImage(file, (progress) =>
          setState({ kind: 'busy', progress }),
        );
        if (!text.trim()) {
          setState({ kind: 'error', message: t('ocr.empty') });
          return;
        }
        onText(text);
        setState({ kind: 'done' });
      } catch {
        setState({ kind: 'error', message: t('ocr.failed') });
      }
    },
    [onText, t],
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith('image/'));
      const file = item?.getAsFile();
      if (file) {
        e.preventDefault();
        void run(file);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [run]);

  useEffect(() => () => void releaseOcr(), []);

  const busy = state.kind === 'busy';
  const pct =
    busy && state.progress.progress !== undefined
      ? Math.round(state.progress.progress * 100)
      : undefined;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = [...e.dataTransfer.files].find((f) => f.type.startsWith('image/'));
        if (file) void run(file);
      }}
      className="rounded-lg border-2 border-dashed p-4 text-center transition-colors"
      style={{
        borderColor: dragging ? 'var(--accent)' : 'var(--border-strong)',
        background: dragging ? 'var(--accent-soft)' : 'transparent',
      }}
    >
      <p className="text-sm" style={{ color: 'var(--text)' }}>
        {dragging ? t('ocr.drop') : t('ocr.hint')}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void run(file);
          e.target.value = '';
        }}
      />

      <div className="mt-3 flex flex-col items-center gap-2">
        <Button onClick={() => inputRef.current?.click()} disabled={busy}>
          {t('ocr.choose')}
        </Button>

        {busy && (
          <div className="w-full max-w-xs" aria-live="polite">
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {t(state.progress.stage === 'recognising' ? 'ocr.recognising' : 'ocr.loading')}
              {pct !== undefined ? ` ${pct}%` : ''}
            </p>
            <div
              className="mt-1 h-1.5 w-full overflow-hidden rounded-full"
              style={{ background: 'var(--surface-2)' }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${pct ?? 15}%`, background: 'var(--accent)' }}
              />
            </div>
          </div>
        )}

        {state.kind === 'error' && (
          <p className="text-sm" style={{ color: 'var(--danger)' }} role="alert">
            {state.message}
          </p>
        )}
        {state.kind === 'done' && <Muted>{t('ocr.done')}</Muted>}
      </div>
    </div>
  );
}
