import { Observable } from "../../core/Observable/Observable";
import type {
  ReservationStatus,
  SeatReservationViewState,
} from "../../features/seat-reservation/seatReservationModel";

const PRICE_PER_SEAT = 12.5;
const SEAT_IDS = ["A", "B", "C", "D"].flatMap((row) =>
  Array.from({ length: 6 }, (_, index) => `${row}${index + 1}`),
);

export type ObservableSeatReservationState = {
  selectedSeatIds: string[];
  occupiedSeatIds: string[];
  status: ReservationStatus;
  message: string;
};

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

export class ObservableSeatReservationStore extends Observable<ObservableSeatReservationState> {
  constructor() {
    super({
      selectedSeatIds: [],
      occupiedSeatIds: ["A3", "B2", "B5", "C4", "D1"],
      status: "idle",
      message: "Select one or more available seats.",
    });
  }

  toggleSeat(seatId: string): void {
    const state = this.takeSnapshot();
    if (state.status === "reserving" || state.occupiedSeatIds.includes(seatId)) {
      return;
    }

    const selectedSeatIds = state.selectedSeatIds.includes(seatId)
      ? state.selectedSeatIds.filter((id) => id !== seatId)
      : [...state.selectedSeatIds, seatId];

    this.update({
      selectedSeatIds,
      status: "idle",
      message:
        selectedSeatIds.length === 0
          ? "Select one or more available seats."
          : `${selectedSeatIds.length} seat${selectedSeatIds.length === 1 ? "" : "s"} selected.`,
    });
  }

  async reserveSeats(): Promise<void> {
    const state = this.takeSnapshot();
    if (state.selectedSeatIds.length === 0 || state.status === "reserving") {
      return;
    }

    const reservedSeatIds = state.selectedSeatIds;
    this.update({ status: "reserving", message: "Confirming your seats…" });
    await wait(700);

    const latest = this.takeSnapshot();
    this.update({
      selectedSeatIds: [],
      occupiedSeatIds: [...latest.occupiedSeatIds, ...reservedSeatIds],
      status: "success",
      message: `${reservedSeatIds.length} seat${reservedSeatIds.length === 1 ? "" : "s"} reserved.`,
    });
  }

  toViewState(state: ObservableSeatReservationState): SeatReservationViewState {
    return {
      seats: SEAT_IDS.map((id) => ({
        id,
        label: id,
        status: state.occupiedSeatIds.includes(id)
          ? "occupied"
          : state.selectedSeatIds.includes(id)
            ? "selected"
            : "available",
      })),
      selectedCount: state.selectedSeatIds.length,
      totalPrice: state.selectedSeatIds.length * PRICE_PER_SEAT,
      reservationStatus: state.status,
      message: state.message,
    };
  }
}
