/**
 * @fileoverview Types para el feature de autenticación
 * @module features/auth/types
 */

/**
 * Usuario autenticado
 */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos de registro
 */
export interface SignupData {
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Errores de autenticación de Firebase
 */
export const AuthErrorCode = {
  INVALID_EMAIL: 'auth/invalid-email',
  USER_DISABLED: 'auth/user-disabled',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

/**
 * Mapeo de errores a mensajes en español
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AuthErrorCode.INVALID_EMAIL]: 'El email no es válido',
  [AuthErrorCode.USER_DISABLED]: 'Esta cuenta ha sido deshabilitada',
  [AuthErrorCode.USER_NOT_FOUND]: 'No existe una cuenta con este email',
  [AuthErrorCode.WRONG_PASSWORD]: 'Contraseña incorrecta',
  [AuthErrorCode.EMAIL_ALREADY_IN_USE]: 'Este email ya está registrado',
  [AuthErrorCode.WEAK_PASSWORD]:
    'La contraseña debe tener al menos 6 caracteres',
  [AuthErrorCode.TOO_MANY_REQUESTS]:
    'Demasiados intentos. Inténtalo más tarde',
  [AuthErrorCode.NETWORK_REQUEST_FAILED]:
    'Error de conexión. Verifica tu internet',
};

/**
 * Helper para obtener mensaje de error legible
 * @param errorCode - Código de error de Firebase
 * @returns Mensaje de error en español
 */
export function getAuthErrorMessage(errorCode: string): string {
  return AUTH_ERROR_MESSAGES[errorCode] || 'Error desconocido. Inténtalo de nuevo';
}
