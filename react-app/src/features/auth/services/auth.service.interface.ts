/**
 * @fileoverview Interface del servicio de autenticación
 * Aplica DIP (Dependency Inversion Principle): componentes dependen de esta abstracción, no de Firebase
 */

import type { User, LoginCredentials, SignupData } from '../types';

/**
 * Interface del servicio de autenticación
 */
export interface IAuthService {
  /**
   * Login con email y password
   * @param credentials - Email y contraseña
   * @returns Promise con el usuario autenticado
   * @throws Error si las credenciales son inválidas
   */
  login(credentials: LoginCredentials): Promise<User>;

  /**
   * Registro de nuevo usuario
   * @param data - Datos de registro (email, password)
   * @returns Promise con el usuario creado
   * @throws Error si el email ya está registrado o la contraseña es débil
   */
  signup(data: SignupData): Promise<User>;

  /**
   * Cerrar sesión
   * @returns Promise que se resuelve cuando se cierra la sesión
   * @throws Error si hay un problema al cerrar sesión
   */
  logout(): Promise<void>;

  /**
   * Enviar email de recuperación de contraseña
   * @param email - Email del usuario
   * @returns Promise que se resuelve cuando se envía el email
   * @throws Error si el email no existe o hay un problema de red
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Obtener usuario actual
   * @returns Usuario actual o null si no hay sesión activa
   */
  getCurrentUser(): User | null;

  /**
   * Observar cambios en autenticación
   * @param callback - Función que se ejecuta cuando cambia el estado de autenticación
   * @returns Función para cancelar la suscripción
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
