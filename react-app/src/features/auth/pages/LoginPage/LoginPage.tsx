import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@shared/components/ui';
import { LoginForm, ForgotPasswordForm } from '@features/auth/components';

/**
 * Login page with authentication form
 */
export function LoginPage() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLoginSuccess = () => {
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Tipster Tracker</h1>
          <p className="text-slate-400">
            {showForgotPassword ? 'Recuperar contraseña' : 'Inicia sesión en tu cuenta'}
          </p>
        </div>

        {/* Main card */}
        <Card>
          {showForgotPassword ? (
            <ForgotPasswordForm
              onSuccess={handleForgotPasswordClose}
              onCancel={handleForgotPasswordClose}
            />
          ) : (
            <LoginForm onSuccess={handleLoginSuccess} />
          )}
        </Card>

        {/* Footer message */}
        {!showForgotPassword && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={handleSignupClick}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        )}

        {/* Forgot password link (alternative position) */}
        {!showForgotPassword && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
