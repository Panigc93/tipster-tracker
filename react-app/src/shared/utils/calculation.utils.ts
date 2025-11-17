/**
 * @fileoverview Utilidades para cálculos estadísticos de tipsters, picks y follows
 * @module shared/utils/calculation
 */

import type {
  Pick,
  UserFollow,
  PickResult,
  Statistics,
  TraceabilityStats,
} from '@shared/types';

/**
 * Interfaz para distribución de rangos
 */
export interface Distribution {
  [key: string]: number;
}

/**
 * Interfaz para resultado de cálculo de profit
 */
export interface ProfitCalculation {
  profit: number;
  staked: number;
}

/**
 * Calcula el profit de una pick individual
 * @param pick - Pick a calcular
 * @returns Profit (positivo para ganada, negativo para perdida, 0 para void/pendiente)
 * @example
 * calculatePickProfit({ odds: 1.85, stake: 3, result: 'Ganada', isResolved: true })
 * // (1.85 - 1) * 3 = 2.55
 */
export function calculatePickProfit(pick: Pick): number {
  if (!pick.isResolved || pick.result === 'Void') {
    return 0;
  }

  if (pick.result === 'Ganada') {
    return (pick.odds - 1) * pick.stake;
  }

  if (pick.result === 'Perdida') {
    return -pick.stake;
  }

  return 0;
}

/**
 * Calcula el profit de un follow individual
 * @param follow - Follow a calcular
 * @returns Profit del usuario
 */
export function calculateFollowProfit(follow: UserFollow): number {
  if (!follow.isResolved || follow.userResult === 'Void') {
    return 0;
  }

  if (follow.userResult === 'Ganada') {
    return (follow.userOdds - 1) * follow.userStake;
  }

  if (follow.userResult === 'Perdida') {
    return -follow.userStake;
  }

  return 0;
}

/**
 * Calcula el yield (rentabilidad porcentual)
 * @param totalProfit - Profit total
 * @param totalStaked - Total apostado
 * @returns Yield en porcentaje
 * @example
 * calculateYield(100, 500) // 20.00 (20% de rentabilidad)
 */
export function calculateYield(
  totalProfit: number,
  totalStaked: number,
): number {
  if (totalStaked === 0) return 0;
  return (totalProfit / totalStaked) * 100;
}

/**
 * Calcula el winrate (porcentaje de aciertos)
 * @param wonCount - Cantidad de picks ganadas
 * @param totalCount - Total de picks resueltas (sin voids)
 * @returns Winrate en porcentaje
 * @example
 * calculateWinrate(15, 20) // 75.00 (75% de aciertos)
 */
export function calculateWinrate(wonCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return (wonCount / totalCount) * 100;
}

/**
 * Calcula la distribución de cuotas en rangos
 * @param picks - Array de picks
 * @returns Objeto con porcentajes por rango
 */
export function calculateOddsDistribution(picks: Pick[]): Distribution {
  const ranges = {
    '1.00-1.50': picks.filter((p) => p.odds >= 1 && p.odds <= 1.5).length,
    '1.51-2.00': picks.filter((p) => p.odds > 1.5 && p.odds <= 2).length,
    '2.01-3.00': picks.filter((p) => p.odds > 2 && p.odds <= 3).length,
    '3.01+': picks.filter((p) => p.odds > 3).length,
  };

  const total = picks.length;
  const distribution: Distribution = {};

  for (const [range, count] of Object.entries(ranges)) {
    distribution[range] = total > 0 ? (count / total) * 100 : 0;
  }

  return distribution;
}

/**
 * Calcula la distribución de stakes (1-10)
 * @param picks - Array de picks
 * @returns Objeto con porcentajes por stake
 */
export function calculateStakeDistribution(picks: Pick[]): Distribution {
  const distribution: Distribution = {};
  const total = picks.length;

  for (let stake = 1; stake <= 10; stake++) {
    const count = picks.filter((p) => p.stake === stake).length;
    distribution[stake] = total > 0 ? (count / total) * 100 : 0;
  }

  return distribution;
}

/**
 * Calcula la distribución por deporte
 * @param picks - Array de picks
 * @returns Objeto con porcentajes por deporte
 */
export function calculateSportDistribution(picks: Pick[]): Distribution {
  const distribution: Distribution = {};
  const total = picks.length;

  for (const pick of picks) {
    distribution[pick.sport] = (distribution[pick.sport] || 0) + 1;
  }

  for (const sport of Object.keys(distribution)) {
    distribution[sport] = total > 0 ? (distribution[sport] / total) * 100 : 0;
  }

  return distribution;
}

/**
 * Calcula la distribución por tipo de pick
 * @param picks - Array de picks
 * @returns Objeto con porcentajes por tipo
 */
export function calculatePickTypeDistribution(picks: Pick[]): Distribution {
  const distribution: Distribution = {};
  const total = picks.length;

  for (const pick of picks) {
    distribution[pick.pickType] = (distribution[pick.pickType] || 0) + 1;
  }

  for (const type of Object.keys(distribution)) {
    distribution[type] = total > 0 ? (distribution[type] / total) * 100 : 0;
  }

  return distribution;
}

/**
 * Calcula estadísticas completas de un tipster
 * @param picks - Array de picks del tipster
 * @param follows - Array de follows del tipster (opcional)
 * @returns Objeto Statistics con todas las métricas
 */
export function calculateTipsterStats(picks: Pick[]): Statistics {
  const resolvedPicks = picks.filter(
    (p) => p.isResolved && p.result !== 'Void',
  );
  const wonPicks = resolvedPicks.filter((p) => p.result === 'Ganada');

  let totalProfit = 0;
  let totalStaked = 0;

  for (const pick of resolvedPicks) {
    const profit = calculatePickProfit(pick);
    totalProfit += profit;
    totalStaked += pick.stake;
  }

  const avgOdds =
    picks.length > 0
      ? picks.reduce((sum, p) => sum + p.odds, 0) / picks.length
      : 0;

  const avgStake =
    picks.length > 0
      ? picks.reduce((sum, p) => sum + p.stake, 0) / picks.length
      : 0;

  return {
    totalPicks: picks.length,
    resolvedPicks: resolvedPicks.length,
    wonPicks: wonPicks.length,
    lostPicks: resolvedPicks.length - wonPicks.length,
    voidPicks: picks.filter((p) => p.result === 'Void').length,
    pendingPicks: picks.filter((p) => !p.isResolved).length,
    winrate: calculateWinrate(wonPicks.length, resolvedPicks.length),
    yield: calculateYield(totalProfit, totalStaked),
    totalProfit,
    totalStaked,
    avgOdds,
    avgStake,
    oddsDistribution: calculateOddsDistribution(picks),
    stakeDistribution: calculateStakeDistribution(picks),
    sportDistribution: calculateSportDistribution(picks),
    pickTypeDistribution: calculatePickTypeDistribution(picks),
  };
}

/**
 * Calcula la seguibilidad (traceability) de un tipster
 * Porcentaje de picks seguidas desde el primer follow
 * @param picks - Array de picks del tipster (ordenadas por fecha)
 * @param follows - Array de follows del usuario
 * @returns Objeto con métricas de seguibilidad
 */
export function calculateTraceability(
  picks: Pick[],
  follows: UserFollow[],
): TraceabilityStats {
  if (follows.length === 0) {
    return {
      traceabilityPercentage: 0,
      followedCount: 0,
      totalPicksSinceFirstFollow: 0,
      firstFollowDate: null,
    };
  }

  // Ordenar picks por fecha
  const sortedPicks = [...picks].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  );

  // IDs de picks seguidas (usar Set para mejor performance)
  const followedPickIds = new Set(follows.map((f) => f.pickId));

  // Índice del primer follow
  const firstFollowedPickIndex = sortedPicks.findIndex((p) =>
    followedPickIds.has(p.id),
  );

  if (firstFollowedPickIndex === -1) {
    return {
      traceabilityPercentage: 0,
      followedCount: 0,
      totalPicksSinceFirstFollow: 0,
      firstFollowDate: null,
    };
  }

  // Picks desde el primer follow
  const picksFromFirstFollow = sortedPicks.slice(firstFollowedPickIndex);
  const totalPicksSinceFirstFollow = picksFromFirstFollow.length;

  // Contar picks seguidas desde el primer follow
  const followedCount = picksFromFirstFollow.filter((p) =>
    followedPickIds.has(p.id),
  ).length;

  const traceabilityPercentage =
    totalPicksSinceFirstFollow > 0
      ? (followedCount / totalPicksSinceFirstFollow) * 100
      : 0;

  return {
    traceabilityPercentage,
    followedCount,
    totalPicksSinceFirstFollow,
    firstFollowDate: sortedPicks[firstFollowedPickIndex].dateTime,
  };
}

/**
 * Calcula estadísticas de los follows del usuario
 * @param follows - Array de follows del usuario
 * @returns Statistics de los follows
 */
export function calculateFollowStats(follows: UserFollow[]): Statistics {
  const resolvedFollows = follows.filter(
    (f) => f.isResolved && f.userResult !== 'Void',
  );
  const wonFollows = resolvedFollows.filter((f) => f.userResult === 'Ganada');

  let totalProfit = 0;
  let totalStaked = 0;

  for (const follow of resolvedFollows) {
    const profit = calculateFollowProfit(follow);
    totalProfit += profit;
    totalStaked += follow.userStake;
  }

  const avgOdds =
    follows.length > 0
      ? follows.reduce((sum, f) => sum + f.userOdds, 0) / follows.length
      : 0;

  const avgStake =
    follows.length > 0
      ? follows.reduce((sum, f) => sum + f.userStake, 0) / follows.length
      : 0;

  return {
    totalPicks: follows.length,
    resolvedPicks: resolvedFollows.length,
    wonPicks: wonFollows.length,
    lostPicks: resolvedFollows.length - wonFollows.length,
    voidPicks: follows.filter((f) => f.userResult === 'Void').length,
    pendingPicks: follows.filter((f) => !f.isResolved).length,
    winrate: calculateWinrate(wonFollows.length, resolvedFollows.length),
    yield: calculateYield(totalProfit, totalStaked),
    totalProfit,
    totalStaked,
    avgOdds,
    avgStake,
    oddsDistribution: {}, // No calculamos distribución para follows
    stakeDistribution: {},
    sportDistribution: {},
    pickTypeDistribution: {},
  };
}

/**
 * Compara resultado de tipster vs usuario para un follow
 * @param pickResult - Resultado de la pick del tipster
 * @param followResult - Resultado del follow del usuario
 * @returns 'match' si coinciden, 'diverge' si difieren
 */
export function compareResults(
  pickResult: PickResult,
  followResult: PickResult,
): 'match' | 'diverge' {
  return pickResult === followResult ? 'match' : 'diverge';
}

/**
 * Calcula el promedio de un array de números
 * @param numbers - Array de números
 * @returns Promedio
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Redondea un número a N decimales
 * @param value - Valor a redondear
 * @param decimals - Cantidad de decimales (default: 2)
 * @returns Número redondeado
 */
export function roundToDecimals(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
