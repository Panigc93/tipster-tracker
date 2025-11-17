/**
 * Modal component types
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /**
   * Controls whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal title (optional)
   */
  title?: string;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Footer content (optional)
   */
  footer?: React.ReactNode;

  /**
   * Modal size
   * @default 'md'
   */
  size?: ModalSize;

  /**
   * Close modal when clicking outside
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close modal when pressing ESC
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * Show close button (X)
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Additional CSS classes for modal content
   */
  className?: string;
}
