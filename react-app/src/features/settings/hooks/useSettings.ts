/**
 * @fileoverview Custom hook for managing user settings
 * @module features/settings/hooks/useSettings
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@core/config/firebase.config';
import { useAuth } from '@features/auth/hooks';
import { settingsRepository } from '../services';
import type { UserSettings } from '../types';

/**
 * Hook return interface
 */
export interface UseSettingsReturn {
  /** User settings */
  settings: UserSettings | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  // Sports operations
  addSport: (sport: string) => Promise<void>;
  updateSport: (oldSport: string, newSport: string) => Promise<void>;
  ensureSportExists: (sport: string) => Promise<void>;
  
  // Bookmaker operations
  addBookmaker: (bookmaker: string) => Promise<void>;
  updateBookmaker: (oldBookmaker: string, newBookmaker: string) => Promise<void>;
  ensureBookmakerExists: (bookmaker: string) => Promise<void>;
  
  // Channel operations
  addChannel: (channel: string) => Promise<void>;
  updateChannel: (oldChannel: string, newChannel: string) => Promise<void>;
  ensureChannelExists: (channel: string) => Promise<void>;
}

/**
 * Custom hook to manage user settings with real-time updates
 */
export function useSettings(): UseSettingsReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for settings
  useEffect(() => {
    if (!user?.uid) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const docRef = doc(db, 'userSettings', user.uid);
    
    const unsubscribe = onSnapshot(
      docRef,
      async (snapshot) => {
        try {
          if (snapshot.exists()) {
            setSettings(snapshot.data() as UserSettings);
          } else {
            // Initialize settings if they don't exist
            const newSettings = await settingsRepository.initializeUserSettings(user.uid);
            setSettings(newSettings);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error in settings listener:', err);
          setError(err instanceof Error ? err.message : 'Error loading settings');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error subscribing to settings:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // ==================== SPORTS ====================

  const addSport = useCallback(
    async (sport: string) => {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      try {
        await settingsRepository.addSport(user.uid, sport);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al añadir deporte';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  const updateSport = useCallback(
    async (oldSport: string, newSport: string) => {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      try {
        await settingsRepository.updateSport(user.uid, oldSport, newSport);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar deporte';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  /**
   * Ensure a sport exists in the user's list
   * Used for auto-adding legacy values from old picks
   */
  const ensureSportExists = useCallback(
    async (sport: string) => {
      if (!user?.uid || !settings) return;

      // Check if sport already exists
      if (settings.sports.includes(sport)) {
        return;
      }

      console.log(`[useSettings] Auto-adding legacy sport: ${sport}`);
      
      try {
        await settingsRepository.addSport(user.uid, sport);
      } catch (err) {
        // Ignore duplicate errors (race condition)
        if (err instanceof Error && err.message.includes('ya existe')) {
          return;
        }
        console.error('Error auto-adding sport:', err);
      }
    },
    [user?.uid, settings]
  );

  // ==================== BOOKMAKERS ====================

  const addBookmaker = useCallback(
    async (bookmaker: string) => {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      try {
        await settingsRepository.addBookmaker(user.uid, bookmaker);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al añadir casa de apuestas';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  const updateBookmaker = useCallback(
    async (oldBookmaker: string, newBookmaker: string) => {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      try {
        await settingsRepository.updateBookmaker(user.uid, oldBookmaker, newBookmaker);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al actualizar casa de apuestas';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  const ensureBookmakerExists = useCallback(
    async (bookmaker: string) => {
      if (!user?.uid || !settings) return;

      if (settings.bookmakers.includes(bookmaker)) {
        return;
      }

      console.log(`[useSettings] Auto-adding legacy bookmaker: ${bookmaker}`);
      
      try {
        await settingsRepository.addBookmaker(user.uid, bookmaker);
      } catch (err) {
        if (err instanceof Error && err.message.includes('ya existe')) {
          return;
        }
        console.error('Error auto-adding bookmaker:', err);
      }
    },
    [user?.uid, settings]
  );

  // ==================== CHANNELS ====================

  const addChannel = useCallback(
    async (channel: string) => {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      try {
        await settingsRepository.addChannel(user.uid, channel);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al añadir canal';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  const updateChannel = useCallback(
    async (oldChannel: string, newChannel: string) => {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      try {
        await settingsRepository.updateChannel(user.uid, oldChannel, newChannel);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar canal';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  const ensureChannelExists = useCallback(
    async (channel: string) => {
      if (!user?.uid || !settings) return;

      if (settings.channels.includes(channel)) {
        return;
      }

      console.log(`[useSettings] Auto-adding legacy channel: ${channel}`);
      
      try {
        await settingsRepository.addChannel(user.uid, channel);
      } catch (err) {
        if (err instanceof Error && err.message.includes('ya existe')) {
          return;
        }
        console.error('Error auto-adding channel:', err);
      }
    },
    [user?.uid, settings]
  );

  return {
    settings,
    loading,
    error,
    // Sports
    addSport,
    updateSport,
    ensureSportExists,
    // Bookmakers
    addBookmaker,
    updateBookmaker,
    ensureBookmakerExists,
    // Channels
    addChannel,
    updateChannel,
    ensureChannelExists,
  };
}
