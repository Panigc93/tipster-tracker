import { useState, useEffect, useCallback } from 'react';
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
 * Handles CRUD operations and state management
 */
// Create repository instance (singleton pattern)
const repository = new PickRepository();

export function usePicks(): UsePicksReturn {
  const { user } = useAuth();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all picks
  const fetchPicks = useCallback(async () => {
    if (!user?.uid) {
      setPicks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await repository.getAllPicks(user.uid);
      
      if (result.success && result.data) {
        // Sort by dateTime descending (newest first)
        const sortedPicks = [...result.data].sort((a, b) => 
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setPicks(sortedPicks);
      } else {
        setError(result.error?.message || 'Failed to load picks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load picks');
      console.error('Error fetching picks:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Load picks on mount and when user changes
  useEffect(() => {
    void fetchPicks();
  }, [fetchPicks]);

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

        // Get the created pick to return it
        const pickResult = await repository.getPickById(result.data);
        if (!pickResult.success || !pickResult.data) {
          throw new Error('Pick created but failed to retrieve');
        }

        const newPick = pickResult.data;
        setPicks((prev) => [newPick, ...prev]);
        return newPick;
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

        setPicks((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...data } : p))
        );
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

        setPicks((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete pick';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Refresh picks (useful after external changes)
  const refreshPicks = useCallback(async () => {
    await fetchPicks();
  }, [fetchPicks]);

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
