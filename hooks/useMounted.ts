'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * A hook that returns true only after the component has mounted on the client.
 * Uses useSyncExternalStore to prevent React Hydration errors without triggering
 * cascading renders or setState-in-effect warnings.
 *
 * @example
 * const isMounted = useMounted();
 * if (!isMounted) return null; // or a skeleton
 * return <MyClientComponent />;
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
