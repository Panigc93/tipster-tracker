/**
 * @fileoverview OddsDistributionChart - Horizontal bar chart for odds distribution
 * @module shared/components/charts/OddsDistributionChart
 */

import { Bar } from 'react-chartjs-2';
import { BAR_CHART_OPTIONS } from '@shared/constants';
import { prepareOddsDistribution, prepareFollowOddsDistribution } from '@shared/utils';
import type { Pick, UserFollow } from '@shared/types';

interface OddsDistributionChartProps {
  readonly picks?: Pick[];
  readonly follows?: UserFollow[];
  readonly title?: string;
  readonly height?: number;
}

export function OddsDistributionChart({
  picks,
  follows,
  title = 'Distribución de Cuotas',
  height = 200,
}: OddsDistributionChartProps) {
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
    ? prepareOddsDistribution(picks)
    : prepareFollowOddsDistribution(follows!);

  // Check if there's any data
  const hasData = chartData.datasets[0].data.some((value) => value > 0);

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">Sin datos de cuotas</p>
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
