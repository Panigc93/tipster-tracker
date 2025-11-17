/**
 * @fileoverview Constantes relacionadas con deportes
 * @module shared/constants/sports
 */

import type { Sport } from '@shared/types';

/**
 * Lista completa de deportes disponibles en la aplicación
 * @constant
 */
export const ALL_SPORTS: readonly Sport[] = [
  'Fútbol',
  'Baloncesto',
  'Tenis',
  'Fútbol Americano',
  'Hockey',
  'Béisbol',
  'Dardos',
  'Caballos',
  'Motor',
  'Esports',
  'Fórmula 1',
  'Golf',
  'Rugby',
  'Cricket',
  'Tenis de mesa',
  'Otro',
] as const;

/**
 * Mapeo de deportes a iconos emoji
 * @constant
 */
export const SPORT_ICONS: Readonly<Record<Sport, string>> = {
  Fútbol: '⚽',
  Baloncesto: '🏀',
  Tenis: '🎾',
  'Fútbol Americano': '🏈',
  Hockey: '🏒',
  Béisbol: '⚾',
  Dardos: '🎯',
  Caballos: '🐴',
  Motor: '🏎️',
  Esports: '🎮',
  'Fórmula 1': '🏁',
  Golf: '⛳',
  Rugby: '🏉',
  Cricket: '🏏',
  'Tenis de mesa': '🏓',
  Otro: '🎲',
} as const;

/**
 * Obtiene el icono para un deporte específico
 * @param sport - El deporte del que obtener el icono
 * @returns El emoji correspondiente o un icono genérico
 */
export function getSportIcon(sport: Sport): string {
  return SPORT_ICONS[sport] || SPORT_ICONS.Otro;
}

/**
 * Verifica si un string es un deporte válido
 * @param value - El valor a verificar
 * @returns true si es un deporte válido
 */
export function isValidSport(value: string): value is Sport {
  return ALL_SPORTS.includes(value as Sport);
}
