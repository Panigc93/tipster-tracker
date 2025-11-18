/**
 * Dashboard filters utilities
 * Handles filtering, sorting, and calculating stats for tipsters in the dashboard
 */

import type { Tipster, Pick, UserFollow } from '@shared/types';
import { calculateTipsterStats as calculateStats } from '@shared/utils';
import { calculateTraceability, type TraceabilityStats } from '@features/follows/utils';

/**
 * Dashboard filters state interface
 */
export interface DashboardFiltersState {
  sports: string[];
  channels: string[];
  yieldMin: number;
  lastPickDays: 'all' | '7' | '14' | '30' | '90';
  sortBy: 'yield' | 'winrate' | 'totalPicks' | 'name' | 'traceability' | 'lastPick';
  searchQuery: string;
}

/**
 * Initial dashboard filters state
 */
export const initialDashboardFilters: DashboardFiltersState = {
  sports: [],
  channels: [],
  yieldMin: -1000, // -1000 = no filter
  lastPickDays: 'all',
  sortBy: 'yield',
  searchQuery: '',
};

/**
 * Tipster with calculated stats
 */
export interface TipsterWithStats extends Tipster {
  stats: {
    totalPicks: number;
    resolvedPicks: number;
    wonPicks: number;
    lostPicks: number;
    voidPicks: number;
    winrate: number;
    yield: number;
    totalProfit: number;
    totalStaked: number;
    avgOdds: number;
    avgStake: number;
    traceability: number;
    lastPickDate: string | null;
  };
}

/**
 * Calculate stats for a single tipster
 */
export const calculateTipsterStats = (
  tipster: Tipster,
  picks: Pick[],
  follows: UserFollow[]
): TipsterWithStats => {
  // Filter picks for this tipster
  const tipsterPicks = picks.filter((p) => p.tipsterId === tipster.id);

  // Calculate basic stats
  const pickStats = calculateStats(tipsterPicks);

  // Get last pick date
  const sortedPicks = [...tipsterPicks].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );
  const lastPickDate = sortedPicks[0]?.date || null;

  // Calculate traceability (filter follows for this tipster)
  const tipsterFollows = follows.filter((f) => f.tipsterId === tipster.id);
  const traceabilityData: TraceabilityStats = calculateTraceability(tipsterPicks, tipsterFollows);

  return {
    ...tipster,
    stats: {
      totalPicks: pickStats.totalPicks,
      resolvedPicks: pickStats.resolvedPicks,
      wonPicks: pickStats.wonPicks,
      lostPicks: pickStats.lostPicks,
      voidPicks: pickStats.voidPicks,
      winrate: pickStats.winrate,
      yield: pickStats.yield,
      totalProfit: pickStats.totalProfit,
      totalStaked: pickStats.totalStaked,
      avgOdds: pickStats.avgOdds,
      avgStake: pickStats.avgStake,
      traceability: traceabilityData.followRate,
      lastPickDate,
    },
  };
};

/**
 * Check if tipster matches search query
 */
const matchesSearchQuery = (tipster: TipsterWithStats, query: string): boolean => {
  const searchLower = query.toLowerCase();
  const nameMatch = tipster.name.toLowerCase().includes(searchLower);
  const channelMatch = tipster.channel.toLowerCase().includes(searchLower);
  return nameMatch || channelMatch;
};

/**
 * Check if tipster has picks in any of the selected sports
 */
const hasSportMatch = (tipster: TipsterWithStats, sports: string[], allPicks: Pick[]): boolean => {
  const tipsterPicks = allPicks.filter((p) => p.tipsterId === tipster.id);
  const tipsterSports = new Set(tipsterPicks.map((p) => p.sport));
  return sports.some((sport) => tipsterSports.has(sport));
};

/**
 * Check if tipster's last pick is within the specified days
 */
const matchesLastPickFilter = (tipster: TipsterWithStats, days: string): boolean => {
  if (!tipster.stats.lastPickDate) return false;
  const lastPickDate = new Date(tipster.stats.lastPickDate);
  const daysAgo = Number.parseInt(days, 10);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
  return lastPickDate >= cutoffDate;
};

/**
 * Filter tipsters based on dashboard filters
 */
export const filterTipsters = (
  tipsters: TipsterWithStats[],
  filters: DashboardFiltersState,
  allPicks: Pick[]
): TipsterWithStats[] => {
  return tipsters.filter((tipster) => {
    // Search filter
    if (filters.searchQuery && !matchesSearchQuery(tipster, filters.searchQuery)) {
      return false;
    }

    // Channel filter
    if (filters.channels.length > 0 && !filters.channels.includes(tipster.channel)) {
      return false;
    }

    // Sports filter
    if (filters.sports.length > 0 && !hasSportMatch(tipster, filters.sports, allPicks)) {
      return false;
    }

    // Yield filter
    if (filters.yieldMin > -1000 && tipster.stats.yield < filters.yieldMin) {
      return false;
    }

    // Last pick filter
    if (filters.lastPickDays !== 'all' && !matchesLastPickFilter(tipster, filters.lastPickDays)) {
      return false;
    }

    return true;
  });
};

/**
 * Sort tipsters based on sort criteria
 */
export const sortTipsters = (
  tipsters: TipsterWithStats[],
  sortBy: DashboardFiltersState['sortBy']
): TipsterWithStats[] => {
  const sorted = [...tipsters];

  switch (sortBy) {
    case 'yield':
      return sorted.sort((a, b) => b.stats.yield - a.stats.yield);

    case 'winrate':
      return sorted.sort((a, b) => b.stats.winrate - a.stats.winrate);

    case 'totalPicks':
      return sorted.sort((a, b) => b.stats.totalPicks - a.stats.totalPicks);

    case 'traceability':
      return sorted.sort((a, b) => b.stats.traceability - a.stats.traceability);

    case 'lastPick':
      return sorted.sort((a, b) => {
        if (!a.stats.lastPickDate) return 1;
        if (!b.stats.lastPickDate) return -1;
        return (
          new Date(b.stats.lastPickDate).getTime() - new Date(a.stats.lastPickDate).getTime()
        );
      });

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return sorted;
  }
};

/**
 * Count active filters
 */
export const countActiveFilters = (filters: DashboardFiltersState): number => {
  let count = 0;

  if (filters.sports.length > 0) count++;
  if (filters.channels.length > 0) count++;
  if (filters.yieldMin > -1000) count++;
  if (filters.lastPickDays !== 'all') count++;
  if (filters.searchQuery) count++;

  return count;
};
