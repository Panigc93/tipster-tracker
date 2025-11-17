/**
 * @fileoverview AddPickModal component types
 * @module features/picks/components/AddPickModal
 */

import type { Pick, Tipster } from '@shared/types';

export interface AddPickModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback to close the modal
   */
  onClose: () => void;

  /**
   * Callback when pick is successfully created/updated
   */
  onSuccess: () => void;

  /**
   * List of tipsters for the select dropdown
   */
  tipsters: Tipster[];

  /**
   * Pick to edit (undefined for create mode)
   */
  pick?: Pick;

  /**
   * Function to update a pick (required in edit mode)
   */
  onUpdate?: (id: string, data: Partial<Pick>) => Promise<void>;
}
