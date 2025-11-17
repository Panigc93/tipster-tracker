/**
 * @fileoverview Hook para acceder al contexto de autenticación
 */

import { useContext } from 'react';
import { AuthContext } from '../providers/AuthContext';

/**
 * Hook para acceder al contexto de autenticación
 * @returns Contexto de autenticación con usuario, loading, error y funciones
 * @throws Error si se usa fuera del AuthProvider
 * @example
 * const { user, loading, error, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
