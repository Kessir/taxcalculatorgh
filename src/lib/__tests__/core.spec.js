import { describe, it, expect } from "vitest";
import { Decimal } from "decimal.js";
import { calculate } from "../core";
import { monthlyTaxRates, SSNIT_RATE } from "../rates";

// Expected values below are worked out by hand from the Sept 2026 GRA monthly bands:
//   first 588 @ 0%, next 80 @ 5%, next 100 @ 10%, next 2,900 @ 17.5%,
//   next 16,000 @ 25%, next 30,332 @ 30%, above 50,000 @ 35%
// Cumulative thresholds: 588, 668, 768, 3,668, 19,668, 50,000
// Cumulative tax at each: 0, 4, 14, 521.50, 4,521.50, 13,621.10
//
// Allowances are not subject to SSNIT, so calculate(0, X, 0) taxes exactly X.
// That makes it the easiest way to probe the bands directly.
const taxOn = (taxable) => calculate("", String(taxable), "").incomeTax;

describe("rate table", () => {
  const { rates } = monthlyTaxRates;

  it("uses a 5.5% SSNIT employee rate", () => {
    expect(SSNIT_RATE).toBe(5.5);
  });

  it("has finite bands summing to the 50,000 top threshold", () => {
    const finite = rates.slice(0, -1).reduce((sum, [, amount]) => sum + amount, 0);
    expect(finite).toBe(50000);
  });

  it("ends with an unbounded top band", () => {
    expect(rates.at(-1)[1]).toBe(Number.POSITIVE_INFINITY);
  });

  it("has strictly increasing rates starting at 0%", () => {
    const pcts = rates.map(([rate]) => rate);
    expect(pcts[0]).toBe(0);
    pcts.slice(1).forEach((rate, i) => expect(rate).toBeGreaterThan(pcts[i]));
  });
});

describe("income tax bands", () => {
  it.each([
    [0, "0.00"],
    [588, "0.00"],
    [668, "4.00"],
    [768, "14.00"],
    [3668, "521.50"],
    [19668, "4521.50"],
    [50000, "13621.10"]
  ])("taxes exactly %s at %s (band boundary)", (taxable, expected) => {
    expect(taxOn(taxable)).toBe(expected);
  });

  it.each([
    [589, "0.05"], // 5%
    [669, "4.10"], // 10%
    [769, "14.18"], // 17.5% -> 14.175 rounds half up
    [3669, "521.75"], // 25%
    [19669, "4521.80"], // 30%
    [50001, "13621.45"] // 35%
  ])("taxes one cedi above a boundary: %s -> %s", (taxable, expected) => {
    expect(taxOn(taxable)).toBe(expected);
  });

  it("applies 35% to everything above 50,000", () => {
    expect(taxOn(60000)).toBe("17121.10");
  });
});

describe("full calculation", () => {
  it("returns zeros for empty input", () => {
    expect(calculate("", "", "")).toMatchObject({
      incomeTax: "0.00",
      ssnit: "0.00",
      netIncome: "0.00"
    });
  });

  it("charges no income tax when income after SSNIT is under the free band", () => {
    // SSNIT 27.50, taxable 472.50
    expect(calculate("500", "", "")).toEqual({
      incomeTax: "0.00",
      ssnit: "27.50",
      netIncome: "472.50",
      computationBreakdown: [{ taxRate: 0, taxAmount: "0.00", amountTaxed: "473" }]
    });
  });

  it("deducts SSNIT from basic income before taxing, and taxes allowances without SSNIT", () => {
    // SSNIT = 5.5% of 5,000 = 275
    // taxable = 5,000 - 275 - 200 relief + 1,000 allowances = 5,525
    // tax = 521.50 + (5,525 - 3,668) * 25% = 521.50 + 464.25 = 985.75
    // net = 5,000 + 1,000 - 985.75 - 275 = 4,739.25
    expect(calculate("5000", "1000", "200")).toEqual({
      incomeTax: "985.75",
      ssnit: "275.00",
      netIncome: "4739.25",
      computationBreakdown: [
        { taxRate: 0, taxAmount: "0.00", amountTaxed: "588" },
        { taxRate: 5, taxAmount: "4.00", amountTaxed: "80" },
        { taxRate: 10, taxAmount: "10.00", amountTaxed: "100" },
        { taxRate: 17.5, taxAmount: "507.50", amountTaxed: "2900" },
        { taxRate: 25, taxAmount: "464.25", amountTaxed: "1857" }
      ]
    });
  });

  it("handles a top-band earner", () => {
    // SSNIT 5,500; taxable 94,500; tax = 13,621.10 + 44,500 * 35% = 29,196.10
    expect(calculate("100000", "", "")).toMatchObject({
      incomeTax: "29196.10",
      ssnit: "5500.00",
      netIncome: "65303.90"
    });
    expect(calculate("100000", "", "").computationBreakdown).toHaveLength(7);
  });

  it("charges no tax when relief exceeds income, but still deducts SSNIT", () => {
    const result = calculate("1000", "", "2000");
    expect(result).toMatchObject({ incomeTax: "0.00", ssnit: "55.00", netIncome: "945.00" });
  });

  it("treats tax relief as reducing taxable income, not net income directly", () => {
    // 1,000 relief on a 25%-band earner saves 250 of tax
    const without = calculate("10000", "", "");
    const withRelief = calculate("10000", "", "1000");
    expect(new Decimal(withRelief.netIncome).minus(without.netIncome).toFixed(2)).toBe("250.00");
  });

  it("accepts numbers as well as strings", () => {
    expect(calculate(5000, 1000, 200)).toEqual(calculate("5000", "1000", "200"));
  });
});

describe("input validation", () => {
  it.each(["100", "100.50", ".5", "1.", "+5", "0"])("accepts %j", (input) => {
    expect(calculate(input, input, input).errorMessage).toBeUndefined();
  });

  it.each(["abc", "-5", "1,000", "1e3", " 100", "100 ", "1.2.3", "GH₵100", "NaN", "Infinity"])(
    "rejects %j in any field",
    (bad) => {
      const error = { errorMessage: "Please input valid amounts" };
      expect(calculate(bad, "", "")).toEqual(error);
      expect(calculate("", bad, "")).toEqual(error);
      expect(calculate("", "", bad)).toEqual(error);
    }
  );
});

// Properties checked over a deterministic sweep of incomes spanning every band.
describe("invariants", () => {
  const incomes = Array.from({ length: 400 }, (_, i) => (i * 317.37).toFixed(2));

  it("breakdown taxes add up to the total income tax", () => {
    incomes.forEach((gross) => {
      const { incomeTax, computationBreakdown } = calculate(gross, "", "");
      const sum = computationBreakdown.reduce((acc, row) => acc.plus(row.taxAmount), new Decimal(0));
      expect(sum.minus(incomeTax).abs().lte(0.01 * computationBreakdown.length), gross).toBe(true);
    });
  });

  it("net income never decreases as gross income increases", () => {
    incomes.reduce((prevNet, gross) => {
      const net = new Decimal(calculate(gross, "", "").netIncome);
      expect(net.gte(prevNet), gross).toBe(true);
      return net;
    }, new Decimal(-1));
  });

  it("effective tax rate never reaches the 35% top rate", () => {
    incomes.slice(1).forEach((gross) => {
      const { incomeTax } = calculate(gross, "", "");
      expect(new Decimal(incomeTax).dividedBy(gross).lt(0.35), gross).toBe(true);
    });
  });

  // Regression: net used to be derived from unrounded tax/SSNIT and could be off by 0.01 (e.g. gross 952.11)
  it("net + income tax + SSNIT equals gross + allowances to the pesewa", () => {
    incomes.forEach((gross) => {
      const { incomeTax, ssnit, netIncome } = calculate(gross, "123.45", "");
      const total = new Decimal(netIncome).plus(incomeTax).plus(ssnit);
      expect(total.toFixed(2), gross).toBe(new Decimal(gross).plus("123.45").toFixed(2));
    });
  });
});
