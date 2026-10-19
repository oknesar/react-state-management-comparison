import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  type ApproachPart,
  SeatReservationExample,
} from "../../features/seat-reservation/SeatReservationExample";
import { SeatReservationView } from "../../features/seat-reservation/SeatReservationView";
import { MobxSeatReservationStore } from "./MobxSeatReservationStore";

const parts: ApproachPart[] = [
  {
    name: "State",
    description:
      "Ordinary class fields. One makeAutoObservable call in the constructor turns fields into observables, methods into actions, and getters into computeds.",
  },
  {
    name: "Transitions",
    description:
      "Direct assignments to this. No patches and no immutability rules, but code after an await has left the action and needs runInAction.",
  },
  {
    name: "Derivation",
    description:
      "A getter, cached as a computed while something observes it. Derived view state can live in the service instead of in the component.",
  },
  {
    name: "Binding",
    description:
      "observer() wraps the component and subscribes it to whatever it happened to read during render, at whatever depth. Tracking is automatic rather than declared.",
  },
];

const sketch = `// service
class SeatService {
  selectedSeatIds: string[] = []
  status: ReservationStatus = "idle"

  constructor() {
    makeAutoObservable(this)      // fields, methods, and getters annotated at once
  }

  get viewState(): ViewState {    // computed, cached while observed
    return { selectedCount: this.selectedSeatIds.length, ... }
  }

  toggleSeat(seatId: string) {    // action
    if (this.status === "reserving") return
    this.selectedSeatIds = next   // just assign
  }

  async reserveSeats() {
    this.status = "reserving"     // still inside the action
    await api.reserve(...)
    runInAction(() => {           // after await it is not
      this.status = "success"
    })
  }
}

// component: tracking is implicit, it reads whatever it needs
const Seats = observer(({ service }: { service: SeatService }) => (
  <SeatGrid {...service.viewState} onToggle={(id) => service.toggleSeat(id)} />
))`;

/**
 * observer wraps the only component that reads the store, so tracking stays explicit
 * and the shared view keeps receiving plain props.
 */
const SeatReservationBinding = observer(({ store }: { store: MobxSeatReservationStore }) => (
  <SeatReservationView
    {...store.viewState}
    onSeatToggle={(seatId) => store.toggleSeat(seatId)}
    onReserve={() => void store.reserveSeats()}
  />
));

export function MobxSeatReservationPage() {
  const [store] = useState(() => new MobxSeatReservationStore());

  return (
    <SeatReservationExample
      tool="MobX"
      summary="A plain class made observable in one call. Services read like normal object-oriented code with mutable fields and getters, and the library works out what to recompute and which components to rerender."
      parts={parts}
      sketch={sketch}
    >
      <SeatReservationBinding store={store} />
    </SeatReservationExample>
  );
}
