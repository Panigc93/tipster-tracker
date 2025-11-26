import { Plus } from 'lucide-react';
import { Button, StatCard } from '@/shared/components';
import type { TipsterStats } from '../../utils';

interface GeneralStatsProps {
  stats: TipsterStats;
  loading: boolean;
  onAddPick: () => void;
  hasPicks: boolean;
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
  return `${sign}${value}${suffix}`;
}

export function GeneralStats({ stats, loading, onAddPick, hasPicks }: GeneralStatsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!hasPicks) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-700">
        <p className="text-slate-400 mb-4">
          Aún no hay picks registradas para este tipster
        </p>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={onAddPick}
        >
          Añadir primer Pick
        </Button>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <StatCard label="Total Picks" value={stats.totalPicks} size="md" />
        <StatCard label="Winrate" value={`${stats.winrate}%`} size="md" />
        <StatCard 
          label="Yield" 
          value={formatWithSign(stats.yield, '%')} 
          valueClassName={getValueColor(stats.yield)} 
          size="md"
        />
        <StatCard 
          label="Profit" 
          value={formatWithSign(stats.profit, 'u')} 
          valueClassName={getValueColor(stats.profit)} 
          size="md"
        />
        <StatCard label="Cuota Media" value={stats.avgOdds} size="md" />
        <StatCard label="Stake Medio" value={`${stats.avgStake}u`} size="md" />
      </div>
  );
}
