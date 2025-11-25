/**
 * Chart data preparation utilities
 * Functions to transform picks/follows data into Chart.js datasets
 */

import type { Pick, UserFollow } from '@shared/types';
import { CHART_COLORS } from '@shared/constants';

/**
 * Odds ranges for grouping
 */
const ODDS_RANGES = [
  { label: '< 1.5', min: 0, max: 1.5 },
  { label: '1.5 - 2', min: 1.5, max: 2 },
  { label: '2 - 3', min: 2, max: 3 },
  { label: '3 - 5', min: 3, max: 5 },
  { label: '> 5', min: 5, max: Infinity },
] as const;

/**
 * Prepare odds distribution data for bar chart with gradient
 */
export function prepareOddsDistribution(picks: Pick[]) {
  const distribution = ODDS_RANGES.map((range) => ({
    label: range.label,
    count: picks.filter((pick) => pick.odds >= range.min && pick.odds < range.max).length,
  }));

  return {
    labels: distribution.map((d) => d.label),
    datasets: [
      {
        label: 'Picks por Cuota',
        data: distribution.map((d) => d.count),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return CHART_COLORS[0];
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, CHART_COLORS[0] + '80'); // 50% opacity at bottom
          gradient.addColorStop(1, CHART_COLORS[0]); // Full opacity at top
          return gradient;
        },
        borderWidth: 0,
      },
    ],
  };
}

/**
 * Prepare stake distribution data for bar chart with gradient
 */
export function prepareStakeDistribution(picks: Pick[]) {
  const stakes = Array.from({ length: 10 }, (_, i) => i + 1);
  const distribution = stakes.map((stake) => ({
    label: `${stake}u`,
    count: picks.filter((pick) => pick.stake === stake).length,
  }));

  return {
    labels: distribution.map((d) => d.label),
    datasets: [
      {
        label: 'Picks por Stake',
        data: distribution.map((d) => d.count),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return CHART_COLORS[1];
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, CHART_COLORS[1] + '80'); // 50% opacity at bottom
          gradient.addColorStop(1, CHART_COLORS[1]); // Full opacity at top
          return gradient;
        },
        borderWidth: 0,
      },
    ],
  };
}

/**
 * Prepare sport distribution data for doughnut chart
 */
export function prepareSportDistribution(picks: Pick[]) {
  // Count picks by sport
  const sportCounts = picks.reduce(
    (acc, pick) => {
      const sport = pick.sport;
      acc[sport] = (acc[sport] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort by count descending
  const sorted = Object.entries(sportCounts).sort(([, a], [, b]) => b - a);

  return {
    labels: sorted.map(([sport]) => sport),
    datasets: [
      {
        data: sorted.map(([, count]) => count),
        backgroundColor: sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderWidth: 0,
      },
    ],
  };
}

/**
 * Prepare pick type distribution data for doughnut chart
 */
export function preparePickTypeDistribution(picks: Pick[]) {
  // Count picks by type
  const typeCounts = picks.reduce(
    (acc, pick) => {
      const type = pick.pickType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort by count descending
  const sorted = Object.entries(typeCounts).sort(([, a], [, b]) => b - a);

  return {
    labels: sorted.map(([type]) => type),
    datasets: [
      {
        data: sorted.map(([, count]) => count),
        backgroundColor: sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderWidth: 0,
      },
    ],
  };
}

/**
 * Prepare odds distribution for follows (user data) with gradient
 */
export function prepareFollowOddsDistribution(follows: UserFollow[]) {
  const distribution = ODDS_RANGES.map((range) => ({
    label: range.label,
    count: follows.filter(
      (follow) => follow.userOdds >= range.min && follow.userOdds < range.max,
    ).length,
  }));

  return {
    labels: distribution.map((d) => d.label),
    datasets: [
      {
        label: 'Follows por Cuota',
        data: distribution.map((d) => d.count),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return CHART_COLORS[2];
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, CHART_COLORS[2] + '80'); // 50% opacity at bottom
          gradient.addColorStop(1, CHART_COLORS[2]); // Full opacity at top
          return gradient;
        },
        borderWidth: 0,
      },
    ],
  };
}

/**
 * Prepare stake distribution for follows (user data) with gradient
 */
export function prepareFollowStakeDistribution(follows: UserFollow[]) {
  const stakes = Array.from({ length: 10 }, (_, i) => i + 1);
  const distribution = stakes.map((stake) => ({
    label: `${stake}u`,
    count: follows.filter((follow) => follow.userStake === stake).length,
  }));

  return {
    labels: distribution.map((d) => d.label),
    datasets: [
      {
        label: 'Follows por Stake',
        data: distribution.map((d) => d.count),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return CHART_COLORS[3];
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, CHART_COLORS[3] + '80'); // 50% opacity at bottom
          gradient.addColorStop(1, CHART_COLORS[3]); // Full opacity at top
          return gradient;
        },
        borderWidth: 0,
      },
    ],
  };
}
