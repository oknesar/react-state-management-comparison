import { action, computed, observable, runInAction } from "mobx";
import type {
  ReservationStatus,
  SeatReservationViewState,
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

/**
 * Standard (ES2022) decorators, not the legacy `experimentalDecorators` flavour.
 * They require the `accessor` keyword on observable fields, and because each
 * decorator registers its own initializer there is no makeObservable call.
 */
export class MobxDecoratorsSeatReservationStore {
  @observable accessor selectedSeatIds: string[] = [];
  @observable accessor occupiedSeatIds: string[] = [...INITIAL_OCCUPIED_SEAT_IDS];
  @observable accessor status: ReservationStatus = "idle";
  @observable accessor message = SELECT_PROMPT;

  @computed
  get viewState(): SeatReservationViewState {
    return {
      seats: SEAT_IDS.map((id) => ({
        id,
        label: id,
        status: this.occupiedSeatIds.includes(id)
          ? "occupied"
          : this.selectedSeatIds.includes(id)
            ? "selected"
            : "available",
      })),
      selectedCount: this.selectedSeatIds.length,
      totalPrice: this.selectedSeatIds.length * PRICE_PER_SEAT,
      reservationStatus: this.status,
      message: this.message,
    };
  }

  @action
  toggleSeat(seatId: string): void {
    if (this.status === "reserving" || this.occupiedSeatIds.includes(seatId)) {
      return;
    }

    this.selectedSeatIds = this.selectedSeatIds.includes(seatId)
      ? this.selectedSeatIds.filter((id) => id !== seatId)
      : [...this.selectedSeatIds, seatId];
    this.status = "idle";
    this.message =
      this.selectedSeatIds.length === 0
        ? SELECT_PROMPT
        : `${seatCount(this.selectedSeatIds.length)} selected.`;
  }

  @action
  async reserveSeats(): Promise<void> {
    if (this.status === "reserving" || this.selectedSeatIds.length === 0) {
      return;
    }

    const reservedSeatIds = [...this.selectedSeatIds];
    this.status = "reserving";
    this.message = "Confirming your seats…";

    await wait(RESERVATION_DELAY_MS);

    // Code after await is no longer inside the action, decorated or not.
    runInAction(() => {
      this.selectedSeatIds = [];
      this.occupiedSeatIds = [...this.occupiedSeatIds, ...reservedSeatIds];
      this.status = "success";
      this.message = `${seatCount(reservedSeatIds.length)} reserved.`;
    });
  }
}
