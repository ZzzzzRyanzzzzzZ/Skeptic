import type { CSSProperties, ReactNode } from 'react';
import type { Band, EvidenceKind, Severity } from '../engine/types';

export const bandTokens: Record<Band, { fg: string; bg: string }> = {
  safe: { fg: 'var(--safe)', bg: 'var(--safe-bg)' },
  caution: { fg: 'var(--caution)', bg: 'var(--caution-bg)' },
  'likely-scam': { fg: 'var(--likely)', bg: 'var(--likely-bg)' },
  dangerous: { fg: 'var(--danger)', bg: 'var(--danger-bg)' },
};

export const kindTokens: Record<EvidenceKind, string> = {
  model: 'var(--hue-model)',
  rule: 'var(--hue-tactic)',
  link: 'var(--hue-link)',
  header: 'var(--hue-header)',
  structure: 'var(--hue-format)',
};

export const severityTokens: Record<Severity, { fg: string; bg: string }> = {
  info: { fg: 'var(--safe)', bg: 'var(--safe-bg)' },
  low: { fg: 'var(--caution)', bg: 'var(--caution-bg)' },
  medium: { fg: 'var(--likely)', bg: 'var(--likely-bg)' },
  high: { fg: 'var(--danger)', bg: 'var(--danger-bg)' },
};

export function Card({
  children,
  className = '',
  style,
  as: Tag = 'section',
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'section' | 'div' | 'article' | 'aside';
}) {
  return (
    <Tag
      data-card
      className={`rounded-xl border p-5 sm:p-6 ${className}`}
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
      {children}
    </h2>
  );
}

export function Muted({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-sm leading-relaxed ${className}`} style={{ color: 'var(--text-dim)' }}>
      {children}
    </p>
  );
}

export function Button({
  children,
  onClick,
  variant = 'ghost',
  type = 'button',
  disabled,
  ariaPressed,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'quiet';
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaPressed?: boolean;
  className?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-45 disabled:cursor-not-allowed';
  const styles: Record<string, CSSProperties> = {
    primary: { background: 'var(--accent)', color: '#fff', border: '1px solid transparent' },
    ghost: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-strong)' },
    quiet: { background: 'transparent', color: 'var(--text-dim)', border: '1px solid transparent' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={ariaPressed}
      className={`${base} ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

export function Pill({
  children,
  fg = 'var(--text-dim)',
  bg = 'var(--surface-2)',
  title,
}: {
  children: ReactNode;
  fg?: string;
  bg?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ color: fg, background: bg, border: `1px solid ${fg}33` }}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  hue,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  hue?: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-lg border px-3 py-2.5"
      style={{
        borderColor: hue ? `color-mix(in srgb, ${hue} 40%, var(--border))` : 'var(--border)',
        background: hue
          ? `color-mix(in srgb, ${hue} 9%, var(--surface-2))`
          : 'var(--surface-2)',
        borderLeft: hue ? `3px solid ${hue}` : undefined,
      }}
    >
      <div className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
        {label}
      </div>
      <div
        className="mt-0.5 text-lg font-semibold tabular-nums"
        style={{ color: hue ?? 'var(--text)' }}
      >
        {value}
      </div>
      {hint && (
        <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {hint}
        </div>
      )}
    </div>
  );
}
