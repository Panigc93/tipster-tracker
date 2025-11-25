/**
 * @fileoverview SportDistributionChart - Doughnut chart for sport distribution
 * @module shared/components/charts/SportDistributionChart
 */

import { Doughnut } from 'react-chartjs-2';
import { DOUGHNUT_CHART_OPTIONS, CHART_COLORS } from '@shared/constants';
import { prepareSportDistribution } from '@shared/utils';
import type { Pick } from '@shared/types';

interface SportDistributionChartProps {
  readonly picks: Pick[];
  readonly title?: string;
  readonly height?: number;
}

export function SportDistributionChart({
  picks,
  title = 'Deportes',
  height = 200,
}: SportDistributionChartProps) {
  // Prepare chart data first (before any early returns to satisfy React Hooks rules)
  const chartData = prepareSportDistribution(picks || []);

  // Check if there are picks
  if (!picks || picks.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">No hay datos disponibles</p>
      </div>
    );
  }

  // Check if there's any data
  const hasData = chartData.datasets[0].data.length > 0;

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-3">
        <p className="text-xs text-slate-400">Sin deportes</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-2 pt-3">
      <h3 className="mb-3 text-sm font-medium text-slate-200">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <Doughnut data={chartData} options={DOUGHNUT_CHART_OPTIONS} />
      </div>
      {/* External Legend */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center max-h-16 overflow-y-auto">
        {chartData.labels.map((label, index) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-xs text-slate-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
