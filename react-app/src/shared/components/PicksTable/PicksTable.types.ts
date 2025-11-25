/**
 * @fileoverview PicksTable types and interfaces
 * @module shared/components/PicksTable
 */

import type { Pick, UserFollow } from '@/shared/types';

/**
 * Table mode - determines which data and columns to show
 */
export type PicksTableMode = 'picks' | 'follows';

/**
 * Column configuration
 */
export interface PicksTableColumns {
  date?: boolean;
  tipster?: boolean;
  match?: boolean;
  sport?: boolean;
  pickType?: boolean;
  betType?: boolean;
  odds?: boolean;
  stake?: boolean;
  bookmaker?: boolean;
  result?: boolean;
  profit?: boolean;
  matchComparison?: boolean; // Only for follows mode
  actions?: boolean;
}

/**
 * Props for PicksTable component
 */
export interface PicksTableProps {
  // Mode
  mode: PicksTableMode;
  
  // Data
  data: Pick[] | UserFollow[];
  picks?: Pick[]; // Required for follows mode (to get original pick data)
  
  // Column configuration (optional - defaults based on mode)
  columns?: Partial<PicksTableColumns>;
  
  // Sorting
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  
  // Actions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (item: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete?: (item: any) => void;
  onFollow?: (pick: Pick) => void; // Only for picks mode
  
  // State
  isFollowed?: (pickId: string) => boolean; // For showing if pick is already followed
  
  // Helpers
  getTipsterName: (tipsterId: string) => string;
  
  // UI
  title?: string;
  showActions?: boolean;
  emptyMessage?: string;
}

/**
 * Internal enriched data type for follows
 */
export interface EnrichedFollow extends UserFollow {
  sport: string;
}
