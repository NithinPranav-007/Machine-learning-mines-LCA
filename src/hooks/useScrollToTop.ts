import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll to top when route changes
 * Useful for multi-page navigation
 */
export function useScrollToTop(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);
}
