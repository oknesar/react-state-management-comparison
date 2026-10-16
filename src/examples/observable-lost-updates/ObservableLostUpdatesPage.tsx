import { useEffect, useState } from "react";
import { Observable } from "../../core/Observable/Observable";
import { useObservableState } from "../../hooks/useObservableState";

const example = `const first = store.takeSnapshot()
const second = store.takeSnapshot()

setTimeout(() => {
  store.update({ count: first.count + 1 })
})

setTimeout(() => {
  store.update({ count: second.count + 1 })
})

// Both patches contain { count: 1 }; final count is 1, not 2.`;

export function ObservableLostUpdatesPage() {
  const [store] = useState(() => new Observable({ count: 0 }));
  const state = useObservableState(store);

  useEffect(() => {
    const first = store.takeSnapshot();
    const second = store.takeSnapshot();
    const firstTimer = window.setTimeout(() => {
      store.update({ count: first.count + 1 });
    });
    const secondTimer = window.setTimeout(() => {
      store.update({ count: second.count + 1 });
    });

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
    };
  }, [store]);

  return (
    <section className="example">
      <header>
        <p className="eyebrow">Custom Observable</p>
        <h1>Lost updates</h1>
        <p>
          Two asynchronous increments read the same <code>0</code> snapshot. Both later write{" "}
          <code>1</code>, so one increment is lost.
        </p>
      </header>

      <div className="consumers">
        <article className="consumer consumer--current">
          <h2>Expected</h2>
          <strong>2</strong>
          <p>Both increments should be applied.</p>
        </article>
        <article className="consumer consumer--stale">
          <h2>Actual</h2>
          <strong>{state.count}</strong>
          <p>The second stale patch overwrites the first.</p>
        </article>
      </div>

      <section className="explanation">
        <h2>Why it happens</h2>
        <p>
          <code>update</code> accepts values, not a function of the latest state. Read and write are
          separate operations, allowing another update between them.
        </p>
        <article className="variation">
          <h3>Two stale read-modify-write operations</h3>
          <pre>
            <code>{example}</code>
          </pre>
        </article>
      </section>
    </section>
  );
}
