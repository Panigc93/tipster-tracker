/**
 * @fileoverview Constantes relacionadas con gráficos Chart.js
 * @module shared/constants/charts
 */

/**
 * Paleta de colores para gráficos Chart.js
 * @constant
 */
export const CHART_COLORS: readonly string[] = [
  '#1FB8CD', // Cyan
  '#FFC185', // Peach
  '#B4413C', // Red
  '#ECEBD5', // Beige
  '#5D878F', // Teal
  '#DB4545', // Bright Red
  '#D2BA4C', // Yellow
  '#964325', // Brown
  '#944454', // Maroon
  '#13343B', // Dark Blue
] as const;

/**
 * Colores para estados de picks (ganada, perdida, void, pendiente)
 * @constant
 */
export const PICK_STATUS_COLORS = {
  Ganada: '#10B981', // Green
  Perdida: '#EF4444', // Red
  Void: '#F59E0B', // Orange
  Pendiente: '#6B7280', // Gray
} as const;

/**
 * Opciones base para gráficos Chart.js
 * @constant
 */
export const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
    },
  },
} as const;

/**
 * Opciones para gráficos de barras
 * @constant
 */
export const BAR_CHART_OPTIONS = {
  ...DEFAULT_CHART_OPTIONS,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
} as const;

/**
 * Opciones para gráficos circulares (doughnut/pie)
 * @constant
 */
export const DOUGHNUT_CHART_OPTIONS = {
  ...DEFAULT_CHART_OPTIONS,
  cutout: '60%',
  plugins: {
    ...DEFAULT_CHART_OPTIONS.plugins,
    legend: {
      display: true,
      position: 'right' as const,
    },
  },
} as const;

/**
 * Obtiene un color del array de colores por índice
 * Si el índice excede la longitud, hace wrap around
 * @param index - El índice del color
 * @returns El color hexadecimal
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Genera un array de colores para un dataset
 * @param count - Cantidad de colores necesarios
 * @returns Array de colores hexadecimales
 */
export function generateChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getChartColor(i));
}

/**
 * Obtiene el color para un estado de pick
 * @param status - El estado del pick
 * @returns El color hexadecimal correspondiente
 */
export function getPickStatusColor(
  status: keyof typeof PICK_STATUS_COLORS,
): string {
  return PICK_STATUS_COLORS[status];
}
