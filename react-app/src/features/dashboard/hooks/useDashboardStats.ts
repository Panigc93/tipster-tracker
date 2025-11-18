/**
 * Hook for calculating global dashboard personal stats
 * Calculates user's overall statistics from all their follows
 */

import { useMemo } from 'react';
import { useFollows } from '@features/follows/hooks';
import { usePicks } from '@features/picks/hooks';

/**
 * Personal dashboard stats interface
 */
export interface PersonalDashboardStats {
  totalFollowed: number;
  winrate: number;
  yield: number;
  avgOdds: number;
  avgStake: number;
  favoriteBookmaker: string;
  bestBookmaker: string; // Best by profit
  totalProfit: number;
}

/**
 * Calculate profit for a single follow
 */
function calculateFollowProfit(userResult: string, userOdds: number, userStake: number): number {
  if (userResult === 'Ganada') {
    return (userOdds - 1) * userStake;
  } else if (userResult === 'Perdida') {
    return -userStake;
  }
  return 0; // Void
}

/**
 * Hook to calculate personal dashboard stats from all follows
 */
export function useDashboardStats(): PersonalDashboardStats {
  const { follows } = useFollows();
  const { picks } = usePicks();

  const stats = useMemo(() => {
    // Filter resolved follows only
    const resolvedFollows = follows.filter((f) => f.isResolved);

    // Total followed
    const totalFollowed = follows.length;

    // Calculate winrate
    const wonFollows = resolvedFollows.filter((f) => f.userResult === 'Ganada');
    const winrate =
      resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length) * 100 : 0;

    // Calculate yield and profit
    const totalStaked = resolvedFollows.reduce((sum, f) => {
      if (f.userResult === 'Void') return sum;
      return sum + f.userStake;
    }, 0);

    const totalProfit = resolvedFollows.reduce((sum, f) => {
      if (f.userResult === 'Ganada') {
        return sum + (f.userOdds - 1) * f.userStake;
      } else if (f.userResult === 'Perdida') {
        return sum - f.userStake;
      }
      return sum; // Void
    }, 0);

    const yieldValue = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;

    // Calculate average odds and stake
    const avgOdds =
      resolvedFollows.length > 0
        ? resolvedFollows.reduce((sum, f) => sum + f.userOdds, 0) / resolvedFollows.length
        : 0;

    const avgStake =
      resolvedFollows.length > 0
        ? resolvedFollows.reduce((sum, f) => sum + f.userStake, 0) / resolvedFollows.length
        : 0;

    // Calculate favorite and best bookmaker
    const bookmakerStats = new Map<string, { count: number; profit: number }>();

    for (const follow of resolvedFollows) {
      // Get pick to find bookmaker
      const pick = picks.find((p) => p.id === follow.pickId);
      if (!pick?.bookmaker) continue;

      const currentStats = bookmakerStats.get(pick.bookmaker) || { count: 0, profit: 0 };
      const followProfit = calculateFollowProfit(follow.userResult, follow.userOdds, follow.userStake);

      bookmakerStats.set(pick.bookmaker, {
        count: currentStats.count + 1,
        profit: currentStats.profit + followProfit,
      });
    }

    // Find favorite (most used) bookmaker
    let favoriteBookmaker = '-';
    let maxCount = 0;
    for (const [bookmaker, stats] of bookmakerStats) {
      if (stats.count > maxCount) {
        maxCount = stats.count;
        favoriteBookmaker = bookmaker;
      }
    }

    // Find best (highest profit) bookmaker
    let bestBookmaker = '-';
    let maxProfit = -Infinity;
    for (const [bookmaker, stats] of bookmakerStats) {
      if (stats.profit > maxProfit) {
        maxProfit = stats.profit;
        bestBookmaker = bookmaker;
      }
    }

    return {
      totalFollowed,
      winrate: Math.round(winrate * 100) / 100,
      yield: Math.round(yieldValue * 100) / 100,
      avgOdds: Math.round(avgOdds * 100) / 100,
      avgStake: Math.round(avgStake * 100) / 100,
      favoriteBookmaker,
      bestBookmaker,
      totalProfit: Math.round(totalProfit * 100) / 100,
    };
  }, [follows, picks]);

  return stats;
}
