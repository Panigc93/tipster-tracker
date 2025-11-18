import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@features/auth/providers';
import { router } from '@core/routing';
import '@shared/config/chart.config'; // Initialize Chart.js

/**
 * Main App component with routing and authentication
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

/**
 * Phase 3 - Authentication complete! ✅
 *
 * Implemented:
 * - Auth foundation (types, service, provider, hook)
 * - UI components (Button, Input, Card, Alert)
 * - Auth forms (LoginForm, SignupForm, ForgotPasswordForm)
 * - Auth pages (LoginPage, SignupPage)
 * - PrivateRoute component
 * - React Router integration
 *
 * Next: Phase 4 - Feature Tipsters
 */
