import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { AuthContext, type AuthContextValue } from './AuthContext';

interface InternalAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<InternalAuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({ user, loading: false, error: null });
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch {
      const errorMessage = 'Error de autenticacion';
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch {
      const errorMessage = 'Error al crear cuenta';
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signOut(auth);
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch {
      const errorMessage = 'Error al cerrar sesion';
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch {
      const errorMessage = 'Error al enviar email';
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const clearError = (): void => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const value: AuthContextValue = useMemo(
    () => ({ user: authState.user, loading: authState.loading, error: authState.error, login, signup, logout, resetPassword, clearError }),
    [authState.user, authState.loading, authState.error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
