export type Unsubscribe = () => void;

type Subscriber = () => void;

export class Observable<State extends object> {
  private state: State;
  private readonly subscribers = new Set<Subscriber>();

  constructor(initialState: State) {
    this.state = { ...initialState };
  }

  readonly takeSnapshot = (): State => this.state;

  update(patch: Partial<State>): void {
    this.state = { ...this.state, ...patch };
    this.subscribers.forEach((subscriber) => subscriber());
  }

  readonly subscribe = (subscriber: Subscriber): Unsubscribe => {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  };
}
