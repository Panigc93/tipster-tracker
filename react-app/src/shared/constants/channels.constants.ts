/**
 * @fileoverview Constantes relacionadas con canales de tipsters
 * @module shared/constants/channels
 */

import type { Channel } from '@shared/types';

/**
 * Lista completa de canales disponibles para tipsters
 * @constant
 */
export const ALL_CHANNELS: readonly Channel[] = [
  'BlogaBet',
  'Telegram',
  'TipsterLand',
  'Twitter/X',
  'Discord',
  'Otro',
] as const;

/**
 * Verifica si un string es un canal válido
 * @param value - El valor a verificar
 * @returns true si es un canal válido
 */
export function isValidChannel(value: string): value is Channel {
  return ALL_CHANNELS.includes(value as Channel);
}

/**
 * Obtiene un nombre de canal normalizado
 * @param channel - El canal a normalizar
 * @returns El nombre del canal
 */
export function getChannelName(channel: Channel): string {
  return channel;
}
