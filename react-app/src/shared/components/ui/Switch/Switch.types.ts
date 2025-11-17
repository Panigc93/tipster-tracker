/**
 * Switch component types
 */

export interface SwitchProps {
  /**
   * Switch state (on/off)
   */
  checked: boolean;

  /**
   * Callback when state changes
   */
  onChange: (checked: boolean) => void;

  /**
   * Label text
   */
  label?: string;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
