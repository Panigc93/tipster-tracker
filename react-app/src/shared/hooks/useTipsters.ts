import { useContext } from 'react';
import { TipstersContext, type TipstersContextValue } from '@core/providers/TipstersContext';

export function useTipsters(): TipstersContextValue {
  const context = useContext(TipstersContext);

  if (context === undefined) {
    throw new Error('useTipsters must be used within a TipstersProvider');
  }

  return context;
}
