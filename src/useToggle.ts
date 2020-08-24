import { ref } from "vue";

export default function useToogle(initialValue = 0) {
  const count = ref(initialValue);
  const inc = (delta = 1) => (count.value += delta);
  const dec = (delta = 1) => (count.value -= delta);
  const get = () => count.value;
  const set = (val: number) => (count.value = val);
  const reset = (val = initialValue) => {
    initialValue = val; // eslint-disable-line no-param-reassign
    return set(val);
  };
  const actions = { inc, dec, get, set, reset };

  return [count, actions] as const;
}
