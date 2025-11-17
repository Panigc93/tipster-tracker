/**
 * Radio component types
 */

export interface RadioOption {
  /**
   * Unique value
   */
  value: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface RadioGroupProps {
  /**
   * Available options
   */
  options: RadioOption[];

  /**
   * Selected value
   */
  value: string;

  /**
   * Callback when selection changes
   */
  onChange: (value: string) => void;

  /**
   * Group name (for native radio)
   */
  name: string;

  /**
   * Layout direction
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal';

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
