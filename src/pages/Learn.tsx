import { useI18n } from '../i18n';
import { Card, H2, Muted } from '../components/ui';
import type { Family } from '../engine/types';

const ORDER: Family[] = [
  'phishing',
  'impersonation-bank',
  'impersonation-gov',
  'delivery',
  'tech-support',
  'family-emergency',
  'invoice-bec',
  'romance',
  'investment',
  'job-task',
  'prize',
  'refund',
  'extortion',
  'charity',
];

const FAMILY_HUES = [
  'var(--hue-model)',
  'var(--hue-tactic)',
  'var(--hue-link)',
  'var(--hue-header)',
  'var(--hue-format)',
];

export function Learn() {
  const { t, locale } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <H2>{t('learn.heading')}</H2>
        <Muted className="mt-1.5">{t('learn.intro')}</Muted>
      </Card>

      <Card style={{ borderColor: 'var(--accent)' }}>
        <H2>{t('learn.rules.title')}</H2>
        <ol className="mt-3 flex flex-col gap-3">
          {(['1', '2', '3'] as const).map((n) => (
            <li key={n} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {n}
              </span>
              <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--text)' }}>
                {t(`learn.rules.${n}`)}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {ORDER.map((f, i) => {
          const fam = locale.families[f];
          const hue = FAMILY_HUES[i % FAMILY_HUES.length];
          return (
            <Card
              key={f}
              as="article"
              style={{ borderTop: `3px solid ${hue}` }}
            >
              <h3 className="text-base font-semibold" style={{ color: hue }}>
                {fam.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                {fam.summary}
              </p>

              <h4
                className="mt-4 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--danger)' }}
              >
                {t('learn.flags')}
              </h4>
              <ul className="mt-1.5 flex flex-col gap-1">
                {fam.flags.map((flag) => (
                  <li key={flag} className="text-sm leading-snug" style={{ color: 'var(--text)' }}>
                    <span aria-hidden="true" style={{ color: 'var(--danger)' }}>
                      ▲{' '}
                    </span>
                    {flag}
                  </li>
                ))}
              </ul>

              <h4
                className="mt-4 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--safe)' }}
              >
                {t('learn.actions')}
              </h4>
              <ul className="mt-1.5 flex flex-col gap-1">
                {locale.advice[f].map((step) => (
                  <li key={step} className="text-sm leading-snug" style={{ color: 'var(--text)' }}>
                    <span aria-hidden="true" style={{ color: 'var(--safe)' }}>
                      ✓{' '}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card style={{ borderColor: 'var(--safe)' }}>
        <H2>{t('learn.report.title')}</H2>
        <ul className="mt-3 flex flex-col gap-2">
          {(['us', 'uk', 'eu'] as const).map((r) => (
            <li key={r} className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              {t(`learn.report.${r}`)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
          {t('learn.report.bank')}
        </p>
      </Card>
    </div>
  );
}
