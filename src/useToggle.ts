import { ref } from 'vue';

export default function useToggle(leftValue?: any, rightValue?: any) {
  leftValue = leftValue === void 0 ? true : leftValue;
  rightValue = rightValue === void 0 ? !Boolean(leftValue) : rightValue;

  const status = ref(leftValue);
  const toggle = (value?: any) =>
    (status.value =
      value !== void 0
        ? value
        : status.value !== leftValue
        ? leftValue
        : rightValue);
  const setLeft = () => (status.value = leftValue);
  const setRight = () => (status.value = rightValue);

  return [
    status,
    {
      toggle,
      setLeft,
      setRight,
    },
  ];
}
