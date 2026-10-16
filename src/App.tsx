import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { ObservableLayoutRacePage } from "./examples/observable-layout-race/ObservableLayoutRacePage";
import { ObservableLostUpdatesPage } from "./examples/observable-lost-updates/ObservableLostUpdatesPage";
import { ObservableNoSelectorsPage } from "./examples/observable-no-selectors/ObservableNoSelectorsPage";
import { ObservableRacePage } from "./examples/observable-race/ObservableRacePage";
import { ObservableReentrantPage } from "./examples/observable-reentrant/ObservableReentrantPage";
import { ObservableSeatReservationPage } from "./examples/observable-seat-reservation/ObservableSeatReservationPage";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Examples</h2>
        <nav aria-label="Examples">
          <NavLink
            to="/observable/seat-reservation"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Seat reservation
          </NavLink>
          <NavLink
            to="/observable/race-condition"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Passive-effect race
          </NavLink>
          <NavLink
            to="/observable/layout-effect-race"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Layout-effect race
          </NavLink>
          <NavLink
            to="/observable/lost-updates"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Lost updates
          </NavLink>
          <NavLink
            to="/observable/reentrant-updates"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Re-entrant updates
          </NavLink>
          <NavLink
            to="/observable/no-selectors"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            No selectors
          </NavLink>
        </nav>
      </aside>

      <main>
        <Routes>
          <Route path="/observable/seat-reservation" element={<ObservableSeatReservationPage />} />
          <Route path="/observable/race-condition" element={<ObservableRacePage />} />
          <Route path="/observable/layout-effect-race" element={<ObservableLayoutRacePage />} />
          <Route path="/observable/lost-updates" element={<ObservableLostUpdatesPage />} />
          <Route path="/observable/reentrant-updates" element={<ObservableReentrantPage />} />
          <Route path="/observable/no-selectors" element={<ObservableNoSelectorsPage />} />
          <Route path="*" element={<Navigate to="/observable/seat-reservation" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
