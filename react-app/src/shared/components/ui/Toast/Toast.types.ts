/**
 * Toast component types
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  /**
   * Unique ID
   */
  id: string;

  /**
   * Toast message
   */
  message: string;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: ToastVariant;

  /**
   * Auto-dismiss duration in ms (0 = no auto-dismiss)
   * @default 5000
   */
  duration?: number;
}

export interface ToastContainerProps {
  /**
   * Position on screen
   * @default 'top-right'
   */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}
