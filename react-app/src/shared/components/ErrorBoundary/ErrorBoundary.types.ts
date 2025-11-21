/**
 * @fileoverview ErrorBoundary types
 * @module shared/components/ErrorBoundary
 */

import type { ReactNode, ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;
  
  /**
   * Optional custom fallback UI
   */
  fallback?: ReactNode;
  
  /**
   * Optional error handler callback
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  /**
   * Whether an error has been caught
   */
  hasError: boolean;
  
  /**
   * The caught error
   */
  error: Error | null;
}

export interface ErrorFallbackProps {
  /**
   * The error that was caught
   */
  error?: Error | null;
  
  /**
   * Function to reset the error boundary
   */
  resetError?: () => void;
}
