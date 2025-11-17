/**
 * @fileoverview PicksListPage types
 * @module features/picks/pages/PicksListPage
 */

/**
 * Filter state for picks list
 */
export interface PickFilters {
  tipsterId: string;
  sport: string;
  result: string;
  bookmaker: string;
  searchQuery: string;
}

/**
 * Initial filter values
 */
export const initialFilters: PickFilters = {
  tipsterId: '',
  sport: '',
  result: '',
  bookmaker: '',
  searchQuery: '',
};
