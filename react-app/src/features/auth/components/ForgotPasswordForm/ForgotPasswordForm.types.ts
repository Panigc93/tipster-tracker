/**
 * ForgotPasswordForm component types
 */

export interface ForgotPasswordFormProps {
  /**
   * Callback when email is sent successfully
   */
  onSuccess?: () => void;

  /**
   * Callback to close the form/modal
   */
  onCancel?: () => void;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  general?: string;
}
