/**
 * @fileoverview ErrorFallback - UI shown when an error is caught
 * @module shared/components/ErrorBoundary
 */

import { AlertTriangle } from 'lucide-react';
import { Button } from '@shared/components/ui';
import type { ErrorFallbackProps } from './ErrorBoundary.types';

/**
 * ErrorFallback - Fallback UI displayed when ErrorBoundary catches an error
 * 
 * @example
 * ```tsx
 * <ErrorFallback error={error} resetError={reset} />
 * ```
 */
export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {/* Error Icon */}
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Algo salió mal
          </h2>
          
          {/* Description */}
          <p className="text-slate-400 mb-6">
            Lo sentimos, ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
          </p>

          {/* Technical Details (dev only) */}
          {import.meta.env.DEV && error && (
            <details className="mb-6 w-full text-left">
              <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400 transition-colors">
                Detalles técnicos
              </summary>
              <pre className="mt-2 text-xs text-red-400 bg-slate-900 p-3 rounded overflow-auto max-h-40">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            {resetError && (
              <Button 
                onClick={resetError} 
                variant="primary" 
                fullWidth
              >
                Reintentar
              </Button>
            )}
            <Button 
              onClick={handleGoHome} 
              variant="secondary" 
              fullWidth
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
