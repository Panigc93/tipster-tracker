import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PrivateRoute } from '@features/auth/components';
import { Layout } from '@shared/components/layout';
import { ErrorBoundary, PageLoadingFallback } from '@shared/components';

// Lazy load all page components for code splitting
const LoginPage = lazy(() => 
  import('@features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage }))
);
const SignupPage = lazy(() => 
  import('@features/auth/pages/SignupPage').then(module => ({ default: module.SignupPage }))
);
const DashboardPage = lazy(() => 
  import('@features/dashboard/pages/DashboardPage').then(module => ({ default: module.DashboardPage }))
);

const TipsterDetailPage = lazy(() => 
  import('@features/tipsters/pages/TipsterDetailPage').then(module => ({ default: module.TipsterDetailPage }))
);
const PicksListPage = lazy(() => 
  import('@features/picks/pages/PicksListPage').then(module => ({ default: module.PicksListPage }))
);
const MyPicksPage = lazy(() => 
  import('@features/follows/pages/MyPicksPage').then(module => ({ default: module.MyPicksPage }))
);

// TEMPORARY: Demo page for settings components
const SettingsDemo = lazy(() =>
  import('@features/settings/pages').then(module => ({ default: module.SettingsDemo }))
);

/**
 * Suspense wrapper for lazy-loaded pages
 */
const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoadingFallback />}>
    {children}
  </Suspense>
);
/**
 * Application routes configuration
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PageSuspense>
        <LoginPage />
      </PageSuspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <PageSuspense>
        <SignupPage />
      </PageSuspense>
    ),
  },
  // TEMPORARY: Demo route for settings components
  {
    path: '/settings-demo',
    element: (
      <PrivateRoute>
        <Layout>
          <PageSuspense>
            <SettingsDemo />
          </PageSuspense>
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Layout>
          <ErrorBoundary>
            <PageSuspense>
              <DashboardPage />
            </PageSuspense>
          </ErrorBoundary>
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
            <PageSuspense>
              <TipsterDetailPage />
            </PageSuspense>
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
            <PageSuspense>
              <PicksListPage />
            </PageSuspense>
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
            <PageSuspense>
              <MyPicksPage />
            </PageSuspense>
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
