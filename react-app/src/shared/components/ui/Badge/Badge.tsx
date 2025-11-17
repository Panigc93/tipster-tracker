import { X } from 'lucide-react';
import type { BadgeProps } from './Badge.types';

/**
 * Badge component for status indicators and labels
 *
 * @example
 * ```tsx
 * <Badge variant="success">Activo</Badge>
 * <Badge variant="error" dismissible onDismiss={() => console.log('removed')}>
 *   Error
 * </Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dismissible = false,
  onDismiss,
  className = '',
}: BadgeProps) {
  // Variant styles
  const variantClasses = {
    default: 'bg-slate-700 text-slate-200 border-slate-600',
    success: 'bg-green-500/10 text-green-400 border-green-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };

  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="hover:opacity-70 transition-opacity focus:outline-none"
          aria-label="Eliminar badge"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
