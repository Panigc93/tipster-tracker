import { useNavigate as useRouterNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook for navigation with type-safe routes
 */
export function useNavigate() {
  const navigate = useRouterNavigate();

  const goToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const goToSignup = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    navigate,
    goToLogin,
    goToSignup,
    goToDashboard,
  };
}
