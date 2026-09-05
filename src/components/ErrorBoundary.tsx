import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SmartToolHub ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });

    // Handle chunk loading failure gracefully
    const isChunkLoadError = 
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.message?.includes('error loading dynamically imported module');

    if (isChunkLoadError) {
      const reloadCount = parseInt(sessionStorage.getItem('sth_chunk_retry') || '0', 10);
      if (reloadCount < 1) {
        sessionStorage.setItem('sth_chunk_retry', String(reloadCount + 1));
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    sessionStorage.removeItem('sth_chunk_retry');
    sessionStorage.removeItem('chunk_retry_reload');
    window.location.reload();
  };

  private handleGoHome = () => {
    sessionStorage.removeItem('sth_chunk_retry');
    sessionStorage.removeItem('chunk_retry_reload');
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleResetAll = () => {
    try {
      sessionStorage.clear();
      // Keep auth user if any, but clear temporary state
      localStorage.removeItem('sth_is_admin');
    } catch (e) {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected application state occurred.';

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
              <ShieldCheck size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                SmartToolHub Self-Recovery
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The application detected a component state refresh. All your data and tools are safe and ready to use.
              </p>
            </div>

            {/* Error Detail Pill */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Notice:</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 truncate">
                {errorMessage}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleGoHome}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <Home size={15} />
                <span>Go to Dashboard</span>
              </button>

              <button
                onClick={this.handleReload}
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <RefreshCw size={15} />
                <span>Reload View</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={this.handleResetAll}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset temporary cache & restart clean</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

