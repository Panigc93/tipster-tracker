import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import type { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox component with indeterminate state support
 *
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isChecked}
 *   onChange={setIsChecked}
 *   label="Acepto los términos"
 * />
 * ```
 */
export function Checkbox({
  checked,
  onChange,
  label,
  indeterminate = false,
  disabled = false,
  error = false,
  errorMessage,
  className = '',
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Set indeterminate state on the native input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={className}>
      <label className="flex items-start gap-2 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            ref={inputRef}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
          />
          <div
            className={`
              h-5 w-5 rounded border-2 flex items-center justify-center transition-all
              ${error 
                ? 'border-red-500' 
                : disabled
                  ? 'border-slate-600 bg-slate-800'
                  : 'border-slate-500 group-hover:border-blue-400'
              }
              ${checked || indeterminate 
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-slate-700'
              }
              peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900
            `}
          >
            {indeterminate ? (
              <Minus className="h-3 w-3 text-white" />
            ) : checked ? (
              <Check className="h-3 w-3 text-white" />
            ) : null}
          </div>
        </div>
        {label && (
          <span
            className={`text-sm ${
              disabled ? 'text-slate-500' : error ? 'text-red-400' : 'text-slate-200'
            }`}
          >
            {label}
          </span>
        )}
      </label>
      {error && errorMessage && (
        <p className="mt-1 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
