import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MESSAGES, type LabeledMessage } from '../data/messages';
import { analyzeMessage } from '../engine';
import { useI18n } from '../i18n';
import { Button, Card, H2, kindTokens, Muted, Pill, Stat } from '../components/ui';
import type { Family } from '../engine/types';

type Level = 1 | 2 | 3;

interface Card3 extends LabeledMessage {
  index: number;
  score: number;
  level: Level;
  topReasons: { key: string; params?: Record<string, string | number> }[];
}

const STORAGE_KEY = 'skeptic.practice.v1';

interface Progress {
  correct: number;
  answered: number;
  streak: number;
  best: number;
  level: Level;
  seen: number[];
  byCategory: Record<string, [number, number]>;
}

const EMPTY: Progress = {
  correct: 0,
  answered: 0,
  streak: 0,
  best: 0,
  level: 1,
  seen: [],
  byCategory: {},
};

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Progress>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function levelOf(label: 0 | 1, score: number): Level {
  if (label === 1) return score >= 75 ? 1 : score >= 45 ? 2 : 3;
  return score <= 10 ? 1 : score <= 30 ? 2 : 3;
}

export function Practice() {
  const { t, locale } = useI18n();
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [current, setCurrent] = useState<Card3 | null>(null);
  const [answer, setAnswer] = useState<0 | 1 | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const deck = useMemo<Card3[]>(
    () =>
      MESSAGES.map((m, index) => {
        const a = analyzeMessage(m.text);
        return {
          ...m,
          index,
          score: a.score,
          level: levelOf(m.label, a.score),
          topReasons: a.evidence
            .filter((e) => e.points > 0)
            .slice(0, 3)
            .map((e) => ({ key: e.key, params: e.params })),
        };
      }),
    [],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
    }
  }, [progress]);

  const draw = useCallback(
    (level: Level, seen: number[]) => {
      const unseen = deck.filter((c) => !seen.includes(c.index));
      if (unseen.length === 0) return null;
      const tiers = [level, (level + 1) as Level, (level - 1) as Level, 1, 2, 3];
      for (const tier of tiers) {
        const pool = unseen.filter((c) => c.level === tier);
        if (pool.length) return pool[Math.floor(Math.random() * pool.length)]!;
      }
      return unseen[Math.floor(Math.random() * unseen.length)]!;
    },
    [deck],
  );

  const start = () => {
    setAnswer(null);
    setCurrent(draw(progress.level, progress.seen));
  };

  const respond = (guess: 0 | 1) => {
    if (!current || answer !== null) return;
    setAnswer(guess);
    const right = guess === current.label;
    setProgress((p) => {
      const cat = p.byCategory[current.category] ?? [0, 0];
      const streak = right ? p.streak + 1 : 0;
      const level: Level = right
        ? streak > 0 && streak % 3 === 0
          ? (Math.min(3, p.level + 1) as Level)
          : p.level
        : (Math.max(1, p.level - 1) as Level);
      return {
        ...p,
        answered: p.answered + 1,
        correct: p.correct + (right ? 1 : 0),
        streak,
        best: Math.max(p.best, streak),
        level,
        seen: [...p.seen, current.index],
        byCategory: {
          ...p.byCategory,
          [current.category]: [cat[0] + (right ? 1 : 0), cat[1] + 1],
        },
      };
    });
  };

  const next = useCallback(() => {
    setAnswer(null);
    setCurrent(draw(progress.level, progress.seen));
  }, [draw, progress.level, progress.seen]);

  useEffect(() => {
    if (answer !== null) nextRef.current?.focus();
  }, [answer]);

  const keyStateRef = useRef({ current, answer, respond, next });
  keyStateRef.current = { current, answer, respond, next };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = keyStateRef.current;
      if (!st.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      const key = e.key.toLowerCase();
      if (st.answer === null && (key === 's' || key === '1')) st.respond(1);
      else if (st.answer === null && (key === 'l' || key === '2')) st.respond(0);
      else if (st.answer !== null && key === 'n') st.next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const reset = () => {
    setProgress(EMPTY);
    setCurrent(null);
    setAnswer(null);
  };

  const accuracy = progress.answered
    ? Math.round((progress.correct / progress.answered) * 100)
    : 0;

  const weakest = useMemo(
    () =>
      Object.entries(progress.byCategory)
        .filter(([, [, n]]) => n >= 2)
        .map(([cat, [ok, n]]) => ({ cat, rate: ok / n, n }))
        .sort((a, b) => a.rate - b.rate)
        .slice(0, 3),
    [progress.byCategory],
  );

  const categoryName = (category: string) =>
    category.startsWith('legit-')
      ? t('practice.legit')
      : (locale.families[category as Family]?.name ?? category);

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="flex flex-col gap-4">
        <Card>
          <H2>{t('practice.heading')}</H2>
          <Muted className="mt-1.5">{t('practice.intro')}</Muted>
        </Card>

        {!current ? (
          <Card>
            {progress.seen.length >= deck.length ? (
              <>
                <Muted>{t('practice.done')}</Muted>
                <div className="mt-4">
                  <Button variant="primary" onClick={reset}>
                    {t('practice.reset')}
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="primary" onClick={start}>
                {t('practice.start')}
              </Button>
            )}
          </Card>
        ) : (
          <>
            <Card>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-dim)' }}>
                  {t('practice.q')}
                </h3>
                <Pill>
                  {t('practice.level')} {current.level}
                </Pill>
              </div>
              <blockquote
                className="mt-3 rounded-lg border-l-4 p-4 text-[0.95rem] leading-relaxed whitespace-pre-wrap"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text)',
                }}
              >
                {current.text}
              </blockquote>

              {answer === null ? (
                <>
                  <div className="mt-4 flex gap-3">
                    <Button variant="primary" onClick={() => respond(1)} className="flex-1">
                      {t('practice.scam')}
                    </Button>
                    <Button variant="ghost" onClick={() => respond(0)} className="flex-1">
                      {t('practice.legit')}
                    </Button>
                  </div>
                  <p className="mt-2 text-center text-xs" style={{ color: 'var(--text-dim)' }}>
                    {t('practice.keys')}
                  </p>
                </>
              ) : (
                <div
                  className="mt-4 rounded-lg border p-4"
                  style={{
                    background: answer === current.label ? 'var(--safe-bg)' : 'var(--danger-bg)',
                    borderColor:
                      answer === current.label ? 'var(--safe)' : 'var(--danger)',
                  }}
                >
                  <p
                    className="font-semibold"
                    style={{
                      color: answer === current.label ? 'var(--safe)' : 'var(--danger)',
                    }}
                  >
                    {answer === current.label ? t('practice.correct') : t('practice.wrong')} —{' '}
                    {current.label === 1 ? t('practice.wasScam') : t('practice.wasLegit')}
                  </p>
                  {current.label === 1 && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
                      {locale.families[current.category as Family]?.summary}
                    </p>
                  )}
                  {current.topReasons.length > 0 && (
                    <>
                      <p
                        className="mt-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--text-dim)' }}
                      >
                        {t('practice.explain')}
                      </p>
                      <ul className="mt-1 flex flex-col gap-1">
                        {current.topReasons.map((r) => (
                          <li key={r.key} className="text-sm" style={{ color: 'var(--text)' }}>
                            • {t(`${r.key}.title`, r.params)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="mt-4">
                    <button
                      ref={nextRef}
                      type="button"
                      onClick={next}
                      className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      {t('practice.next')}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      <aside className="flex flex-col gap-4">
        <Card>
          <H2>{t('practice.score')}</H2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat
              label={t('practice.accuracy')}
              value={`${accuracy}%`}
              hue={accuracy >= 80 ? 'var(--safe)' : accuracy >= 50 ? 'var(--caution)' : 'var(--danger)'}
            />
            <Stat
              label={t('practice.streak')}
              value={progress.streak}
              hint={`best ${progress.best}`}
              hue={kindTokens.rule}
            />
            <Stat label={t('practice.level')} value={progress.level} hue={kindTokens.header} />
            <Stat
              label={t('practice.seen')}
              value={`${progress.seen.length}/${deck.length}`}
              hue={kindTokens.model}
            />
          </div>
          <div className="mt-4">
            <Button onClick={reset} variant="quiet">
              {t('practice.reset')}
            </Button>
          </div>
        </Card>

        <Card>
          <H2>{t('practice.weakest')}</H2>
          {weakest.length === 0 ? (
            <Muted className="mt-1.5">{t('practice.noWeak')}</Muted>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {weakest.map((w) => (
                <li key={w.cat} className="flex items-center justify-between gap-2 text-sm">
                  <span style={{ color: 'var(--text)' }}>{categoryName(w.cat)}</span>
                  <Pill
                    fg={w.rate < 0.5 ? 'var(--danger)' : 'var(--caution)'}
                    bg="transparent"
                  >
                    {Math.round(w.rate * 100)}%
                  </Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </aside>
    </div>
  );
}
