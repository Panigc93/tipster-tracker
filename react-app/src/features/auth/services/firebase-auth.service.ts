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
      throw new Error(firebaseError.code || 'Error al iniciar sesión');
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
      throw new Error(firebaseError.code || 'Error al registrar usuario');
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
