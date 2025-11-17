/**
 * @fileoverview Enumeraciones y tipos constantes de la aplicación
 * @module shared/types/enums
 */

/**
 * Deportes disponibles en la aplicación
 */
export const Sport = {
  FUTBOL: 'Fútbol',
  BALONCESTO: 'Baloncesto',
  TENIS: 'Tenis',
  FUTBOL_AMERICANO: 'Fútbol Americano',
  HOCKEY: 'Hockey',
  BEISBOL: 'Béisbol',
  DARDOS: 'Dardos',
  CABALLOS: 'Caballos',
  MOTOR: 'Motor',
  ESPORTS: 'Esports',
  FORMULA_1: 'Fórmula 1',
  GOLF: 'Golf',
  RUGBY: 'Rugby',
  CRICKET: 'Cricket',
  TENIS_MESA: 'Tenis de mesa',
  OTRO: 'Otro',
} as const;

export type Sport = (typeof Sport)[keyof typeof Sport];

/**
 * Canales de origen de tipsters
 */
export const Channel = {
  BLOGABET: 'BlogaBet',
  TELEGRAM: 'Telegram',
  TIPSTERLAND: 'TipsterLand',
  TWITTER: 'Twitter/X',
  DISCORD: 'Discord',
  OTRO: 'Otro',
} as const;

export type Channel = (typeof Channel)[keyof typeof Channel];

/**
 * Casas de apuestas disponibles
 */
export const Bookmaker = {
  ONE_XBET: '1xBet',
  BETFAIR: 'Betfair',
  BET365: 'Bet365',
  WILLIAM_HILL: 'William Hill',
  MARATHONBET: 'Marathonbet',
  EIGHT_EIGHT_EIGHT: '888',
  BWIN: 'Bwin',
  CODERE: 'Codere',
  LUCKIA: 'Luckia',
  SPORTIUM: 'Sportium',
  BETSSON: 'Betsson',
  BETWAY: 'Betway',
  INTERWETTEN: 'Interwetten',
  KIROLBET: 'Kirolbet',
  CASUMO: 'Casumo',
  LEOVEGAS: 'LeoVegas',
  WINAMAX: 'Winamax',
  PAF: 'Paf',
  PASTON: 'Pastón',
  OLYBET: 'Olybet',
  TONYBET: 'TonyBet',
  MARCA_APUESTAS: 'Marca Apuestas',
  SUERTIA: 'Suertia',
  YAAS: 'Yaas',
  VERSUS: 'Versus',
  RETABET: 'Retabet',
  OPABETS: 'Opabets',
  OTRO: 'Otro',
} as const;

export type Bookmaker = (typeof Bookmaker)[keyof typeof Bookmaker];

/**
 * Tipos de pick según momento de la apuesta
 */
export const PickType = {
  PRE: 'Pre',
  LIVE: 'Live',
  COMBINADO: 'Combinado',
} as const;

export type PickType = (typeof PickType)[keyof typeof PickType];

/**
 * Resultados posibles de una pick o follow
 */
export const PickResult = {
  GANADA: 'Ganada',
  PERDIDA: 'Perdida',
  VOID: 'Void',
  PENDIENTE: 'Pendiente',
} as const;

export type PickResult = (typeof PickResult)[keyof typeof PickResult];

/**
 * Vistas disponibles en la aplicación
 */
export const AppView = {
  DASHBOARD: 'dashboard',
  ALL_PICKS: 'allPicks',
  MY_PICKS: 'myPicks',
  TIPSTER_DETAIL: 'tipsterDetail',
} as const;

export type AppView = (typeof AppView)[keyof typeof AppView];

/**
 * Criterios de ordenación para el dashboard
 */
export const SortBy = {
  YIELD: 'yield',
  WINRATE: 'winrate',
  TOTAL_PICKS: 'totalPicks',
  NAME: 'name',
} as const;

export type SortBy = (typeof SortBy)[keyof typeof SortBy];

/**
 * Rangos de días para filtrar última pick
 */
export const LastPickDays = {
  ALL: 'all',
  SEVEN: '7',
  THIRTY: '30',
  NINETY: '90',
} as const;

export type LastPickDays = (typeof LastPickDays)[keyof typeof LastPickDays];
