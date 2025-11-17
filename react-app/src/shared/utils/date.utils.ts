/**
 * @fileoverview Utilidades para manejo y formateo de fechas
 * @module shared/utils/date
 */

/**
 * Opciones para formateo de fechas
 */
export interface DateFormatOptions {
  locale?: string;
  format?: 'short' | 'long' | 'iso';
}

/**
 * Formatea una fecha de formato ISO/YYYY-MM-DD a formato legible español
 * @param dateString - Fecha en formato ISO (YYYY-MM-DD) o string de fecha válido
 * @param options - Opciones de formateo
 * @returns Fecha formateada (DD/MM/YYYY por defecto)
 * @example
 * formatDate('2025-01-15') // '15/01/2025'
 * formatDate('2025-01-15T20:00:00Z', { format: 'long' }) // '15 de enero de 2025'
 */
export function formatDate(
  dateString: string,
  options: DateFormatOptions = {},
): string {
  const { locale = 'es-ES', format = 'short' } = options;

  try {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString; // Retorna el string original si no es válido
    }

    if (format === 'iso') {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    if (format === 'long') {
      return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    // Default: short format (DD/MM/YYYY)
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Formatea una hora en formato HH:MM
 * @param timeString - Hora en formato HH:MM o ISO completo
 * @returns Hora formateada (HH:MM)
 * @example
 * formatTime('14:30') // '14:30'
 * formatTime('2025-01-15T14:30:00Z') // '14:30'
 */
export function formatTime(timeString: string): string {
  try {
    // Si es una hora simple HH:MM, retornarla directamente
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // Si es un ISO completo, extraer la hora
    const date = new Date(timeString);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    return timeString;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}

/**
 * Combina fecha y hora en un string ISO completo
 * @param date - Fecha en formato YYYY-MM-DD
 * @param time - Hora en formato HH:MM
 * @returns String ISO completo (YYYY-MM-DDTHH:MM:00.000Z)
 * @example
 * formatDateTime('2025-01-15', '14:30') // '2025-01-15T14:30:00.000Z'
 */
export function formatDateTime(date: string, time: string): string {
  try {
    // Asegurar formato correcto
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const timeRegex = /^(\d{2}):(\d{2})$/;
    const dateMatch = dateRegex.exec(date);
    const timeMatch = timeRegex.exec(time);

    if (!dateMatch || !timeMatch) {
      throw new Error('Invalid date or time format');
    }

    return `${date}T${time}:00.000Z`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return new Date().toISOString();
  }
}

/**
 * Parsea un string de fecha a objeto Date
 * @param dateString - String de fecha en cualquier formato válido
 * @returns Objeto Date o null si es inválido
 * @example
 * parseDate('2025-01-15') // Date object
 * parseDate('invalid') // null
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Valida si un string representa una fecha válida
 * @param dateString - String de fecha a validar
 * @returns true si es una fecha válida
 * @example
 * isValidDate('2025-01-15') // true
 * isValidDate('invalid') // false
 */
export function isValidDate(dateString: string): boolean {
  const date = parseDate(dateString);
  return date !== null;
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns Fecha actual en formato ISO date
 * @example
 * getCurrentDate() // '2025-01-15'
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Obtiene la hora actual en formato HH:MM
 * @returns Hora actual
 * @example
 * getCurrentTime() // '14:30'
 */
export function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Calcula la diferencia en días entre dos fechas
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha (default: hoy)
 * @returns Diferencia en días (número positivo o negativo)
 * @example
 * getDaysDifference('2025-01-01', '2025-01-15') // 14
 */
export function getDaysDifference(date1: string, date2?: string): number {
  const d1 = parseDate(date1);
  const d2 = date2 ? parseDate(date2) : new Date();

  if (!d1 || !d2) return 0;

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si una fecha está dentro de un rango de días desde hoy
 * @param dateString - Fecha a verificar
 * @param days - Número de días hacia atrás
 * @returns true si la fecha está dentro del rango
 * @example
 * isWithinDays('2025-01-10', 7) // true si hoy es 2025-01-15
 */
export function isWithinDays(dateString: string, days: number): boolean {
  const date = parseDate(dateString);
  if (!date) return false;

  const diffDays = getDaysDifference(dateString);
  return diffDays <= days;
}

/**
 * Formatea una unidad de tiempo con pluralización
 */
function formatTimeUnit(value: number, unit: string): string {
  const plural = value > 1 ? 's' : '';
  const unitPlural = unit === 'mes' && plural ? 'es' : plural;
  return `hace ${value} ${unit}${unitPlural}`;
}

/**
 * Formatea una fecha relativa (hace X días, hace X horas, etc.)
 * @param dateString - Fecha a formatear
 * @returns String con formato relativo
 * @example
 * formatRelativeDate('2025-01-14') // 'hace 1 día'
 * formatRelativeDate('2025-01-01') // 'hace 14 días'
 */
export function formatRelativeDate(dateString: string): string {
  const date = parseDate(dateString);
  if (!date) return dateString;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'hace un momento';
  if (diffMins < 60) return formatTimeUnit(diffMins, 'minuto');
  if (diffHours < 24) return formatTimeUnit(diffHours, 'hora');
  if (diffDays < 7) return formatTimeUnit(diffDays, 'día');
  if (diffDays < 30) return formatTimeUnit(Math.floor(diffDays / 7), 'semana');
  if (diffDays < 365) return formatTimeUnit(Math.floor(diffDays / 30), 'mes');

  return formatTimeUnit(Math.floor(diffDays / 365), 'año');
}

/**
 * Obtiene el primer día del mes actual en formato YYYY-MM-DD
 * @returns Primer día del mes
 */
export function getFirstDayOfMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Obtiene el último día del mes actual en formato YYYY-MM-DD
 * @returns Último día del mes
 */
export function getLastDayOfMonth(): string {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split('T')[0];
}
