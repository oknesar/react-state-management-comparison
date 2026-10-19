import { Observable } from "../../core/Observable/Observable";
import type {
  ReservationStatus,
  SeatReservationViewState,
  SeatViewModel,
} from "../../features/seat-reservation/seatReservationModel";

const PRICE_PER_SEAT = 12.5;
const RESERVATION_DELAY_MS = 700;
const SELECT_PROMPT = "Select one or more available seats.";

const SEAT_IDS = ["A", "B", "C", "D"].flatMap((row) =>
  Array.from({ length: 6 }, (_, index) => `${row}${index + 1}`),
);

const INITIAL_OCCUPIED_SEAT_IDS = ["A3", "B2", "B5", "C4", "D1"];

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const seatCount = (count: number) => `${count} seat${count === 1 ? "" : "s"}`;

export type ObservableSeatReservationState = {
  selectedSeatIds: string[];
  occupiedSeatIds: string[];
  status: ReservationStatus;
  message: string;
};

export class ObservableSeatReservationStore extends Observable<ObservableSeatReservationState> {
  constructor() {
    super({
      selectedSeatIds: [],
      occupiedSeatIds: [...INITIAL_OCCUPIED_SEAT_IDS],
      status: "idle",
      message: SELECT_PROMPT,
    });
  }

  toggleSeat(seatId: string): void {
    const { status, occupiedSeatIds, selectedSeatIds } = this.takeSnapshot();
    if (status === "reserving" || occupiedSeatIds.includes(seatId)) {
      return;
    }

    const nextSelectedSeatIds = selectedSeatIds.includes(seatId)
      ? selectedSeatIds.filter((id) => id !== seatId)
      : [...selectedSeatIds, seatId];

    this.update({
      selectedSeatIds: nextSelectedSeatIds,
      status: "idle",
      message:
        nextSelectedSeatIds.length === 0
          ? SELECT_PROMPT
          : `${seatCount(nextSelectedSeatIds.length)} selected.`,
    });
  }

  async reserveSeats(): Promise<void> {
    const { status, selectedSeatIds } = this.takeSnapshot();
    if (status === "reserving" || selectedSeatIds.length === 0) {
      return;
    }

    this.update({ status: "reserving", message: "Confirming your seats…" });
    await wait(RESERVATION_DELAY_MS);

    // The snapshot taken before the await is stale by now, so read the latest one.
    const latest = this.takeSnapshot();
    this.update({
      selectedSeatIds: [],
      occupiedSeatIds: [...latest.occupiedSeatIds, ...selectedSeatIds],
      status: "success",
      message: `${seatCount(selectedSeatIds.length)} reserved.`,
    });
  }

  toViewState(state: ObservableSeatReservationState): SeatReservationViewState {
    const seats: SeatViewModel[] = SEAT_IDS.map((id) => ({
      id,
      label: id,
      status: state.occupiedSeatIds.includes(id)
        ? "occupied"
        : state.selectedSeatIds.includes(id)
          ? "selected"
          : "available",
    }));

    return {
      seats,
      selectedCount: state.selectedSeatIds.length,
      totalPrice: state.selectedSeatIds.length * PRICE_PER_SEAT,
      reservationStatus: state.status,
      message: state.message,
    };
  }
}
