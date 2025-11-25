export interface StatCardProps {
  /**
   * Label text displayed above the value
   */
  readonly label: string;

  /**
   * Value to display (can be string or number)
   */
  readonly value: string | number;

  /**
   * Optional CSS class for value styling (e.g., 'text-green-400')
   * @default 'text-slate-100'
   */
  readonly valueClassName?: string;

  /**
   * Optional tooltip text
   */
  readonly title?: string;

  /**
   * Size variant for the card
   * @default 'md'
   */
  readonly size?: 'sm' | 'md' | 'lg';
}
