import type { CardProps } from './Card.types';

/**
 * Card component - container with background, border, and shadow
 *
 * @example
 * ```tsx
 * <Card header={<h2>Title</h2>}>
 *   Card content here
 * </Card>
 *
 * <Card clickable onClick={handleClick}>
 *   Clickable card
 * </Card>
 * ```
 */
export function Card({
  children,
  header,
  footer,
  className = '',
  noPadding = false,
  clickable = false,
  onClick,
}: CardProps) {
  // Base classes
  const baseClasses =
    'bg-slate-800 border border-slate-700 rounded-lg shadow-md transition-all duration-200';

  // Clickable classes
  const clickableClasses = clickable
    ? 'cursor-pointer hover:border-slate-600 hover:shadow-lg hover:-translate-y-0.5'
    : '';

  // Padding classes
  const paddingClasses = noPadding ? '' : 'p-6';

  // Combine all classes
  const cardClasses = `${baseClasses} ${clickableClasses} ${className}`;

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick} role={clickable ? 'button' : undefined}>
      {/* Header */}
      {header && (
        <div className={`border-b border-slate-700 ${noPadding ? 'p-4 pb-4' : 'pb-4 mb-4'}`}>
          {header}
        </div>
      )}

      {/* Body */}
      <div className={paddingClasses}>{children}</div>

      {/* Footer */}
      {footer && (
        <div className={`border-t border-slate-700 ${noPadding ? 'p-4 pt-4' : 'pt-4 mt-4'}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
