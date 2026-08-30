import { useI18n } from '../i18n';
import { kindTokens, Pill, severityTokens } from './ui';
import type { Evidence } from '../engine/types';
import { compress } from '../engine/analyze';

const KIND_LABEL: Record<Evidence['kind'], string> = {
  model: 'model',
  rule: 'tactic',
  link: 'link',
  structure: 'format',
  header: 'headers',
};

export function EvidenceList({
  evidence,
  rawPoints,
  score,
}: {
  evidence: Evidence[];
  rawPoints?: number;
  score?: number;
}) {
  const { t } = useI18n();
  if (evidence.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
        {t('analyze.evidence.none')}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {evidence.map((e) => {
        const tone = severityTokens[e.severity];
        const hue = kindTokens[e.kind];
        const positive = e.points > 0;
        return (
          <li
            key={e.id}
            className="overflow-hidden rounded-lg border p-3"
            style={{
              borderColor: positive ? `${tone.fg}44` : 'var(--border)',
              borderLeft: `4px solid ${hue}`,
              background: positive
                ? tone.bg
                : `color-mix(in srgb, ${hue} 6%, var(--surface-2))`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-baseline gap-2">
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider"
                  style={{ background: `color-mix(in srgb, ${hue} 16%, transparent)`, color: hue }}
                >
                  {KIND_LABEL[e.kind]}
                </span>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {t(`${e.key}.title`, e.params)}
                </h4>
              </div>
              <Pill fg={positive ? tone.fg : 'var(--safe)'} bg="transparent">
                {positive ? '+' : ''}
                {e.points}
              </Pill>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              {t(`${e.key}.detail`, e.params)}
            </p>
            {rawPoints !== undefined && score !== undefined && positive && (
              <p className="mt-1.5 text-xs tabular-nums" style={{ color: 'var(--text-dim)' }}>
                {t('analyze.without', { score: compress(rawPoints - e.points) })}
                <span aria-hidden="true"> · −{score - compress(rawPoints - e.points)}</span>
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
