import { createStore } from "zustand/vanilla";
import type {
  ReservationStatus,
  SeatViewModel,
} from "../../features/seat-reservation/seatReservationModel";

export const PRICE_PER_SEAT = 12.5;
const RESERVATION_DELAY_MS = 700;
const SELECT_PROMPT = "Select one or more available seats.";

export const SEAT_IDS = ["A", "B", "C", "D"].flatMap((row) =>
  Array.from({ length: 6 }, (_, index) => `${row}${index + 1}`),
);

const INITIAL_OCCUPIED_SEAT_IDS = ["A3", "B2", "B5", "C4", "D1"];

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const seatCount = (count: number) => `${count} seat${count === 1 ? "" : "s"}`;

export type ZustandSeatReservationStore = {
  selectedSeatIds: string[];
  occupiedSeatIds: string[];
  status: ReservationStatus;
  message: string;
  toggleSeat: (seatId: string) => void;
  reserveSeats: () => Promise<void>;
};

/** Pure derivation kept out of selectors, which must return stable references. */
export const buildSeats = (
  selectedSeatIds: readonly string[],
  occupiedSeatIds: readonly string[],
): SeatViewModel[] =>
  SEAT_IDS.map((id) => ({
    id,
    label: id,
    status: occupiedSeatIds.includes(id)
      ? "occupied"
      : selectedSeatIds.includes(id)
        ? "selected"
        : "available",
  }));

export const createZustandSeatReservationStore = () =>
  createStore<ZustandSeatReservationStore>((set, get) => ({
    selectedSeatIds: [],
    occupiedSeatIds: [...INITIAL_OCCUPIED_SEAT_IDS],
    status: "idle",
    message: SELECT_PROMPT,

    toggleSeat: (seatId) => {
      const { status, occupiedSeatIds, selectedSeatIds } = get();
      if (status === "reserving" || occupiedSeatIds.includes(seatId)) {
        return;
      }

      const nextSelectedSeatIds = selectedSeatIds.includes(seatId)
        ? selectedSeatIds.filter((id) => id !== seatId)
        : [...selectedSeatIds, seatId];

      set({
        selectedSeatIds: nextSelectedSeatIds,
        status: "idle",
        message:
          nextSelectedSeatIds.length === 0
            ? SELECT_PROMPT
            : `${seatCount(nextSelectedSeatIds.length)} selected.`,
      });
    },

    reserveSeats: async () => {
      const { status, selectedSeatIds } = get();
      if (status === "reserving" || selectedSeatIds.length === 0) {
        return;
      }

      set({ status: "reserving", message: "Confirming your seats…" });
      await wait(RESERVATION_DELAY_MS);

      // The updater form reads the state as it is after the await.
      set((state) => ({
        selectedSeatIds: [],
        occupiedSeatIds: [...state.occupiedSeatIds, ...selectedSeatIds],
        status: "success",
        message: `${seatCount(selectedSeatIds.length)} reserved.`,
      }));
    },
  }));

export type ZustandSeatReservationStoreApi = ReturnType<typeof createZustandSeatReservationStore>;
