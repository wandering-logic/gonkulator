import { describe, expect, it } from "vitest";
import {
  createCalculator,
  getDisplay,
  pressKey,
  toggleShift,
} from "./calculator";

describe("createCalculator", () => {
  it("returns initial state", () => {
    const calc = createCalculator();
    expect(calc.display).toBe("0");
    expect(calc.shiftActive).toBe(false);
  });
});

describe("pressKey", () => {
  it("appends digit to display", () => {
    const calc = createCalculator();
    const result = pressKey(calc, "5");
    expect(result.display).toBe("05");
  });

  it("appends multiple digits", () => {
    let calc = createCalculator();
    calc = pressKey(calc, "1");
    calc = pressKey(calc, "2");
    calc = pressKey(calc, "3");
    expect(calc.display).toBe("0123");
  });

  it("appends non-digit key labels", () => {
    const calc = createCalculator();
    const result = pressKey(calc, "sin");
    expect(result.display).toBe("0sin");
  });

  it("truncates display to 9 characters", () => {
    let calc = createCalculator();
    for (const d of "123456789") {
      calc = pressKey(calc, d);
    }
    // display started as "0" + 9 digits = "0123456789" → last 9 = "123456789"
    expect(calc.display).toBe("123456789");
  });

  it("appends 'x' and clears shift when shift is active", () => {
    let calc = createCalculator();
    calc = toggleShift(calc);
    expect(calc.shiftActive).toBe(true);
    calc = pressKey(calc, "5");
    expect(calc.display).toBe("05x");
    expect(calc.shiftActive).toBe(false);
  });
});

describe("toggleShift", () => {
  it("flips shiftActive on", () => {
    const calc = createCalculator();
    expect(toggleShift(calc).shiftActive).toBe(true);
  });

  it("flips shiftActive off", () => {
    let calc = createCalculator();
    calc = toggleShift(calc);
    calc = toggleShift(calc);
    expect(calc.shiftActive).toBe(false);
  });
});

describe("getDisplay", () => {
  it("returns value as-is when 9 chars or fewer", () => {
    expect(getDisplay("123456789")).toBe("123456789");
  });

  it("truncates to last 9 characters", () => {
    expect(getDisplay("1234567890")).toBe("234567890");
  });
});
