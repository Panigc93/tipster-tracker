import { Card } from '@shared/components/ui';
import { SignupForm } from '@features/auth/components';

/**
 * Signup page with registration form
 */
export function SignupPage() {
  const handleSignupSuccess = () => {
    // TODO: Navigate to dashboard after successful signup
    // Will be implemented with React Router
    console.log('Signup successful, navigating to dashboard...');
  };

  const handleLoginClick = () => {
    // TODO: Navigate to login page
    // Will be implemented with React Router
    console.log('Navigate to login...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Tipster Tracker</h1>
          <p className="text-slate-400">Crea tu cuenta para comenzar</p>
        </div>

        {/* Main card */}
        <Card>
          <SignupForm onSuccess={handleSignupSuccess} />
        </Card>

        {/* Footer message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
