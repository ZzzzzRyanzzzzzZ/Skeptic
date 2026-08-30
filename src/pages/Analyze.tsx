import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { analyzeMessage, bandFor, SENSITIVITY_OFFSET } from '../engine';
import type { Analysis } from '../engine/types';
import { useI18n } from '../i18n';
import { SAMPLES } from '../data/samples';
import { bandTokens, Button, Card, H2, kindTokens, Muted, Pill } from '../components/ui';
import { RiskGauge } from '../components/RiskGauge';
import { EvidenceList } from '../components/EvidenceList';
import { HighlightedMessage } from '../components/HighlightedMessage';
import { LinkCard } from '../components/LinkCard';
import { VerdictActions } from '../components/VerdictActions';
import { History, useHistory } from '../components/History';
import { ImageInput } from '../components/ImageInput';
import { takeMessageFromUrl } from '../deeplink';

function Contributions({ analysis }: { analysis: Analysis }) {
  const { t } = useI18n();
  const items = analysis.contributions.filter((c) => Math.abs(c.weight) > 0.001).slice(0, 10);
  if (items.length === 0) return null;
  const max = Math.max(...items.map((c) => Math.abs(c.weight)));

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((c) => {
        const pct = (Math.abs(c.weight) / max) * 100;
        const toward = c.weight > 0;
        return (
          <div key={c.token} className="flex items-center gap-3">
            <code
              className="w-36 shrink-0 truncate text-right text-xs"
              style={{ color: 'var(--text-dim)' }}
              title={c.token.replace(/_/g, ' ')}
            >
              {c.token.replace(/_/g, ' ')}
            </code>
            <div className="flex h-3 flex-1 items-center">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.max(2, pct)}%`,
                  background: toward ? 'var(--danger)' : 'var(--safe)',
                }}
                role="img"
                aria-label={`${c.token.replace(/_/g, ' ')}: ${
                  toward ? t('analyze.model.toward') : t('analyze.model.away')
                }`}
              />
            </div>
          </div>
        );
      })}
      <div className="mt-1 flex gap-4 text-xs" style={{ color: 'var(--text-dim)' }}>
        <span>
          <span aria-hidden="true" style={{ color: 'var(--danger)' }}>
            ▬
          </span>{' '}
          {t('analyze.model.toward')}
        </span>
        <span>
          <span aria-hidden="true" style={{ color: 'var(--safe)' }}>
            ▬
          </span>{' '}
          {t('analyze.model.away')}
        </span>
      </div>
    </div>
  );
}

export function Analyze() {
  const { t, locale, lang, sensitivity } = useI18n();
  const [text, setText] = useState(() => takeMessageFromUrl() ?? '');
  const [copied, setCopied] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const history = useHistory();

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(Math.max(el.scrollHeight + 2, 190), 520)}px`;
  }, [text]);

  const deferred = useDeferredValue(text);
  const analysis = useMemo(() => analyzeMessage(deferred), [deferred]);
  const hasText = deferred.trim().length > 0;

  const band = bandFor(analysis.score, SENSITIVITY_OFFSET[sensitivity]);

  const { record } = history;
  useEffect(() => {
    if (deferred.trim().length < 25) return;
    const id = setTimeout(() => record(deferred, analysis.score, band), 1200);
    return () => clearTimeout(id);
  }, [deferred, analysis.score, band, record]);

  const copyReport = async () => {
    const lines = [
      `${t('app.name')} — ${t('analyze.scoreLabel')}: ${analysis.score}/100 (${t(`band.${band}`)})`,
      analysis.family !== 'unknown'
        ? t('analyze.family', { family: locale.families[analysis.family].name })
        : '',
      '',
      ...analysis.evidence.map(
        (e) => `${e.points > 0 ? '+' : ''}${e.points}  ${t(`${e.key}.title`, e.params)}`,
      ),
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      <div className="flex flex-col gap-4 lg:sticky lg:top-28">
        <Card className="print:hidden">
          <H2 id="analyze-heading">{t('analyze.heading')}</H2>
          <Muted className="mt-1.5">{t('analyze.intro')}</Muted>

          <label htmlFor="message-input" className="sr-only">
            {t('analyze.heading')}
          </label>
          <textarea
            id="message-input"
            ref={areaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={9}
            placeholder={t('analyze.placeholder')}
            className="mt-4 w-full resize-y rounded-lg border p-3 text-[0.95rem] leading-relaxed"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text)',
            }}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button onClick={() => setText('')} disabled={!text}>
              {t('analyze.clear')}
            </Button>
            {hasText && (
              <Button onClick={copyReport} variant="ghost">
                {copied ? t('analyze.copied') : t('analyze.copy')}
              </Button>
            )}
            <span className="ml-auto text-xs" style={{ color: 'var(--text-dim)' }}>
              🔒 {t('app.offline')}
            </span>
          </div>
        </Card>

        <Card className="print:hidden">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {t('ocr.title')}
          </h3>
          <div className="mt-3">
            <ImageInput
              onText={(read) => {
                setText(read);
                areaRef.current?.focus();
              }}
            />
          </div>
        </Card>

        <Card className="print:hidden">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {t('analyze.samples')}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <Button
                key={s.label}
                variant="ghost"
                onClick={() => {
                  setText(s.text);
                  areaRef.current?.focus();
                }}
              >
                {lang === 'es' ? s.labelEs : s.label}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="print:hidden">
          <H2>{t('history.title')}</H2>
          <div className="mt-3">
            <History entries={history.entries} onClear={history.clear} />
          </div>
        </Card>

        {hasText && (
          <Card>
            <H2>{t('analyze.message')}</H2>
            <div className="mt-3">
              <HighlightedMessage text={analysis.text} spans={analysis.highlights} />
            </div>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {!hasText ? (
          <Card>
            <H2>{t('analyze.empty.title')}</H2>
            <Muted className="mt-1.5">{t('analyze.empty.body')}</Muted>
            <ol className="mt-5 flex flex-col gap-4">
              {(['step1', 'step2', 'step3'] as const).map((step, i) => {
                const hue = [kindTokens.model, kindTokens.rule, kindTokens.link][i]!;
                return (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: hue }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: hue }}>
                      {t(`intro.${step}.title`)}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                      {t(`intro.${step}.body`)}
                    </p>
                  </div>
                </li>
                );
              })}
            </ol>
            <p
              className="mt-5 rounded-lg border p-3 text-sm leading-relaxed"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface-2)',
                color: 'var(--text-dim)',
              }}
            >
              <span aria-hidden="true">&#128274; </span>
              {t('intro.privacy')}
            </p>
          </Card>
        ) : (
          <>
            <div aria-live="polite" aria-atomic="true">
              <RiskGauge analysis={analysis} band={band} />
            </div>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <H2>{t('analyze.actions')}</H2>
                {analysis.family !== 'unknown' && (
                  <Pill>{locale.families[analysis.family].name}</Pill>
                )}
              </div>
              <ol className="mt-3 flex list-none flex-col gap-2">
                {locale.advice[analysis.family].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: `color-mix(in srgb, ${bandTokens[band].fg} 18%, transparent)`,
                        color: bandTokens[band].fg,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: 'var(--text)' }}>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="print:break-inside-avoid">
              <H2>{t('analyze.share')}</H2>
              <div className="mt-3">
                <VerdictActions analysis={analysis} band={band} />
              </div>
            </Card>

            <Card>
              <H2>{t('analyze.evidence')}</H2>
              <Muted className="mt-1.5">
                {t('analyze.breakdown.note', { raw: analysis.rawPoints })}
              </Muted>
              <div className="mt-3">
                <EvidenceList
                  evidence={analysis.evidence}
                  rawPoints={analysis.rawPoints}
                  score={analysis.score}
                />
              </div>
            </Card>

            <Card>
              <H2>{t('analyze.links')}</H2>
              <div className="mt-3 flex flex-col gap-2">
                {analysis.links.length === 0 ? (
                  <Muted>{t('analyze.links.none')}</Muted>
                ) : (
                  analysis.links.map((l, i) => <LinkCard key={`${l.url}-${i}`} link={l} />)
                )}
              </div>
            </Card>

            <Card>
              <H2>{t('analyze.model')}</H2>
              <Muted className="mt-1.5">{t('analyze.model.intro')}</Muted>
              <div className="mt-3">
                <Contributions analysis={analysis} />
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
