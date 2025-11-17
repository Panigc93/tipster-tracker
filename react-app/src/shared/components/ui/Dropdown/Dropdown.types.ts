/**
 * Dropdown component types
 */

export type DropdownMode = 'single' | 'multi';

export interface DropdownOption {
  /**
   * Unique value for the option
   */
  value: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Optional icon (Lucide icon name or React element)
   */
  icon?: React.ReactNode;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface DropdownProps {
  /**
   * Available options
   */
  options: DropdownOption[];

  /**
   * Selected value(s)
   * - Single mode: string | undefined
   * - Multi mode: string[]
   */
  value?: string | string[];

  /**
   * Callback when selection changes
   * - Single mode: (value: string) => void
   * - Multi mode: (values: string[]) => void
   */
  onChange: (value: string | string[]) => void;

  /**
   * Selection mode
   * @default 'single'
   */
  mode?: DropdownMode;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Enable search/filter
   * @default false
   */
  searchable?: boolean;

  /**
   * Search placeholder
   */
  searchPlaceholder?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
