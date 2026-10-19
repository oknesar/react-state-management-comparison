import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  type ApproachPart,
  SeatReservationExample,
} from "../../features/seat-reservation/SeatReservationExample";
import { SeatReservationView } from "../../features/seat-reservation/SeatReservationView";
import { MobxDecoratorsSeatReservationStore } from "./MobxDecoratorsSeatReservationStore";

const parts: ApproachPart[] = [
  {
    name: "State",
    description:
      "Fields marked one by one with @observable, which standard decorators require to be declared with the accessor keyword.",
  },
  {
    name: "Annotations",
    description:
      "Each decorator registers its own initializer, so there is no makeObservable call and no constructor at all. The annotation sits next to the thing it annotates.",
  },
  {
    name: "Transitions",
    description:
      "@action methods assigning directly to this, exactly as with makeAutoObservable. Code after an await still needs runInAction.",
  },
  {
    name: "Build setup",
    description:
      "The cost of this flavour: standard decorators are not implemented by every toolchain. Here Vite's oxc pipeline passes them through untouched, so these files are compiled by TypeScript through a small plugin.",
  },
];

const sketch = `// service
class SeatService {
  @observable accessor selectedSeatIds: string[] = []   // accessor is required
  @observable accessor status: ReservationStatus = "idle"

  // no constructor, no makeObservable: each decorator initialises itself

  @computed
  get viewState(): ViewState {
    return { selectedCount: this.selectedSeatIds.length, ... }
  }

  @action
  toggleSeat(seatId: string) {
    if (this.status === "reserving") return
    this.selectedSeatIds = next
  }

  @action
  async reserveSeats() {
    this.status = "reserving"
    await api.reserve(...)
    runInAction(() => { this.status = "success" })       // still needed
  }
}

// component: identical to the makeAutoObservable version
const Seats = observer(({ service }: { service: SeatService }) => (
  <SeatGrid {...service.viewState} onToggle={(id) => service.toggleSeat(id)} />
))`;

const SeatReservationBinding = observer(
  ({ store }: { store: MobxDecoratorsSeatReservationStore }) => (
    <SeatReservationView
      {...store.viewState}
      onSeatToggle={(seatId) => store.toggleSeat(seatId)}
      onReserve={() => void store.reserveSeats()}
    />
  ),
);

export function MobxDecoratorsSeatReservationPage() {
  const [store] = useState(() => new MobxDecoratorsSeatReservationStore());

  return (
    <SeatReservationExample
      tool="MobX with decorators"
      summary="The same MobX service annotated with standard ES decorators instead of makeAutoObservable. Every annotation is visible at its declaration, at the price of needing a toolchain that can compile decorators."
      parts={parts}
      sketch={sketch}
    >
      <SeatReservationBinding store={store} />
    </SeatReservationExample>
  );
}
