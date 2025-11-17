import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button, Input, Alert } from '@shared/components/ui';
import { useAuth } from '../../hooks';
import type { LoginFormProps, LoginFormData, LoginFormErrors } from './LoginForm.types';

/**
 * Login form component with email and password inputs
 *
 * @example
 * ```tsx
 * <LoginForm onSuccess={() => navigate('/dashboard')} />
 * ```
 */
export function LoginForm({
  onSuccess,
  showSignupLink = true,
  showForgotPassword = true,
}: LoginFormProps) {
  const { login, loading, error: authError } = useAuth();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  // Form errors
  const [errors, setErrors] = useState<LoginFormErrors>({});

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Call login from auth context
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Call success callback if provided
      onSuccess?.();
    } catch (err) {
      // Error is handled by AuthProvider and displayed via authError
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auth error alert */}
      {authError && (
        <Alert variant="error" title="Error de autenticación">
          {authError}
        </Alert>
      )}

      {/* Email input */}
      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<Mail className="h-5 w-5" />}
        required
        fullWidth
        disabled={loading}
      />

      {/* Password input */}
      <Input
        type="password"
        name="password"
        label="Contraseña"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={<Lock className="h-5 w-5" />}
        required
        fullWidth
        disabled={loading}
      />

      {/* Forgot password link */}
      {showForgotPassword && (
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            onClick={() => {
              // TODO: Implementar modal de forgot password
              console.log('Forgot password clicked');
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      )}

      {/* Submit button */}
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      {/* Signup link */}
      {showSignupLink && (
        <div className="text-center text-sm text-slate-400">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            onClick={() => {
              // TODO: Navigate to signup page
              console.log('Signup link clicked');
            }}
          >
            Regístrate
          </button>
        </div>
      )}
    </form>
  );
}
