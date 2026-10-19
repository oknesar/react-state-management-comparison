import type { ReadonlySignal } from "@preact/signals-core";
import { useCallback, useSyncExternalStore } from "react";

/**
 * Explicit signal subscription, without @preact/signals-react and its Babel transform:
 * the component states which signal it reads, and useSyncExternalStore attaches the
 * subscription so an update between render and subscribe cannot be missed.
 */
export function useSignalValue<Value>(source: ReadonlySignal<Value>): Value {
  const subscribe = useCallback(
    (onStoreChange: () => void) => source.subscribe(onStoreChange),
    [source],
  );

  const getSnapshot = useCallback(() => source.peek(), [source]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
