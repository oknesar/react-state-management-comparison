import type { ReactNode } from "react";
import { CodeBlock } from "../../components/CodeBlock";

export type ApproachPart = {
  name: string;
  description: string;
};

type SeatReservationExampleProps = {
  tool: string;
  summary: ReactNode;
  parts: ApproachPart[];
  sketch: string;
  children: ReactNode;
};

/**
 * Identical framing for every seat reservation implementation, so the only visible
 * difference between examples is the store, its React binding, and the overview below.
 */
export function SeatReservationExample({
  tool,
  summary,
  parts,
  sketch,
  children,
}: SeatReservationExampleProps) {
  return (
    <section className="example">
      <header>
        <p className="eyebrow">{tool}</p>
        <h1>Cinema seat reservation</h1>
        <p>
          Shared selection, derived totals, disabled seats, and an asynchronous reservation. Same
          scenario, same stateless UI, different state management.
        </p>
      </header>

      {children}

      <section className="explanation">
        <h2>The approach</h2>
        <p>{summary}</p>

        <dl className="approach-parts">
          {parts.map((part) => (
            <div key={part.name}>
              <dt>{part.name}</dt>
              <dd>{part.description}</dd>
            </div>
          ))}
        </dl>

        <article className="variation">
          <h3>How a service looks with {tool}</h3>
          <CodeBlock code={sketch} />
        </article>
      </section>
    </section>
  );
}
