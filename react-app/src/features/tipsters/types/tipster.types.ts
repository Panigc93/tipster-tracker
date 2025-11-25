import type { Tipster, CreateTipsterDTO, UpdateTipsterDTO } from '@/shared/types';

export type { Tipster, CreateTipsterDTO, UpdateTipsterDTO };

/**
 * Tipster with computed statistics
 * Extended type for display purposes
 */
export interface TipsterWithStats extends Tipster {
  totalPicks: number;
  resolvedPicks: number;
  wonPicks: number;
  winrate: number;
  yield: number;
  totalProfit: number;
  totalStaked: number;
  avgOdds: number;
  avgStake: number;
}
