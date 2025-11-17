/**
 * @fileoverview Constantes relacionadas con casas de apuestas
 * @module shared/constants/bookmakers
 */

import type { Bookmaker } from '@shared/types';

/**
 * Lista completa de casas de apuestas disponibles
 * @constant
 */
export const ALL_BOOKMAKERS: readonly Bookmaker[] = [
  '1xBet',
  'Betfair',
  'Bet365',
  'William Hill',
  'Marathonbet',
  '888',
  'Bwin',
  'Codere',
  'Luckia',
  'Sportium',
  'Betsson',
  'Betway',
  'Interwetten',
  'Kirolbet',
  'Casumo',
  'LeoVegas',
  'Winamax',
  'Paf',
  'Pastón',
  'Olybet',
  'TonyBet',
  'Marca Apuestas',
  'Suertia',
  'Yaas',
  'Versus',
  'Retabet',
  'Opabets',
  'Otro',
] as const;

/**
 * Verifica si un string es una casa de apuestas válida
 * @param value - El valor a verificar
 * @returns true si es una casa de apuestas válida
 */
export function isValidBookmaker(value: string): value is Bookmaker {
  return ALL_BOOKMAKERS.includes(value as Bookmaker);
}

/**
 * Obtiene el nombre de una casa de apuestas
 * @param bookmaker - La casa de apuestas
 * @returns El nombre de la casa de apuestas
 */
export function getBookmakerName(bookmaker: Bookmaker): string {
  return bookmaker;
}
