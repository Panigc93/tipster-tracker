import { useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import { collection, onSnapshot, query, where, orderBy, type Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { pickRepository } from '@features/picks/services/pick-repository';
import { PicksContext, type PicksContextValue } from './PicksContext';
import type { Pick, CreatePickDTO, UpdatePickDTO, OperationResult } from '@shared/types';

interface PicksProviderProps {
  readonly children: ReactNode;
  readonly userId: string | null;
}

export function PicksProvider({ children, userId }: PicksProviderProps) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const picksQuery = query(
      collection(db, 'picks'),
      where('uid', '==', userId),
      orderBy('dateTime', 'desc'),
    );

    const unsubscribe: Unsubscribe = onSnapshot(
      picksQuery,
      (snapshot) => {
        const picksData: Pick[] = [];
        for (const docSnap of snapshot.docs) {
          picksData.push({ id: docSnap.id, ...docSnap.data() } as Pick);
        }
        setPicks(picksData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError('Error al cargar picks: ' + err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const createPick = useCallback(
    async (data: CreatePickDTO): Promise<OperationResult<string>> => {
      if (!userId) {
        return { success: false, error: { code: 'NO_USER', message: 'Usuario no autenticado' } };
      }
      return pickRepository.createPick(data, userId);
    },
    [userId],
  );

  const updatePick = useCallback(
    async (id: string, data: UpdatePickDTO): Promise<OperationResult> => {
      return pickRepository.updatePick(id, data);
    },
    [],
  );

  const deletePick = useCallback(async (id: string): Promise<OperationResult> => {
    return pickRepository.deletePick(id);
  }, []);

  const getPickById = useCallback(
    (id: string): Pick | undefined => {
      return picks.find((p) => p.id === id);
    },
    [picks],
  );

  const getPicksByTipster = useCallback(
    (tipsterId: string): Pick[] => {
      return picks.filter((p) => p.tipsterId === tipsterId);
    },
    [picks],
  );

  const refreshPicks = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    const result = await pickRepository.getAllPicks(userId);
    if (result.success && result.data) {
      setPicks(result.data);
    }
    setLoading(false);
  }, [userId]);

  const value: PicksContextValue = useMemo(
    () => ({
      picks,
      loading,
      error,
      createPick,
      updatePick,
      deletePick,
      getPickById,
      getPicksByTipster,
      refreshPicks,
    }),
    [picks, loading, error, createPick, updatePick, deletePick, getPickById, getPicksByTipster, refreshPicks],
  );

  return <PicksContext.Provider value={value}>{children}</PicksContext.Provider>;
}
