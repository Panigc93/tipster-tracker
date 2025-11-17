/**
 * LoginForm component types
 */

export interface LoginFormProps {
  /**
   * Callback when login is successful
   */
  onSuccess?: () => void;

  /**
   * Show link to signup page
   * @default true
   */
  showSignupLink?: boolean;

  /**
   * Show forgot password link
   * @default true
   */
  showForgotPassword?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}
