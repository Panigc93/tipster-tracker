/**
 * @fileoverview FollowCard types
 * @module features/follows/components/FollowCard
 */

import type { UserFollow, Pick } from '@shared/types';

export interface FollowCardProps {
  /** Follow data to display */
  follow: UserFollow;
  
  /** Original pick from tipster */
  pick: Pick;
  
  /** Name of the tipster */
  tipsterName: string;
  
  /** Callback when edit button is clicked */
  onEdit?: (follow: UserFollow) => void;
  
  /** Callback when delete button is clicked */
  onDelete?: (follow: UserFollow) => void;
  
  /** Whether to show action buttons */
  showActions?: boolean;
}
