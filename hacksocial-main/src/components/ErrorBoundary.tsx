import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Skeptic crashed:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="mx-auto max-w-xl px-4 py-16" role="alert">
        <h1 className="text-xl font-bold" style={{ color: 'var(--danger)' }}>
          Skeptic hit an error
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          Something in the interface failed, so this analysis is not trustworthy. Treat the
          message you were checking as unverified: do not click its links, reply, call any number
          in it, or send money until you have checked it another way.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          Reloading the page usually clears it. Nothing was uploaded, and nothing was reported —
          this tool has no telemetry.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Reload
        </button>
        <pre
          className="mt-6 overflow-auto rounded-lg border p-3 text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
        >
          {error.message}
        </pre>
      </div>
    );
  }
}
