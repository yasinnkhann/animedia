'use client';

import { useState, useEffect } from 'react';

/**
 * A hook that returns true only after the component has mounted on the client.
 * Use this to prevent React Hydration errors (Error #418) when rendering components
 * that depend on browser APIs (window, document, localStorage) or random/time values.
 *
 * @example
 * const isMounted = useMounted();
 * if (!isMounted) return null; // or a skeleton
 * return <MyClientComponent />;
 */
export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
