import { useEffect } from 'react';
import { useAuth } from '../../hooks';
import type { PrivateRouteProps } from './PrivateRoute.types';

/**
 * PrivateRoute component that protects routes requiring authentication
 *
 * @example
 * ```tsx
 * <PrivateRoute>
 *   <DashboardPage />
 * </PrivateRoute>
 * ```
 */
export function PrivateRoute({ children, redirectTo = '/login' }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !user) {
      // TODO: Use React Router navigate here
      // For now, just log
      console.log(`Not authenticated, should redirect to ${redirectTo}`);
    }
  }, [user, loading, redirectTo]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  // (Router will handle redirect)
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
