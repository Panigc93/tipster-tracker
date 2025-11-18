/**
 * @fileoverview StakeDistributionChart - Horizontal bar chart for stake distribution
 * @module shared/components/charts/StakeDistributionChart
 */

import { Bar } from 'react-chartjs-2';
import { BAR_CHART_OPTIONS } from '@shared/constants';
import { prepareStakeDistribution, prepareFollowStakeDistribution } from '@shared/utils';
import type { Pick, UserFollow } from '@shared/types';

interface StakeDistributionChartProps {
  readonly picks?: Pick[];
  readonly follows?: UserFollow[];
  readonly title?: string;
  readonly height?: number;
}

export function StakeDistributionChart({
  picks,
  follows,
  title = 'Distribución de Stakes',
  height = 200,
}: StakeDistributionChartProps) {
  // Validate that at least one data source is provided
  if (!picks && !follows) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">No hay datos disponibles</p>
      </div>
    );
  }

  // Prepare chart data based on data source
  const chartData = picks
    ? prepareStakeDistribution(picks)
    : prepareFollowStakeDistribution(follows!);

  // Check if there's any data
  const hasData = chartData.datasets[0].data.some((value) => value > 0);

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">Sin datos de stakes</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
      <h3 className="mb-3 text-sm font-medium text-slate-200">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <Bar data={chartData} options={BAR_CHART_OPTIONS} />
      </div>
    </div>
  );
}
