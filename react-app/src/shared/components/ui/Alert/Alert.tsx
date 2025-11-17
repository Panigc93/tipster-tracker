import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { AlertProps } from './Alert.types';

/**
 * Alert component for displaying messages with different severity levels
 *
 * @example
 * ```tsx
 * <Alert variant="error" title="Error">
 *   Something went wrong!
 * </Alert>
 *
 * <Alert variant="success" dismissible onDismiss={handleDismiss}>
 *   Operation completed successfully
 * </Alert>
 * ```
 */
export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  // Variant classes
  const variantClasses = {
    error: 'bg-red-900/20 border-red-500/50 text-red-200',
    success: 'bg-green-900/20 border-green-500/50 text-green-200',
    warning: 'bg-orange-900/20 border-orange-500/50 text-orange-200',
    info: 'bg-blue-900/20 border-blue-500/50 text-blue-200',
  };

  // Icon color classes
  const iconColorClasses = {
    error: 'text-red-400',
    success: 'text-green-400',
    warning: 'text-orange-400',
    info: 'text-blue-400',
  };

  // Base classes
  const baseClasses = 'flex items-start gap-3 p-4 border rounded-lg';

  // Combine all classes
  const alertClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={alertClasses} role="alert">
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${iconColorClasses[variant]}`}>
        {variant === 'error' && <AlertCircle className="h-5 w-5" />}
        {variant === 'success' && <CheckCircle className="h-5 w-5" />}
        {variant === 'warning' && <AlertTriangle className="h-5 w-5" />}
        {variant === 'info' && <Info className="h-5 w-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:opacity-100"
          aria-label="Cerrar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
