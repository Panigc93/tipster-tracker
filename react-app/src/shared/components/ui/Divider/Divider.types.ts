/**
 * Divider component types
 */

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;

  /**
   * Text content in the middle of divider
   */
  text?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
