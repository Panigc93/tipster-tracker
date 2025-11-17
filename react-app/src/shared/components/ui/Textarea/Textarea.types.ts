/**
 * Textarea component types
 */

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /**
   * Textarea value
   */
  value: string;

  /**
   * Callback when value changes
   */
  onChange: (value: string) => void;

  /**
   * Label text
   */
  label?: string;

  /**
   * Error state
   * @default false
   */
  error?: boolean;

  /**
   * Error message
   */
  errorMessage?: string;

  /**
   * Auto-resize to fit content
   * @default false
   */
  autoResize?: boolean;

  /**
   * Show character counter
   * @default false
   */
  showCounter?: boolean;

  /**
   * Maximum character length
   */
  maxLength?: number;

  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;
}
