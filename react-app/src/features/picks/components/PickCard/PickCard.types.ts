/**
 * @fileoverview PickCard types
 * @module features/picks/components/PickCard
 */

import type { Pick } from '@shared/types';

export interface PickCardProps {
  /** Pick data to display */
  pick: Pick;
  
  /** Name of the tipster who made this pick */
  tipsterName: string;
  
  /** Callback when edit button is clicked */
  onEdit?: (pick: Pick) => void;
  
  /** Callback when delete button is clicked */
  onDelete?: (pick: Pick) => void;
  
  /** Callback when follow button is clicked */
  onFollow?: (pick: Pick) => void;
  
  /** Whether this pick is already followed */
  isFollowed?: boolean;
  
  /** Whether to show action buttons */
  showActions?: boolean;
}
