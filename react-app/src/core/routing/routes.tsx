import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, SignupPage } from '@features/auth/pages';
import { PrivateRoute } from '@features/auth/components';
import { TipsterListPage, TipsterDetailPage } from '@features/tipsters/pages';
import { PicksListPage } from '@features/picks/pages';
import { MyPicksPage } from '@features/follows/pages';
import { Layout } from '@shared/components/layout';
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
        <Layout>
          <DashboardPlaceholder />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/tipsters',
    element: (
      <PrivateRoute>
        <Layout>
          <TipsterListPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/tipsters/:id',
    element: (
      <PrivateRoute>
        <Layout>
          <TipsterDetailPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/picks',
    element: (
      <PrivateRoute>
        <Layout>
          <PicksListPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/my-picks',
    element: (
      <PrivateRoute>
        <Layout>
          <MyPicksPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
