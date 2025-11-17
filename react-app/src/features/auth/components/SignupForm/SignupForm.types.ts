/**
 * SignupForm component types
 */

export interface SignupFormProps {
  /**
   * Callback when signup is successful
   */
  onSuccess?: () => void;

  /**
   * Show link to login page
   * @default true
   */
  showLoginLink?: boolean;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}
