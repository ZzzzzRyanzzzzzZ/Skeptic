import { useMemo } from 'react';
import { MODEL } from '../engine';
import type { ModelMetrics } from '../engine/model';
import { useI18n } from '../i18n';
import { Card, H2, kindTokens, Muted, Stat } from '../components/ui';
import { CalibrationPlot, ConfusionMatrix, FeatureBars, SweepPlot } from '../components/Charts';
import { wilson } from '../engine/stats';
import externalEval from '../data/external-eval.json';

function totalOf(m: ModelMetrics) {
  const [[tn, fp], [fn, tp]] = m.confusion;
  return tn + fp + fn + tp;
}

function MetricRow({ label, m, emphasis }: { label: string; m: ModelMetrics; emphasis?: boolean }) {
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const n = totalOf(m);
  const ci = wilson(Math.round(m.accuracy * n), n);
  return (
    <tr
      style={
        emphasis
          ? { background: 'color-mix(in srgb, var(--hue-link) 12%, transparent)' }
          : undefined
      }
    >
      <th
        scope="row"
        className="py-2 pr-3 text-left text-sm font-medium"
        style={{ color: 'var(--text)' }}
      >
        {label}
      </th>
      <td className="py-2 pr-3 text-right text-sm tabular-nums" style={{ color: 'var(--text)' }}>
        {pct(m.accuracy)}
        <span className="ml-1 text-xs" style={{ color: 'var(--text-dim)' }}>
          {pct(ci.low)}–{pct(ci.high)}
        </span>
      </td>
      {[pct(m.precision), pct(m.recall), pct(m.f1), m.rocAuc.toFixed(3)].map((v, i) => (
        <td
          key={i}
          className="py-2 pr-3 text-right text-sm tabular-nums"
          style={{ color: 'var(--text)' }}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

export function Model() {
  const { t } = useI18n();

  const { topScam, topLegit } = useMemo(() => {
    const feats = MODEL.vocab.map((token, i) => ({ token, weight: MODEL.lrWeights[i] ?? 0 }));
    const sorted = feats.slice().sort((a, b) => b.weight - a.weight);
    return {
      topScam: sorted.slice(0, 12),
      topLegit: sorted.slice(-12).reverse(),
    };
  }, []);

  const pipeline = MODEL.metricsPipeline ?? MODEL.metrics;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <H2>{t('model.heading')}</H2>
        <Muted className="mt-1.5">{t('model.intro')}</Muted>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(
            [
              ['layer1', kindTokens.model],
              ['layer2', kindTokens.rule],
              ['layer3', kindTokens.link],
              ['layer4', kindTokens.header],
            ] as const
          ).map(([k, hue]) => (
            <div
              key={k}
              className="overflow-hidden rounded-lg border p-4"
              style={{
                borderColor: `color-mix(in srgb, ${hue} 35%, var(--border))`,
                background: `color-mix(in srgb, ${hue} 8%, var(--surface-2))`,
                borderTop: `3px solid ${hue}`,
              }}
            >
              <h3 className="text-sm font-semibold" style={{ color: hue }}>
                {t(`model.${k}.title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                {t(`model.${k}.body`)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <H2>{t('model.surfaces')}</H2>
        <Muted className="mt-1.5">{t('model.surfaces.body')}</Muted>
      </Card>

      <Card>
        <H2>{t('model.metrics')}</H2>
        <Muted className="mt-1.5">{t('model.metrics.intro', { n: totalOf(pipeline) })}</Muted>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th />
                {['model.accuracy', 'model.precision', 'model.recall', 'model.f1', 'model.auc'].map(
                  (k) => (
                    <th
                      key={k}
                      className="py-2 pr-3 text-right text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      {t(k)}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <MetricRow label={t('model.metrics.internal')} m={MODEL.metricsInternal} />
              <MetricRow label={t('model.metrics.holdout')} m={MODEL.metrics} />
              <MetricRow label={t('model.metrics.pipeline')} m={pipeline} emphasis />
            </tbody>
          </table>
        </div>
        <Muted className="mt-3">{t('model.interval', { n: totalOf(pipeline) })}</Muted>
      </Card>

      <Card>
        <H2>{t('model.ablation')}</H2>
        <Muted className="mt-1.5">{t('model.ablation.intro')}</Muted>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th
                  className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {t('model.ablation.config')}
                </th>
                {['model.accuracy', 'model.precision', 'model.recall', 'model.f1'].map((k) => (
                  <th
                    key={k}
                    className="py-2 pr-3 text-right text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {t(k)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(MODEL.ablation ?? []).map((a) => {
                const best = a.id === 'all';
                return (
                  <tr
                    key={a.id}
                    style={
                      best
                        ? { background: 'color-mix(in srgb, var(--hue-link) 12%, transparent)' }
                        : undefined
                    }
                  >
                    <th
                      scope="row"
                      className="py-2 pr-3 text-left text-sm font-medium"
                      style={{ color: 'var(--text)' }}
                    >
                      {t(`abl.${a.id}`)}
                    </th>
                    {[a.metrics.accuracy, a.metrics.precision, a.metrics.recall, a.metrics.f1].map(
                      (v, i) => (
                        <td
                          key={i}
                          className="py-2 pr-3 text-right text-sm tabular-nums"
                          style={{
                            color: 'var(--text)',
                            fontWeight: best ? 600 : undefined,
                          }}
                        >
                          {(v * 100).toFixed(1)}%
                        </td>
                      ),
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Muted className="mt-3">{t('model.ablation.note')}</Muted>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <H2>{t('model.confusion')}</H2>
          <Muted className="mt-1.5">{t('model.confusion.intro', { n: totalOf(pipeline) })}</Muted>
          <div className="mt-4">
            <ConfusionMatrix m={pipeline} />
          </div>
        </Card>

        <Card>
          <H2>{t('model.data')}</H2>
          <Muted className="mt-1.5">{t('model.data.intro')}</Muted>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Stat
              label={t('model.data.messages')}
              value={MODEL.train.total.toLocaleString()}
              hue={kindTokens.model}
            />
            <Stat
              label={t('model.data.vocab')}
              value={MODEL.train.vocabSize.toLocaleString()}
              hue={kindTokens.header}
            />
            <Stat
              label={t('model.data.scam')}
              value={MODEL.train.scam.toLocaleString()}
              hue="var(--danger)"
            />
            <Stat
              label={t('model.data.ham')}
              value={MODEL.train.ham.toLocaleString()}
              hue="var(--safe)"
            />
          </div>
        </Card>

        <Card>
          <H2>{t('model.calibration')}</H2>
          <Muted className="mt-1.5">{t('model.calibration.intro')}</Muted>
          <div className="mt-3">
            <CalibrationPlot m={MODEL.metrics} />
          </div>
        </Card>

        <Card>
          <H2>{t('model.sweep')}</H2>
          <Muted className="mt-1.5">{t('model.sweep.intro')}</Muted>
          <div className="mt-3">
            <SweepPlot m={pipeline} />
          </div>
        </Card>
      </div>

      <Card>
        <H2>{t('model.features')}</H2>
        <Muted className="mt-1.5">{t('model.features.intro')}</Muted>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3
              className="mb-2 text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'var(--danger)' }}
            >
              {t('model.features.scam')}
            </h3>
            <FeatureBars features={topScam} positive />
          </div>
          <div>
            <h3
              className="mb-2 text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'var(--safe)' }}
            >
              {t('model.features.legit')}
            </h3>
            <FeatureBars features={topLegit} positive={false} />
          </div>
        </div>
      </Card>

      <Card style={{ borderColor: 'var(--hue-link)' }}>
        <H2>{t('model.external')}</H2>
        <Muted className="mt-1.5">
          {t('model.external.intro', { n: externalEval.total.toLocaleString() })}
        </Muted>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            label={t('model.accuracy')}
            value={`${(externalEval.flagged.accuracy * 100).toFixed(1)}%`}
            hint={t('model.external.flagged')}
            hue={kindTokens.link}
          />
          <Stat
            label={t('model.external.falseAlarms')}
            value={`${(externalEval.flagged.falseAlarmRate * 100).toFixed(1)}%`}
            hue="var(--caution)"
          />
          <Stat
            label={t('model.precision')}
            value={`${(externalEval.flagged.precision * 100).toFixed(1)}%`}
            hue={kindTokens.model}
          />
          <Stat
            label={t('model.recall')}
            value={`${(externalEval.flagged.recall * 100).toFixed(1)}%`}
            hue={kindTokens.header}
          />
        </div>

        <h3 className="mt-5 text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {t('model.external.found')}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          {t('model.external.found.body')}
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          {t('model.external.cost')}
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          {t('model.external.residual', {
            rate: `${(externalEval.flagged.falseAlarmRate * 100).toFixed(1)}%`,
          })}
        </p>

        <h3 className="mt-5 text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {t('model.external.examples')}
        </h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {externalEval.examples.falseAlarms.map((e) => (
            <li key={e.text} className="flex items-start gap-2 text-sm">
              <span
                className="shrink-0 rounded px-1.5 py-0.5 text-xs font-bold tabular-nums"
                style={{ background: 'var(--caution-bg)', color: 'var(--caution)' }}
              >
                {e.score}
              </span>
              <span style={{ color: 'var(--text-dim)' }}>{e.text}</span>
            </li>
          ))}
        </ul>

        <Muted className="mt-4">{t('model.external.caveat')}</Muted>
      </Card>

      <Card style={{ borderColor: 'var(--caution)' }}>
        <H2>{t('model.limits')}</H2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {t('model.limits.body')}
        </p>
      </Card>
    </div>
  );
}
