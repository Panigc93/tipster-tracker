import type { RadioGroupProps } from './Radio.types';

/**
 * RadioGroup component for single selection
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   name="gender"
 *   options={[
 *     { value: 'male', label: 'Masculino' },
 *     { value: 'female', label: 'Femenino' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
export function RadioGroup({
  options,
  value,
  onChange,
  name,
  layout = 'vertical',
  error = false,
  errorMessage,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={className}>
      <div
        className={`
          flex gap-4
          ${layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        `}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = option.disabled || false;

          return (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={isDisabled}
                  className="sr-only peer"
                />
                <div
                  className={`
                    h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${error
                      ? 'border-red-500'
                      : isDisabled
                        ? 'border-slate-600 bg-slate-800'
                        : 'border-slate-500 group-hover:border-blue-400'
                    }
                    ${isSelected ? 'border-blue-500' : ''}
                    peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900
                  `}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
              <span
                className={`text-sm ${
                  isDisabled
                    ? 'text-slate-500'
                    : error
                      ? 'text-red-400'
                      : 'text-slate-200'
                }`}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && errorMessage && (
        <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
