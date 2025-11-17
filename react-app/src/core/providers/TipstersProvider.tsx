import { useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import { collection, onSnapshot, query, where, type Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { tipsterRepository } from '@features/tipsters/services/tipster-repository';
import { TipstersContext, type TipstersContextValue } from './TipstersContext';
import type { Tipster, CreateTipsterDTO, UpdateTipsterDTO, OperationResult } from '@shared/types';

interface TipstersProviderProps {
  readonly children: ReactNode;
  readonly userId: string | null;
}

export function TipstersProvider({ children, userId }: TipstersProviderProps) {
  const [tipsters, setTipsters] = useState<Tipster[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const tipstersQuery = query(collection(db, 'tipsters'), where('uid', '==', userId));

    const unsubscribe: Unsubscribe = onSnapshot(
      tipstersQuery,
      (snapshot) => {
        const tipstersData: Tipster[] = [];
        for (const docSnap of snapshot.docs) {
          tipstersData.push({ id: docSnap.id, ...docSnap.data() } as Tipster);
        }
        setTipsters(tipstersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError('Error al cargar tipsters: ' + err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const createTipster = useCallback(
    async (data: CreateTipsterDTO): Promise<OperationResult<string>> => {
      if (!userId) {
        return { success: false, error: { code: 'NO_USER', message: 'Usuario no autenticado' } };
      }
      return tipsterRepository.createTipster(data, userId);
    },
    [userId],
  );

  const updateTipster = useCallback(
    async (id: string, data: UpdateTipsterDTO): Promise<OperationResult> => {
      return tipsterRepository.updateTipster(id, data);
    },
    [],
  );

  const deleteTipster = useCallback(async (id: string): Promise<OperationResult> => {
    return tipsterRepository.deleteTipster(id);
  }, []);

  const getTipsterById = useCallback(
    (id: string): Tipster | undefined => {
      return tipsters.find((t) => t.id === id);
    },
    [tipsters],
  );

  const refreshTipsters = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    const result = await tipsterRepository.getAllTipsters(userId);
    if (result.success && result.data) {
      setTipsters(result.data);
    }
    setLoading(false);
  }, [userId]);

  const value: TipstersContextValue = useMemo(
    () => ({
      tipsters,
      loading,
      error,
      createTipster,
      updateTipster,
      deleteTipster,
      getTipsterById,
      refreshTipsters,
    }),
    [tipsters, loading, error, createTipster, updateTipster, deleteTipster, getTipsterById, refreshTipsters],
  );

  return <TipstersContext.Provider value={value}>{children}</TipstersContext.Provider>;
}
