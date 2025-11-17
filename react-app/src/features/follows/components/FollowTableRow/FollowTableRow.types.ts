import type { UserFollow, Pick } from '@shared/types';

/**
 * Props for FollowTableRow component
 */
export interface FollowTableRowProps {
  /**
   * Follow data (user's follow)
   */
  follow: UserFollow;

  /**
   * Original pick data from tipster
   */
  pick: Pick;

  /**
   * Tipster name (for display)
   */
  tipsterName: string;

  /**
   * Callback when edit button is clicked
   */
  onEdit?: (follow: UserFollow) => void;

  /**
   * Callback when delete button is clicked
   */
  onDelete?: (follow: UserFollow) => void;

  /**
   * Whether to show action buttons (edit/delete)
   * @default true
   */
  showActions?: boolean;
}
