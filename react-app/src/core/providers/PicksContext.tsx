import { createContext } from 'react';
import type { Pick, CreatePickDTO, UpdatePickDTO, OperationResult } from '@shared/types';

export interface PicksContextValue {
  picks: Pick[];
  loading: boolean;
  error: string | null;
  createPick: (data: CreatePickDTO) => Promise<OperationResult<string>>;
  updatePick: (id: string, data: UpdatePickDTO) => Promise<OperationResult>;
  deletePick: (id: string) => Promise<OperationResult>;
  getPickById: (id: string) => Pick | undefined;
  getPicksByTipster: (tipsterId: string) => Pick[];
  refreshPicks: () => Promise<void>;
}

export const PicksContext = createContext<PicksContextValue | undefined>(undefined);
