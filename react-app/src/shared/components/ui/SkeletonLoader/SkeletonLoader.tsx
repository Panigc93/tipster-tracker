/**
 * @fileoverview SkeletonLoader - Animated loading placeholders
 * @module shared/components/ui/SkeletonLoader
 */

import type {
  SkeletonTextProps,
  SkeletonCardProps,
  SkeletonTableRowProps,
  SkeletonTableProps,
} from './SkeletonLoader.types';

/**
 * SkeletonText - Animated text placeholder
 * 
 * @example
 * ```tsx
 * <SkeletonText width="200px" height="20px" />
 * <SkeletonText lines={3} />
 * ```
 */
export function SkeletonText({
  width = '100%',
  height = '1rem',
  lines = 1,
  className = '',
}: SkeletonTextProps) {
  if (lines === 1) {
    return (
      <div
        className={`animate-pulse bg-slate-700 rounded ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-slate-700 rounded"
          style={{
            width: i === lines - 1 ? '80%' : width,
            height,
          }}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - Animated card placeholder
 * 
 * @example
 * ```tsx
 * <SkeletonCard height="100px" />
 * ```
 */
export function SkeletonCard({ height = '100px', className = '' }: SkeletonCardProps) {
  return (
    <div
      className={`animate-pulse bg-slate-800 border border-slate-700 rounded-lg ${className}`}
      style={{ height }}
    />
  );
}

/**
 * SkeletonTableRow - Animated table row placeholder
 * 
 * @example
 * ```tsx
 * <SkeletonTableRow columns={5} />
 * ```
 */
export function SkeletonTableRow({ columns = 5, className = '' }: SkeletonTableRowProps) {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="animate-pulse bg-slate-700 rounded h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * SkeletonTable - Animated table placeholder
 * 
 * @example
 * ```tsx
 * <SkeletonTable rows={10} columns={12} />
 * ```
 */
export function SkeletonTable({ rows = 5, columns = 5, className = '' }: SkeletonTableProps) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-500/10 border-b border-slate-700">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <div className="animate-pulse bg-slate-600 rounded h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonTableRow key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
