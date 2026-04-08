import {
  type Calculator,
  type NumberEntry,
  createCalculator,
  formatEntryParts,
  pressKey,
  toggleShift,
} from "./calculator";

function setupDisplay(el: HTMLElement): {
  mantissa: HTMLSpanElement;
  exponent: HTMLSpanElement;
} {
  const mantissa = document.createElement("span");
  mantissa.id = "mantissa";
  const exponent = document.createElement("span");
  exponent.id = "exponent";
  el.appendChild(mantissa);
  el.appendChild(exponent);
  return { mantissa, exponent };
}

function updateDisplay(
  parts: { mantissa: HTMLElement; exponent: HTMLElement },
  entry: NumberEntry,
): void {
  const fmt = formatEntryParts(entry);
  parts.mantissa.textContent = fmt.mantissa;
  parts.exponent.textContent = fmt.exponent ?? "";
}

export function initUI(): void {
  const totaldiv = document.getElementById("total");
  if (!totaldiv) {
    throw new Error("Could not find #total element");
  }

  const display = setupDisplay(totaldiv);
  let calc: Calculator = createCalculator();
  let myTimer: ReturnType<typeof setTimeout> | null = null;
  let myKeyPressed: HTMLElement | null = null;

  updateDisplay(display, calc.entry);

  const keysList = document.getElementsByClassName("ckey");

  const keyPress = (thisKey: HTMLElement, thisEvent: Event): void => {
    myKeyPressed = thisKey;
    myTimer = setTimeout(() => {
      calc = toggleShift(calc);
      window.navigator.vibrate(30);
    }, 750);
    window.navigator.vibrate(40);
    thisEvent.preventDefault();
  };

  const keyLeave = (thisEvent: Event): void => {
    myKeyPressed = null;
    if (myTimer) {
      clearTimeout(myTimer);
    }
    thisEvent.preventDefault();
  };

  const keyRelease = (thisKey: HTMLElement, thisEvent: Event): void => {
    if (myTimer) {
      clearTimeout(myTimer);
    }
    if (thisKey === myKeyPressed) {
      const keyId = thisKey.id || thisKey.textContent?.trim() || "";
      calc = pressKey(calc, keyId);
      updateDisplay(display, calc.entry);
    }
    thisEvent.preventDefault();
  };

  const keyMap: Record<string, string> = {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    ".": "dot",
    "+": "plus",
    "-": "minus",
    "*": "times",
    "/": "divby",
    "^": "pow",
    "(": "lparen",
    ")": "rparen",
    Enter: "equals",
    "=": "equals",
    Backspace: "del",
    Escape: "clear",
  };

  document.addEventListener("keydown", (event) => {
    const keyId = keyMap[event.key];
    if (keyId) {
      event.preventDefault();
      calc = pressKey(calc, keyId);
      updateDisplay(display, calc.entry);
    }
  });

  for (let i = 0; i < keysList.length; i++) {
    const key = keysList[i] as HTMLElement;

    key.addEventListener("pointerdown", function (this: HTMLElement, event) {
      keyPress(this, event);
    });

    key.addEventListener("pointerleave", function (this: HTMLElement, event) {
      keyLeave(event);
    });

    key.addEventListener("pointerup", function (this: HTMLElement, event) {
      keyRelease(this, event);
    });
  }
}
