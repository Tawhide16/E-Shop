import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleResetStorage = () => {
    try {
      // Clear large cached sections that might have exceeded quota
      localStorage.removeItem('gymshark_cms_draft_sections');
      localStorage.removeItem('gymshark_cms_sections');
      localStorage.removeItem('gymshark_cms_versions');
      localStorage.removeItem('gymshark_media_assets');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-lg font-black text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">
              The application encountered a storage or display issue. Click below to clear storage cache and reload safely.
            </p>
            <button
              onClick={this.handleResetStorage}
              className="w-full bg-black text-white text-xs font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all cursor-pointer shadow-md active:scale-98"
            >
              <RefreshCw size={15} />
              <span>Clear Storage & Recover</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
