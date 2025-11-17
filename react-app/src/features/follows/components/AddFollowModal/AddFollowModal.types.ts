import type { Pick, UserFollow, UpdateFollowDTO } from '@shared/types';

/**
 * Props for AddFollowModal component
 */
export interface AddFollowModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal is closed
   */
  onClose: () => void;

  /**
   * Callback when follow is successfully created/updated
   */
  onSuccess: () => void;

  /**
   * Original pick to follow (required for create mode)
   */
  pick?: Pick;

  /**
   * Tipster name (for display)
   */
  tipsterName?: string;

  /**
   * Existing follow to edit (for edit mode)
   */
  follow?: UserFollow;

  /**
   * Callback to update existing follow (for edit mode)
   */
  onUpdate?: (id: string, data: UpdateFollowDTO) => Promise<void>;
}

/**
 * Form data interface
 */
export interface FollowFormData {
  userOdds: string;
  userStake: string;
  userBookmaker: string;
  userBetType: string;
  userResult: string;
  userIsResolved: boolean;
  dateFollowed: string;
  timeFollowed: string;
  comments: string;
}
