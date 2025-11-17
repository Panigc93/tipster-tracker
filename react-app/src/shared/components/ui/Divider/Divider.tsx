import type { DividerProps } from './Divider.types';

/**
 * Divider component for visual separation
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider text="o" />
 * <Divider orientation="vertical" className="h-32" />
 * ```
 */
export function Divider({
  orientation = 'horizontal',
  text,
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px bg-slate-700 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  // Horizontal with text
  if (text) {
    return (
      <div className={`flex items-center gap-4 ${className}`} role="separator">
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-sm text-slate-400">{text}</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>
    );
  }

  // Horizontal simple
  return (
    <hr
      className={`border-0 h-px bg-slate-700 ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}
