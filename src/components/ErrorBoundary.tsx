import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;
  state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('IOIS Platform Uncaught Runtime Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">IOIS Platform</h2>
            <p className="text-slate-300 text-sm mb-4">
              पेज लोड करने में एक अस्थायी त्रुटि आई है। कृपया पेज को रीफ्रेश करें या होम पर वापस जाएं।
            </p>
            {this.state.error?.message && (
              <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-400 mb-5 overflow-x-auto text-left border border-slate-800">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                पेज रीफ्रेश करें
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-700 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                होम पेज
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
