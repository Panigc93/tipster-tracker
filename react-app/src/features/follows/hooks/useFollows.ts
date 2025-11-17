import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@core/config/firebase.config';
import { useAuth } from '@features/auth/hooks';
import { FollowRepository } from '../services/follow-repository';
import type { UserFollow, CreateFollowDTO, UpdateFollowDTO } from '@shared/types';

interface UseFollowsReturn {
  follows: UserFollow[];
  loading: boolean;
  error: string | null;
  createFollow: (data: CreateFollowDTO) => Promise<UserFollow>;
  updateFollow: (id: string, data: UpdateFollowDTO) => Promise<void>;
  deleteFollow: (id: string) => Promise<void>;
  refreshFollows: () => Promise<void>;
  isPickFollowed: (pickId: string) => boolean;
  getFollowByPickId: (pickId: string) => UserFollow | null;
}

/**
 * Custom hook for managing follows
 * Handles CRUD operations and state management with real-time updates
 */
// Create repository instance (singleton pattern)
const repository = new FollowRepository();

export function useFollows(): UseFollowsReturn {
  const { user } = useAuth();
  const [follows, setFollows] = useState<UserFollow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup real-time listener for follows
  useEffect(() => {
    if (!user?.uid) {
      setFollows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create Firestore query
    const followsQuery = query(
      collection(db, 'userFollows'),
      where('uid', '==', user.uid),
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
        console.error('Error in follows listener:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  // Refresh follows (refetch from repository)
  const refreshFollows = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const result = await repository.getAllFollows(user.uid);
      if (result.success && result.data) {
        setFollows(result.data);
      }
    } catch (err) {
      console.error('Error refreshing follows:', err);
    }
  }, [user?.uid]);

  // Create follow
  const createFollow = useCallback(
    async (data: CreateFollowDTO): Promise<UserFollow> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await repository.createFollow(data, user.uid);
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to create follow');
        }

        // Fetch the created follow to return it
        const followResult = await repository.getFollowById(result.data);
        
        if (!followResult.success || !followResult.data) {
          throw new Error('Failed to fetch created follow');
        }

        // Real-time listener will update the state automatically
        return followResult.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create follow';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Update follow
  const updateFollow = useCallback(
    async (id: string, data: UpdateFollowDTO): Promise<void> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await repository.updateFollow(id, data);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to update follow');
        }

        // Real-time listener will update the state automatically
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update follow';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Delete follow
  const deleteFollow = useCallback(
    async (id: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await repository.deleteFollow(id);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete follow');
        }

        // Real-time listener will update the state automatically
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete follow';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.uid]
  );

  // Check if a pick is followed
  const isPickFollowed = useCallback(
    (pickId: string): boolean => {
      return follows.some((follow) => follow.pickId === pickId);
    },
    [follows]
  );

  // Get follow by pick ID
  const getFollowByPickId = useCallback(
    (pickId: string): UserFollow | null => {
      return follows.find((follow) => follow.pickId === pickId) || null;
    },
    [follows]
  );

  return {
    follows,
    loading,
    error,
    createFollow,
    updateFollow,
    deleteFollow,
    refreshFollows,
    isPickFollowed,
    getFollowByPickId,
  };
}
