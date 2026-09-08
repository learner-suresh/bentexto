import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D1527] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-[#253556] bg-[#15213B] p-6 text-center shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">খেলার পাতা লোড করতে সাময়িক সমস্যা হয়েছে</h2>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              পৃষ্ঠাটি পুনরায় লোড করতে নিচের বাটনে চাপ দিন। আপনার পূর্বের গেমের তথ্য সুরক্ষিত আছে।
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#0080FF] text-white font-medium shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>পুনরায় লোড করুন (Reload Page)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
