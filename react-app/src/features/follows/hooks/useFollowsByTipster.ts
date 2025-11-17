import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@core/config/firebase.config';
import { useAuth } from '@features/auth/hooks';
import { FollowRepository } from '../services/follow-repository';
import type { UserFollow } from '@shared/types';

interface UseFollowsByTipsterReturn {
  follows: UserFollow[];
  loading: boolean;
  error: string | null;
  refreshFollows: () => Promise<void>;
}

/**
 * Custom hook for getting follows for a specific tipster with real-time updates
 * Read-only hook for displaying tipster's follow history
 */
// Create repository instance (singleton pattern)
const repository = new FollowRepository();

export function useFollowsByTipster(tipsterId: string | null): UseFollowsByTipsterReturn {
  const { user } = useAuth();
  const [follows, setFollows] = useState<UserFollow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup real-time listener for tipster follows
  useEffect(() => {
    if (!user?.uid || !tipsterId) {
      setFollows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create Firestore query for this tipster's follows
    const followsQuery = query(
      collection(db, 'userFollows'),
      where('uid', '==', user.uid),
      where('tipsterId', '==', tipsterId),
      orderBy('dateTimeFollowed', 'desc')
    );

    // Setup real-time listener
    const unsubscribe = onSnapshot(
      followsQuery,
      (snapshot) => {
        const followsData: UserFollow[] = [];
        for (const doc of snapshot.docs) {
          followsData.push({
            id: doc.id,
            ...doc.data(),
          } as UserFollow);
        }
        setFollows(followsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error in follows listener for tipster:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount or when tipsterId changes
    return () => {
      unsubscribe();
    };
  }, [user?.uid, tipsterId]);

  // Refresh follows (refetch from repository)
  const refreshFollows = useCallback(async () => {
    if (!user?.uid || !tipsterId) return;

    try {
      const result = await repository.getFollowsByTipster(user.uid, tipsterId);
      if (result.success && result.data) {
        setFollows(result.data);
      }
    } catch (err) {
      console.error('Error refreshing follows for tipster:', err);
    }
  }, [user?.uid, tipsterId]);

  return {
    follows,
    loading,
    error,
    refreshFollows,
  };
}
