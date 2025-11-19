/**
 * @fileoverview PicksListPage types
 * @module features/picks/pages/PicksListPage
 */

/**
 * Filter state for picks list
 */
export interface PickFilters {
  // Basic filters
  tipsterId: string;
  sport: string;
  result: string;
  bookmaker: string;
  searchQuery: string;
  
  // Advanced filters
  tipsterIds: string[];        // Multi-select tipsters
  sports: string[];            // Multi-select sports
  bookmakers: string[];        // Multi-select bookmakers
  pickType: string;            // Pre, Live, Combinado
  dateFrom: string;            // YYYY-MM-DD
  dateTo: string;              // YYYY-MM-DD
  oddsMin: number | null;
  oddsMax: number | null;
  stakeMin: number | null;
  stakeMax: number | null;
}

/**
 * Initial filter values
 */
export const initialFilters: PickFilters = {
  // Basic filters
  tipsterId: '',
  sport: '',
  result: '',
  bookmaker: '',
  searchQuery: '',
  
  // Advanced filters
  tipsterIds: [],
  sports: [],
  bookmakers: [],
  pickType: '',
  dateFrom: '',
  dateTo: '',
  oddsMin: null,
  oddsMax: null,
  stakeMin: null,
  stakeMax: null,
};
