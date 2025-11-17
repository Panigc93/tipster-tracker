/**
 * @fileoverview Barrel export de todas las utilidades
 * @module shared/utils
 */

// Date utilities
export {
  formatDate,
  formatTime,
  formatDateTime,
  parseDate,
  isValidDate,
  getCurrentDate,
  getCurrentTime,
  getDaysDifference,
  isWithinDays,
  formatRelativeDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from './date.utils';

export type { DateFormatOptions } from './date.utils';

// Calculation utilities
export {
  calculatePickProfit,
  calculateFollowProfit,
  calculateYield,
  calculateWinrate,
  calculateOddsDistribution,
  calculateStakeDistribution,
  calculateSportDistribution,
  calculatePickTypeDistribution,
  calculateTipsterStats,
  calculateTraceability,
  calculateFollowStats,
  compareResults,
  calculateAverage,
  roundToDecimals,
} from './calculation.utils';

export type { Distribution, ProfitCalculation } from './calculation.utils';

// Format utilities
export {
  formatNumber,
  formatPercentage,
  formatNumberWithSeparators,
  formatCurrency,
  formatUnits,
  formatProfit,
  formatOdds,
  formatStake,
  truncateText,
  capitalize,
  toTitleCase,
  formatResult,
  formatCompactNumber,
  sanitizeHTML,
  pluralize,
} from './format.utils';

// Validation utilities
export {
  isValidEmail,
  isValidOdds,
  isValidStake,
  isNotEmpty,
  isInRange,
  hasMinLength,
  hasMaxLength,
  isDefined,
  isPositive,
  isNonNegative,
  isNonEmptyArray,
  isNonEmptyObject,
  isValidDateFormat,
  isValidTimeFormat,
  isValidURL,
  validateAll,
  validateAny,
} from './validation.utils';
