import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { Button, Input, Alert } from '@shared/components/ui';
import { useAuth } from '../../hooks';
import type { SignupFormProps, SignupFormData, SignupFormErrors } from './SignupForm.types';

/**
 * Signup form component with email, password and confirm password inputs
 *
 * @example
 * ```tsx
 * <SignupForm onSuccess={() => navigate('/dashboard')} />
 * ```
 */
export function SignupForm({ onSuccess, showLoginLink = true }: SignupFormProps) {
  const { signup, loading, error: authError } = useAuth();

  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Form errors
  const [errors, setErrors] = useState<SignupFormErrors>({});

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {};

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
    if (errors[name as keyof SignupFormErrors]) {
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
      // Call signup from auth context
      await signup({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Call success callback if provided
      onSuccess?.();
    } catch (err) {
      // Error is handled by AuthProvider and displayed via authError
      console.error('Signup error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auth error alert */}
      {authError && (
        <Alert variant="error" title="Error de registro">
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
        helperText="Mínimo 6 caracteres"
        required
        fullWidth
        disabled={loading}
      />

      {/* Confirm password input */}
      <Input
        type="password"
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon={<Lock className="h-5 w-5" />}
        required
        fullWidth
        disabled={loading}
      />

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        icon={<UserPlus className="h-5 w-5" />}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>

      {/* Login link */}
      {showLoginLink && (
        <div className="text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            onClick={() => {
              // TODO: Navigate to login page
              console.log('Login link clicked');
            }}
          >
            Inicia sesión
          </button>
        </div>
      )}
    </form>
  );
}
