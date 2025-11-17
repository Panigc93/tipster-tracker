import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, SignupPage } from '@features/auth/pages';
import { PrivateRoute } from '@features/auth/components';
import { TipsterListPage, TipsterDetailPage } from '@features/tipsters/pages';
import { DashboardPlaceholder } from './DashboardPlaceholder';

/**
 * Application routes configuration
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardPlaceholder />
      </PrivateRoute>
    ),
  },
  {
    path: '/tipsters',
    element: (
      <PrivateRoute>
        <TipsterListPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/tipsters/:id',
    element: (
      <PrivateRoute>
        <TipsterDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
