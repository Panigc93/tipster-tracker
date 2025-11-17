import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@core/config/firebase.config';
import { useAuth } from '@features/auth/hooks';
import { PickRepository } from '../services/pick-repository';
import type { Pick, CreatePickDTO, UpdatePickDTO } from '@shared/types';

interface UsePicksReturn {
  picks: Pick[];
  loading: boolean;
  error: string | null;
  createPick: (data: CreatePickDTO) => Promise<Pick>;
  updatePick: (id: string, data: UpdatePickDTO) => Promise<void>;
  deletePick: (id: string) => Promise<void>;
  refreshPicks: () => Promise<void>;
}

/**
 * Custom hook for managing picks
 * Handles CRUD operations and state management with real-time updates
 */
// Create repository instance (singleton pattern)
const repository = new PickRepository();

export function usePicks(): UsePicksReturn {
  const { user } = useAuth();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup real-time listener for picks
  useEffect(() => {
    if (!user?.uid) {
      setPicks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create Firestore query
    const picksQuery = query(
      collection(db, 'picks'),
      where('uid', '==', user.uid),
      orderBy('dateTime', 'desc')
    );

    // Setup real-time listener
    const unsubscribe = onSnapshot(
      picksQuery,
      (snapshot) => {
        const picksData: Pick[] = [];
        for (const doc of snapshot.docs) {
          picksData.push({
            id: doc.id,
            ...doc.data(),
          } as Pick);
        }
        setPicks(picksData);
        setLoading(false);
      },
      (err) => {
        console.error('Error in picks listener:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  // Refresh picks (refetch from repository)
  const refreshPicks = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const result = await repository.getAllPicks(user.uid);
      if (result.success && result.data) {
        setPicks(result.data);
      }
    } catch (err) {
      console.error('Error refreshing picks:', err);
    }
  }, [user?.uid]);

  // Create pick
  const createPick = useCallback(
    async (data: CreatePickDTO): Promise<Pick> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await repository.createPick(data, user.uid);
        
        if (!result.success || !result.data) {
          throw new Error(result.error?.message || 'Failed to create pick');
        }

        // Return a temporary pick object (real-time listener will update the list)
        // We need to return something for the modal to know it succeeded
        const tempPick: Pick = {
          id: result.data,
          uid: user.uid,
          ...data,
        };
        
        return tempPick;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create pick';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Update pick
  const updatePick = useCallback(
    async (id: string, data: UpdatePickDTO): Promise<void> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await repository.updatePick(id, data);
        
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to update pick');
        }

        // Real-time listener will update the list automatically
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update pick';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Delete pick
  const deletePick = useCallback(
    async (id: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await repository.deletePick(id);
        
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to delete pick');
        }

        // Real-time listener will update the list automatically
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete pick';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  return {
    picks,
    loading,
    error,
    createPick,
    updatePick,
    deletePick,
    refreshPicks,
  };
}
