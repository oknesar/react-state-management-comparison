import { useEffect, useState } from "react";
import { Observable } from "../../core/Observable/Observable";
import { useObservableState } from "../../hooks/useObservableState";

type Store = Observable<{ count: number }>;

const passiveEffectExample = `function First() {
  const state = useObservableState(store)
  useEffect(() => store.update({ count: 1 }), [])
  return state.count
}

function Second() {
  return useObservableState(store).count
}

// Effect order follows render order.
<><First /><Second /></>`;

function UpdatingConsumer({ store }: { store: Store }) {
  const state = useObservableState(store);

  useEffect(() => {
    store.update({ count: 1 });
  }, []);

  return (
    <article className="consumer consumer--current">
      <h2>First consumer</h2>
      <strong>{state.count}</strong>
      <p>Subscribes first, then updates the store in its next effect.</p>
    </article>
  );
}

function LateConsumer({ store }: { store: Store }) {
  const state = useObservableState(store);

  return (
    <article className="consumer consumer--stale">
      <h2>Second consumer</h2>
      <strong>{state.count}</strong>
      <p>Rendered before the update, but subscribed after it.</p>
    </article>
  );
}

export function ObservableRacePage() {
  const [store] = useState(() => new Observable({ count: 0 }));

  return (
    <section className="example">
      <header>
        <p className="eyebrow">Custom Observable</p>
        <h1>Render-to-effect race condition</h1>
        <p>
          Both consumers read <code>0</code> while rendering. The first consumer subscribes and
          updates the store before the second consumer&apos;s subscription effect runs.
        </p>
      </header>

      <div className="consumers">
        <UpdatingConsumer store={store} />
        <LateConsumer store={store} />
      </div>

      <p className="result">
        The store contains <strong>1</strong>, but the second consumer remains at <strong>0</strong>{" "}
        because no later update repairs its stale state.
      </p>

      <section className="explanation">
        <h2>Why it happens</h2>
        <p>
          The hook reads during render but subscribes later in <code>useEffect</code>. An update in
          that gap has no listener and is not replayed, leaving its local state stale until another
          update occurs.
        </p>

        <article className="variation">
          <h3>Earlier sibling updates in a passive effect</h3>
          <pre>
            <code>{passiveEffectExample}</code>
          </pre>
        </article>
      </section>
    </section>
  );
}
