// wait time
export const wait = (time = 0) => new Promise(res => setTimeout(res, time));

// exec times
export const times = (times = 0, cb: Function) => {
  for (let i = 0; i < times; i++) {
    cb(i);
  }
};

// trigger dom event
export const triggerDomEvent = evt => {
  document.dispatchEvent(new Event(evt));
};
