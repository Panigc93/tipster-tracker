import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, SignupPage } from '@features/auth/pages';
import { PrivateRoute } from '@features/auth/components';
import { DashboardPage } from '@features/dashboard/pages';
import { TipsterListPage, TipsterDetailPage } from '@features/tipsters/pages';
import { PicksListPage } from '@features/picks/pages';
import { MyPicksPage } from '@features/follows/pages';
import { Layout } from '@shared/components/layout';
import { ErrorBoundary } from '@shared/components';

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
          <ErrorBoundary>
            <DashboardPage />
          </ErrorBoundary>
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
          <ErrorBoundary>
            <TipsterDetailPage />
          </ErrorBoundary>
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/picks',
    element: (
      <PrivateRoute>
        <Layout>
          <ErrorBoundary>
            <PicksListPage />
          </ErrorBoundary>
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/my-picks',
    element: (
      <PrivateRoute>
        <Layout>
          <ErrorBoundary>
            <MyPicksPage />
          </ErrorBoundary>
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
