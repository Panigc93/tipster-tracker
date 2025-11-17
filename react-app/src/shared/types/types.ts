/**
 * @fileoverview Barrel export para todos los tipos de la aplicación
 * @module shared/types
 */

// Re-exportar todos los enums/constantes y sus tipos
export * from './enums';

// Re-exportar todos los tipos e interfaces
export type {
  FirestoreDocument,
  FirestoreTimestamps,
  Tipster,
  CreateTipsterDTO,
  UpdateTipsterDTO,
  Pick,
  CreatePickDTO,
  UpdatePickDTO,
  UserFollow,
  CreateFollowDTO,
  UpdateFollowDTO,
  Statistics,
  ComparisonStats,
  TraceabilityStats,
  DashboardFilters,
  AllPicksFilters,
  MyPicksFilters,
  AuthState,
  TipstersState,
  PicksState,
  FollowsState,
  ChartData,
  ChartConfig,
  AppError,
  OperationResult,
  PaginationOptions,
  PaginatedResult,
} from './index';
