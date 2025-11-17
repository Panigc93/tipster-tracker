/**
 * @fileoverview Calculate tipster statistics from picks
 * @module features/tipsters/utils/calculate-stats
 */

import type { Pick } from '@shared/types';

export interface TipsterStats {
  totalPicks: number;
  resolvedPicks: number;
  pendingPicks: number;
  wonPicks: number;
  lostPicks: number;
  voidPicks: number;
  winrate: number;
  yield: number;
  profit: number;
  totalStaked: number;
  avgOdds: number;
  avgStake: number;
}

/**
 * Calculate profit for a single pick
 */
const calculatePickProfit = (pick: Pick): number => {
  if (!pick.isResolved) return 0;

  switch (pick.result) {
    case 'Ganada':
      return (pick.odds - 1) * pick.stake;
    case 'Perdida':
      return -pick.stake;
    case 'Void':
      return 0;
    default:
      return 0;
  }
};

/**
 * Calculate comprehensive statistics for a tipster's picks
 */
export function calculateTipsterStats(picks: Pick[]): TipsterStats {
  const totalPicks = picks.length;
  const resolvedPicks = picks.filter((p) => p.isResolved);
  const pendingPicks = picks.filter((p) => !p.isResolved);

  const wonPicks = picks.filter((p) => p.result === 'Ganada');
  const lostPicks = picks.filter((p) => p.result === 'Perdida');
  const voidPicks = picks.filter((p) => p.result === 'Void');

  // Calculate profit and staked
  let totalProfit = 0;
  let totalStaked = 0;

  for (const pick of resolvedPicks) {
    totalProfit += calculatePickProfit(pick);
    if (pick.result !== 'Void') {
      totalStaked += pick.stake;
    }
  }

  // Calculate winrate (excluding voids)
  const picksForWinrate = resolvedPicks.length - voidPicks.length;
  const winrate = picksForWinrate > 0 ? (wonPicks.length / picksForWinrate) * 100 : 0;

  // Calculate yield
  const yieldValue = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;

  // Calculate averages
  const avgOdds = resolvedPicks.length > 0
    ? resolvedPicks.reduce((sum, p) => sum + p.odds, 0) / resolvedPicks.length
    : 0;

  const avgStake = resolvedPicks.length > 0
    ? resolvedPicks.reduce((sum, p) => sum + p.stake, 0) / resolvedPicks.length
    : 0;

  return {
    totalPicks,
    resolvedPicks: resolvedPicks.length,
    pendingPicks: pendingPicks.length,
    wonPicks: wonPicks.length,
    lostPicks: lostPicks.length,
    voidPicks: voidPicks.length,
    winrate: Number(winrate.toFixed(1)),
    yield: Number(yieldValue.toFixed(2)),
    profit: Number(totalProfit.toFixed(2)),
    totalStaked: Number(totalStaked.toFixed(2)),
    avgOdds: Number(avgOdds.toFixed(2)),
    avgStake: Number(avgStake.toFixed(2)),
  };
}
