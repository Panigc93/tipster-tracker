/**
 * @fileoverview Utility functions for settings
 * @module features/settings/utils
 */

/**
 * Sort items alphabetically but keep "Otro" at the end
 * @param items - Array of items to sort
 * @returns Sorted array with "Otro" at the end
 */
export function sortWithOtroLast(items: string[]): string[] {
  return [...items].sort((a, b) => {
    // "Otro" always goes to the end
    if (a === 'Otro') return 1;
    if (b === 'Otro') return -1;
    
    // Alphabetical sort for everything else
    return a.localeCompare(b, 'es', { sensitivity: 'base' });
  });
}

/**
 * Check if an item is "Otro"
 * @param item - Item to check
 * @returns true if item is "Otro"
 */
export function isOtro(item: string): boolean {
  return item === 'Otro';
}
