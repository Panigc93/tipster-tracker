/**
 * Spinner component types
 */

export type SpinnerVariant = 'circular' | 'dots';
export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps {
  /**
   * Spinner variant
   * @default 'circular'
   */
  variant?: SpinnerVariant;

  /**
   * Spinner size
   * @default 'md'
   */
  size?: SpinnerSize;

  /**
   * Show as overlay (full screen with backdrop)
   * @default false
   */
  overlay?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
