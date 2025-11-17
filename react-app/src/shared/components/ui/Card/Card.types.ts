/**
 * Card component types
 */

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Optional header content
   */
  header?: React.ReactNode;

  /**
   * Optional footer content
   */
  footer?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Disable default padding
   * @default false
   */
  noPadding?: boolean;

  /**
   * Clickable card (adds hover effect)
   * @default false
   */
  clickable?: boolean;

  /**
   * onClick handler (only works if clickable is true)
   */
  onClick?: () => void;
}
