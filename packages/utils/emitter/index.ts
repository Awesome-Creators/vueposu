import type { Obj } from "@vueposu/utils";

type EventHandler = (value?: any) => void;

export class Emitter {
  events: Obj<EventHandler[]> = Object.create(null);
  on(type: string, handler: EventHandler) {
    (this.events[type] || (this.events[type] = [])).push(handler);
  }
  off(type: string, handler: EventHandler) {
    this.events[type] &&
      this.events[type].splice(this.events[type].indexOf(handler) >>> 0, 1);
  }
  emit(type: string, ...args: any[]) {
    this.events[type]?.forEach((handler) => handler(args));
  }
}
