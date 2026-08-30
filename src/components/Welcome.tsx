import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

const KEY = 'skeptic.welcomed.v1';

export function useWelcome() {
  const [show, setShow] = useState(() => {
    try {
      return localStorage.getItem(KEY) !== 'yes';
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, 'yes');
    } catch {
      void 0;
    }
    setShow(false);
  };

  return { show, dismiss };
}

export function Welcome({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') start();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const start = () => {
    setLeaving(true);
    setTimeout(onStart, 260);
  };

  const points = [
    { hue: 'var(--hue-model)', k: 'welcome.p1' },
    { hue: 'var(--hue-tactic)', k: 'welcome.p2' },
    { hue: 'var(--hue-link)', k: 'welcome.p3' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('welcome.title')}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{
        background: 'var(--bg)',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 260ms ease',
      }}
    >
      <div
        className="w-full max-w-lg text-center"
        style={{ animation: 'rise 460ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        <svg
          aria-hidden="true"
          width="72"
          height="72"
          viewBox="0 0 512 512"
          className="mx-auto"
          style={{ animation: 'pop 620ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
        >
          <path
            d="M256 72 108 132v128c0 96 62 166 148 180 86-14 148-84 148-180V132L256 72Z"
            fill="none"
            stroke="var(--hue-model)"
            strokeWidth="28"
            strokeLinejoin="round"
          />
          <circle cx="238" cy="238" r="58" fill="none" stroke="var(--hue-model)" strokeWidth="26" />
          <line
            x1="280"
            y1="280"
            x2="330"
            y2="330"
            stroke="var(--hue-model)"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </svg>

        <h1
          className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: 'var(--text)' }}
        >
          {t('welcome.title')}
        </h1>
        <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          {t('welcome.sub')}
        </p>

        <ul className="mx-auto mt-7 flex max-w-sm flex-col gap-3 text-left">
          {points.map((p, i) => (
            <li
              key={p.k}
              className="flex items-start gap-3 text-sm leading-relaxed"
              style={{
                color: 'var(--text)',
                animation: `rise 460ms cubic-bezier(0.22,1,0.36,1) both`,
                animationDelay: `${160 + i * 90}ms`,
              }}
            >
              <span
                aria-hidden="true"
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: p.hue }}
              />
              {t(p.k)}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={start}
          autoFocus
          className="mt-8 rounded-xl px-7 py-3 text-base font-semibold"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            animation: 'rise 460ms cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '440ms',
          }}
        >
          {t('welcome.start')}
        </button>

        <p
          className="mt-5 text-xs"
          style={{
            color: 'var(--text-dim)',
            animation: 'fade 600ms ease both',
            animationDelay: '620ms',
          }}
        >
          {t('welcome.note')}
        </p>
      </div>
    </div>
  );
}
