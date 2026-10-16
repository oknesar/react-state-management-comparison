import type { SeatReservationViewState } from "./seatReservationModel";

export type SeatReservationViewProps = SeatReservationViewState & {
  onSeatToggle: (seatId: string) => void;
  onReserve: () => void;
};

export function SeatReservationView({
  seats,
  selectedCount,
  totalPrice,
  reservationStatus,
  message,
  onSeatToggle,
  onReserve,
}: SeatReservationViewProps) {
  const isReserving = reservationStatus === "reserving";

  return (
    <div className="seat-reservation">
      <div className="seat-picker">
        <div className="cinema-screen">Screen</div>
        <div className="seat-grid" aria-label="Cinema seats">
          {seats.map((seat) => (
            <button
              type="button"
              className={`seat seat--${seat.status}`}
              key={seat.id}
              aria-label={`Seat ${seat.label}: ${seat.status}`}
              aria-pressed={seat.status === "selected"}
              disabled={seat.status === "occupied" || isReserving}
              onClick={() => onSeatToggle(seat.id)}
            >
              {seat.label}
            </button>
          ))}
        </div>
        <div className="seat-legend" aria-label="Seat legend">
          <span>
            <i className="seat-key seat-key--available" />
            Available
          </span>
          <span>
            <i className="seat-key seat-key--selected" />
            Selected
          </span>
          <span>
            <i className="seat-key seat-key--occupied" />
            Occupied
          </span>
        </div>
      </div>

      <aside className="reservation-summary">
        <h2>Your reservation</h2>
        <dl>
          <div>
            <dt>Seats</dt>
            <dd>{selectedCount}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>${totalPrice.toFixed(2)}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="reserve-button"
          disabled={selectedCount === 0 || isReserving}
          onClick={onReserve}
        >
          {isReserving ? "Reserving…" : "Reserve seats"}
        </button>
        <p className="reservation-message" aria-live="polite">
          {message}
        </p>
      </aside>
    </div>
  );
}
