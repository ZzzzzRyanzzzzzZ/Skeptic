import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { Button, Pill, bandTokens } from './ui';
import type { Band } from '../engine/types';

export interface HistoryEntry {
  preview: string;
  score: number;
  band: Band;
  at: number;
}

const KEY = 'skeptic.history.v1';
const LIMIT = 12;

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]).slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

function save(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, LIMIT)));
  } catch {
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(load);

  const record = useCallback((preview: string, score: number, band: Band) => {
    const line = preview.split('\n').find((l) => l.trim().length > 0)?.trim() ?? '';
    const clipped = line.slice(0, 80);
    if (!clipped) return;
    setEntries((prev) => {
      const next = [
        { preview: clipped, score, band, at: Date.now() },
        ...prev.filter((e) => e.preview !== clipped),
      ].slice(0, LIMIT);
      save(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
    save([]);
  }, []);

  return { entries, record, clear };
}

export function History({
  entries,
  onClear,
}: {
  entries: HistoryEntry[];
  onClear: () => void;
}) {
  const { t, lang } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const ago = (at: number) => {
    const mins = Math.round((now - at) / 60000);
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    if (mins < 60) return rtf.format(-mins, 'minute');
    if (mins < 1440) return rtf.format(-Math.round(mins / 60), 'hour');
    return rtf.format(-Math.round(mins / 1440), 'day');
  };

  return (
    <div>
      {entries.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {t('history.empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {entries.map((e) => (
            <li key={`${e.at}`} className="flex items-center gap-2">
              <Pill fg={bandTokens[e.band].fg} bg={bandTokens[e.band].bg}>
                {e.score}
              </Pill>
              <span className="min-w-0 flex-1 truncate text-sm" style={{ color: 'var(--text)' }}>
                {e.preview}
              </span>
              <time
                className="shrink-0 text-xs tabular-nums"
                style={{ color: 'var(--text-dim)' }}
                dateTime={new Date(e.at).toISOString()}
              >
                {ago(e.at)}
              </time>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {t('history.note')}
        </p>
        {entries.length > 0 && (
          <Button variant="quiet" onClick={onClear}>
            {t('history.clear')}
          </Button>
        )}
      </div>
    </div>
  );
}
