import type { StatCardProps } from './StatCard.types';

/**
 * StatCard component
 * Displays a statistic with a label and value in a consistent card format
 * 
 * @example
 * ```tsx
 * <StatCard label="Total Picks" value={42} />
 * <StatCard label="Yield" value="+5.2%" valueClassName="text-green-400" />
 * ```
 */
export function StatCard({ 
  label, 
  value, 
  valueClassName = 'text-slate-100', 
  title,
  size = 'md'
}: Readonly<StatCardProps>) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className="bg-slate-800 rounded p-2 border border-slate-700">
      <div className="text-sm text-slate-400 mb-1 text-center">{label}</div>
      <div 
        className={`${sizeClasses[size]} text-center font-bold ${valueClassName} ${title ? 'truncate' : ''}`} 
        title={title}
      >
        {value}
      </div>
    </div>
  );
}
