/**
 * @fileoverview Barrel export de todas las constantes de la aplicación
 * @module shared/constants
 */

// Sports
export {
  ALL_SPORTS,
  SPORT_ICONS,
  getSportIcon,
  isValidSport,
} from './sports.constants';

// Channels
export {
  ALL_CHANNELS,
  isValidChannel,
  getChannelName,
} from './channels.constants';

// Bookmakers
export {
  ALL_BOOKMAKERS,
  isValidBookmaker,
  getBookmakerName,
} from './bookmakers.constants';

// Charts
export {
  CHART_COLORS,
  PICK_STATUS_COLORS,
  DEFAULT_CHART_OPTIONS,
  BAR_CHART_OPTIONS,
  DOUGHNUT_CHART_OPTIONS,
  getChartColor,
  generateChartColors,
  getPickStatusColor,
} from './chart.constants';
