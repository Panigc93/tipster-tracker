/**
 * Input component types
 */

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Label text
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below input
   */
  helperText?: string;

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display at the start of input (Lucide React icon component)
   */
  icon?: React.ReactNode;

  /**
   * Input container className
   */
  containerClassName?: string;
}
