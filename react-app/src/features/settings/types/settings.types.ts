import { Timestamp } from 'firebase/firestore';

/**
 * User Settings stored in Firestore
 * Collection: userSettings/{uid}
 */
export interface UserSettings {
  /** List of custom sports */
  sports: string[];
  
  /** List of custom bookmakers */
  bookmakers: string[];
  
  /** List of custom channels */
  channels: string[];
  
  /** When the settings were created */
  createdAt: Timestamp;
  
  /** Last time the settings were updated */
  updatedAt: Timestamp;
}

/**
 * DTO for creating user settings
 */
export interface CreateUserSettingsDto {
  sports: string[];
  bookmakers: string[];
  channels: string[];
}

/**
 * Type for settings categories
 */
export type SettingsCategory = 'sport' | 'bookmaker' | 'channel';

/**
 * Maximum items allowed per category
 */
export const MAX_SETTINGS_ITEMS = {
  sports: 60,      // 16 default + 44 custom
  bookmakers: 50,  // 28 default + 22 custom
  channels: 30,    // 6 default + 24 custom
} as const;
