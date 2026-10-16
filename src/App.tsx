import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { ObservableLayoutRacePage } from "./examples/observable-layout-race/ObservableLayoutRacePage";
import { ObservableRacePage } from "./examples/observable-race/ObservableRacePage";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Examples</h2>
        <nav aria-label="Examples">
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
        </nav>
      </aside>

      <main>
        <Routes>
          <Route path="/observable/race-condition" element={<ObservableRacePage />} />
          <Route path="/observable/layout-effect-race" element={<ObservableLayoutRacePage />} />
          <Route path="*" element={<Navigate to="/observable/race-condition" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
