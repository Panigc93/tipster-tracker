/**
 * @fileoverview SkeletonLoader types
 * @module shared/components/ui/SkeletonLoader
 */

export interface SkeletonTextProps {
  /**
   * Width of the skeleton (CSS value)
   * @default '100%'
   */
  width?: string;
  
  /**
   * Height of the skeleton (CSS value)
   * @default '1rem'
   */
  height?: string;
  
  /**
   * Number of lines to render
   * @default 1
   */
  lines?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface SkeletonCardProps {
  /**
   * Height of the card (CSS value)
   * @default '100px'
   */
  height?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface SkeletonTableRowProps {
  /**
   * Number of columns
   * @default 5
   */
  columns?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface SkeletonTableProps {
  /**
   * Number of rows
   * @default 5
   */
  rows?: number;
  
  /**
   * Number of columns
   * @default 5
   */
  columns?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
