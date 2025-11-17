import { Loader2 } from 'lucide-react';
import type { SwitchProps } from './Switch.types';

/**
 * Switch/Toggle component
 *
 * @example
 * ```tsx
 * <Switch
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="Activar notificaciones"
 * />
 * ```
 */
export function Switch({
  checked,
  onChange,
  label,
  loading = false,
  disabled = false,
  className = '',
}: SwitchProps) {
  const isDisabled = disabled || loading;

  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={isDisabled}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors
            ${isDisabled
              ? 'bg-slate-700 cursor-not-allowed'
              : checked
                ? 'bg-blue-500'
                : 'bg-slate-600 group-hover:bg-slate-500'
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900
          `}
        />
        <div
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        >
          {loading && <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />}
        </div>
      </div>
      {label && (
        <span className={`text-sm ${isDisabled ? 'text-slate-500' : 'text-slate-200'}`}>
          {label}
        </span>
      )}
    </label>
  );
}
