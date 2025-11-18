/**
 * @fileoverview PickTypeDistributionChart - Doughnut chart for pick type distribution
 * @module shared/components/charts/PickTypeDistributionChart
 */

import { Doughnut } from 'react-chartjs-2';
import { DOUGHNUT_CHART_OPTIONS } from '@shared/constants';
import { preparePickTypeDistribution } from '@shared/utils';
import type { Pick } from '@shared/types';

interface PickTypeDistributionChartProps {
  readonly picks: Pick[];
  readonly title?: string;
  readonly height?: number;
}

export function PickTypeDistributionChart({
  picks,
  title = 'Distribución por Tipo de Pick',
  height = 200,
}: PickTypeDistributionChartProps) {
  // Check if there are picks
  if (!picks || picks.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">No hay datos disponibles</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = preparePickTypeDistribution(picks);

  // Check if there's any data
  const hasData = chartData.datasets[0].data.length > 0;

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">Sin tipos de pick</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
      <h3 className="mb-3 text-sm font-medium text-slate-200">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <Doughnut data={chartData} options={DOUGHNUT_CHART_OPTIONS} />
      </div>
    </div>
  );
}
