import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Icon } from './Icon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Here you could also log the error to an external service
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-6 text-center" dir="rtl">
          <Icon name="info" className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">عذرًا، حدث خطأ ما</h1>
          <p className="text-slate-600 mb-4">
            واجه التطبيق مشكلة غير متوقعة. يمكنك محاولة تحديث الصفحة.
          </p>
          <pre className="text-left bg-white p-4 rounded-lg border border-slate-200 text-xs text-red-700 max-w-lg overflow-auto mb-4">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
