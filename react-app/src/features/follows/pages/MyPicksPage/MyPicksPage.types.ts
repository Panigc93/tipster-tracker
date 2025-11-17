/**
 * Filter types for MyPicksPage
 */
export interface MyPicksFilters {
  tipsterId: string;
  result: string;
  matchStatus: string; // 'all' | 'match' | 'diverge'
  searchQuery: string;
}

/**
 * Stats for follows
 */
export interface FollowStats {
  totalFollows: number;
  resolvedFollows: number;
  pendingFollows: number;
  wonFollows: number;
  lostFollows: number;
  voidFollows: number;
  winrate: number;
  yield: number;
  profit: number;
  totalStaked: number;
  avgOdds: number;
  avgStake: number;
  matchCount: number;
  divergeCount: number;
  matchRate: number;
}
