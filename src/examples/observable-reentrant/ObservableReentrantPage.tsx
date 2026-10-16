import { useEffect, useState } from "react";
import { Observable } from "../../core/Observable/Observable";
import { useObservableState } from "../../hooks/useObservableState";

const LIMIT = 10;

const example = `const unsubscribe = store.subscribe(() => {
  const { count } = store.takeSnapshot()

  // Without this guard, update recursively notifies forever.
  if (count < 10) {
    store.update({ count: count + 1 })
  }
})

store.update({ count: 1 })`;

export function ObservableReentrantPage() {
  const [store] = useState(() => new Observable({ count: 0 }));
  const state = useObservableState(store);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const { count } = store.takeSnapshot();
      if (count < LIMIT) {
        store.update({ count: count + 1 });
      }
    });

    store.update({ count: 1 });
    return unsubscribe;
  }, [store]);

  return (
    <section className="example">
      <header>
        <p className="eyebrow">Custom Observable</p>
        <h1>Re-entrant updates</h1>
        <p>
          One subscriber calls <code>update</code> while the store is still notifying subscribers,
          creating nested synchronous notifications.
        </p>
      </header>

      <div className="consumers">
        <article className="consumer consumer--stale">
          <h2>One initial update</h2>
          <strong>{state.count}</strong>
          <p>
            Nested updates reached the safety limit of <code>{LIMIT}</code>.
          </p>
        </article>
      </div>

      <section className="explanation">
        <h2>Why it happens</h2>
        <p>
          Notifications are synchronous and have no queue or re-entry guard. Without the limit this
          example would recurse until the stack overflows.
        </p>
        <article className="variation">
          <h3>Subscriber updates its own store</h3>
          <pre>
            <code>{example}</code>
          </pre>
        </article>
      </section>
    </section>
  );
}
