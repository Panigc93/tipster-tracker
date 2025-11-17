/**
 * @fileoverview Contexto de autenticación
 */

import { createContext } from 'react';
import type { AuthState, LoginCredentials, SignupData } from '../types';

/**
 * Valor del contexto de autenticación
 */
export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Contexto de autenticación
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
