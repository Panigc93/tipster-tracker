/**
 * Alert component types
 */

export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

export interface AlertProps {
  /**
   * Alert variant/type
   * @default 'info'
   */
  variant?: AlertVariant;

  /**
   * Alert title (optional)
   */
  title?: string;

  /**
   * Alert message/content
   */
  children: React.ReactNode;

  /**
   * Show dismiss button
   * @default false
   */
  dismissible?: boolean;

  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
