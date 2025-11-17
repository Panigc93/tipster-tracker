import { Loader2 } from 'lucide-react';
import type { ButtonProps } from './Button.types';

/**
 * Button component with multiple variants, sizes and states
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="danger" loading>
 *   Deleting...
 * </Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  // Base classes
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant classes
  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500',
    secondary:
      'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500 focus:ring-slate-500',
    outline:
      'bg-transparent text-slate-200 border border-slate-600 hover:bg-slate-800 active:bg-slate-700 focus:ring-slate-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-1.5 text-base',
    lg: 'px-6 py-2 text-lg',
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
