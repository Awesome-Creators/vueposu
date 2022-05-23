import { add, subtract } from ".";

describe('utils/math', () => {
  it('should can do addition and subtraction calculation', () => {
    expect(add(1, 2)).toBe(3);
    expect(subtract(1, 2)).toBe(-1);
  });

  it('should fix percision issue', () => {
    expect(add(0.1, 0.2)).toBe(0.3);
    expect(subtract(0.3, 0.1)).toBe(0.2);
  });

  it('should can pass number-string', () => {
    expect(add('0.1', '0.2')).toBe(0.3);
    expect(subtract('0.3', '0.1')).toBe(0.2);
  });

  it('should be `0` when the params are `NaN`', () => {
    expect(add('1', 'string')).toBe(1);
    expect(subtract('string', '1')).toBe(-1);
  });
});
