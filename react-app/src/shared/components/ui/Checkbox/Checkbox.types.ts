/**
 * Checkbox component types
 */

export interface CheckboxProps {
  /**
   * Checked state
   */
  checked: boolean;

  /**
   * Callback when checked state changes
   */
  onChange: (checked: boolean) => void;

  /**
   * Label text
   */
  label?: string;

  /**
   * Indeterminate state (partially checked)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

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
   * Additional CSS classes
   */
  className?: string;
}
