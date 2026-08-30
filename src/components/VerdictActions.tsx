import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { Button } from './ui';
import type { Analysis, Band } from '../engine/types';

export function buildWarning(
  analysis: Analysis,
  band: Band,
  t: (k: string, p?: Record<string, string | number>) => string,
  advice: string[],
): string {
  const reasons = analysis.evidence
    .filter((e) => e.points > 0 && e.kind !== 'model')
    .slice(0, 4)
    .map((e) => `• ${t(`${e.key}.title`, e.params)}`);

  return [
    t(`share.header.${band}`),
    '',
    reasons.length ? t('share.why') : '',
    ...reasons,
    '',
    t('share.do'),
    ...advice.slice(0, 3).map((a) => `• ${a}`),
    '',
    t('share.footer'),
  ]
    .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
    .join('\n')
    .trim();
}

export function VerdictActions({ analysis, band }: { analysis: Analysis; band: Band }) {
  const { t, locale, lang } = useI18n();
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const warning = buildWarning(analysis, band, t, locale.advice[analysis.family]);

  useEffect(() => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    return () => window.speechSynthesis.cancel();
  }, [analysis.text, canSpeak]);

  const speak = () => {
    if (!canSpeak) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(
      `${t(`band.${band}`)}. ${t(`band.${band}.body`)} ${warning}`,
    );
    utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const copyWarning = async () => {
    try {
      await navigator.clipboard.writeText(warning);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 print:hidden">
        {canSpeak && (
          <Button onClick={speak} ariaPressed={speaking}>
            <span aria-hidden="true">{speaking ? '■' : '▶'}</span>{' '}
            {speaking ? t('analyze.stop') : t('analyze.speak')}
          </Button>
        )}
        <Button onClick={() => window.print()}>
          <span aria-hidden="true">⎙</span> {t('analyze.print')}
        </Button>
        <Button onClick={copyWarning} variant="primary">
          {copied ? t('analyze.share.copied') : t('analyze.share.copy')}
        </Button>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
        {t('analyze.share.intro')}
      </p>
      <pre
        className="max-h-56 overflow-auto rounded-lg border p-3 text-xs leading-relaxed whitespace-pre-wrap"
        style={{
          background: 'var(--surface-2)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
          fontFamily: 'inherit',
        }}
      >
        {warning}
      </pre>
    </div>
  );
}
