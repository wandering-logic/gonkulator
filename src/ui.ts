import {
  type Calculator,
  createCalculator,
  formatEntry,
  pressKey,
  toggleShift,
} from "./calculator";

export function initUI(): void {
  const totaldiv = document.getElementById("total");
  if (!totaldiv) {
    throw new Error("Could not find #total element");
  }

  let calc: Calculator = createCalculator();
  let myTimer: ReturnType<typeof setTimeout> | null = null;
  let myKeyPressed: HTMLElement | null = null;

  totaldiv.textContent = formatEntry(calc.entry);

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
      totaldiv.textContent = formatEntry(calc.entry);
    }
    thisEvent.preventDefault();
  };

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
