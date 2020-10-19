import { getCurrentInstance } from 'vue-demi';

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
  if (getCurrentInstance()) {
    return new EventEmitter();
  } else {
    throw new Error(
      'Invalid hook call: `useEventEmitter` can only be called inside of `setup()`.',
    );
  }
}
