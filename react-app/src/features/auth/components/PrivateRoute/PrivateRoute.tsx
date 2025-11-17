import { Navigate } from 'react-router-dom';
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

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
