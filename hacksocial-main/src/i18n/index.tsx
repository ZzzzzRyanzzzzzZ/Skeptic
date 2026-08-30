import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { en, type Locale } from './en';
import { es } from './es';
import type { Sensitivity } from '../engine/analyze';

export const LOCALES: Record<string, Locale> = { en, es };

export type TextSize = 'normal' | 'large' | 'huge';

export type Theme = 'system' | 'light' | 'dark';

interface Prefs {
  lang: string;
  textSize: TextSize;
  contrast: boolean;
  theme: Theme;
  sensitivity: Sensitivity;
}

const DEFAULTS: Prefs = {
  lang: 'en',
  textSize: 'normal',
  contrast: false,
  theme: 'system',
  sensitivity: 'balanced',
};
const STORAGE_KEY = 'skeptic.prefs.v1';

function load(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const nav = navigator.language?.slice(0, 2);
      return { ...DEFAULTS, lang: nav && LOCALES[nav] ? nav : 'en' };
    }
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    return DEFAULTS;
  }
}

interface Ctx extends Prefs {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  set: (patch: Partial<Prefs>) => void;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
    }
    const root = document.documentElement;
    root.lang = prefs.lang;
    root.dataset.textSize = prefs.textSize;
    root.dataset.contrast = prefs.contrast ? 'on' : 'off';
    if (prefs.theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = prefs.theme;
  }, [prefs]);

  const locale = LOCALES[prefs.lang] ?? en;

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const raw = locale.strings[key] ?? en.strings[key] ?? key;
      if (!params) return raw;
      return raw.replace(/\{(\w+)\}/g, (m, k: string) =>
        params[k] === undefined ? m : String(params[k]),
      );
    },
    [locale],
  );

  const set = useCallback((patch: Partial<Prefs>) => setPrefs((p) => ({ ...p, ...patch })), []);

  const value = useMemo<Ctx>(() => ({ ...prefs, locale, t, set }), [prefs, locale, t, set]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
