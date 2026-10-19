export type SeatStatus = "available" | "selected" | "occupied";

export type SeatViewModel = {
  id: string;
  label: string;
  status: SeatStatus;
};

export type ReservationStatus = "idle" | "reserving" | "success";

/** The contract between any store implementation and the stateless seat UI. */
export type SeatReservationViewState = {
  seats: SeatViewModel[];
  selectedCount: number;
  totalPrice: number;
  reservationStatus: ReservationStatus;
  message: string;
};
