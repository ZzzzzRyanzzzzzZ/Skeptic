import { useI18n } from '../i18n';
import type { ModelMetrics } from '../engine/model';

const AXIS = 'var(--border-strong)';
const GRID = 'var(--border)';

const SERIES_1 = 'var(--hue-model)';
const SERIES_2 = 'var(--hue-tactic)';

export function ConfusionMatrix({ m }: { m: ModelMetrics }) {
  const { t } = useI18n();
  const [[tn, fp], [fn, tp]] = m.confusion;
  const max = Math.max(tn, fp, fn, tp, 1);
  const cell = (v: number, good: boolean) => (
    <td
      className="border p-3 text-center align-middle"
      style={{
        borderColor: 'var(--border)',
        background: good
          ? `color-mix(in srgb, var(--safe) ${(v / max) * 22}%, var(--surface))`
          : `color-mix(in srgb, var(--danger) ${(v / max) * 40}%, var(--surface))`,
      }}
    >
      <span className="text-lg font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
        {v}
      </span>
    </td>
  );

  return (
    <table className="w-full border-collapse text-sm">
      <caption className="sr-only">{t('model.confusion')}</caption>
      <thead>
        <tr>
          <th />
          <th
            colSpan={2}
            className="pb-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--text-dim)' }}
          >
            {t('model.predicted')}
          </th>
        </tr>
        <tr>
          <th />
          <th className="pb-2 text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
            {t('model.legit')}
          </th>
          <th className="pb-2 text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
            {t('model.scam')}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th
            scope="row"
            className="pr-2 text-right text-xs font-medium"
            style={{ color: 'var(--text-dim)' }}
          >
            {t('model.actual')} · {t('model.legit')}
          </th>
          {cell(tn, true)}
          {cell(fp, false)}
        </tr>
        <tr>
          <th
            scope="row"
            className="pr-2 text-right text-xs font-medium"
            style={{ color: 'var(--text-dim)' }}
          >
            {t('model.actual')} · {t('model.scam')}
          </th>
          {cell(fn, false)}
          {cell(tp, true)}
        </tr>
      </tbody>
    </table>
  );
}

export function CalibrationPlot({ m }: { m: ModelMetrics }) {
  const { t } = useI18n();
  const W = 320;
  const H = 240;
  const P = 36;
  const x = (v: number) => P + v * (W - P - 10);
  const y = (v: number) => H - P - v * (H - P - 12);
  const maxN = Math.max(...m.calibration.map((c) => c.n), 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={`${t('model.calibration')}. ${m.calibration
        .map((c) => `${Math.round(c.predicted * 100)}% predicted, ${Math.round(c.observed * 100)}% observed`)
        .join('; ')}`}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <g key={g}>
          <line x1={x(g)} y1={y(0)} x2={x(g)} y2={y(1)} stroke={GRID} strokeWidth="1" />
          <line x1={x(0)} y1={y(g)} x2={x(1)} y2={y(g)} stroke={GRID} strokeWidth="1" />
        </g>
      ))}
      <line
        x1={x(0)}
        y1={y(0)}
        x2={x(1)}
        y2={y(1)}
        stroke={AXIS}
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(0)} stroke={AXIS} strokeWidth="1.5" />
      <line x1={x(0)} y1={y(0)} x2={x(0)} y2={y(1)} stroke={AXIS} strokeWidth="1.5" />
      {m.calibration.map((c) => (
        <circle
          key={c.bin}
          cx={x(c.predicted)}
          cy={y(c.observed)}
          r={4 + (c.n / maxN) * 6}
          fill={SERIES_1}
          fillOpacity="0.8"
          stroke="var(--surface)"
          strokeWidth="1.5"
        />
      ))}
      <text x={x(0.5)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--text-dim)">
        {t('model.calibration.predicted')}
      </text>
      <text
        x={10}
        y={y(0.5)}
        textAnchor="middle"
        fontSize="10"
        fill="var(--text-dim)"
        transform={`rotate(-90 10 ${y(0.5)})`}
      >
        {t('model.calibration.observed')}
      </text>
      {[0, 0.5, 1].map((g) => (
        <text key={g} x={x(g)} y={H - P + 14} textAnchor="middle" fontSize="9" fill="var(--text-dim)">
          {g}
        </text>
      ))}
    </svg>
  );
}

export function SweepPlot({ m }: { m: ModelMetrics }) {
  const { t } = useI18n();
  const W = 320;
  const H = 240;
  const P = 36;
  const TOP = 30;
  const x = (v: number) => P + v * (W - P - 10);
  const y = (v: number) => H - P - v * (H - P - TOP);
  const path = (key: 'precision' | 'recall') =>
    m.sweep.map((s, i) => `${i === 0 ? 'M' : 'L'} ${x(s.threshold)} ${y(s[key])}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={`${t('model.sweep')}: precision and recall across decision thresholds.`}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={x(0)} y1={y(g)} x2={x(1)} y2={y(g)} stroke={GRID} strokeWidth="1" />
      ))}
      <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(0)} stroke={AXIS} strokeWidth="1.5" />
      <line x1={x(0)} y1={y(0)} x2={x(0)} y2={y(1)} stroke={AXIS} strokeWidth="1.5" />
      <path d={path('precision')} fill="none" stroke={SERIES_1} strokeWidth="2.5" />
      <path d={path('recall')} fill="none" stroke={SERIES_2} strokeWidth="2.5" strokeDasharray="6 4" />
      <line x1={x(0.5)} y1={y(0)} x2={x(0.5)} y2={y(1)} stroke="var(--text-dim)" strokeWidth="1" strokeDasharray="3 3" />
      <text x={x(0.5)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--text-dim)">
        threshold
      </text>
      <g fontSize="10">
        <line x1={x(0.08)} y1={12} x2={x(0.2)} y2={12} stroke={SERIES_1} strokeWidth="2.5" />
        <text x={x(0.23)} y={15} fill="var(--text-dim)">
          {t('model.precision')}
        </text>
        <line
          x1={x(0.55)}
          y1={12}
          x2={x(0.67)}
          y2={12}
          stroke={SERIES_2}
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />
        <text x={x(0.7)} y={15} fill="var(--text-dim)">
          {t('model.recall')}
        </text>
      </g>
      {[0, 0.5, 1].map((g) => (
        <text key={g} x={x(g)} y={H - P + 14} textAnchor="middle" fontSize="9" fill="var(--text-dim)">
          {g}
        </text>
      ))}
    </svg>
  );
}

export function FeatureBars({
  features,
  positive,
}: {
  features: { token: string; weight: number }[];
  positive: boolean;
}) {
  const max = Math.max(...features.map((f) => Math.abs(f.weight)), 0.0001);
  return (
    <ul className="flex flex-col gap-1.5">
      {features.map((f) => (
        <li key={f.token} className="flex items-center gap-3">
          <code className="w-32 shrink-0 truncate text-right text-xs" style={{ color: 'var(--text-dim)' }}>
            {f.token.replace(/_/g, ' ')}
          </code>
          <div className="flex flex-1 items-center gap-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.max(3, (Math.abs(f.weight) / max) * 100)}%`,
                background: positive ? 'var(--danger)' : 'var(--safe)',
              }}
            />
            <span className="text-[0.65rem] tabular-nums" style={{ color: 'var(--text-dim)' }}>
              {f.weight >= 0 ? '+' : ''}
              {f.weight.toFixed(2)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
