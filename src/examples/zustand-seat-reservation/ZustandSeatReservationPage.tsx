import { useMemo, useState } from "react";
import { useStore } from "zustand";
import {
  type ApproachPart,
  SeatReservationExample,
} from "../../features/seat-reservation/SeatReservationExample";
import { SeatReservationView } from "../../features/seat-reservation/SeatReservationView";
import {
  buildSeats,
  createZustandSeatReservationStore,
  PRICE_PER_SEAT,
} from "./zustandSeatReservationStore";

const parts: ApproachPart[] = [
  {
    name: "State",
    description:
      "One immutable object created by a store factory. set() shallow-merges a patch, or takes an updater function for reads that must see the latest state.",
  },
  {
    name: "Transitions",
    description:
      "Actions live inside the state next to the data, and reach the current values through get(). Components get them from the store like any other field.",
  },
  {
    name: "Derivation",
    description:
      "Done in the component. Selectors must return stable references, so anything that builds a new array or object belongs in useMemo rather than in the selector.",
  },
  {
    name: "Binding",
    description:
      "useStore with an explicit selector per value, built on useSyncExternalStore. A component rerenders only when the slice it selected changes.",
  },
];

const sketch = `// service
type SeatService = {
  selectedSeatIds: string[]
  status: ReservationStatus
  toggleSeat: (seatId: string) => void
  reserveSeats: () => Promise<void>
}

const createSeatService = () =>
  createStore<SeatService>((set, get) => ({
    selectedSeatIds: [],
    status: "idle",

    toggleSeat: (seatId) => {
      const { status, selectedSeatIds } = get()      // read
      if (status === "reserving") return
      set({ selectedSeatIds: next })                 // patch
    },

    reserveSeats: async () => {
      set({ status: "reserving" })
      await api.reserve(...)
      set((state) => ({ ...}))                       // updater sees latest state
    },
  }))

// component: one subscription per value
const status = useStore(service, (s) => s.status)
const toggleSeat = useStore(service, (s) => s.toggleSeat)
const seats = useMemo(() => buildSeats(ids), [ids])  // keep selectors stable`;

export function ZustandSeatReservationPage() {
  const [store] = useState(createZustandSeatReservationStore);

  const selectedSeatIds = useStore(store, (state) => state.selectedSeatIds);
  const occupiedSeatIds = useStore(store, (state) => state.occupiedSeatIds);
  const reservationStatus = useStore(store, (state) => state.status);
  const message = useStore(store, (state) => state.message);
  const toggleSeat = useStore(store, (state) => state.toggleSeat);
  const reserveSeats = useStore(store, (state) => state.reserveSeats);

  // Selectors must return stable references, so derived collections are memoised here
  // instead of being built inside a selector.
  const seats = useMemo(
    () => buildSeats(selectedSeatIds, occupiedSeatIds),
    [selectedSeatIds, occupiedSeatIds],
  );

  return (
    <SeatReservationExample
      tool="Zustand"
      summary="A small immutable store with the actions kept inside the state. Reads are explicit per value, writes are patches, and nothing is magic — but derivation and memoisation stay your responsibility."
      parts={parts}
      sketch={sketch}
    >
      <SeatReservationView
        seats={seats}
        selectedCount={selectedSeatIds.length}
        totalPrice={selectedSeatIds.length * PRICE_PER_SEAT}
        reservationStatus={reservationStatus}
        message={message}
        onSeatToggle={toggleSeat}
        onReserve={() => void reserveSeats()}
      />
    </SeatReservationExample>
  );
}
