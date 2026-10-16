export type SeatStatus = "available" | "selected" | "occupied";

export type SeatViewModel = {
  id: string;
  label: string;
  status: SeatStatus;
};

export type ReservationStatus = "idle" | "reserving" | "success";

export type SeatReservationViewState = {
  seats: SeatViewModel[];
  selectedCount: number;
  totalPrice: number;
  reservationStatus: ReservationStatus;
  message: string;
};
