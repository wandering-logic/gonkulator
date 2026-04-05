type Calculator = {
  display: string;
  shiftActive: boolean;
};

export type { Calculator };

export function createCalculator(): Calculator {
  return { display: "0", shiftActive: false };
}

export function pressKey(calc: Calculator, key: string): Calculator {
  let value = calc.display + key;
  if (calc.shiftActive) {
    value += "x";
  }
  return {
    display: getDisplay(value),
    shiftActive: false,
  };
}

export function toggleShift(calc: Calculator): Calculator {
  return { ...calc, shiftActive: !calc.shiftActive };
}

export function getDisplay(value: string): string {
  if (value.length > 9) {
    return value.slice(-9);
  }
  return value;
}
