/**
 * @fileoverview PickTableRow component types
 * @module features/picks/components/PickTableRow
 */

import type { Pick } from '@shared/types';

export interface PickTableRowProps {
  /**
   * Pick data to display
   */
  pick: Pick;

  /**
   * Tipster name for display
   */
  tipsterName: string;

  /**
   * Callback when edit button is clicked
   */
  onEdit?: (pick: Pick) => void;

  /**
   * Callback when delete button is clicked
   */
  onDelete?: (pick: Pick) => void;

  /**
   * Callback when follow button is clicked
   */
  onFollow?: (pick: Pick) => void;

  /**
   * Whether the pick is already followed
   */
  isFollowed?: boolean;

  /**
   * Whether to show actions column
   * @default true
   */
  showActions?: boolean;
}
