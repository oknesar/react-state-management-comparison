import { useEffect, useRef, useState } from "react";
import { CodeBlock } from "../../components/CodeBlock";
import { Observable } from "../../core/Observable/Observable";
import { useObservableState } from "../../hooks/useObservableState";

type Store = Observable<{ count: number; theme: "light" | "dark" }>;

const example = `function Count({ store }) {
  const { count } = useObservableState(store)
  return count
}

// Creates a new whole-state snapshot and notifies every subscriber.
store.update({ theme: "dark" })

// Count rerenders even though count did not change.`;

function CountConsumer({ store }: { store: Store }) {
  const state = useObservableState(store);
  const renders = useRef(0);
  renders.current += 1;

  return (
    <article className="consumer consumer--stale">
      <h2>Count consumer</h2>
      <strong>{renders.current} renders</strong>
      <p>
        Count remains <code>{state.count}</code>.
      </p>
    </article>
  );
}

function ThemeConsumer({ store }: { store: Store }) {
  const state = useObservableState(store);
  const renders = useRef(0);
  renders.current += 1;

  return (
    <article className="consumer consumer--current">
      <h2>Theme consumer</h2>
      <strong>{renders.current} renders</strong>
      <p>
        Theme changed to <code>{state.theme}</code>.
      </p>
    </article>
  );
}

function ThemeUpdater({ store }: { store: Store }) {
  useEffect(() => {
    store.update({ theme: "dark" });
  }, [store]);

  return null;
}

export function ObservableNoSelectorsPage() {
  const [store] = useState<Store>(() => new Observable({ count: 0, theme: "light" }));

  return (
    <section className="example">
      <header>
        <p className="eyebrow">Custom Observable</p>
        <h1>No selectors</h1>
        <p>
          Updating only <code>theme</code> notifies consumers of the entire snapshot, including the
          component that only reads <code>count</code>.
        </p>
      </header>

      <div className="consumers">
        <CountConsumer store={store} />
        <ThemeConsumer store={store} />
        <ThemeUpdater store={store} />
      </div>

      <section className="explanation">
        <h2>Why it happens</h2>
        <p>
          Every subscriber receives every update. The hook cannot select a field or compare a
          selected value before scheduling a render.
        </p>
        <article className="variation">
          <h3>An unrelated field still causes a render</h3>
          <CodeBlock code={example} />
        </article>
      </section>
    </section>
  );
}
