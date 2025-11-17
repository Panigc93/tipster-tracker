import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@core/config/firebase.config';
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
 * Custom hook for getting picks for a specific tipster with real-time updates
 * Read-only hook for displaying tipster's pick history
 */
// Create repository instance (singleton pattern)
const repository = new PickRepository();

export function usePicksByTipster(tipsterId: string | null): UsePicksByTipsterReturn {
  const { user } = useAuth();
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup real-time listener for tipster picks
  useEffect(() => {
    if (!user?.uid || !tipsterId) {
      setPicks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create Firestore query for this tipster's picks
    const picksQuery = query(
      collection(db, 'picks'),
      where('uid', '==', user.uid),
      where('tipsterId', '==', tipsterId),
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
        console.error('Error in picks listener for tipster:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount or when tipsterId changes
    return () => {
      unsubscribe();
    };
  }, [user?.uid, tipsterId]);

  // Refresh picks (refetch from repository)
  const refreshPicks = useCallback(async () => {
    if (!user?.uid || !tipsterId) return;

    try {
      const result = await repository.getPicksByTipster(user.uid, tipsterId);
      if (result.success && result.data) {
        setPicks(result.data);
      }
    } catch (err) {
      console.error('Error refreshing picks for tipster:', err);
    }
  }, [user?.uid, tipsterId]);

  return {
    picks,
    loading,
    error,
    refreshPicks,
  };
}
