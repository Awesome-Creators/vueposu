// exec times
export function execFn(fn: Function, times = 1) {
  for (let i = 0; i < times; i++) {
    fn(i);
  }
}