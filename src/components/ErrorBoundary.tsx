import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('melsa_active_auth_user');
    } catch {}
    window.location.hash = '#inicio';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-[#D02126] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              !
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              MELSA | Gestión Inmobiliaria
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              La aplicación ha detectado un estado inesperado y se ha protegido contra pantalla en blanco.
            </p>
            {this.state.error?.message && (
              <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono text-left text-gray-700 mb-6 overflow-auto max-h-32 border border-gray-200">
                {this.state.error.message}
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-[#D02126] hover:bg-[#B81B1F] text-white py-3 rounded-xl font-semibold shadow-md transition-all cursor-pointer"
              >
                Restablecer & Ir a Inicio
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              >
                Reintentar Recarga
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

