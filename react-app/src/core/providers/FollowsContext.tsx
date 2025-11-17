import { createContext } from 'react';
import type { UserFollow, CreateFollowDTO, UpdateFollowDTO, OperationResult } from '@shared/types';

export interface FollowsContextValue {
  follows: UserFollow[];
  loading: boolean;
  error: string | null;
  createFollow: (data: CreateFollowDTO) => Promise<OperationResult<string>>;
  updateFollow: (id: string, data: UpdateFollowDTO) => Promise<OperationResult>;
  deleteFollow: (id: string) => Promise<OperationResult>;
  getFollowById: (id: string) => UserFollow | undefined;
  getFollowByPickId: (pickId: string) => UserFollow | undefined;
  getFollowsByTipster: (tipsterId: string) => UserFollow[];
  refreshFollows: () => Promise<void>;
}

export const FollowsContext = createContext<FollowsContextValue | undefined>(undefined);
