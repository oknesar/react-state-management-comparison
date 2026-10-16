import { useEffect, useState } from "react";
import { Observable } from "../core/Observable/Observable";

export type StateOf<T> = T extends Observable<infer State> ? State : never;

export function useObservableState<State extends object>(
  store: Observable<State>,
): StateOf<Observable<State>> {
  const [state, setState] = useState<State>(store.takeSnapshot);

  useEffect(() => {
    const updateState = () => setState(store.takeSnapshot());

    return store.subscribe(updateState);
  }, [store]);

  return state;
}
