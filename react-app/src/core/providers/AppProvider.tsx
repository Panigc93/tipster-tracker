import type { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { TipstersProvider } from './TipstersProvider';
import { PicksProvider } from './PicksProvider';
import { FollowsProvider } from './FollowsProvider';
import { useAuth } from '@shared/hooks/useAuth';

interface DataProvidersProps {
  readonly children: ReactNode;
}

function DataProviders({ children }: DataProvidersProps) {
  const { user } = useAuth();
  const userId = user?.uid || null;

  return (
    <TipstersProvider userId={userId}>
      <PicksProvider userId={userId}>
        <FollowsProvider userId={userId}>{children}</FollowsProvider>
      </PicksProvider>
    </TipstersProvider>
  );
}

interface AppProviderProps {
  readonly children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <DataProviders>{children}</DataProviders>
    </AuthProvider>
  );
}
