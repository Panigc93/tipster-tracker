import { Calendar, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Badge } from '@/shared/components/ui';
import type { TipsterCardProps } from './TipsterCard.types';

/**
 * TipsterCard component
 * Displays a tipster with basic info and optional statistics
 *
 * @example
 * ```tsx
 * <TipsterCard
 *   tipster={tipster}
 *   stats={{ totalPicks: 50, winrate: 65, yield: 12.5, totalProfit: 25 }}
 *   onClick={(id) => navigate(`/tipsters/${id}`)}
 * />
 * ```
 */
export function TipsterCard({
  tipster,
  onClick,
  stats,
  className = '',
}: Readonly<TipsterCardProps>) {
  const handleClick = () => {
    if (onClick) {
      onClick(tipster.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin picks';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getYieldColor = (yieldValue: number) => {
    if (yieldValue > 0) return 'text-success';
    if (yieldValue < 0) return 'text-error';
    return 'text-slate-400';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        bg-slate-800 border border-slate-700 rounded-md p-4
        transition-all duration-200 cursor-pointer
        hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-200 truncate mb-1">
            {tipster.name}
          </h3>
          <Badge variant="info" size="sm">
            {tipster.channel}
          </Badge>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <Calendar className="h-3 w-3" />
        <span>Última pick: {formatDate(tipster.lastPickDate)}</span>
      </div>

      {/* Stats (if provided) */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          {/* Total Picks */}
          <div className="bg-blue-500/10 rounded-md p-3 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-slate-400">Picks</span>
            </div>
            <p className="text-base font-semibold text-slate-200">
              {stats.totalPicks}
            </p>
          </div>

          {/* Winrate */}
          <div className="bg-slate-700/50 rounded-md p-3 border border-slate-600">
            <div className="text-xs text-slate-400 mb-1">Winrate</div>
            <p className="text-base font-semibold text-slate-200">
              {stats.winrate.toFixed(1)}%
            </p>
          </div>

          {/* Yield */}
          <div className="bg-slate-700/50 rounded-md p-3 border border-slate-600">
            <div className="flex items-center gap-1 mb-1">
              {stats.yield >= 0 ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-error" />
              )}
              <span className="text-xs text-slate-400">Yield</span>
            </div>
            <p className={`text-base font-semibold ${getYieldColor(stats.yield)}`}>
              {stats.yield > 0 ? '+' : ''}
              {stats.yield.toFixed(2)}%
            </p>
          </div>

          {/* Profit */}
          <div className="bg-slate-700/50 rounded-md p-3 border border-slate-600">
            <div className="text-xs text-slate-400 mb-1">Profit</div>
            <p className={`text-base font-semibold ${getYieldColor(stats.totalProfit)}`}>
              {stats.totalProfit > 0 ? '+' : ''}
              {stats.totalProfit.toFixed(2)}u
            </p>
          </div>
        </div>
      )}

      {/* Empty state when no stats */}
      {!stats && (
        <div className="text-center py-4 text-sm text-slate-400">
          Sin estadísticas disponibles
        </div>
      )}
    </div>
  );
}
