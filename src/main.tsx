import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('IOIS Platform Application Error:', error, errorInfo);
  }

  handleReload = () => {
    // Clear potentially corrupted transient session if any
    try {
      window.location.reload();
    } catch {
      window.location.href = window.location.pathname;
    }
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-500 mx-auto flex items-center justify-center text-3xl font-black">
              IOIS
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              IOIS INDIA डिजिटल सेवा केंद्र
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              वेबसाइट लोड करने में क्षणिक समस्या आई है। कृपया नीचे दिए गए बटन पर क्लिक करके पेज रिफ्रेश करें।
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                🔄 वेबसाइट तुरंत रिफ्रेश करें (Reload Fast)
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              सहायता हेल्पलाइन: +91 8877490845
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>
  );
}
