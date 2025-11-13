/**
 * Módulo de utilidades para cálculos estadísticos.
 * @fileoverview Módulo de utilidades para cálculos estadísticos
 * @module calculations
 */

import { state } from "../core/state.js";
import { filterTipsters } from "./filters.js";

function calculateTraceability(tipsterId) {
  const tipsterPicks = state.picks.filter(p => p.tipsterId === tipsterId).sort((a, b) => new Date(a.date) - new Date(b.date));
  const tipsterFollows = state.userFollows.filter(f => f.tipsterId === tipsterId);

  if (tipsterFollows.length === 0) {
    return 0;
  }
  
  const followedPickIds = tipsterFollows.map(f => f.pickId);
  const firstFollowedPickIndex = tipsterPicks.findIndex(p => followedPickIds.includes(p.id));
  
  if (firstFollowedPickIndex === -1) {
    return 0;
  }
  
  const picksFromFirstFollow = tipsterPicks.slice(firstFollowedPickIndex);
  const totalPicksSinceFirstFollow = picksFromFirstFollow.length;
  
  const followedCount = picksFromFirstFollow.filter(p => followedPickIds.includes(p.id)).length;
  
  return totalPicksSinceFirstFollow > 0 ? ((followedCount / totalPicksSinceFirstFollow) * 100).toFixed(2) : 0;
}

function calculateStats(tipsterId) {
  const tipsterPicks = state.picks.filter(p => p.tipsterId === tipsterId);
  const resolvedPicks = tipsterPicks.filter(p => p.isResolved && p.result !== 'Void');
  const wonPicks = resolvedPicks.filter(p => p.result === 'Ganada');
  
  const totalPicks = tipsterPicks.length;
  const winrate = resolvedPicks.length > 0 ? (wonPicks.length / resolvedPicks.length * 100).toFixed(2) : 0;
  
  let totalProfit = 0;
  let totalStaked = 0;
  
  resolvedPicks.forEach(pick => {
    totalStaked += pick.stake;
    if (pick.result === 'Ganada') {
      totalProfit += (pick.odds - 1) * pick.stake;
    } else if (pick.result === 'Perdida') {
      totalProfit -= pick.stake;
    }
  });
  
  const yield_ = totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
  
  const avgOdds = tipsterPicks.length > 0 
    ? (tipsterPicks.reduce((sum, p) => sum + p.odds, 0) / tipsterPicks.length).toFixed(2)
    : 0;
  
  const avgStake = tipsterPicks.length > 0
    ? (tipsterPicks.reduce((sum, p) => sum + p.stake, 0) / tipsterPicks.length).toFixed(2)
    : 0;
  
  const oddsRanges = {
    '1.00-1.50': tipsterPicks.filter(p => p.odds >= 1.00 && p.odds <= 1.50).length,
    '1.51-2.00': tipsterPicks.filter(p => p.odds > 1.50 && p.odds <= 2.00).length,
    '2.01-3.00': tipsterPicks.filter(p => p.odds > 2.00 && p.odds <= 3.00).length,
    '3.01+': tipsterPicks.filter(p => p.odds > 3.00).length
  };
  
  const oddsDistribution = {};
  Object.keys(oddsRanges).forEach(range => {
    oddsDistribution[range] = tipsterPicks.length > 0
      ? ((oddsRanges[range] / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  });
  
  const stakeDistribution = {};
  for (let i = 1; i <= 10; i++) {
    const count = tipsterPicks.filter(p => p.stake === i).length;
    stakeDistribution[i] = tipsterPicks.length > 0
      ? ((count / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  }
  
  const sportDistribution = {};
  const sports = ['Fútbol', 'Baloncesto', 'Tenis', 'Fútbol Americano', 'Hockey', 'Béisbol', 'Otros'];
  sports.forEach(sport => {
    const count = tipsterPicks.filter(p => p.sport === sport).length;
    sportDistribution[sport] = tipsterPicks.length > 0
      ? ((count / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  });
  
  const pickTypeDistribution = {};
  const types = ['Pre', 'Combinado', 'Live'];
  types.forEach(type => {
    const count = tipsterPicks.filter(p => p.pickType === type).length;
    pickTypeDistribution[type] = tipsterPicks.length > 0
      ? ((count / tipsterPicks.length) * 100).toFixed(2)
      : 0;
  });
  
  const seguibilidad = calculateTraceability(tipsterId);
  
  return {
    totalPicks,
    winrate,
    yield: yield_,
    avgOdds,
    avgStake,
    totalProfit: totalProfit.toFixed(2),
    oddsDistribution,
    stakeDistribution,
    sportDistribution,
    pickTypeDistribution,
    resolvedCount: resolvedPicks.length,
    wonCount: wonPicks.length,
    seguibilidad: seguibilidad
  };
}

function calculateDashboardPersonalStats() {
  const filteredTipsters = filterTipsters();
  const filteredTipsterIds = filteredTipsters.map(t => t.id);
  
  const relevantFollows = state.userFollows.filter(f => filteredTipsterIds.includes(f.tipsterId));
  const resolvedFollows = relevantFollows.filter(f => f.isResolved && f.userResult !== 'Void');
  const wonFollows = resolvedFollows.filter(f => f.userResult === 'Ganada');
  
  const totalFollowed = relevantFollows.length;
  const winrate = resolvedFollows.length > 0 ? (wonFollows.length / resolvedFollows.length * 100).toFixed(2) : 0;
  
  let totalStaked = 0;
  let totalProfit = 0;
  resolvedFollows.forEach(f => {
    totalStaked += f.userStake;
    totalProfit += f.profitFromFollow;
  });
  
  const yield_ = totalStaked > 0 ? (totalProfit / totalStaked * 100).toFixed(2) : 0;
  const avgOdds = relevantFollows.length > 0 ? (relevantFollows.reduce((sum, f) => sum + f.userOdds, 0) / relevantFollows.length).toFixed(2) : 0;
  const avgStake = relevantFollows.length > 0 ? (relevantFollows.reduce((sum, f) => sum + f.userStake, 0) / relevantFollows.length).toFixed(2) : 0;
  
  const bookmakers = {};
  relevantFollows.forEach(f => {
    if (f.userBookmaker) {
      bookmakers[f.userBookmaker] = (bookmakers[f.userBookmaker] || 0) + 1;
    }
  });
  const favBook = Object.keys(bookmakers).length > 0 ? Object.keys(bookmakers).reduce((a, b) => bookmakers[a] > bookmakers[b] ? a : b) : 'N/A';
  
  const bookmakerProfits = {};
  resolvedFollows.forEach(f => {
    if (f.userBookmaker) {
      bookmakerProfits[f.userBookmaker] = (bookmakerProfits[f.userBookmaker] || 0) + f.profitFromFollow;
    }
  });
  const bestBook = Object.keys(bookmakerProfits).length > 0 ? Object.keys(bookmakerProfits).reduce((a, b) => bookmakerProfits[a] > bookmakerProfits[b] ? a : b) : 'N/A';
  
  return {
    totalFollowed,
    winrate,
    yield: yield_,
    avgOdds,
    avgStake,
    favBook,
    bestBook,
    totalProfit: totalProfit.toFixed(2)
  };
}

function calculatePickProfit(pick) {
  if (!pick.isResolved || pick.result === 'Void') return 0;
  if (pick.result === 'Ganada') {
    return (pick.odds - 1) * pick.stake;
  } else if (pick.result === 'Perdida') {
    return -pick.stake;
  }
  return 0;
}

export { calculateStats, calculateDashboardPersonalStats, calculatePickProfit };