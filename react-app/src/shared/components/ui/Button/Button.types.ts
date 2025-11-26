/**
 * Button component types
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'transparent';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Shows loading spinner and disables button
   * @default false
   */
  loading?: boolean;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display before text (Lucide React icon component)
   */
  icon?: React.ReactNode;

  /**
   * Button content (optional for icon-only buttons)
   */
  children?: React.ReactNode;
}
