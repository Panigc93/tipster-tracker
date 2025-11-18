/**
 * Hook for managing dashboard filters state and logic
 * Handles filtering, sorting, and search of tipsters
 */

import { useState, useMemo, useCallback } from 'react';
import { useTipsters } from '@features/tipsters/hooks';
import { usePicks } from '@features/picks/hooks';
import { useFollows } from '@features/follows/hooks';
import {
  initialDashboardFilters,
  calculateTipsterStats,
  filterTipsters,
  sortTipsters,
  countActiveFilters,
  type DashboardFiltersState,
  type TipsterWithStats,
} from '../utils/dashboard-filters.utils';

/**
 * Hook return interface
 */
export interface UseDashboardFiltersReturn {
  // Filtered and sorted tipsters
  tipsters: TipsterWithStats[];
  
  // Filter state
  filters: DashboardFiltersState;
  activeFiltersCount: number;
  
  // Filter actions
  setSports: (sports: string[]) => void;
  setChannels: (channels: string[]) => void;
  setYieldMin: (yieldMin: number) => void;
  setLastPickDays: (days: DashboardFiltersState['lastPickDays']) => void;
  setSortBy: (sortBy: DashboardFiltersState['sortBy']) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  
  // Loading state
  isLoading: boolean;
}

/**
 * Hook to manage dashboard filters and get filtered tipsters
 */
export function useDashboardFilters(): UseDashboardFiltersReturn {
  const { tipsters: rawTipsters } = useTipsters();
  const { picks } = usePicks();
  const { follows } = useFollows();

  // Filter state
  const [filters, setFilters] = useState<DashboardFiltersState>(initialDashboardFilters);

  // Calculate tipsters with stats
  const tipstersWithStats = useMemo<TipsterWithStats[]>(() => {
    return rawTipsters.map((tipster) => 
      calculateTipsterStats(tipster, picks, follows)
    );
  }, [rawTipsters, picks, follows]);

  // Apply filters and sorting
  const filteredAndSortedTipsters = useMemo(() => {
    const filtered = filterTipsters(tipstersWithStats, filters, picks);
    return sortTipsters(filtered, filters.sortBy);
  }, [tipstersWithStats, filters, picks]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);

  // Filter actions
  const setSports = useCallback((sports: string[]) => {
    setFilters((prev) => ({ ...prev, sports }));
  }, []);

  const setChannels = useCallback((channels: string[]) => {
    setFilters((prev) => ({ ...prev, channels }));
  }, []);

  const setYieldMin = useCallback((yieldMin: number) => {
    setFilters((prev) => ({ ...prev, yieldMin }));
  }, []);

  const setLastPickDays = useCallback((lastPickDays: DashboardFiltersState['lastPickDays']) => {
    setFilters((prev) => ({ ...prev, lastPickDays }));
  }, []);

  const setSortBy = useCallback((sortBy: DashboardFiltersState['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialDashboardFilters);
  }, []);

  // Simple loading check based on data availability
  const isLoading = rawTipsters.length === 0 && picks.length === 0;

  return {
    tipsters: filteredAndSortedTipsters,
    filters,
    activeFiltersCount,
    setSports,
    setChannels,
    setYieldMin,
    setLastPickDays,
    setSortBy,
    setSearchQuery,
    resetFilters,
    isLoading,
  };
}
