/**
 * @fileoverview Barrel export para servicios de autenticación
 */

export type { IAuthService } from './auth.service.interface';
export { FirebaseAuthService, authService } from './firebase-auth.service';
