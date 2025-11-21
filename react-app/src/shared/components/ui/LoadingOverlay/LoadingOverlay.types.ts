/**
 * @fileoverview LoadingOverlay types
 * @module shared/components/ui/LoadingOverlay
 */

export interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible
   */
  isLoading: boolean;
  
  /**
   * Loading message to display
   * @default 'Cargando...'
   */
  message?: string;
  
  /**
   * Content to wrap
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes for the overlay
   */
  className?: string;
}
