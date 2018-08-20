import { isPositiveNumber, calculate } from "../../src/lib/helpers.js";

describe("Helper", () => {
  describe("#isPositiveNumber", () => {
    it("returns true given positive number", () => {
      expect(isPositiveNumber(100)).toBe(true);
    });
    it("returns true given zero", () => {
      expect(isPositiveNumber(0)).toBe(true);
    });
    it("returns false given negative number", () => {
      expect(isPositiveNumber(-100)).toBe(false);
    });
  });
  describe("#calculate", () => {
    // TODO add more test values
    it("returns correct values", () => {
      const expected = {
        netIncome: "841.55",
        incomeTax: "103.45",
        ssnit: "55.00"
      };
      expect(calculate(1000, 0)).toEqual(expected);
    });
  });
});
