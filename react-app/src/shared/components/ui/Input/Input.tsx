import { useState, forwardRef, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { InputProps } from './Input.types';

/**
 * Input component with label, error states, and password visibility toggle
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   error={errors.email}
 *   placeholder="tu@email.com"
 * />
 *
 * <Input
 *   label="Password"
 *   type="password"
 *   required
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      fullWidth = false,
      icon,
      containerClassName = '',
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;

    // Determine actual input type (handle password visibility)
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Base classes
    const baseClasses =
      'w-full px-4 py-2 bg-slate-800 border rounded-lg text-slate-200 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

    // Border classes based on state
    const borderClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500';

    // Icon padding
    const iconPaddingClasses = icon ? 'pl-11' : '';

    // Password toggle padding
    const passwordPaddingClasses = type === 'password' ? 'pr-11' : '';

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine all classes
    const inputClasses = `${baseClasses} ${borderClasses} ${iconPaddingClasses} ${passwordPaddingClasses} ${className}`;

    return (
      <div className={`${widthClasses} ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-slate-200"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            required={required}
            {...props}
          />

          {/* Password visibility toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:text-slate-200"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="mt-1.5 text-sm text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
