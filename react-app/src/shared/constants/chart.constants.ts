/**
 * @fileoverview Constantes relacionadas con gráficos Chart.js
 * @module shared/constants/charts
 */

/**
 * Paleta de colores para gráficos Chart.js
 * Paleta industrial moderna optimizada - solo colores muy distintos
 * @constant
 */
export const CHART_COLORS: readonly string[] = [
  '#1C768F', // Azul petróleo
  '#FA991C', // Naranja vibrante
  '#8B5CF6', // Morado moderno
  '#00E5A0', // Verde neón
  '#FF5757', // Rojo claro
  '#023246', // Azul marino oscuro
  '#A8B2B8', // Gris plata
  '#A78BFA', // Lavanda vibrante
  '#10B981', // Verde esmeralda
  '#6BB6D0', // Azul claro
  '#FF8C42', // Naranja suave
  '#7C3AED', // Púrpura intenso
  '#C5CDD3', // Plata claro
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
 * Opciones base para gráficos Chart.js (dark theme)
 * @constant
 */
export const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: '#E0E0E0', // slate-300
        padding: 15,
        font: {
          size: 12,
          weight: 500,
        },
      },
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#1E293B', // slate-800
      titleColor: '#F1F5F9', // slate-100
      bodyColor: '#E2E8F0', // slate-200
      borderColor: '#475569', // slate-600
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      titleFont: {
        size: 13,
        weight: 600,
      },
      bodyFont: {
        size: 12,
      },
    },
  },
} as const;

/**
 * Opciones para gráficos de barras verticales (dark theme)
 * @constant
 */
export const BAR_CHART_OPTIONS = {
  indexAxis: 'x' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    ...DEFAULT_CHART_OPTIONS.plugins,
    legend: {
      display: false,
    },
  },
  datasets: {
    bar: {
      barPercentage: 0.6, // Reduce bar width
      categoryPercentage: 0.7, // Reduce category width
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: '#94A3B8', // slate-400
        font: {
          size: 10,
        },
      },
      grid: {
        color: '#334155', // slate-700
        drawBorder: false,
      },
    },
    y: {
      ticks: {
        color: '#E0E0E0', // slate-300
        font: {
          size: 11,
        },
      },
      grid: {
        display: false,
      },
    },
  },
} as const;

/**
 * Opciones para gráficos circulares (doughnut/pie) con dark theme
 * @constant
 */
export const DOUGHNUT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: false, // Disabled - will use external legend
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#1E293B', // slate-800
      titleColor: '#F1F5F9', // slate-100
      bodyColor: '#CBD5E1', // slate-300
      borderColor: '#475569', // slate-600
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      titleFont: {
        size: 13,
        weight: 600,
      },
      bodyFont: {
        size: 12,
      },
      callbacks: {
        label: (context: { label?: string; parsed: number; dataset: { data: number[] } }) => {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
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
