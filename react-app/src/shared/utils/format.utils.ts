/**
 * @fileoverview Utilidades para formateo de números, moneda y texto
 * @module shared/utils/format
 */

/**
 * Formatea un número con decimales fijos
 * @param value - Número a formatear
 * @param decimals - Cantidad de decimales (default: 2)
 * @returns Número formateado como string
 * @example
 * formatNumber(123.456, 2) // '123.46'
 * formatNumber(10, 0) // '10'
 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

/**
 * Formatea un porcentaje
 * @param value - Valor del porcentaje
 * @param decimals - Cantidad de decimales (default: 2)
 * @param showSign - Mostrar símbolo % (default: true)
 * @returns Porcentaje formateado
 * @example
 * formatPercentage(45.678) // '45.68%'
 * formatPercentage(100, 0) // '100%'
 * formatPercentage(45.678, 2, false) // '45.68'
 */
export function formatPercentage(
  value: number,
  decimals = 2,
  showSign = true,
): string {
  const formatted = value.toFixed(decimals);
  return showSign ? `${formatted}%` : formatted;
}

/**
 * Formatea un número con separadores de miles
 * @param value - Número a formatear
 * @param locale - Locale para formateo (default: 'es-ES')
 * @returns Número formateado con separadores
 * @example
 * formatNumberWithSeparators(1234567.89) // '1.234.567,89'
 */
export function formatNumberWithSeparators(
  value: number,
  locale = 'es-ES',
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formatea moneda
 * @param value - Cantidad a formatear
 * @param currency - Código de moneda (default: 'EUR')
 * @param locale - Locale para formateo (default: 'es-ES')
 * @returns Cantidad formateada como moneda
 * @example
 * formatCurrency(1234.56) // '1.234,56 €'
 * formatCurrency(1000, 'USD', 'en-US') // '$1,000.00'
 */
export function formatCurrency(
  value: number,
  currency = 'EUR',
  locale = 'es-ES',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formatea unidades (stakes)
 * @param value - Número de unidades
 * @param decimals - Decimales (default: 2)
 * @returns Unidades formateadas
 * @example
 * formatUnits(5) // '5.00u'
 * formatUnits(10.5, 1) // '10.5u'
 */
export function formatUnits(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}u`;
}

/**
 * Formatea profit con signo + o -
 * @param value - Valor del profit
 * @param decimals - Decimales (default: 2)
 * @returns Profit formateado con signo
 * @example
 * formatProfit(50.5) // '+50.50'
 * formatProfit(-20.75) // '-20.75'
 * formatProfit(0) // '0.00'
 */
export function formatProfit(value: number, decimals = 2): string {
  const formatted = value.toFixed(decimals);
  if (value > 0) return `+${formatted}`;
  return formatted;
}

/**
 * Formatea cuota (odds)
 * @param odds - Valor de la cuota
 * @param decimals - Decimales (default: 2)
 * @returns Cuota formateada
 * @example
 * formatOdds(1.85) // '1.85'
 * formatOdds(2.0) // '2.00'
 */
export function formatOdds(odds: number, decimals = 2): string {
  return odds.toFixed(decimals);
}

/**
 * Formatea stake (unidades apostadas)
 * @param stake - Valor del stake
 * @returns Stake formateado
 * @example
 * formatStake(3) // '3'
 * formatStake(10) // '10'
 */
export function formatStake(stake: number): string {
  return stake.toString();
}

/**
 * Trunca un texto a una longitud máxima
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @param suffix - Sufijo a agregar (default: '...')
 * @returns Texto truncado
 * @example
 * truncateText('Este es un texto muy largo', 10) // 'Este es un...'
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix = '...',
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitaliza la primera letra de un string
 * @param text - Texto a capitalizar
 * @returns Texto capitalizado
 * @example
 * capitalize('hola mundo') // 'Hola mundo'
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convierte texto a título (primera letra de cada palabra en mayúscula)
 * @param text - Texto a convertir
 * @returns Texto en formato título
 * @example
 * toTitleCase('hola mundo cruel') // 'Hola Mundo Cruel'
 */
export function toTitleCase(text: string): string {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Formatea un resultado de pick con color
 * @param result - Resultado de la pick
 * @returns Objeto con texto y clase CSS
 * @example
 * formatResult('Ganada') // { text: 'Ganada', className: 'result-won' }
 */
export function formatResult(result: string): {
  text: string;
  className: string;
} {
  const classMap: Record<string, string> = {
    Ganada: 'result-won',
    Perdida: 'result-lost',
    Void: 'result-void',
    Pendiente: 'result-pending',
  };

  return {
    text: result,
    className: classMap[result] || 'result-default',
  };
}

/**
 * Formatea un número compacto (K, M, B)
 * @param value - Número a formatear
 * @param decimals - Decimales (default: 1)
 * @returns Número compacto
 * @example
 * formatCompactNumber(1500) // '1.5K'
 * formatCompactNumber(1500000) // '1.5M'
 */
export function formatCompactNumber(value: number, decimals = 1): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toString();
}

/**
 * Sanitiza un string para uso en HTML
 * @param text - Texto a sanitizar
 * @returns Texto sanitizado
 */
export function sanitizeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  let result = text;
  for (const [char, escaped] of Object.entries(map)) {
    result = result.replaceAll(char, escaped);
  }
  return result;
}

/**
 * Pluraliza una palabra según cantidad
 * @param count - Cantidad
 * @param singular - Forma singular
 * @param plural - Forma plural (opcional, agrega 's' por defecto)
 * @returns Palabra pluralizada
 * @example
 * pluralize(1, 'pick') // '1 pick'
 * pluralize(5, 'pick', 'picks') // '5 picks'
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const word = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${word}`;
}
