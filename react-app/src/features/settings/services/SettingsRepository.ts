/**
 * @fileoverview Repository for managing user settings in Firestore
 * @module features/settings/services/SettingsRepository
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@core/config/firebase.config';
import type { UserSettings, CreateUserSettingsDto } from '../types';
import { MAX_SETTINGS_ITEMS } from '../types';
import { ALL_SPORTS } from '@/shared/constants/sports.constants';
import { ALL_BOOKMAKERS } from '@/shared/constants/bookmakers.constants';
import { ALL_CHANNELS } from '@/shared/constants/channels.constants';

/**
 * Default settings with all current values from constants
 */
const DEFAULT_SETTINGS: CreateUserSettingsDto = {
  sports: [...ALL_SPORTS],
  bookmakers: [...ALL_BOOKMAKERS],
  channels: [...ALL_CHANNELS],
};

/**
 * Normalize string for comparison (lowercase, no accents, trim)
 */
function normalizeString(str: string): string {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Repository class for user settings operations
 */
class SettingsRepository {
  private readonly COLLECTION = 'userSettings';

  /**
   * Get user settings document reference
   */
  private getDocRef(uid: string) {
    return doc(db, this.COLLECTION, uid);
  }

  /**
   * Initialize user settings with default values
   * Called on first use or if settings don't exist
   */
  async initializeUserSettings(uid: string): Promise<UserSettings> {
    const docRef = this.getDocRef(uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserSettings;
    }

    // Create with default values
    const newSettings: Omit<UserSettings, 'createdAt' | 'updatedAt'> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      ...DEFAULT_SETTINGS,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, newSettings);

    // Return with actual timestamps
    return {
      ...DEFAULT_SETTINGS,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  }

  /**
   * Get user settings
   */
  async getUserSettings(uid: string): Promise<UserSettings> {
    const docRef = this.getDocRef(uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return this.initializeUserSettings(uid);
    }

    return docSnap.data() as UserSettings;
  }

  /**
   * Check if item already exists (case-insensitive, accent-insensitive)
   */
  private isDuplicate(newItem: string, existingItems: string[]): string | null {
    const normalized = normalizeString(newItem);
    const duplicate = existingItems.find(
      (item) => normalizeString(item) === normalized
    );
    return duplicate || null;
  }

  // ==================== SPORTS ====================

  /**
   * Add a new sport
   */
  async addSport(uid: string, sport: string): Promise<void> {
    const settings = await this.getUserSettings(uid);

    // Check limit
    if (settings.sports.length >= MAX_SETTINGS_ITEMS.sports) {
      throw new Error(
        `Máximo ${MAX_SETTINGS_ITEMS.sports} deportes permitidos. Elimina algunos antes de añadir más.`
      );
    }

    // Check duplicate
    const duplicate = this.isDuplicate(sport, settings.sports);
    if (duplicate) {
      throw new Error(`El deporte "${sport}" ya existe como "${duplicate}"`);
    }

    // Add sport
    const docRef = this.getDocRef(uid);
    await updateDoc(docRef, {
      sports: arrayUnion(sport.trim()),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Update a sport name
   */
  async updateSport(uid: string, oldSport: string, newSport: string): Promise<void> {
    const settings = await this.getUserSettings(uid);

    // Check if old sport exists
    if (!settings.sports.includes(oldSport)) {
      throw new Error(`El deporte "${oldSport}" no existe`);
    }

    // Check if new name is duplicate (excluding the old one)
    const otherSports = settings.sports.filter((s) => s !== oldSport);
    const duplicate = this.isDuplicate(newSport, otherSports);
    if (duplicate) {
      throw new Error(`El deporte "${newSport}" ya existe como "${duplicate}"`);
    }

    // Update: replace old with new
    const updatedSports = settings.sports.map((s) =>
      s === oldSport ? newSport.trim() : s
    );

    const docRef = this.getDocRef(uid);
    await updateDoc(docRef, {
      sports: updatedSports,
      updatedAt: serverTimestamp(),
    });
  }

  // ==================== BOOKMAKERS ====================

  /**
   * Add a new bookmaker
   */
  async addBookmaker(uid: string, bookmaker: string): Promise<void> {
    const settings = await this.getUserSettings(uid);

    // Check limit
    if (settings.bookmakers.length >= MAX_SETTINGS_ITEMS.bookmakers) {
      throw new Error(
        `Máximo ${MAX_SETTINGS_ITEMS.bookmakers} casas de apuestas permitidas.`
      );
    }

    // Check duplicate
    const duplicate = this.isDuplicate(bookmaker, settings.bookmakers);
    if (duplicate) {
      throw new Error(`La casa de apuestas "${bookmaker}" ya existe como "${duplicate}"`);
    }

    // Add bookmaker
    const docRef = this.getDocRef(uid);
    await updateDoc(docRef, {
      bookmakers: arrayUnion(bookmaker.trim()),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Update a bookmaker name
   */
  async updateBookmaker(
    uid: string,
    oldBookmaker: string,
    newBookmaker: string
  ): Promise<void> {
    const settings = await this.getUserSettings(uid);

    // Check if old bookmaker exists
    if (!settings.bookmakers.includes(oldBookmaker)) {
      throw new Error(`La casa de apuestas "${oldBookmaker}" no existe`);
    }

    // Check if new name is duplicate
    const otherBookmakers = settings.bookmakers.filter((b) => b !== oldBookmaker);
    const duplicate = this.isDuplicate(newBookmaker, otherBookmakers);
    if (duplicate) {
      throw new Error(
        `La casa de apuestas "${newBookmaker}" ya existe como "${duplicate}"`
      );
    }

    // Update
    const updatedBookmakers = settings.bookmakers.map((b) =>
      b === oldBookmaker ? newBookmaker.trim() : b
    );

    const docRef = this.getDocRef(uid);
    await updateDoc(docRef, {
      bookmakers: updatedBookmakers,
      updatedAt: serverTimestamp(),
    });
  }

  // ==================== CHANNELS ====================

  /**
   * Add a new channel
   */
  async addChannel(uid: string, channel: string): Promise<void> {
    const settings = await this.getUserSettings(uid);

    // Check limit
    if (settings.channels.length >= MAX_SETTINGS_ITEMS.channels) {
      throw new Error(
        `Máximo ${MAX_SETTINGS_ITEMS.channels} canales permitidos.`
      );
    }

    // Check duplicate
    const duplicate = this.isDuplicate(channel, settings.channels);
    if (duplicate) {
      throw new Error(`El canal "${channel}" ya existe como "${duplicate}"`);
    }

    // Add channel
    const docRef = this.getDocRef(uid);
    await updateDoc(docRef, {
      channels: arrayUnion(channel.trim()),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Update a channel name
   */
  async updateChannel(uid: string, oldChannel: string, newChannel: string): Promise<void> {
    const settings = await this.getUserSettings(uid);

    // Check if old channel exists
    if (!settings.channels.includes(oldChannel)) {
      throw new Error(`El canal "${oldChannel}" no existe`);
    }

    // Check if new name is duplicate
    const otherChannels = settings.channels.filter((c) => c !== oldChannel);
    const duplicate = this.isDuplicate(newChannel, otherChannels);
    if (duplicate) {
      throw new Error(`El canal "${newChannel}" ya existe como "${duplicate}"`);
    }

    // Update
    const updatedChannels = settings.channels.map((c) =>
      c === oldChannel ? newChannel.trim() : c
    );

    const docRef = this.getDocRef(uid);
    await updateDoc(docRef, {
      channels: updatedChannels,
      updatedAt: serverTimestamp(),
    });
  }
}

// Export singleton instance
export const settingsRepository = new SettingsRepository();
