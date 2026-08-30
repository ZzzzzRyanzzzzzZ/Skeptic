import { useMemo } from 'react';
import type { Span } from '../engine/types';

export function HighlightedMessage({ text, spans }: { text: string; spans: Span[] }) {
  const parts = useMemo(() => {
    const out: { text: string; mark: boolean }[] = [];
    let cursor = 0;
    for (const s of spans) {
      const start = Math.max(cursor, Math.min(s.start, text.length));
      const end = Math.max(start, Math.min(s.end, text.length));
      if (start > cursor) out.push({ text: text.slice(cursor, start), mark: false });
      if (end > start) out.push({ text: text.slice(start, end), mark: true });
      cursor = Math.max(cursor, end);
    }
    if (cursor < text.length) out.push({ text: text.slice(cursor), mark: false });
    return out;
  }, [text, spans]);

  return (
    <p
      className="text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words"
      style={{ color: 'var(--text)' }}
    >
      {parts.map((p, i) =>
        p.mark ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>,
      )}
    </p>
  );
}
