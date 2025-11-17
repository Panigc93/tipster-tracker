import type { Pick, UserFollow } from '@/shared/types';

/**
 * Traceability and comparison stats between tipster picks and user follows
 */
export interface TraceabilityStats {
  // Basic counts
  totalPicks: number;
  totalFollows: number;
  followRate: number; // Percentage of picks followed

  // Tipster stats (from picks)
  tipsterResolvedPicks: number;
  tipsterWonPicks: number;
  tipsterWinrate: number;
  tipsterYield: number;
  tipsterProfit: number;
  tipsterTotalStaked: number;
  tipsterAvgOdds: number;
  tipsterAvgStake: number;

  // User stats (from follows)
  userResolvedFollows: number;
  userWonFollows: number;
  userWinrate: number;
  userYield: number;
  userProfit: number;
  userTotalStaked: number;
  userAvgOdds: number;
  userAvgStake: number;

  // Comparison
  matchCount: number; // Same result between tipster and user
  divergeCount: number; // Different result
  matchRate: number; // Percentage of follows that matched tipster result
  
  // Differences
  winrateDiff: number;
  yieldDiff: number;
  profitDiff: number;
  avgOddsDiff: number;
  avgStakeDiff: number;
}

/**
 * Calculate traceability and comparison stats
 * 
 * Compares tipster's picks with user's follows for that tipster
 * 
 * @param picks - All picks from the tipster
 * @param follows - All follows from the user for this tipster
 * @returns Comprehensive comparison statistics
 */
export function calculateTraceability(
  picks: Pick[],
  follows: UserFollow[]
): TraceabilityStats {
  // Filter picks and follows for this tipster
  const tipsterPicks = picks;
  const userFollows = follows;

  // Tipster stats
  const tipsterResolvedPicks = tipsterPicks.filter((p) => p.isResolved);
  const tipsterWonPicks = tipsterResolvedPicks.filter((p) => p.result === 'Ganada');

  const tipsterTotalStaked = tipsterResolvedPicks.reduce((sum, p) => {
    if (p.result === 'Void') return sum;
    return sum + p.stake;
  }, 0);

  const tipsterProfit = tipsterResolvedPicks.reduce((sum, p) => {
    if (p.result === 'Ganada') {
      return sum + (p.odds - 1) * p.stake;
    } else if (p.result === 'Perdida') {
      return sum - p.stake;
    }
    return sum; // Void
  }, 0);

  const tipsterYield = tipsterTotalStaked > 0 ? (tipsterProfit / tipsterTotalStaked) * 100 : 0;
  const tipsterWinrate = tipsterResolvedPicks.length > 0 
    ? (tipsterWonPicks.length / tipsterResolvedPicks.length) * 100 
    : 0;

  const tipsterAvgOdds = tipsterResolvedPicks.length > 0
    ? tipsterResolvedPicks.reduce((sum, p) => sum + p.odds, 0) / tipsterResolvedPicks.length
    : 0;

  const tipsterAvgStake = tipsterResolvedPicks.length > 0
    ? tipsterResolvedPicks.reduce((sum, p) => sum + p.stake, 0) / tipsterResolvedPicks.length
    : 0;

  // User stats
  const userResolvedFollows = userFollows.filter((f) => f.isResolved);
  const userWonFollows = userResolvedFollows.filter((f) => f.userResult === 'Ganada');

  const userTotalStaked = userResolvedFollows.reduce((sum, f) => {
    if (f.userResult === 'Void') return sum;
    return sum + f.userStake;
  }, 0);

  const userProfit = userResolvedFollows.reduce((sum, f) => sum + (f.profitFromFollow || 0), 0);

  const userYield = userTotalStaked > 0 ? (userProfit / userTotalStaked) * 100 : 0;
  const userWinrate = userResolvedFollows.length > 0
    ? (userWonFollows.length / userResolvedFollows.length) * 100
    : 0;

  const userAvgOdds = userResolvedFollows.length > 0
    ? userResolvedFollows.reduce((sum, f) => sum + f.userOdds, 0) / userResolvedFollows.length
    : 0;

  const userAvgStake = userResolvedFollows.length > 0
    ? userResolvedFollows.reduce((sum, f) => sum + f.userStake, 0) / userResolvedFollows.length
    : 0;

  // Match/Diverge calculation
  let matchCount = 0;
  let divergeCount = 0;

  for (const follow of userFollows) {
    if (!follow.isResolved) continue;

    const originalPick = tipsterPicks.find((p) => p.id === follow.pickId);
    if (!originalPick?.isResolved) continue;

    if (follow.userResult === originalPick.result) {
      matchCount++;
    } else {
      divergeCount++;
    }
  }

  const matchRate = userResolvedFollows.length > 0 
    ? (matchCount / userResolvedFollows.length) * 100 
    : 0;

  // Follow rate (percentage of picks followed)
  const followRate = tipsterPicks.length > 0 
    ? (userFollows.length / tipsterPicks.length) * 100 
    : 0;

  // Differences
  const winrateDiff = userWinrate - tipsterWinrate;
  const yieldDiff = userYield - tipsterYield;
  const profitDiff = userProfit - tipsterProfit;
  const avgOddsDiff = userAvgOdds - tipsterAvgOdds;
  const avgStakeDiff = userAvgStake - tipsterAvgStake;

  return {
    // Counts
    totalPicks: tipsterPicks.length,
    totalFollows: userFollows.length,
    followRate,

    // Tipster
    tipsterResolvedPicks: tipsterResolvedPicks.length,
    tipsterWonPicks: tipsterWonPicks.length,
    tipsterWinrate,
    tipsterYield,
    tipsterProfit,
    tipsterTotalStaked,
    tipsterAvgOdds,
    tipsterAvgStake,

    // User
    userResolvedFollows: userResolvedFollows.length,
    userWonFollows: userWonFollows.length,
    userWinrate,
    userYield,
    userProfit,
    userTotalStaked,
    userAvgOdds,
    userAvgStake,

    // Comparison
    matchCount,
    divergeCount,
    matchRate,

    // Differences
    winrateDiff,
    yieldDiff,
    profitDiff,
    avgOddsDiff,
    avgStakeDiff,
  };
}
