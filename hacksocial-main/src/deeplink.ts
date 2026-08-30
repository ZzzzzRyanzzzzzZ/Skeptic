const MAX = 8000;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function encodeMessage(text: string): string {
  return `#m=${toBase64Url(new TextEncoder().encode(text.slice(0, MAX)))}`;
}

export function takeMessageFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const match = /[#&]m=([A-Za-z0-9\-_]+)/.exec(window.location.hash);
  if (!match?.[1]) return null;
  try {
    const text = new TextDecoder().decode(fromBase64Url(match[1]));
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return text.slice(0, MAX);
  } catch {
    return null;
  }
}
