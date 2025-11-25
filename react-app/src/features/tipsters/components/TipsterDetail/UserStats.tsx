import { StatCard } from '@/shared/components';
import type { TraceabilityStats } from '@features/follows/utils';

interface UserStatsProps {
  stats: TraceabilityStats;
  loading: boolean;
  tipsterYield: number;
}

/**
 * Helper function to get color class based on value
 */
function getValueColor(value: number): string {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-slate-100';
}

/**
 * Helper function to format value with sign
 */
function formatWithSign(value: number, suffix: string = ''): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}${suffix}`;
}

/**
 * Helper function to get match rate color
 */
function getMatchRateColor(matchRate: number): string {
  if (matchRate >= 80) return 'text-green-400';
  if (matchRate >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

export function UserStats({ stats, loading, tipsterYield }: UserStatsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">
          Seguibilidad
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            label="Total Picks del Tipster" 
            value={stats.totalPicks} 
            size="lg"
          />
          <StatCard 
            label="Picks Seguidas" 
            value={stats.totalFollows} 
            valueClassName="text-blue-400" 
            size="lg"
          />
          <StatCard 
            label="Tasa de Seguimiento" 
            value={`${stats.followRate.toFixed(1)}%`} 
            valueClassName="text-blue-400" 
            size="lg"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-4 mt-8">
          Tus Estadísticas de Seguimiento
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard 
            label="Total Follows" 
            value={stats.totalFollows} 
            valueClassName="text-slate-200" 
            size="lg"
          />
          <StatCard 
            label="Ganados" 
            value={stats.userWonFollows} 
            valueClassName="text-green-400" 
            size="lg"
          />
          <StatCard 
            label="Perdidos" 
            value={stats.userResolvedFollows - stats.userWonFollows} 
            valueClassName="text-red-400" 
            size="lg"
          />
          <StatCard 
            label="Winrate" 
            value={`${stats.userWinrate.toFixed(1)}%`} 
            valueClassName="text-slate-200" 
            size="lg"
          />
          <StatCard 
            label="Yield" 
            value={formatWithSign(stats.userYield, '%')} 
            valueClassName={getValueColor(stats.userYield)} 
            size="lg"
          />
          <StatCard 
            label="Profit Total" 
            value={formatWithSign(stats.userProfit, 'u')} 
            valueClassName={getValueColor(stats.userProfit)} 
            size="lg"
          />
          <StatCard 
            label="Match Rate" 
            value={`${stats.matchRate.toFixed(1)}%`} 
            valueClassName={getMatchRateColor(stats.matchRate)} 
            size="lg"
          />
        </div>

        <div
          className={`rounded-lg p-4 border mb-6 ${
            stats.yieldDiff >= 2
              ? 'bg-green-500/10 border-green-500/30'
              : stats.yieldDiff <= -2
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-blue-500/10 border-blue-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {stats.yieldDiff >= 2
                ? '🟢'
                : stats.yieldDiff <= -2
                  ? '🔴'
                  : '⚪'}
            </div>
            <div>
              <p
                className={`font-semibold ${
                  stats.yieldDiff >= 2
                    ? 'text-green-400'
                    : stats.yieldDiff <= -2
                      ? 'text-red-400'
                      : 'text-blue-400'
                }`}
              >
                {stats.yieldDiff >= 2
                  ? `Superando al tipster en +${stats.yieldDiff.toFixed(2)}% yield`
                  : stats.yieldDiff <= -2
                    ? `Por debajo del tipster en ${stats.yieldDiff.toFixed(2)}% yield`
                    : 'Rendimiento similar al tipster'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Comparado con el yield del tipster ({tipsterYield.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
