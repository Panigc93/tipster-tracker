/**
 * @fileoverview LoadingOverlay - Overlay for async operations
 * @module shared/components/ui/LoadingOverlay
 */

import type { LoadingOverlayProps } from './LoadingOverlay.types';

/**
 * LoadingOverlay - Shows a loading overlay over content during async operations
 * 
 * @example
 * ```tsx
 * <LoadingOverlay isLoading={isResetting} message="Reseteando tipster...">
 *   <div>Content</div>
 * </LoadingOverlay>
 * ```
 */
export function LoadingOverlay({
  isLoading,
  message = 'Cargando...',
  children,
  className = '',
}: LoadingOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            <p className="text-slate-200 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
