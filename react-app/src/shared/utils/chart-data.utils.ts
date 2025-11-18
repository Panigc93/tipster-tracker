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
 * Prepare odds distribution data for bar chart
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
        backgroundColor: CHART_COLORS[0],
        borderColor: CHART_COLORS[0],
        borderWidth: 1,
      },
    ],
  };
}

/**
 * Prepare stake distribution data for bar chart
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
        backgroundColor: CHART_COLORS[1],
        borderColor: CHART_COLORS[1],
        borderWidth: 1,
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
        borderColor: '#1E293B', // slate-800
        borderWidth: 2,
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
        borderColor: '#1E293B', // slate-800
        borderWidth: 2,
      },
    ],
  };
}

/**
 * Prepare odds distribution for follows (user data)
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
        backgroundColor: CHART_COLORS[2],
        borderColor: CHART_COLORS[2],
        borderWidth: 1,
      },
    ],
  };
}

/**
 * Prepare stake distribution for follows (user data)
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
        backgroundColor: CHART_COLORS[3],
        borderColor: CHART_COLORS[3],
        borderWidth: 1,
      },
    ],
  };
}
