import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { formatMonthYear, formatLongDate } from "../dates";
import { monthlyTaxRates } from "../rates";
import TopBanner from "@/components/TopBanner.vue";

describe("formatMonthYear", () => {
  it.each([
    ["2026-09-01", "September 2026"],
    ["2024-01-01", "January 2024"],
    ["2023-12-31", "December 2023"]
  ])("%s -> %s", (iso, expected) => {
    expect(formatMonthYear(iso)).toBe(expected);
  });
});

describe("formatLongDate", () => {
  it.each([
    ["2026-09-01", "1 September 2026"],
    ["2023-04-02", "2 April 2023"],
    ["2021-12-31", "31 December 2021"]
  ])("%s -> %s", (iso, expected) => {
    expect(formatLongDate(iso)).toBe(expected);
  });
});

describe("invalid dates", () => {
  it.each(["09/01/2026", "2026-9-1", "2026-13-01", "2026-00-10", "2026-01-32", "", undefined])(
    "rejects %j",
    (bad) => {
      expect(() => formatMonthYear(bad)).toThrow(/ISO date/);
      expect(() => formatLongDate(bad)).toThrow(/ISO date/);
    }
  );
});

describe("current rate table date", () => {
  it("is a valid ISO date", () => {
    expect(() => formatLongDate(monthlyTaxRates.effectiveFrom)).not.toThrow();
  });

  it("is shown in the top banner", () => {
    const wrapper = mount(TopBanner);
    expect(wrapper.text()).toContain(formatMonthYear(monthlyTaxRates.effectiveFrom));
  });
});
