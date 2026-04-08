type NumberEntry = {
  state: "int" | "frac" | "exp";
  negative: boolean;
  intDigits: string;
  fracDigits: string;
  expNegative: boolean;
  expDigits: string;
};

type Calculator = {
  entry: NumberEntry;
  shiftActive: boolean;
};

export type { Calculator, NumberEntry };

export function createEntry(): NumberEntry {
  return {
    state: "int",
    negative: false,
    intDigits: "",
    fracDigits: "",
    expNegative: false,
    expDigits: "",
  };
}

export function createCalculator(): Calculator {
  return { entry: createEntry(), shiftActive: false };
}

function mantissaLen(entry: NumberEntry): number {
  return entry.intDigits.length + entry.fracDigits.length;
}

export function entryPressKey(entry: NumberEntry, key: string): NumberEntry {
  if (key >= "0" && key <= "9") {
    return entryDigit(entry, key);
  }
  switch (key) {
    case "dot":
      return entryDot(entry);
    case "ee":
      return entryEE(entry);
    case "neg":
      return entryNeg(entry);
    case "del":
      return entryDel(entry);
    case "clear":
      return createEntry();
    default:
      return entry;
  }
}

function entryDigit(entry: NumberEntry, digit: string): NumberEntry {
  switch (entry.state) {
    case "int": {
      if (mantissaLen(entry) >= 12) return entry;
      // Leading zero suppression: "0" is replaced by the next digit
      const intDigits =
        entry.intDigits === "0" ? digit : entry.intDigits + digit;
      return { ...entry, intDigits };
    }
    case "frac": {
      if (mantissaLen(entry) >= 12) return entry;
      return { ...entry, fracDigits: entry.fracDigits + digit };
    }
    case "exp": {
      const expDigits = (entry.expDigits + digit).slice(-3);
      return { ...entry, expDigits };
    }
  }
}

function entryDot(entry: NumberEntry): NumberEntry {
  if (entry.state === "int") {
    return { ...entry, state: "frac" };
  }
  return entry;
}

function entryEE(entry: NumberEntry): NumberEntry {
  if (entry.state === "exp") return entry;
  // Need at least one mantissa digit; empty intDigits gets implicit "0"
  const intDigits = entry.intDigits === "" ? "0" : entry.intDigits;
  return { ...entry, state: "exp", intDigits };
}

function entryNeg(entry: NumberEntry): NumberEntry {
  if (entry.state === "exp") {
    return { ...entry, expNegative: !entry.expNegative };
  }
  return { ...entry, negative: !entry.negative };
}

function entryDel(entry: NumberEntry): NumberEntry {
  switch (entry.state) {
    case "exp": {
      const expDigits = entry.expDigits.slice(0, -1);
      if (expDigits === "") {
        // Return to frac if we were in frac before, else int
        const state = entry.fracDigits !== "" ? "frac" : "int";
        return { ...entry, state, expNegative: false, expDigits: "" };
      }
      return { ...entry, expDigits };
    }
    case "frac": {
      if (entry.fracDigits === "") {
        // No frac digits left — remove the decimal point, back to int
        return { ...entry, state: "int" };
      }
      return { ...entry, fracDigits: entry.fracDigits.slice(0, -1) };
    }
    case "int": {
      const intDigits = entry.intDigits.slice(0, -1);
      return { ...entry, intDigits };
    }
  }
}

export function formatEntry(entry: NumberEntry): string {
  let result = "";
  if (entry.negative) result += "-";
  result += entry.intDigits || "0";
  if (entry.state === "frac" || entry.fracDigits !== "") {
    result += `.${entry.fracDigits}`;
  }
  if (entry.state === "exp") {
    result += " ";
    if (entry.expNegative) result += "-";
    result += entry.expDigits || "0";
  }
  return result;
}

export function formatEntryParts(entry: NumberEntry): {
  mantissa: string;
  exponent?: string;
} {
  let mantissa = "";
  if (entry.negative) mantissa += "-";
  mantissa += entry.intDigits || "0";
  if (entry.state === "frac" || entry.fracDigits !== "") {
    mantissa += `.${entry.fracDigits}`;
  }
  if (entry.state === "exp") {
    let exp = "";
    if (entry.expNegative) exp += "-";
    exp += entry.expDigits || "0";
    return { mantissa, exponent: exp };
  }
  return { mantissa };
}

export function pressKey(calc: Calculator, key: string): Calculator {
  return {
    entry: entryPressKey(calc.entry, key),
    shiftActive: false,
  };
}

export function toggleShift(calc: Calculator): Calculator {
  return { ...calc, shiftActive: !calc.shiftActive };
}
