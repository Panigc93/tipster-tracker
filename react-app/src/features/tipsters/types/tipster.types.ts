/**
 * Tipster data model
 * Represents a tipster (betting expert) in the system
 */
export interface Tipster {
  /** Firestore document ID */
  id: string;

  /** User ID who owns this tipster (Firebase Auth UID) */
  uid: string;

  /** Tipster name */
  name: string;

  /** Channel source (Telegram, BlogaBet, etc.) */
  channel: string;

  /** Creation date (YYYY-MM-DD format) */
  createdDate: string;

  /** Date of last pick registered (YYYY-MM-DD format) - computed field */
  lastPickDate: string | null;
}

/**
 * Data required to create a new tipster
 * Omits auto-generated fields (id, lastPickDate)
 */
export type CreateTipsterDto = Omit<Tipster, 'id' | 'lastPickDate'>;

/**
 * Data allowed for tipster updates
 * Can only update name and channel
 */
export type UpdateTipsterDto = Partial<Pick<Tipster, 'name' | 'channel'>>;

/**
 * Tipster with computed statistics
 * Extended type for display purposes
 */
export interface TipsterWithStats extends Tipster {
  totalPicks: number;
  resolvedPicks: number;
  wonPicks: number;
  winrate: number;
  yield: number;
  totalProfit: number;
  totalStaked: number;
  avgOdds: number;
  avgStake: number;
}
