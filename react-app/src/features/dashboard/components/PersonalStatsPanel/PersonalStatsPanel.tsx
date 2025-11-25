/**
 * PersonalStatsPanel component
 * Displays user's global statistics in 8 stat cards
 */

import { StatCard } from '@/shared/components';
import { useDashboardStats } from '../../hooks';

export function PersonalStatsPanel() {
  const stats = useDashboardStats();

  const statsConfig = [
    { label: 'Picks Seguidos', value: stats.totalFollowed },
    { label: 'Winrate', value: `${stats.winrate.toFixed(2)}%` },
    { 
      label: 'Yield', 
      value: `${stats.yield.toFixed(2)}%`,
      valueClassName: stats.yield >= 0 ? 'text-green-400' : 'text-red-400'
    },
    { label: 'Cuota Media', value: stats.avgOdds.toFixed(2) },
    { label: 'Stake Medio', value: stats.avgStake.toFixed(2) },
    { 
      label: 'Casa Favorita', 
      value: stats.favoriteBookmaker,
      title: stats.favoriteBookmaker
    },
    { 
      label: 'Mejor Casa', 
      value: stats.bestBookmaker,
      title: stats.bestBookmaker
    },
    { 
      label: 'Beneficio Total', 
      value: `${stats.totalProfit.toFixed(2)}u`,
      valueClassName: stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
    },
  ];

  return (
    <div className=" bg-slate-800 rounded p-3 border border-slate-700 shadow-md">
      <h3 className="text-sm font-semibold text-slate-100 mb-2">TUS ESTADÍSTICAS GENERALES</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {statsConfig.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            valueClassName={stat.valueClassName}
            title={stat.title}
          />
        ))}
      </div>
    </div>
  );
}
