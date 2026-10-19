import { useState } from "react";
import {
  type ApproachPart,
  SeatReservationExample,
} from "../../features/seat-reservation/SeatReservationExample";
import { SeatReservationView } from "../../features/seat-reservation/SeatReservationView";
import { useObservableState } from "../../hooks/useObservableState";
import { ObservableSeatReservationStore } from "./ObservableSeatReservationStore";

const parts: ApproachPart[] = [
  {
    name: "State",
    description:
      "One plain object per store, replaced by shallow-merging a patch. Nothing is observable, so the store must notify every subscriber on every change.",
  },
  {
    name: "Transitions",
    description:
      "Methods on the store read takeSnapshot(), compute the next values, and call update(). Across an await the snapshot is stale and has to be read again.",
  },
  {
    name: "Derivation",
    description:
      "A plain method the component calls during render. There is no caching, so it re-runs on every render.",
  },
  {
    name: "Binding",
    description:
      "A hand-written hook on useState plus useEffect. The component receives the whole state, so any field change rerenders it.",
  },
];

const sketch = `// service
class SeatService extends Observable<State> {
  constructor() {
    super({ selectedSeatIds: [], status: "idle" })
  }

  toggleSeat(seatId: string) {
    const state = this.takeSnapshot()            // read
    if (state.status === "reserving") return     // guard by hand
    this.update({ selectedSeatIds: next })       // merge + notify all
  }

  async reserveSeats() {
    this.update({ status: "reserving" })
    await api.reserve(...)
    const latest = this.takeSnapshot()           // pre-await snapshot is stale
    this.update({ ...latest, status: "success" })
  }

  toViewState(state: State): ViewState { ... }   // recomputed every render
}

// component
const state = useObservableState(service)        // whole state, one subscription
<Seats {...service.toViewState(state)} />`;

export function ObservableSeatReservationPage() {
  const [store] = useState(() => new ObservableSeatReservationStore());
  const state = useObservableState(store);

  return (
    <SeatReservationExample
      tool="Custom Observable"
      summary="A hand-rolled event emitter around a single state object. It is the smallest thing that works, and everything beyond storing and notifying — selectors, caching, safe subscription timing — is left to the caller."
      parts={parts}
      sketch={sketch}
    >
      <SeatReservationView
        {...store.toViewState(state)}
        onSeatToggle={(seatId) => store.toggleSeat(seatId)}
        onReserve={() => void store.reserveSeats()}
      />
    </SeatReservationExample>
  );
}
