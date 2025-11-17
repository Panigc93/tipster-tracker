import { useState, useEffect, useCallback } from 'react';
import { db } from '@/core/config/firebase.config';
import { useAuth } from '@features/auth/hooks';
import { TipsterRepository } from '../services';
import type { Tipster, CreateTipsterDto, UpdateTipsterDto } from '../types';

interface UseTipstersReturn {
  tipsters: Tipster[];
  loading: boolean;
  error: string | null;
  createTipster: (data: CreateTipsterDto) => Promise<Tipster>;
  updateTipster: (id: string, data: UpdateTipsterDto) => Promise<void>;
  deleteTipster: (id: string) => Promise<void>;
  refreshTipsters: () => Promise<void>;
}

/**
 * Custom hook for managing tipsters
 * Handles CRUD operations and state management
 */
// Create repository instance (singleton pattern)
const repository = new TipsterRepository(db);

export function useTipsters(): UseTipstersReturn {
  const { user } = useAuth();
  const [tipsters, setTipsters] = useState<Tipster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tipsters
  const fetchTipsters = useCallback(async () => {
    if (!user?.uid) {
      setTipsters([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await repository.getAll(user.uid);
      setTipsters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tipsters');
      console.error('Error fetching tipsters:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Load tipsters on mount and when user changes
  useEffect(() => {
    void fetchTipsters();
  }, [fetchTipsters]);

  // Create tipster
  const createTipster = useCallback(
    async (data: CreateTipsterDto): Promise<Tipster> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const newTipster = await repository.create(data);
        setTipsters((prev) => [newTipster, ...prev]);
        return newTipster;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create tipster';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Update tipster
  const updateTipster = useCallback(
    async (id: string, data: UpdateTipsterDto): Promise<void> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        await repository.update(id, user.uid, data);
        setTipsters((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update tipster';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Delete tipster
  const deleteTipster = useCallback(
    async (id: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        await repository.delete(id, user.uid);
        setTipsters((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete tipster';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Refresh tipsters (useful after external changes)
  const refreshTipsters = useCallback(async () => {
    await fetchTipsters();
  }, [fetchTipsters]);

  return {
    tipsters,
    loading,
    error,
    createTipster,
    updateTipster,
    deleteTipster,
    refreshTipsters,
  };
}
