/**
 * @fileoverview Provider de autenticación
 * Gestiona el estado global de autenticación
 */

import {
  type FC,
  type ReactNode,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { authService } from '../services';
import type { LoginCredentials, SignupData, AuthState } from '../types';
import { getAuthErrorMessage } from '../types';
import { AuthContext, type AuthContextValue } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de autenticación
 * Gestiona el estado global de autenticación y sincroniza con Firebase
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  /**
   * Listener de cambios en autenticación
   * Se ejecuta cuando Firebase detecta cambios en el estado de autenticación
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        user,
        loading: false,
      }));
    });

    return unsubscribe;
  }, []);

  /**
   * Login con email y password
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      await authService.login(credentials);
      // El usuario se actualizará automáticamente por onAuthStateChanged
    } catch (error: unknown) {
      const firebaseError = error as { message?: string };
      setState((prev) => ({
        ...prev,
        error: getAuthErrorMessage(firebaseError.message || ''),
      }));
      throw error;
    }
  }, []);

  /**
   * Registro de nuevo usuario
   */
  const signup = useCallback(async (data: SignupData) => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      await authService.signup(data);
      // El usuario se actualizará automáticamente por onAuthStateChanged
    } catch (error: unknown) {
      const firebaseError = error as { message?: string };
      setState((prev) => ({
        ...prev,
        error: getAuthErrorMessage(firebaseError.message || ''),
      }));
      throw error;
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await authService.logout();
    } catch (error: unknown) {
      const firebaseError = error as { message?: string };
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(firebaseError.message || ''),
      }));
      throw error;
    }
  }, []);

  /**
   * Enviar email de recuperación de contraseña
   */
  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (error: unknown) {
      const firebaseError = error as { message?: string };
      const errorMsg = getAuthErrorMessage(firebaseError.message || '');
      setState((prev) => ({ ...prev, error: errorMsg }));
      throw error;
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      login,
      signup,
      logout,
      sendPasswordResetEmail,
      clearError,
    }),
    [state, login, signup, logout, sendPasswordResetEmail, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
