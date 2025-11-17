/**
 * @fileoverview Barrel export para tipos de autenticación
 */

export type { User, LoginCredentials, SignupData, AuthState } from './auth.types';
export { AuthErrorCode, AUTH_ERROR_MESSAGES, getAuthErrorMessage } from './auth.types';
export type { AuthErrorCode as AuthErrorCodeType } from './auth.types';
