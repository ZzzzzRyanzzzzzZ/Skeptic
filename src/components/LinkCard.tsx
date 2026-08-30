import { useI18n } from '../i18n';
import { Pill } from './ui';
import { splitHost } from '../engine/url';
import type { LinkFinding } from '../engine/types';

export function LinkCard({ link }: { link: LinkFinding }) {
  const { t } = useI18n();
  const { registrable } = splitHost(link.host);
  const risky = link.risk > 0;
  const tone = risky ? 'var(--danger)' : 'var(--safe)';

  const idx = link.url.toLowerCase().lastIndexOf(registrable);
  const before = idx >= 0 ? link.url.slice(0, idx) : link.url;
  const domain = idx >= 0 ? link.url.slice(idx, idx + registrable.length) : '';
  const after = idx >= 0 ? link.url.slice(idx + registrable.length) : '';

  return (
    <div
      className="rounded-lg border p-3"
      style={{ borderColor: risky ? `${tone}44` : 'var(--border)', background: 'var(--surface-2)' }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <code className="text-xs break-all" style={{ color: 'var(--text-dim)' }}>
          {before}
          <span
            className="rounded px-1 py-0.5 font-bold"
            style={{ background: `${tone}22`, color: tone }}
          >
            {domain}
          </span>
          {after}
        </code>
        {link.impersonates && (
          <Pill fg="var(--danger)" bg="var(--danger-bg)">
            ≠ {link.impersonates}
          </Pill>
        )}
      </div>
      {link.issues.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {link.issues.map((i) => (
            <li key={i.id} className="text-sm leading-snug" style={{ color: 'var(--text)' }}>
              <span aria-hidden="true" style={{ color: i.points > 0 ? tone : 'var(--safe)' }}>
                {i.points > 0 ? '▲ ' : '▼ '}
              </span>
              <strong className="font-semibold">{t(`${i.key}.title`, i.params)}</strong>{' '}
              <span style={{ color: 'var(--text-dim)' }}>{t(`${i.key}.detail`, i.params)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
