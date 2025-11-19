/**
 * @fileoverview useSortableTable - Custom hook for table sorting
 * @module shared/hooks/useSortableTable
 */

import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

export interface UseSortableTableResult<T> {
  sortedData: T[];
  sortConfig: SortConfig<T>;
  requestSort: (key: keyof T) => void;
  getSortIndicator: (key: keyof T) => '↑' | '↓' | '';
}

/**
 * Custom hook for table sorting with visual indicators
 * @param data - Array of data to sort
 * @param defaultSortKey - Optional default column to sort by
 * @param defaultSortDirection - Optional default sort direction
 * @returns Object with sorted data, sort config, and helper functions
 */
export function useSortableTable<T>(
  data: T[],
  defaultSortKey: keyof T | null = null,
  defaultSortDirection: SortDirection = 'desc'
): UseSortableTableResult<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: defaultSortKey,
    direction: defaultSortDirection,
  });

  /**
   * Sort data based on current sort config
   */
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle string comparison (case-insensitive)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle date comparison (ISO strings)
      if (
        typeof aValue === 'string' &&
        typeof bValue === 'string' &&
        /^\d{4}-\d{2}-\d{2}/.test(aValue)
      ) {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Fallback to string comparison
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [data, sortConfig]);

  /**
   * Request sort by a specific column
   * Toggles direction: null -> asc -> desc -> null
   */
  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key: direction ? key : null, direction });
  };

  /**
   * Get sort indicator for a column
   * Returns ↑ for asc, ↓ for desc, empty string for no sort
   */
  const getSortIndicator = (key: keyof T): '↑' | '↓' | '' => {
    if (sortConfig.key !== key) return '';
    if (sortConfig.direction === 'asc') return '↑';
    if (sortConfig.direction === 'desc') return '↓';
    return '';
  };

  return {
    sortedData,
    sortConfig,
    requestSort,
    getSortIndicator,
  };
}
