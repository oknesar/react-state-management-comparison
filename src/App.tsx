import type { ReactElement } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { MobxDecoratorsSeatReservationPage } from "./examples/mobx-decorators-seat-reservation/MobxDecoratorsSeatReservationPage";
import { MobxSeatReservationPage } from "./examples/mobx-seat-reservation/MobxSeatReservationPage";
import { ObservableLayoutRacePage } from "./examples/observable-layout-race/ObservableLayoutRacePage";
import { ObservableLostUpdatesPage } from "./examples/observable-lost-updates/ObservableLostUpdatesPage";
import { ObservableNoSelectorsPage } from "./examples/observable-no-selectors/ObservableNoSelectorsPage";
import { ObservableRacePage } from "./examples/observable-race/ObservableRacePage";
import { ObservableReentrantPage } from "./examples/observable-reentrant/ObservableReentrantPage";
import { ObservableSeatReservationPage } from "./examples/observable-seat-reservation/ObservableSeatReservationPage";
import { SignalsSeatReservationPage } from "./examples/signals-seat-reservation/SignalsSeatReservationPage";
import { ZustandSeatReservationPage } from "./examples/zustand-seat-reservation/ZustandSeatReservationPage";
import "./App.css";

type Example = {
  path: string;
  label: string;
  element: ReactElement;
};

const exampleGroups: { title: string; examples: Example[] }[] = [
  {
    title: "Seat reservation",
    examples: [
      {
        path: "/seat-reservation/observable",
        label: "Custom Observable",
        element: <ObservableSeatReservationPage />,
      },
      {
        path: "/seat-reservation/zustand",
        label: "Zustand",
        element: <ZustandSeatReservationPage />,
      },
      {
        path: "/seat-reservation/signals",
        label: "Signals Core",
        element: <SignalsSeatReservationPage />,
      },
      {
        path: "/seat-reservation/mobx",
        label: "MobX",
        element: <MobxSeatReservationPage />,
      },
      {
        path: "/seat-reservation/mobx-decorators",
        label: "MobX (decorators)",
        element: <MobxDecoratorsSeatReservationPage />,
      },
    ],
  },
  {
    title: "Observable problems",
    examples: [
      {
        path: "/observable/race-condition",
        label: "Passive-effect race",
        element: <ObservableRacePage />,
      },
      {
        path: "/observable/layout-effect-race",
        label: "Layout-effect race",
        element: <ObservableLayoutRacePage />,
      },
      {
        path: "/observable/lost-updates",
        label: "Lost updates",
        element: <ObservableLostUpdatesPage />,
      },
      {
        path: "/observable/reentrant-updates",
        label: "Re-entrant updates",
        element: <ObservableReentrantPage />,
      },
      {
        path: "/observable/no-selectors",
        label: "No selectors",
        element: <ObservableNoSelectorsPage />,
      },
    ],
  },
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Examples</h2>
        {exampleGroups.map((group) => (
          <nav key={group.title} className="sidebar-group" aria-label={group.title}>
            <h3>{group.title}</h3>
            {group.examples.map((example) => (
              <NavLink
                key={example.path}
                to={example.path}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {example.label}
              </NavLink>
            ))}
          </nav>
        ))}
      </aside>

      <main>
        <Routes>
          {exampleGroups.flatMap((group) =>
            group.examples.map((example) => (
              <Route key={example.path} path={example.path} element={example.element} />
            )),
          )}
          <Route path="*" element={<Navigate to="/seat-reservation/observable" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
