/**
 * PrivateRoute component types
 */

export interface PrivateRouteProps {
  /**
   * The component/element to render if user is authenticated
   */
  children: React.ReactNode;

  /**
   * Optional redirect path when not authenticated
   * @default '/login'
   */
  redirectTo?: string;
}
