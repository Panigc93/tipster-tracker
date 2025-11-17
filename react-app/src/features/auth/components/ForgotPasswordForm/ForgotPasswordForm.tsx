import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { Button, Input, Alert } from '@shared/components/ui';
import { useAuth } from '../../hooks';
import type {
  ForgotPasswordFormProps,
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
} from './ForgotPasswordForm.types';

/**
 * Forgot password form component for password reset
 *
 * @example
 * ```tsx
 * <ForgotPasswordForm
 *   onSuccess={() => setShowModal(false)}
 *   onCancel={() => setShowModal(false)}
 * />
 * ```
 */
export function ForgotPasswordForm({ onSuccess, onCancel }: ForgotPasswordFormProps) {
  const { sendPasswordResetEmail, loading } = useAuth();

  // Form state
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });

  // Form errors and success state
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordFormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
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
    if (errors[name as keyof ForgotPasswordFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear local error
    if (localError) {
      setLocalError(null);
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
      // Call sendPasswordResetEmail from auth context
      await sendPasswordResetEmail(formData.email);

      // Show success state
      setIsSuccess(true);

      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      // Handle error
      console.error('Password reset error:', err);
      setLocalError(
        'No se pudo enviar el email de recuperación. Verifica tu dirección de correo.'
      );
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="space-y-4">
        <Alert variant="success" title="Email enviado">
          Revisa tu bandeja de entrada. Te hemos enviado un email con instrucciones para
          restablecer tu contraseña.
        </Alert>
        <Button variant="secondary" fullWidth onClick={onCancel}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error alert */}
      {localError && <Alert variant="error">{localError}</Alert>}

      {/* Instructions */}
      <p className="text-sm text-slate-400">
        Introduce tu email y te enviaremos instrucciones para restablecer tu contraseña.
      </p>

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

      {/* Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          {loading ? 'Enviando...' : 'Enviar email'}
        </Button>
      </div>
    </form>
  );
}
