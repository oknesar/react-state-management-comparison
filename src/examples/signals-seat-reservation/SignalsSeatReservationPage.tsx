import { useState } from "react";
import {
  type ApproachPart,
  SeatReservationExample,
} from "../../features/seat-reservation/SeatReservationExample";
import { SeatReservationView } from "../../features/seat-reservation/SeatReservationView";
import { useSignalValue } from "../../hooks/useSignalValue";
import { SignalsSeatReservationStore } from "./SignalsSeatReservationStore";

const parts: ApproachPart[] = [
  {
    name: "State",
    description:
      "One signal per field instead of one object. Each signal is independently readable and independently subscribable, so there is no single state blob to diff.",
  },
  {
    name: "Transitions",
    description:
      "Plain methods that assign to .value, wrapped in batch so a multi-field transition notifies once. Actions read with peek() to avoid subscribing themselves.",
  },
  {
    name: "Derivation",
    description:
      "computed() signals that track their own dependencies and cache the result, so derived values recompute only when an input actually changes.",
  },
  {
    name: "Binding",
    description:
      "A custom hook over useSyncExternalStore, one call per signal the component reads. Subscriptions stay explicit, with no Babel transform involved.",
  },
];

const sketch = `// service
class SeatService {
  private readonly selected = signal<string[]>([])
  private readonly state = signal<ReservationStatus>("idle")

  readonly status: ReadonlySignal<ReservationStatus> = this.state
  readonly selectedCount = computed(() => this.selected.value.length)  // cached

  toggleSeat(seatId: string) {
    if (this.state.peek() === "reserving") return    // peek: read, do not subscribe
    batch(() => {                                    // one notification
      this.selected.value = next
      this.state.value = "idle"
    })
  }

  async reserveSeats() {
    batch(() => { this.state.value = "reserving" })
    await api.reserve(...)
    batch(() => { ... })                             // no stale-snapshot problem
  }
}

// component: one subscription per signal
const count = useSignalValue(service.selectedCount)
const status = useSignalValue(service.status)`;

export function SignalsSeatReservationPage() {
  const [store] = useState(() => new SignalsSeatReservationStore());

  const seats = useSignalValue(store.seats);
  const selectedCount = useSignalValue(store.selectedCount);
  const totalPrice = useSignalValue(store.totalPrice);
  const reservationStatus = useSignalValue(store.status);
  const message = useSignalValue(store.message);

  return (
    <SeatReservationExample
      tool="Signals Core"
      summary="State split into independent signals with derived values as cached computeds. Reads are granular like Zustand selectors, but the caching is done by the library rather than by useMemo."
      parts={parts}
      sketch={sketch}
    >
      <SeatReservationView
        seats={seats}
        selectedCount={selectedCount}
        totalPrice={totalPrice}
        reservationStatus={reservationStatus}
        message={message}
        onSeatToggle={(seatId) => store.toggleSeat(seatId)}
        onReserve={() => void store.reserveSeats()}
      />
    </SeatReservationExample>
  );
}
