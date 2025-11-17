import type { CreateTipsterDto, UpdateTipsterDto } from '../../types';

export interface AddTipsterModalProps {
  /** Whether the modal is open */
  isOpen: boolean;

  /** Callback to close the modal */
  onClose: () => void;

  /** Callback when tipster is successfully created/updated */
  onSuccess: () => void;

  /** Tipster data for editing (optional) */
  tipster?: {
    id: string;
    name: string;
    channel: string;
  };

  /** Callback to create a tipster */
  onCreate?: (data: CreateTipsterDto) => Promise<void>;

  /** Callback to update a tipster */
  onUpdate?: (id: string, data: UpdateTipsterDto) => Promise<void>;
}

export interface TipsterFormData {
  name: string;
  channel: string;
}
