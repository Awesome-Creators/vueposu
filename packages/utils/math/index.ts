import { RefTyped } from "@vueposu/utils";

export type NumberType = number | string;
export type CounterNumber = RefTyped<NumberType>;

type FixNumbers = [NumberType, NumberType, ...NumberType[]];

const fix = (...numbers: FixNumbers) => {
  const fs = numbers.map((num, index) => {
    numbers[index] = num = +num;
    if (isNaN(num)) {
      numbers[index] = num = 0;
    }
    return (num.toString().split(".")[1] || "").length;
  });
  const f = Math.pow(10, Math.max(...fs));
  return {
    add: () => +numbers.reduce((a, b) => +a + +b * f, 0) / f,
    subtract: () =>
      +numbers.reduce((a, b) => +a - +b * f, +numbers[0] * 2 * f) / f,
  };
};

export const add = (...numbers: FixNumbers) => fix(...numbers).add();
export const subtract = (...numbers: FixNumbers) => fix(...numbers).subtract();
