/**
 * Table component types
 */

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  /**
   * Unique key for the column
   */
  key: string;

  /**
   * Column header label
   */
  label: string;

  /**
   * Custom render function for cell content
   */
  render?: (row: T) => React.ReactNode;

  /**
   * Enable sorting for this column
   * @default false
   */
  sortable?: boolean;

  /**
   * Custom sort function
   */
  sortFn?: (a: T, b: T) => number;

  /**
   * Column width (CSS value)
   */
  width?: string;

  /**
   * Alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  /**
   * Table columns configuration
   */
  columns: TableColumn<T>[];

  /**
   * Table data
   */
  data: T[];

  /**
   * Unique key extractor
   */
  keyExtractor: (row: T) => string | number;

  /**
   * Empty state message
   */
  emptyMessage?: string;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Loading rows count (skeleton)
   * @default 5
   */
  loadingRows?: number;

  /**
   * Enable hover effect on rows
   * @default true
   */
  hoverable?: boolean;

  /**
   * Enable striped rows
   * @default false
   */
  striped?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Row click handler
   */
  onRowClick?: (row: T) => void;
}
