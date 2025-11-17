/**
 * @fileoverview Utilidades para validación de datos
 * @module shared/utils/validation
 */

/**
 * Valida que un email sea válido
 * @param email - Email a validar
 * @returns true si es válido
 * @example
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid') // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que una cuota (odds) sea válida
 * @param odds - Cuota a validar
 * @returns true si es >= 1.01
 * @example
 * isValidOdds(1.85) // true
 * isValidOdds(0.5) // false
 */
export function isValidOdds(odds: number): boolean {
  return odds >= 1.01;
}

/**
 * Valida que un stake sea válido
 * @param stake - Stake a validar
 * @returns true si está entre 1 y 10
 * @example
 * isValidStake(5) // true
 * isValidStake(0) // false
 * isValidStake(11) // false
 */
export function isValidStake(stake: number): boolean {
  return stake >= 1 && stake <= 10;
}

/**
 * Valida que un string no esté vacío
 * @param value - String a validar
 * @returns true si no está vacío
 * @example
 * isNotEmpty('hello') // true
 * isNotEmpty('   ') // false
 * isNotEmpty('') // false
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Valida que un número esté dentro de un rango
 * @param value - Número a validar
 * @param min - Valor mínimo (inclusive)
 * @param max - Valor máximo (inclusive)
 * @returns true si está en el rango
 * @example
 * isInRange(5, 1, 10) // true
 * isInRange(0, 1, 10) // false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Valida que un string tenga una longitud mínima
 * @param value - String a validar
 * @param minLength - Longitud mínima
 * @returns true si cumple la longitud
 * @example
 * hasMinLength('password', 6) // true
 * hasMinLength('pass', 6) // false
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Valida que un string tenga una longitud máxima
 * @param value - String a validar
 * @param maxLength - Longitud máxima
 * @returns true si cumple la longitud
 * @example
 * hasMaxLength('hello', 10) // true
 * hasMaxLength('hello world', 5) // false
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Valida que un valor no sea null ni undefined
 * @param value - Valor a validar
 * @returns true si no es null ni undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Valida que un número sea positivo
 * @param value - Número a validar
 * @returns true si es mayor a 0
 * @example
 * isPositive(5) // true
 * isPositive(0) // false
 * isPositive(-5) // false
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Valida que un número sea no negativo (0 o mayor)
 * @param value - Número a validar
 * @returns true si es >= 0
 * @example
 * isNonNegative(5) // true
 * isNonNegative(0) // true
 * isNonNegative(-5) // false
 */
export function isNonNegative(value: number): boolean {
  return value >= 0;
}

/**
 * Valida que un array no esté vacío
 * @param array - Array a validar
 * @returns true si tiene al menos un elemento
 * @example
 * isNonEmptyArray([1, 2, 3]) // true
 * isNonEmptyArray([]) // false
 */
export function isNonEmptyArray<T>(array: T[]): boolean {
  return array.length > 0;
}

/**
 * Valida que un objeto tenga al menos una propiedad
 * @param obj - Objeto a validar
 * @returns true si tiene propiedades
 * @example
 * isNonEmptyObject({ a: 1 }) // true
 * isNonEmptyObject({}) // false
 */
export function isNonEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length > 0;
}

/**
 * Valida formato de fecha YYYY-MM-DD
 * @param dateString - String de fecha
 * @returns true si tiene formato válido
 * @example
 * isValidDateFormat('2025-01-15') // true
 * isValidDateFormat('15/01/2025') // false
 */
export function isValidDateFormat(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
}

/**
 * Valida formato de hora HH:MM
 * @param timeString - String de hora
 * @returns true si tiene formato válido
 * @example
 * isValidTimeFormat('14:30') // true
 * isValidTimeFormat('2:30 PM') // false
 */
export function isValidTimeFormat(timeString: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeString);
}

/**
 * Valida que un URL sea válido
 * @param url - URL a validar
 * @returns true si es válido
 * @example
 * isValidURL('https://example.com') // true
 * isValidURL('not a url') // false
 */
export function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida múltiples condiciones
 * @param validators - Array de funciones validadoras
 * @returns true si todas las validaciones pasan
 * @example
 * validateAll([
 *   () => isNotEmpty(name),
 *   () => isValidEmail(email),
 *   () => hasMinLength(password, 6)
 * ]) // true si todas pasan
 */
export function validateAll(validators: Array<() => boolean>): boolean {
  return validators.every((validator) => validator());
}

/**
 * Valida al menos una condición
 * @param validators - Array de funciones validadoras
 * @returns true si al menos una validación pasa
 * @example
 * validateAny([
 *   () => isValidEmail(contact),
 *   () => isValidURL(contact)
 * ]) // true si al menos una pasa
 */
export function validateAny(validators: Array<() => boolean>): boolean {
  return validators.some((validator) => validator());
}
