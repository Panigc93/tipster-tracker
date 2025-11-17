import { useState, useEffect, useCallback } from 'react';
import { db } from '@/core/config/firebase.config';
import { useAuth } from '@features/auth/hooks';
import { TipsterRepository } from '../services';
import type { Tipster } from '../types';

interface UseTipsterDetailReturn {
  tipster: Tipster | null;
  loading: boolean;
  error: string | null;
  refreshTipster: () => Promise<void>;
}

// Create repository instance (singleton pattern)
const repository = new TipsterRepository(db);

/**
 * Custom hook for fetching a single tipster with details
 * Used in TipsterDetail page
 */
export function useTipsterDetail(tipsterId: string): UseTipsterDetailReturn {
  const { user } = useAuth();
  const [tipster, setTipster] = useState<Tipster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tipster by ID
  const fetchTipster = useCallback(async () => {
    if (!user?.uid || !tipsterId) {
      setTipster(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await repository.getById(tipsterId, user.uid);
      setTipster(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tipster');
      console.error('Error fetching tipster:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, tipsterId]);

  // Load tipster on mount and when ID or user changes
  useEffect(() => {
    void fetchTipster();
  }, [fetchTipster]);

  // Refresh tipster (useful after updates)
  const refreshTipster = useCallback(async () => {
    await fetchTipster();
  }, [fetchTipster]);

  return {
    tipster,
    loading,
    error,
    refreshTipster,
  };
}
