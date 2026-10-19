import { batch, computed, type ReadonlySignal, signal } from "@preact/signals-core";
import type {
  ReservationStatus,
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

export class SignalsSeatReservationStore {
  private readonly selectedSeatIds = signal<string[]>([]);
  private readonly occupiedSeatIds = signal<string[]>([...INITIAL_OCCUPIED_SEAT_IDS]);
  private readonly reservationStatus = signal<ReservationStatus>("idle");
  private readonly reservationMessage = signal(SELECT_PROMPT);

  // Each readable chunk is its own signal, so a component subscribes to exactly what it
  // reads instead of to the whole state. Computeds recompute only when their own
  // dependencies change, which keeps their references stable in between.
  readonly seats: ReadonlySignal<SeatViewModel[]> = computed(() =>
    SEAT_IDS.map((id) => ({
      id,
      label: id,
      status: this.occupiedSeatIds.value.includes(id)
        ? "occupied"
        : this.selectedSeatIds.value.includes(id)
          ? "selected"
          : "available",
    })),
  );

  readonly selectedCount: ReadonlySignal<number> = computed(
    () => this.selectedSeatIds.value.length,
  );

  readonly totalPrice: ReadonlySignal<number> = computed(
    () => this.selectedSeatIds.value.length * PRICE_PER_SEAT,
  );

  readonly status: ReadonlySignal<ReservationStatus> = this.reservationStatus;

  readonly message: ReadonlySignal<string> = this.reservationMessage;

  toggleSeat(seatId: string): void {
    // peek reads without subscribing, which is what actions want.
    if (
      this.reservationStatus.peek() === "reserving" ||
      this.occupiedSeatIds.peek().includes(seatId)
    ) {
      return;
    }

    const selectedSeatIds = this.selectedSeatIds.peek();
    const nextSelectedSeatIds = selectedSeatIds.includes(seatId)
      ? selectedSeatIds.filter((id) => id !== seatId)
      : [...selectedSeatIds, seatId];

    // One notification for the whole transition instead of three.
    batch(() => {
      this.selectedSeatIds.value = nextSelectedSeatIds;
      this.reservationStatus.value = "idle";
      this.reservationMessage.value =
        nextSelectedSeatIds.length === 0
          ? SELECT_PROMPT
          : `${seatCount(nextSelectedSeatIds.length)} selected.`;
    });
  }

  async reserveSeats(): Promise<void> {
    const reservedSeatIds = this.selectedSeatIds.peek();
    if (this.reservationStatus.peek() === "reserving" || reservedSeatIds.length === 0) {
      return;
    }

    batch(() => {
      this.reservationStatus.value = "reserving";
      this.reservationMessage.value = "Confirming your seats…";
    });

    await wait(RESERVATION_DELAY_MS);

    batch(() => {
      this.selectedSeatIds.value = [];
      this.occupiedSeatIds.value = [...this.occupiedSeatIds.peek(), ...reservedSeatIds];
      this.reservationStatus.value = "success";
      this.reservationMessage.value = `${seatCount(reservedSeatIds.length)} reserved.`;
    });
  }
}
