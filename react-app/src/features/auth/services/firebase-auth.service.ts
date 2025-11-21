/**
 * @fileoverview Implementación del servicio de autenticación con Firebase
 * Aplica SRP: solo se encarga de autenticación
 * Aplica DIP: implementa IAuthService
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@core/config/firebase.config';
import type { IAuthService } from './auth.service.interface';
import type { User, LoginCredentials, SignupData } from '../types';

/**
 * Implementación del servicio de autenticación con Firebase
 */
export class FirebaseAuthService implements IAuthService {
  /**
   * Convierte FirebaseUser a nuestro tipo User
   * @param firebaseUser - Usuario de Firebase
   * @returns Usuario en formato de la aplicación
   */
  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
    };
  }

  /**
   * Login con email y password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      
      // Map Firebase error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'No existe una cuenta con este email. ¿Necesitas registrarte?',
        'auth/wrong-password': 'Contraseña incorrecta. Inténtalo de nuevo.',
        'auth/invalid-email': 'El formato del email no es válido.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      };
      
      const message = errorMessages[firebaseError.code || ''] || 'Error al iniciar sesión. Inténtalo de nuevo.';
      throw new Error(message);
    }
  }

  /**
   * Registro de nuevo usuario
   */
  async signup(data: SignupData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      
      // Map Firebase error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'Ya existe una cuenta con este email.',
        'auth/invalid-email': 'El formato del email no es válido.',
        'auth/weak-password': 'La contraseña es demasiado débil. Usa al menos 6 caracteres.',
        'auth/operation-not-allowed': 'El registro está deshabilitado temporalmente.',
      };
      
      const message = errorMessages[firebaseError.code || ''] || 'Error al registrar usuario. Inténtalo de nuevo.';
      throw new Error(message);
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      throw new Error(firebaseError.code || 'Error al cerrar sesión');
    }
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseSendPasswordReset(auth, email);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      throw new Error(firebaseError.code || 'Error al enviar email de recuperación');
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    return firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
  }

  /**
   * Observar cambios en autenticación
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
      callback(user);
    });
  }
}

/**
 * Instancia singleton del servicio de autenticación
 */
export const authService = new FirebaseAuthService();
