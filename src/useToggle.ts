import { ref } from "vue";

export default function useToggle(initialValue) {
  const status = ref(initialValue);
  const toggle = () => (status.value = !status.value);
  return [status, toggle];
}
