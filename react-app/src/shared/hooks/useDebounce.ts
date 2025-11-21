/**
 * @fileoverview useDebounce hook - Debounces a value
 * @module shared/hooks
 */

import { useState, useEffect } from 'react';

/**
 * Hook to debounce a value
 * 
 * Delays updating the returned value until the input value has stopped changing
 * for the specified delay period. Useful for optimizing search inputs and
 * reducing unnecessary API calls or expensive computations.
 * 
 * @template T - Type of the value to debounce
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebounce(searchQuery, 300);
 * 
 * // debouncedQuery will only update 300ms after user stops typing
 * useEffect(() => {
 *   // Perform search with debouncedQuery
 * }, [debouncedQuery]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
