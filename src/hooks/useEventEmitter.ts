type Subscription = (v: any) => void;

export class EventEmitter {
  #subscriptions = new Set<Subscription>();

  emit = (v: any) => {
    for (let subscription of this.#subscriptions) {
      subscription(v);
    }
  };

  useSubscription = (s: Subscription) => {
    this.#subscriptions.add(s);
  };
}

// TODO: COMMENT NEED
export default function useEventEmitter() {
  return new EventEmitter();
}
