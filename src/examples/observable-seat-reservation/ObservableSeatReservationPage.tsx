import { useState } from "react";
import { SeatReservationView } from "../../features/seat-reservation/SeatReservationView";
import { useObservableState } from "../../hooks/useObservableState";
import { ObservableSeatReservationStore } from "./ObservableSeatReservationStore";

export function ObservableSeatReservationPage() {
  const [store] = useState(() => new ObservableSeatReservationStore());
  const state = useObservableState(store);
  const viewState = store.toViewState(state);

  return (
    <section className="example">
      <header>
        <p className="eyebrow">Custom Observable</p>
        <h1>Cinema seat reservation</h1>
        <p>
          Shared selection, derived totals, disabled seats, and an asynchronous reservation using
          the same naïve Observable hook.
        </p>
      </header>

      <SeatReservationView
        {...viewState}
        onSeatToggle={(seatId) => store.toggleSeat(seatId)}
        onReserve={() => void store.reserveSeats()}
      />

      <section className="explanation">
        <h2>State, binding, and UI</h2>
        <p>
          The Observable subclass owns state and transitions. This page binds it to React and maps
          state to view props. The stateless seat view can be reused unchanged by another store.
        </p>
      </section>
    </section>
  );
}
