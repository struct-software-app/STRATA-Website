import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4 py-16 bg-white text-zinc-900">
          <div className="max-w-md w-full border border-zinc-200 rounded-2xl p-8 text-center shadow-xs space-y-5 bg-white">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Something went wrong
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                An unexpected error occurred while loading this page. Your local data and account remain safe.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 text-white text-xs font-medium rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Reload page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="w-full sm:w-auto px-5 py-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 text-xs font-medium rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
