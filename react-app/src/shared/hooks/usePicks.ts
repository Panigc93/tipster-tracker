import { useContext } from 'react';
import { PicksContext, type PicksContextValue } from '@core/providers/PicksContext';

export function usePicks(): PicksContextValue {
  const context = useContext(PicksContext);

  if (context === undefined) {
    throw new Error('usePicks must be used within a PicksProvider');
  }

  return context;
}
