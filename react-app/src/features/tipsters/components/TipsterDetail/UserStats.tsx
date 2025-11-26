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
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6">
        <StatCard 
          label="Total Follows" 
          value={stats.totalFollows} 
          valueClassName="text-slate-200" 
          size="md"
        />
        <StatCard 
          label="Winrate" 
          value={`${stats.userWinrate.toFixed(1)}%`} 
          valueClassName="text-slate-200" 
          size="md"
        />
        <StatCard 
          label="Yield" 
          value={formatWithSign(stats.userYield, '%')} 
          valueClassName={getValueColor(stats.userYield)} 
          size="md"
        />
        <StatCard 
          label="Profit Total" 
          value={formatWithSign(stats.userProfit, 'u')} 
          valueClassName={getValueColor(stats.userProfit)} 
          size="md"
        />
        <StatCard 
          label="Match Rate" 
          value={`${stats.matchRate.toFixed(1)}%`} 
          valueClassName={getMatchRateColor(stats.matchRate)} 
          size="md"
        />
        <StatCard 
          label="Tasa de Seguimiento" 
          value={`${stats.followRate.toFixed(1)}%`} 
          valueClassName="text-blue-400" 
          size="md"
        />
      </div>
    </>
  );
}
