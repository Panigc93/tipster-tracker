/**
 * @fileoverview Ejemplos de uso de los tipos TypeScript
 * @module shared/types/examples
 * 
 * Este archivo NO se usa en producción, solo como referencia y documentación
 */

import type {
  Tipster,
  Pick,
  UserFollow,
  CreateTipsterDTO,
  CreatePickDTO,
  CreateFollowDTO,
  UpdatePickDTO,
  Statistics,
  DashboardFilters,
} from './index';

import {
  Sport,
  Channel,
  Bookmaker,
  PickType,
  PickResult,
  SortBy,
  LastPickDays,
} from './enums';

// ============================================================================
// EJEMPLO 1: Crear un Tipster
// ============================================================================

export const exampleNewTipster: CreateTipsterDTO = {
  name: 'ProTipster123',
  channel: Channel.TELEGRAM,
  createdDate: '2025-11-17',
  lastPickDate: null,
};

// Tipster completo (después de guardarse en Firebase)
export const exampleTipsterCompleto: Tipster = {
  id: 'tipster-abc123', // Auto-generado por Firestore
  uid: 'user-xyz789', // Del usuario autenticado
  name: 'ProTipster123',
  channel: Channel.TELEGRAM,
  createdDate: '2025-11-17',
  lastPickDate: '2025-11-17',
};

// ============================================================================
// EJEMPLO 2: Crear un Pick
// ============================================================================

export const exampleNewPick: CreatePickDTO = {
  tipsterId: 'tipster-abc123',
  match: 'Real Madrid vs Barcelona',
  sport: Sport.FUTBOL,
  pickType: PickType.PRE,
  betType: 'Over 2.5 goles',
  bookmaker: Bookmaker.BET365,
  odds: 1.85,
  stake: 3,
  date: '2025-11-17',
  time: '21:00',
  dateTime: '2025-11-17T21:00:00',
  result: PickResult.PENDIENTE,
  isResolved: false,
  comments: 'Partido importante del clásico',
};

// Pick completo (después de guardarse)
export const examplePickCompleto: Pick = {
  id: 'pick-def456',
  uid: 'user-xyz789',
  ...exampleNewPick,
};

// ============================================================================
// EJEMPLO 3: Seguir un Pick
// ============================================================================

export const exampleNewFollow: CreateFollowDTO = {
  tipsterId: 'tipster-abc123',
  pickId: 'pick-def456',
  userBookmaker: Bookmaker.BETFAIR, // Diferente casa de apuestas
  userOdds: 1.9, // Mejor cuota que el tipster
  userStake: 2, // Stake diferente
  userBetType: 'Over 2.5 goles',
  userResult: PickResult.PENDIENTE,
  isError: false,
  dateFollowed: '2025-11-17',
  timeFollowed: '20:45',
  dateTimeFollowed: '2025-11-17T20:45:00',
  isResolved: false,
  profitFromFollow: 0, // Se calculará cuando se resuelva
  comments: 'Conseguí mejor cuota en Betfair',
};

// Follow completo
export const exampleFollowCompleto: UserFollow = {
  id: 'follow-ghi789',
  uid: 'user-xyz789',
  ...exampleNewFollow,
};

// ============================================================================
// EJEMPLO 4: Estadísticas
// ============================================================================

export const exampleEstadisticas: Statistics = {
  totalPicks: 100,
  resolvedPicks: 95,
  wonPicks: 58,
  lostPicks: 35,
  voidPicks: 2,
  winrate: 61.05, // (58 / 95) * 100
  yield: 12.5, // Porcentaje de ganancia
  totalProfit: 25.3, // Unidades ganadas
  totalStaked: 202.4, // Total apostado
  avgOdds: 1.92,
  avgStake: 2.1,
  oddsDistribution: {
    '1.0-1.5': 10,
    '1.5-2.0': 45,
    '2.0-3.0': 35,
    '3.0+': 10,
  },
  stakeDistribution: {
    '1': 20,
    '2': 30,
    '3': 25,
    '4': 15,
    '5+': 10,
  },
  sportDistribution: {
    'Fútbol': 60,
    'Baloncesto': 25,
    'Tenis': 15,
  },
  pickTypeDistribution: {
    'Pre': 70,
    'Live': 20,
    'Combinado': 10,
  },
};

// ============================================================================
// EJEMPLO 5: Filtros del Dashboard
// ============================================================================

export const exampleFiltrosDashboard: DashboardFilters = {
  sports: [Sport.FUTBOL, Sport.BALONCESTO], // Solo fútbol y baloncesto
  channels: [Channel.TELEGRAM], // Solo Telegram
  yieldMin: 5, // Yield mínimo del 5%
  lastPickDays: LastPickDays.THIRTY, // Última pick en los últimos 30 días
  sortBy: SortBy.YIELD, // Ordenar por yield
  searchQuery: 'pro', // Buscar tipsters con "pro" en el nombre
};

// Ejemplo con valores "all" (todos)
export const exampleFiltrosTodos: DashboardFilters = {
  sports: [], // Array vacío = todos
  channels: [],
  yieldMin: -1000, // -1000 = sin filtro
  lastPickDays: LastPickDays.ALL,
  sortBy: SortBy.YIELD,
  searchQuery: '',
};

// ============================================================================
// EJEMPLO 6: Actualización Parcial (Update DTO)
// ============================================================================

// Solo actualizar el resultado de un pick
export const exampleActualizarResultado: UpdatePickDTO = {
  result: PickResult.GANADA,
  isResolved: true,
};

// Actualizar múltiples campos
export const exampleActualizarVarios: UpdatePickDTO = {
  odds: 1.95, // Cuota corregida
  stake: 4, // Stake corregido
  comments: 'Cuota y stake actualizados',
};

// ============================================================================
// EJEMPLO 7: Type Guards (Verificación de tipos)
// ============================================================================

export function isPickResolved(pick: Pick): boolean {
  return pick.isResolved && pick.result !== PickResult.PENDIENTE;
}

export function isPickWon(pick: Pick): boolean {
  return pick.result === PickResult.GANADA;
}

export function calculatePickProfit(pick: Pick): number {
  if (!isPickResolved(pick)) return 0;

  switch (pick.result) {
    case PickResult.GANADA:
      return (pick.odds - 1) * pick.stake;
    case PickResult.PERDIDA:
      return -pick.stake;
    case PickResult.VOID:
      return 0;
    default:
      return 0;
  }
}

// ============================================================================
// EJEMPLO 8: Manejo de valores legacy (string)
// ============================================================================

// Los tipos aceptan string para compatibilidad con datos legacy
export const examplePickConStringLegacy: Pick = {
  id: 'pick-123',
  uid: 'user-123',
  tipsterId: 'tipster-123',
  match: 'Partido ejemplo',
  sport: 'Fútbol', // String en lugar de enum (legacy)
  pickType: 'Pre', // String en lugar de enum
  betType: 'Over 2.5',
  bookmaker: 'Bet365', // String en lugar de enum
  odds: 1.85,
  stake: 3,
  date: '2025-11-17',
  time: '21:00',
  dateTime: '2025-11-17T21:00:00',
  result: 'Ganada', // String en lugar de enum
  isResolved: true,
  comments: '',
};

// Pero se recomienda usar constantes en código nuevo
export const examplePickConEnums: Pick = {
  ...examplePickConStringLegacy,
  sport: Sport.FUTBOL, // ✅ Recomendado
  pickType: PickType.PRE, // ✅ Recomendado
  bookmaker: Bookmaker.BET365, // ✅ Recomendado
  result: PickResult.GANADA, // ✅ Recomendado
};

// ============================================================================
// EJEMPLO 9: Composición de tipos
// ============================================================================

// Combinar Pick con Follow para análisis
export interface PickWithFollow extends Pick {
  follow?: UserFollow;
}

export const examplePickConSeguimiento: PickWithFollow = {
  ...examplePickCompleto,
  follow: exampleFollowCompleto,
};

// Array de picks con sus follows
export type PicksWithFollows = PickWithFollow[];

export const exampleListadoCompleto: PicksWithFollows = [
  {
    ...examplePickCompleto,
    follow: exampleFollowCompleto,
  },
  {
    ...examplePickCompleto,
    id: 'pick-otro',
    match: 'Otro partido',
    // Sin follow
  },
];

// ============================================================================
// EJEMPLO 10: Uso con Firebase
// ============================================================================

// Datos para guardar en Firestore (sin id, con uid del usuario)
export type FirestoreCreateData<T extends { id: string; uid: string }> = Omit<
  T,
  'id' | 'uid'
> & {
  uid: string; // Siempre incluir uid del usuario autenticado
};

export function prepararParaFirestore(
  dto: CreatePickDTO,
  userId: string,
): FirestoreCreateData<Pick> {
  return {
    ...dto,
    uid: userId,
  };
}

// Uso:
export const exampleDatosParaGuardar = prepararParaFirestore(
  exampleNewPick,
  'user-xyz789',
);

// ============================================================================
// NOTAS FINALES
// ============================================================================

/*
 * 1. Siempre usar constantes tipadas en código nuevo para mejor type safety
 * 2. Los DTOs (Create/Update) facilitan la validación en forms
 * 3. El tipo `string` junto a constantes permite migración gradual
 * 4. Todos los documentos Firestore incluyen id y uid
 * 5. Las fechas siempre son strings en formato ISO
 * 6. Los cálculos (profit, yield) se hacen en utils, no en tipos
 */
