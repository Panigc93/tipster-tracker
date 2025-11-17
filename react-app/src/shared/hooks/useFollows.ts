import { useContext } from 'react';
import { FollowsContext, type FollowsContextValue } from '@core/providers/FollowsContext';

export function useFollows(): FollowsContextValue {
  const context = useContext(FollowsContext);

  if (context === undefined) {
    throw new Error('useFollows must be used within a FollowsProvider');
  }

  return context;
}
