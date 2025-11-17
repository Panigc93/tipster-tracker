import { useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import { collection, onSnapshot, query, where, orderBy, type Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { followRepository } from '@features/follows/services/follow-repository';
import { FollowsContext, type FollowsContextValue } from './FollowsContext';
import type { UserFollow, CreateFollowDTO, UpdateFollowDTO, OperationResult } from '@shared/types';

interface FollowsProviderProps {
  readonly children: ReactNode;
  readonly userId: string | null;
}

export function FollowsProvider({ children, userId }: FollowsProviderProps) {
  const [follows, setFollows] = useState<UserFollow[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const followsQuery = query(
      collection(db, 'userFollows'),
      where('uid', '==', userId),
      orderBy('dateTimeFollowed', 'desc'),
    );

    const unsubscribe: Unsubscribe = onSnapshot(
      followsQuery,
      (snapshot) => {
        const followsData: UserFollow[] = [];
        for (const docSnap of snapshot.docs) {
          followsData.push({ id: docSnap.id, ...docSnap.data() } as UserFollow);
        }
        setFollows(followsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError('Error al cargar follows: ' + err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const createFollow = useCallback(
    async (data: CreateFollowDTO): Promise<OperationResult<string>> => {
      if (!userId) {
        return { success: false, error: { code: 'NO_USER', message: 'Usuario no autenticado' } };
      }
      return followRepository.createFollow(data, userId);
    },
    [userId],
  );

  const updateFollow = useCallback(
    async (id: string, data: UpdateFollowDTO): Promise<OperationResult> => {
      return followRepository.updateFollow(id, data);
    },
    [],
  );

  const deleteFollow = useCallback(async (id: string): Promise<OperationResult> => {
    return followRepository.deleteFollow(id);
  }, []);

  const getFollowById = useCallback(
    (id: string): UserFollow | undefined => {
      return follows.find((f) => f.id === id);
    },
    [follows],
  );

  const getFollowByPickId = useCallback(
    (pickId: string): UserFollow | undefined => {
      return follows.find((f) => f.pickId === pickId);
    },
    [follows],
  );

  const getFollowsByTipster = useCallback(
    (tipsterId: string): UserFollow[] => {
      return follows.filter((f) => f.tipsterId === tipsterId);
    },
    [follows],
  );

  const refreshFollows = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    const result = await followRepository.getAllFollows(userId);
    if (result.success && result.data) {
      setFollows(result.data);
    }
    setLoading(false);
  }, [userId]);

  const value: FollowsContextValue = useMemo(
    () => ({
      follows,
      loading,
      error,
      createFollow,
      updateFollow,
      deleteFollow,
      getFollowById,
      getFollowByPickId,
      getFollowsByTipster,
      refreshFollows,
    }),
    [follows, loading, error, createFollow, updateFollow, deleteFollow, getFollowById, getFollowByPickId, getFollowsByTipster, refreshFollows],
  );

  return <FollowsContext.Provider value={value}>{children}</FollowsContext.Provider>;
}
