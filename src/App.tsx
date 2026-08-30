import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useI18n, LOCALES, type TextSize, type Theme } from './i18n';
import { Analyze } from './pages/Analyze';

const Practice = lazy(() => import('./pages/Practice').then((m) => ({ default: m.Practice })));
const Model = lazy(() => import('./pages/Model').then((m) => ({ default: m.Model })));
const Learn = lazy(() => import('./pages/Learn').then((m) => ({ default: m.Learn })));
import { Button } from './components/ui';
import type { Sensitivity } from './engine';

type Tab = 'analyze' | 'practice' | 'model' | 'learn';
const TABS: Tab[] = ['analyze', 'practice', 'model', 'learn'];

const TAB_HUE: Record<Tab, string> = {
  analyze: 'var(--hue-model)',
  practice: 'var(--hue-tactic)',
  model: 'var(--hue-link)',
  learn: 'var(--hue-header)',
};

const REPO = 'https://github.com/ZzzzzRyanzzzzzZ/hacksocial';

function Settings({ onClose }: { onClose: () => void }) {
  const { t, lang, textSize, contrast, theme, sensitivity, set } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        if (!(target instanceof Element && target.closest('[data-settings-toggle]'))) onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [onClose]);

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
        {label}
      </span>
      <div className="flex gap-1">{children}</div>
    </div>
  );

  const Choice = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-md px-2.5 py-1 text-xs font-semibold"
      style={{
        background: active ? 'var(--accent)' : 'var(--surface-2)',
        color: active ? '#fff' : 'var(--text-dim)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-20 mt-2 w-80 rounded-xl border p-4"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-strong)',
        boxShadow: 'var(--shadow)',
      }}
      role="dialog"
      aria-label={t('settings.title')}
    >
      <Row label={t('settings.language')}>
        {Object.values(LOCALES).map((l) => (
          <Choice key={l.code} active={lang === l.code} onClick={() => set({ lang: l.code })}>
            {l.name}
          </Choice>
        ))}
      </Row>
      <Row label={t('settings.textSize')}>
        {(['normal', 'large', 'huge'] as TextSize[]).map((s, i) => (
          <Choice key={s} active={textSize === s} onClick={() => set({ textSize: s })}>
            <span style={{ fontSize: `${0.7 + i * 0.15}rem` }}>A</span>
          </Choice>
        ))}
      </Row>
      <Row label={t('settings.theme')}>
        {(['system', 'light', 'dark'] as Theme[]).map((th) => (
          <Choice key={th} active={theme === th} onClick={() => set({ theme: th })}>
            {th === 'system' ? '◐' : th === 'light' ? '☀' : '☾'}
          </Choice>
        ))}
      </Row>
      <Row label={t('settings.sensitivity')}>
        {(['cautious', 'balanced', 'strict'] as Sensitivity[]).map((sv) => (
          <Choice key={sv} active={sensitivity === sv} onClick={() => set({ sensitivity: sv })}>
            {t(`settings.sensitivity.${sv}`)}
          </Choice>
        ))}
      </Row>
      <p className="pb-1 text-xs leading-snug" style={{ color: 'var(--text-dim)' }}>
        {t('settings.sensitivity.hint')}
      </p>
      <Row label={t('settings.contrast')}>
        <Choice active={contrast} onClick={() => set({ contrast: !contrast })}>
          {contrast ? 'On' : 'Off'}
        </Choice>
      </Row>
      <div className="mt-2 flex justify-end">
        <Button variant="quiet" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>
    </div>
  );
}

export function App() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('analyze');
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header
        className="sticky top-0 z-10 backdrop-blur"
        style={{
          background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
          borderBottom: '2px solid transparent',
          borderImage:
            'linear-gradient(90deg, var(--hue-model), var(--hue-tactic), var(--hue-link), var(--hue-header)) 1',
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <svg
              aria-hidden="true"
              width="34"
              height="34"
              viewBox="0 0 512 512"
              className="shrink-0"
            >
              <path
                d="M256 72 108 132v128c0 96 62 166 148 180 86-14 148-84 148-180V132L256 72Z"
                fill="none"
                stroke="var(--hue-model)"
                strokeWidth="30"
                strokeLinejoin="round"
              />
              <circle cx="238" cy="238" r="58" fill="none" stroke="var(--hue-model)" strokeWidth="28" />
              <line
                x1="280"
                y1="280"
                x2="330"
                y2="330"
                stroke="var(--hue-model)"
                strokeWidth="30"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight" style={{ color: 'var(--text)' }}>
                {t('app.name')}
              </h1>
              <p className="text-xs leading-tight" style={{ color: 'var(--text-dim)' }}>
                {t('app.tagline')}
              </p>
            </div>
          </div>

          <div className="relative ml-auto">
            <span data-settings-toggle>
              <Button onClick={() => setSettingsOpen((v) => !v)} ariaPressed={settingsOpen}>
                <span aria-hidden="true">⚙</span> {t('settings.title')}
              </Button>
            </span>
            {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
          </div>

          <nav
            aria-label="Sections"
            className="order-last flex w-full flex-wrap gap-1 sm:order-none sm:w-auto sm:basis-full"
          >
            {TABS.map((tb) => {
              const active = tab === tb;
              return (
                <button
                  key={tb}
                  type="button"
                  onClick={() => setTab(tb)}
                  aria-current={active ? 'page' : undefined}
                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    background: active
                      ? `color-mix(in srgb, ${TAB_HUE[tb]} 14%, transparent)`
                      : 'transparent',
                    color: active ? TAB_HUE[tb] : 'var(--text-dim)',
                    border: `1px solid ${active ? TAB_HUE[tb] : 'transparent'}`,
                  }}
                >
                  {t(`nav.${tb}`)}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <Suspense
          fallback={
            <p className="py-12 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
              …
            </p>
          }
        >
          {tab === 'analyze' && <Analyze />}
          {tab === 'practice' && <Practice />}
          {tab === 'model' && <Model />}
          {tab === 'learn' && <Learn />}
        </Suspense>
      </main>

      <footer
        className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-xs"
        style={{ color: 'var(--text-dim)' }}
      >
        <p>{t('footer.privacy')}</p>
        <p className="mt-1">
          <a href={REPO} className="underline" style={{ color: 'var(--accent)' }}>
            {t('footer.source')}
          </a>
        </p>
      </footer>
    </div>
  );
}
