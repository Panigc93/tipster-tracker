/**
 * @fileoverview Tipos e interfaces principales de la aplicación
 * @module shared/types
 */

import type {
  Sport,
  Channel,
  Bookmaker,
  PickType,
  PickResult,
  SortBy,
  LastPickDays,
} from './enums';

// ============================================================================
// FIREBASE TYPES
// ============================================================================

/**
 * Campos base que todos los documentos de Firestore tienen
 */
export interface FirestoreDocument {
  id: string;
  uid: string; // ID del usuario propietario
}

/**
 * Timestamps de Firestore
 */
export interface FirestoreTimestamps {
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

// ============================================================================
// TIPSTER TYPES
// ============================================================================

/**
 * Interfaz para Tipster (pronosticador)
 */
export interface Tipster extends FirestoreDocument {
  name: string;
  channel: Channel | string; // String para manejar valores legacy
  createdDate: string; // YYYY-MM-DD
  lastPickDate: string | null; // YYYY-MM-DD o null si no hay picks
}

/**
 * Datos para crear un nuevo tipster (sin id, sin uid)
 */
export interface CreateTipsterDTO {
  name: string;
  channel: Channel | string;
  createdDate: string; // YYYY-MM-DD
  lastPickDate?: string | null;
}

/**
 * Datos para actualizar un tipster (campos opcionales)
 */
export interface UpdateTipsterDTO {
  name?: string;
  channel?: Channel | string;
  lastPickDate?: string | null;
}

// ============================================================================
// PICK TYPES
// ============================================================================

/**
 * Interfaz para Pick (pronóstico)
 */
export interface Pick extends FirestoreDocument {
  tipsterId: string; // Referencia al tipster
  match: string; // Descripción del partido/evento
  sport: Sport | string; // String para manejar valores legacy
  pickType: PickType | string;
  betType: string; // Descripción del tipo de apuesta (ej: "Over 2.5", "1X2 Local")
  bookmaker: Bookmaker | string;
  odds: number; // Cuota de la apuesta
  stake: number; // Unidades apostadas (1-10)
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  dateTime: string; // ISO completo para ordenación (YYYY-MM-DDTHH:MM:SS)
  result: PickResult | string;
  isResolved: boolean; // Si la pick está resuelta
  comments?: string; // Comentarios adicionales (opcional)
  status?: string; // 'Seguido' | 'No Seguido' (legacy)
}

/**
 * Datos para crear una nueva pick
 */
export interface CreatePickDTO {
  tipsterId: string;
  match: string;
  sport: Sport | string;
  pickType: PickType | string;
  betType: string;
  bookmaker: Bookmaker | string;
  odds: number;
  stake: number;
  date: string;
  time: string;
  dateTime: string;
  result: PickResult | string;
  isResolved: boolean;
  comments?: string;
  status?: string;
}

/**
 * Datos para actualizar una pick
 */
export interface UpdatePickDTO {
  tipsterId?: string;
  match?: string;
  sport?: Sport | string;
  pickType?: PickType | string;
  betType?: string;
  bookmaker?: Bookmaker | string;
  odds?: number;
  stake?: number;
  date?: string;
  time?: string;
  dateTime?: string;
  result?: PickResult | string;
  isResolved?: boolean;
  comments?: string;
  status?: string;
}

// ============================================================================
// FOLLOW TYPES
// ============================================================================

/**
 * Interfaz para UserFollow (seguimiento de pick por usuario)
 */
export interface UserFollow extends FirestoreDocument {
  tipsterId: string; // Referencia al tipster
  pickId: string; // Referencia a la pick original
  userBookmaker: Bookmaker | string; // Casa de apuestas del usuario
  userOdds: number; // Cuota que consiguió el usuario
  userStake: number; // Stake del usuario (1-10)
  userBetType: string; // Tipo de apuesta del usuario
  userResult: PickResult | string; // Resultado de la apuesta del usuario
  isError?: boolean; // Si hubo error en el seguimiento (opcional, default: false)
  dateFollowed: string; // YYYY-MM-DD
  timeFollowed: string; // HH:MM
  dateTimeFollowed: string; // ISO completo
  isResolved: boolean; // Si el follow está resuelto
  profitFromFollow: number; // Ganancia/pérdida del follow
  comments?: string; // Comentarios adicionales (opcional)
}

/**
 * Datos para crear un nuevo follow
 */
export interface CreateFollowDTO {
  tipsterId: string;
  pickId: string;
  userBookmaker: Bookmaker | string;
  userOdds: number;
  userStake: number;
  userBetType: string;
  userResult: PickResult | string;
  isError?: boolean;
  dateFollowed: string;
  timeFollowed: string;
  dateTimeFollowed: string;
  isResolved: boolean;
  profitFromFollow: number;
  comments?: string;
}

/**
 * Datos para actualizar un follow
 */
export interface UpdateFollowDTO {
  userBookmaker?: Bookmaker | string;
  userOdds?: number;
  userStake?: number;
  userBetType?: string;
  userResult?: PickResult | string;
  isError?: boolean;
  dateFollowed?: string;
  timeFollowed?: string;
  dateTimeFollowed?: string;
  isResolved?: boolean;
  profitFromFollow?: number;
  comments?: string;
}

// ============================================================================
// STATISTICS TYPES
// ============================================================================

/**
 * Estadísticas calculadas de un tipster o del usuario
 */
export interface Statistics {
  totalPicks: number;
  resolvedPicks: number;
  wonPicks: number;
  lostPicks: number;
  voidPicks: number;
  winrate: number; // Porcentaje (0-100)
  yield: number; // Porcentaje (-∞ to +∞)
  totalProfit: number; // Ganancia neta en unidades
  totalStaked: number; // Total apostado en unidades
  avgOdds: number; // Cuota media
  avgStake: number; // Stake medio
  oddsDistribution: Record<string, number>; // Distribución de cuotas por rango
  stakeDistribution: Record<string, number>; // Distribución de stakes
  sportDistribution: Record<string, number>; // Distribución por deporte
  pickTypeDistribution: Record<string, number>; // Distribución por tipo de pick
}

/**
 * Comparación entre estadísticas del tipster y del usuario
 */
export interface ComparisonStats {
  tipster: Statistics;
  user: Statistics;
  divergence: {
    yieldDiff: number;
    winrateDiff: number;
    profitDiff: number;
  };
}

/**
 * Estadísticas de seguibilidad de un tipster
 */
export interface TraceabilityStats {
  totalPicksSinceFirstFollow: number;
  picksFollowed: number;
  traceabilityPercentage: number; // Porcentaje (0-100)
  firstFollowDate: string | null; // YYYY-MM-DD
}

// ============================================================================
// FILTER TYPES
// ============================================================================

/**
 * Filtros del dashboard
 */
export interface DashboardFilters {
  sports: (Sport | string)[];
  channels: (Channel | string)[];
  yieldMin: number; // -1000 para sin filtro
  lastPickDays: LastPickDays | string;
  sortBy: SortBy | string;
  searchQuery: string;
}

/**
 * Filtros para la vista de All Picks
 */
export interface AllPicksFilters {
  tipsterId: string; // 'all' para todos
  sport: Sport | string; // 'all' para todos
  status: 'all' | 'resolved' | 'pending';
  channel: Channel | string; // 'all' para todos
  bookmaker: Bookmaker | string; // 'all' para todos
  result: PickResult | string; // 'all' para todos
}

/**
 * Filtros para la vista de My Picks
 */
export interface MyPicksFilters {
  tipsterId: string; // 'all' para todos
  result: PickResult | string; // 'all' para todos
  matchType: 'all' | 'match' | 'diverge'; // match: mismo resultado, diverge: diferente resultado
}

// ============================================================================
// STATE TYPES
// ============================================================================

/**
 * Estado global de autenticación
 */
export interface AuthState {
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Estado global de tipsters
 */
export interface TipstersState {
  tipsters: Tipster[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Estado global de picks
 */
export interface PicksState {
  picks: Pick[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Estado global de follows
 */
export interface FollowsState {
  follows: UserFollow[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// CHART TYPES
// ============================================================================

/**
 * Datos para gráficos de Chart.js
 */
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

/**
 * Configuración de gráficos
 */
export interface ChartConfig {
  type: 'bar' | 'line' | 'doughnut' | 'pie';
  data: ChartData;
  options?: Record<string, unknown>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Tipo para manejo de errores en la aplicación
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Tipo genérico para respuestas de operaciones CRUD
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: AppError;
}

/**
 * Tipo para paginación (futuro)
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// RE-EXPORTS FROM ENUMS
// ============================================================================

export type {
  Sport,
  Channel,
  Bookmaker,
  PickType,
  PickResult,
  SortBy,
  LastPickDays,
} from './enums';
