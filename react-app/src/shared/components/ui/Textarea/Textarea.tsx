import { useEffect, useRef } from 'react';
import type { TextareaProps } from './Textarea.types';

/**
 * Textarea component with auto-resize and character counter
 *
 * @example
 * ```tsx
 * <Textarea
 *   value={text}
 *   onChange={setText}
 *   label="Comentarios"
 *   autoResize
 *   showCounter
 *   maxLength={500}
 * />
 * ```
 */
export function Textarea({
  value,
  onChange,
  label,
  error = false,
  errorMessage,
  autoResize = false,
  showCounter = false,
  maxLength,
  fullWidth = false,
  className = '',
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  const characterCount = value.length;
  const isOverLimit = maxLength !== undefined && characterCount > maxLength;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-200 mb-2">{label}</label>}
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className={`
          w-full px-4 py-2 rounded-lg border transition-all
          bg-slate-700 text-slate-200 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500
          resize-none
          ${error || isOverLimit
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-600 hover:border-blue-400'
          }
          ${autoResize ? 'overflow-hidden' : ''}
        `}
        {...props}
      />

      <div className="flex items-center justify-between mt-1">
        <div>
          {error && errorMessage && (
            <p className="text-xs text-red-400">{errorMessage}</p>
          )}
        </div>
        {showCounter && (
          <p
            className={`text-xs ${
              isOverLimit ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            {characterCount}
            {maxLength !== undefined && ` / ${maxLength}`}
          </p>
        )}
      </div>
    </div>
  );
}
