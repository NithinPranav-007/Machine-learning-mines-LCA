import { useRef, useEffect } from 'react';

/**
 * Store and return the previous value
 * Useful for comparing current vs previous state
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
