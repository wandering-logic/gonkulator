import { describe, expect, it } from "vitest";
import {
  createCalculator,
  createEntry,
  entryPressKey,
  formatEntry,
  pressKey,
  toggleShift,
} from "./calculator";

/** Helper: press a sequence of keys and return formatted result */
function type(...keys: string[]): string {
  let entry = createEntry();
  for (const k of keys) {
    entry = entryPressKey(entry, k);
  }
  return formatEntry(entry);
}

describe("createEntry", () => {
  it("returns initial state that formats as '0'", () => {
    expect(formatEntry(createEntry())).toBe("0");
  });
});

describe("digit entry", () => {
  it("enters digits", () => {
    expect(type("1", "2", "3")).toBe("123");
  });

  it("suppresses leading zeros: 0 then 5 → 5", () => {
    expect(type("0", "5")).toBe("5");
  });

  it("keeps single zero: 0 then 0 → 0", () => {
    expect(type("0", "0")).toBe("0");
  });
});

describe("decimal point", () => {
  it("enters decimal number", () => {
    expect(type("3", "dot", "1", "4")).toBe("3.14");
  });

  it("leading decimal shows 0.", () => {
    expect(type("dot", "5")).toBe("0.5");
  });

  it("double decimal is ignored", () => {
    expect(type("1", "dot", "dot", "2")).toBe("1.2");
  });

  it("decimal with no trailing digits shows dot", () => {
    expect(type("1", "dot")).toBe("1.");
  });
});

describe("EE (exponent entry)", () => {
  it("enters exponent", () => {
    expect(type("5", "ee", "3")).toBe("5 3");
  });

  it("enters exponent with decimal mantissa", () => {
    expect(type("1", "dot", "5", "ee", "1", "0")).toBe("1.5 10");
  });

  it("negative exponent", () => {
    expect(type("3", "ee", "neg", "8")).toBe("3 -8");
  });

  it("EE with empty mantissa gets implicit 0", () => {
    expect(type("ee", "3")).toBe("0 3");
  });

  it("double EE is ignored", () => {
    expect(type("5", "ee", "ee", "3")).toBe("5 3");
  });

  it("EE with no exponent digits shows 0", () => {
    expect(type("5", "ee")).toBe("5 0");
  });
});

describe("+/- toggle", () => {
  it("toggles mantissa sign", () => {
    expect(type("5", "neg")).toBe("-5");
  });

  it("double toggle restores positive", () => {
    expect(type("5", "neg", "neg")).toBe("5");
  });

  it("in exponent mode toggles exponent sign, not mantissa", () => {
    expect(type("5", "ee", "neg")).toBe("5 -0");
  });

  it("in frac mode toggles mantissa sign", () => {
    expect(type("3", "dot", "1", "neg")).toBe("-3.1");
  });
});

describe("backspace (del)", () => {
  it("removes last digit", () => {
    expect(type("1", "2", "3", "del")).toBe("12");
  });

  it("backspace across decimal returns to int", () => {
    expect(type("1", "dot", "del")).toBe("1");
  });

  it("backspace across frac digits then decimal", () => {
    expect(type("1", "dot", "5", "del", "del")).toBe("1");
  });

  it("backspace across EE returns to previous state", () => {
    expect(type("5", "ee", "del")).toBe("5");
  });

  it("backspace EE returns to frac if frac existed", () => {
    expect(type("1", "dot", "5", "ee", "del")).toBe("1.5");
  });

  it("backspace to empty shows 0", () => {
    expect(type("5", "del")).toBe("0");
  });

  it("backspace on empty stays at 0", () => {
    expect(type("del")).toBe("0");
  });
});

describe("digit limits", () => {
  it("limits mantissa to 12 digits", () => {
    const keys = "123456789012".split("");
    expect(type(...keys)).toBe("123456789012");
    // 13th digit should be ignored
    expect(type(...keys, "3")).toBe("123456789012");
  });

  it("limits mantissa across int and frac", () => {
    const keys = ["1", "2", "3", "dot", ..."456789012".split("")];
    // 12 mantissa digits total: 3 int + 9 frac
    expect(type(...keys)).toBe("123.456789012");
    // 13th should be ignored
    expect(type(...keys, "3")).toBe("123.456789012");
  });

  it("slides exponent digits when a 4th digit is entered", () => {
    expect(type("1", "ee", "1", "2", "3", "4")).toBe("1 234");
  });
});

describe("clear", () => {
  it("resets everything", () => {
    expect(type("1", "2", "dot", "3", "ee", "neg", "5", "clear")).toBe("0");
  });
});

describe("decimal ignored in exp mode", () => {
  it("dot is ignored during exponent entry", () => {
    expect(type("5", "ee", "dot", "3")).toBe("5 3");
  });
});

describe("Calculator integration", () => {
  it("pressKey dispatches to entry state machine", () => {
    let calc = createCalculator();
    calc = pressKey(calc, "1");
    calc = pressKey(calc, "2");
    expect(formatEntry(calc.entry)).toBe("12");
  });

  it("toggleShift is preserved", () => {
    let calc = createCalculator();
    calc = toggleShift(calc);
    expect(calc.shiftActive).toBe(true);
    calc = toggleShift(calc);
    expect(calc.shiftActive).toBe(false);
  });

  it("pressKey clears shift", () => {
    let calc = createCalculator();
    calc = toggleShift(calc);
    calc = pressKey(calc, "5");
    expect(calc.shiftActive).toBe(false);
  });
});
