import { Loader2 } from 'lucide-react';
import type { SpinnerProps } from './Spinner.types';

/**
 * Spinner component for loading states
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner variant="dots" size="lg" label="Cargando..." />
 * <Spinner overlay label="Guardando cambios..." />
 * ```
 */
export function Spinner({
  variant = 'circular',
  size = 'md',
  overlay = false,
  label,
  className = '',
}: SpinnerProps) {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const dotSizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  // Spinner content
  const spinnerContent = (
    <div className="flex flex-col items-center gap-3">
      {variant === 'circular' ? (
        <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin`} />
      ) : (
        <div className="flex items-center gap-1.5">
          <div
            className={`${dotSizeClasses[size]} bg-blue-400 rounded-full animate-pulse`}
            style={{ animationDelay: '0ms' }}
          />
          <div
            className={`${dotSizeClasses[size]} bg-blue-400 rounded-full animate-pulse`}
            style={{ animationDelay: '150ms' }}
          />
          <div
            className={`${dotSizeClasses[size]} bg-blue-400 rounded-full animate-pulse`}
            style={{ animationDelay: '300ms' }}
          />
        </div>
      )}
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </div>
  );

  // Overlay mode
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  // Inline mode
  return <div className={`flex items-center justify-center ${className}`}>{spinnerContent}</div>;
}
