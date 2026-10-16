import { useLayoutEffect, useState } from "react";
import { Observable } from "../../core/Observable/Observable";
import { useObservableState } from "../../hooks/useObservableState";

type Store = Observable<{ count: number }>;

const example = `function Listener() {
  return useObservableState(store).count
}

function LayoutUpdater() {
  useLayoutEffect(() => store.update({ count: 1 }), [])
  return null
}

// Listener renders first, but subscribes after layout effects.
<><Listener /><LayoutUpdater /></>`;

function Listener({ store }: { store: Store }) {
  const state = useObservableState(store);

  return (
    <article className="consumer consumer--stale">
      <h2>Listener</h2>
      <strong>{state.count}</strong>
      <p>Reads during render and waits for its passive effect to subscribe.</p>
    </article>
  );
}

function LayoutUpdater({ store }: { store: Store }) {
  useLayoutEffect(() => {
    store.update({ count: 1 });
  }, []);

  return (
    <article className="consumer consumer--current">
      <h2>Layout updater</h2>
      <strong>→ 1</strong>
      <p>Updates after commit, before passive effects run.</p>
    </article>
  );
}

export function ObservableLayoutRacePage() {
  const [store] = useState(() => new Observable({ count: 0 }));

  return (
    <section className="example">
      <header>
        <p className="eyebrow">Custom Observable</p>
        <h1>Layout-effect race condition</h1>
        <p>
          The listener renders first with <code>0</code>. A later sibling updates the store in{" "}
          <code>useLayoutEffect</code> before the listener&apos;s passive subscription exists.
        </p>
      </header>

      <div className="consumers">
        <Listener store={store} />
        <LayoutUpdater store={store} />
      </div>

      <p className="result">
        The store contains <strong>1</strong>, while the listener remains at <strong>0</strong>.
        Rendering first does not help when subscription waits for a passive effect.
      </p>

      <section className="explanation">
        <h2>Why it happens</h2>
        <p>
          React runs all layout effects before passive effects. The update therefore lands after the
          listener&apos;s render but before its subscription.
        </p>

        <article className="variation">
          <h3>Listener first, updater uses a layout effect</h3>
          <pre>
            <code>{example}</code>
          </pre>
        </article>
      </section>
    </section>
  );
}
