import { createContext } from 'react';
import type { Tipster, CreateTipsterDTO, UpdateTipsterDTO, OperationResult } from '@shared/types';

export interface TipstersContextValue {
  tipsters: Tipster[];
  loading: boolean;
  error: string | null;
  createTipster: (data: CreateTipsterDTO) => Promise<OperationResult<string>>;
  updateTipster: (id: string, data: UpdateTipsterDTO) => Promise<OperationResult>;
  deleteTipster: (id: string) => Promise<OperationResult>;
  getTipsterById: (id: string) => Tipster | undefined;
  refreshTipsters: () => Promise<void>;
}

export const TipstersContext = createContext<TipstersContextValue | undefined>(undefined);
