import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-tasc-bg text-tasc-text p-6">
          <div className="max-w-md w-full border border-tasc-border p-6 bg-slate-900/80 text-center font-mono">
            <h2 className="text-tasc-cyan text-lg mb-2 font-bold tracking-wider">// SYSTEM RECOVERY</h2>
            <p className="text-sm text-tasc-text/70 mb-4">A temporary interface anomaly occurred. Click below to reload.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 border border-tasc-cyan text-tasc-cyan text-xs uppercase tracking-widest hover:bg-tasc-cyan hover:text-slate-950 transition-colors"
            >
              Restart System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
