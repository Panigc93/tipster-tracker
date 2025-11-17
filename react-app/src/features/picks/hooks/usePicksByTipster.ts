import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@features/auth/hooks';
import { PickRepository } from '../services/pick-repository';
import type { Pick } from '@shared/types';

interface UsePicksByTipsterReturn {
  picks: Pick[];
  loading: boolean;
  error: string | null;
  refreshPicks: () => Promise<void>;
}

/**
 * Custom hook for getting picks for a specific tipster
 * Read-only hook for displaying tipster's pick history
 */
// Create repository instance (singleton pattern)
const repository = new PickRepository();

export function usePicksByTipster(tipsterId: string | null): UsePicksByTipsterReturn {
  const { user } = useAuth();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch picks for tipster
  const fetchPicks = useCallback(async () => {
    if (!user?.uid || !tipsterId) {
      setPicks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await repository.getPicksByTipster(user.uid, tipsterId);
      
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
      console.error('Error fetching picks for tipster:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, tipsterId]);

  // Load picks on mount and when user/tipster changes
  useEffect(() => {
    void fetchPicks();
  }, [fetchPicks]);

  // Refresh picks (useful after external changes)
  const refreshPicks = useCallback(async () => {
    await fetchPicks();
  }, [fetchPicks]);

  return {
    picks,
    loading,
    error,
    refreshPicks,
  };
}
