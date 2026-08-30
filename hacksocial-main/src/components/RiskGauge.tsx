import { useI18n } from '../i18n';
import { bandTokens } from './ui';
import type { Analysis, Band } from '../engine/types';

export function RiskGauge({ analysis, band }: { analysis: Analysis; band: Band }) {
  const { t, locale } = useI18n();
  const { score } = analysis;
  const tone = bandTokens[band];

  const R = 68;
  const CX = 88;
  const CY = 82;
  const circumference = Math.PI * R;
  const filled = (score / 100) * circumference;

  return (
    <div
      data-card
      className="rounded-xl border p-5 sm:p-6"
      style={{ background: tone.bg, borderColor: `${tone.fg}55`, boxShadow: 'var(--shadow)' }}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <svg
          width="176"
          height="102"
          viewBox="0 0 176 102"
          role="img"
          aria-label={`${t('analyze.scoreLabel')}: ${score} ${t('common.of')} 100. ${t(`band.${band}`)}`}
          className="shrink-0"
        >
          <defs>
            <linearGradient id="riskTrack" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--safe)" />
              <stop offset="30%" stopColor="var(--caution)" />
              <stop offset="62%" stopColor="var(--likely)" />
              <stop offset="100%" stopColor="var(--danger)" />
            </linearGradient>
          </defs>

          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="url(#riskTrack)"
            strokeWidth="13"
            strokeLinecap="round"
            opacity="0.22"
          />

          {[25, 50, 75].map((mark) => {
            const angle = Math.PI * (1 - mark / 100);
            const inner = R - 9;
            const outer = R + 9;
            return (
              <line
                key={mark}
                x1={CX + Math.cos(angle) * inner}
                y1={CY - Math.sin(angle) * inner}
                x2={CX + Math.cos(angle) * outer}
                y2={CY - Math.sin(angle) * outer}
                stroke="var(--border-strong)"
                strokeWidth="1.5"
                opacity="0.6"
              />
            );
          })}

          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke={tone.fg}
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            style={{ transition: 'stroke-dasharray 350ms ease-out' }}
          />

          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fontSize="36"
            fontWeight="800"
            fill={tone.fg}
            className="tabular-nums"
          >
            {score}
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontSize="10" fill="var(--text-dim)">
            / 100
          </text>
        </svg>

        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xl font-bold leading-tight" style={{ color: tone.fg }}>
            {t(`band.${band}`)}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            {t(`band.${band}.body`)}
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-dim)' }}>
            {analysis.family !== 'unknown' &&
              `${t('analyze.family', { family: locale.families[analysis.family].name })} · `}
            {t(`analyze.confidence.${analysis.confidence}`)}
          </p>
        </div>
      </div>
    </div>
  );
}
