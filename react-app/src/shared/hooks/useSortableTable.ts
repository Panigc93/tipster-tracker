/**
 * @fileoverview useSortableTable - Custom hook for table sorting with multi-sort support
 * @module shared/hooks/useSortableTable
 */

import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortColumn<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
  columns: SortColumn<T>[]; // For multi-sort
}

export interface UseSortableTableResult<T> {
  sortedData: T[];
  sortConfig: SortConfig<T>;
  requestSort: (key: keyof T, isMulti?: boolean) => void;
  getSortIndicator: (key: keyof T) => string;
  clearSort: () => void;
}

/**
 * Compare two values for sorting
 */
function compareValues(aValue: unknown, bValue: unknown, direction: 'asc' | 'desc'): number {
  // Handle null/undefined values
  if (aValue === null || aValue === undefined) return 1;
  if (bValue === null || bValue === undefined) return -1;

  // Handle string comparison (case-insensitive)
  if (typeof aValue === 'string' && typeof bValue === 'string') {
    const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    return direction === 'asc' ? comparison : -comparison;
  }

  // Handle number comparison
  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  }

  // Handle date comparison (ISO strings)
  if (
    typeof aValue === 'string' &&
    typeof bValue === 'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(aValue)
  ) {
    const comparison = aValue.localeCompare(bValue);
    return direction === 'asc' ? comparison : -comparison;
  }

  // Fallback to string comparison
  return direction === 'asc'
    ? String(aValue).localeCompare(String(bValue))
    : String(bValue).localeCompare(String(aValue));
}

/**
 * Custom hook for table sorting with multi-sort support
 * @param data - Array of data to sort
 * @param defaultSortKey - Optional default column to sort by
 * @param defaultSortDirection - Optional default sort direction
 * @returns Object with sorted data, sort config, and helper functions
 *
 * @example
 * // Simple sort
 * const { sortedData, requestSort, getSortIndicator } = useSortableTable(data, 'date', 'desc');
 *
 * // Multi-sort (hold Shift key)
 * <th onClick={(e) => requestSort('name', e.shiftKey)}>
 *   Name {getSortIndicator('name')}
 * </th>
 */
export function useSortableTable<T>(
  data: T[],
  defaultSortKey: keyof T | null = null,
  defaultSortDirection: SortDirection = 'desc'
): UseSortableTableResult<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: defaultSortKey,
    direction: defaultSortDirection,
    columns: defaultSortKey && defaultSortDirection ? [{ key: defaultSortKey, direction: defaultSortDirection }] : [],
  });

  /**
   * Sort data based on current sort config (supports multi-column sorting)
   */
  const sortedData = useMemo(() => {
    if (sortConfig.columns.length === 0) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      // Apply sorting for each column in order
      for (const column of sortConfig.columns) {
        if (!column.direction) continue;

        const aValue = a[column.key];
        const bValue = b[column.key];

        const comparison = compareValues(aValue, bValue, column.direction);

        // If values are different, return the comparison result
        if (comparison !== 0) {
          return comparison;
        }
        // If equal, continue to next sort column
      }

      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  /**
   * Request sort by a specific column
   * @param key - Column key to sort by
   * @param isMulti - If true (Shift key held), add to existing sorts. If false, replace sort.
   *
   * Single column: toggles null -> asc -> desc -> null
   * Multi column: adds/updates column in sort chain
   */
  const requestSort = (key: keyof T, isMulti = false) => {
    if (!isMulti) {
      // Single column sort - toggle through states
      let direction: SortDirection = 'asc';

      if (sortConfig.key === key) {
        if (sortConfig.direction === 'asc') {
          direction = 'desc';
        } else if (sortConfig.direction === 'desc') {
          direction = null;
        }
      }

      setSortConfig({
        key: direction ? key : null,
        direction,
        columns: direction ? [{ key, direction }] : [],
      });
    } else {
      // Multi-column sort
      const existingColumn = sortConfig.columns.find((col) => col.key === key);

      if (existingColumn) {
        // Toggle existing column
        let newDirection: SortDirection = 'asc';
        if (existingColumn.direction === 'asc') {
          newDirection = 'desc';
        } else if (existingColumn.direction === 'desc') {
          newDirection = null;
        }

        const newColumns = newDirection
          ? sortConfig.columns.map((col) => (col.key === key ? { key, direction: newDirection } : col))
          : sortConfig.columns.filter((col) => col.key !== key);

        const primaryColumn = newColumns[0];
        setSortConfig({
          key: primaryColumn?.key ?? null,
          direction: primaryColumn?.direction ?? null,
          columns: newColumns.filter((col) => col.direction !== null) as SortColumn<T>[],
        });
      } else {
        // Add new column to sort
        const newColumns = [...sortConfig.columns, { key, direction: 'asc' as SortDirection }];
        setSortConfig({
          key: sortConfig.key ?? key,
          direction: sortConfig.direction ?? 'asc',
          columns: newColumns,
        });
      }
    }
  };

  /**
   * Get sort indicator for a column
   * Returns ↑ for asc, ↓ for desc, with number for multi-sort priority
   */
  const getSortIndicator = (key: keyof T): string => {
    const columnIndex = sortConfig.columns.findIndex((col) => col.key === key);

    if (columnIndex === -1) return '';

    const column = sortConfig.columns[columnIndex];
    const arrow = column.direction === 'asc' ? '↑' : '↓';

    // Show priority number for multi-sort (if more than 1 column)
    if (sortConfig.columns.length > 1) {
      return `${arrow}${columnIndex + 1}`;
    }

    return arrow;
  };

  /**
   * Clear all sorting
   */
  const clearSort = () => {
    setSortConfig({ key: null, direction: null, columns: [] });
  };

  return {
    sortedData,
    sortConfig,
    requestSort,
    getSortIndicator,
    clearSort,
  };
}
