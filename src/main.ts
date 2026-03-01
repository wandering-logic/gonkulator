import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const shiftOut = (value: string): string => {
    if (value.length > 9) {
      return value.substr(value.length - 9, 9);
    }
    return value;
  };

  const totaldiv = document.getElementById("total");
  if (!totaldiv) {
    throw new Error("Could not find #total element");
  }

  let shiftKey = false;
  let myTimer: ReturnType<typeof setTimeout> | null = null;
  let myKeyPressed: HTMLElement | null = null;

  totaldiv.textContent = "0";

  const keysList = document.getElementsByClassName("ckey");

  const keyPress = (thisKey: HTMLElement, thisEvent: Event): void => {
    myKeyPressed = thisKey;
    myTimer = setTimeout(() => {
      shiftKey = !shiftKey;
      console.log("doink!");
      window.navigator.vibrate(30);
    }, 750);
    window.navigator.vibrate(40);
    thisEvent.preventDefault();
  };

  const keyLeave = (_thisKey: HTMLElement, thisEvent: Event): void => {
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
      let value = totaldiv.textContent ?? "";
      value += thisKey.textContent;
      if (shiftKey) {
        value += "x";
      }
      shiftKey = false;
      totaldiv.textContent = shiftOut(value);
    }
    thisEvent.preventDefault();
  };

  for (let i = 0; i < keysList.length; i++) {
    const key = keysList[i] as HTMLElement;

    key.addEventListener("pointerdown", function (this: HTMLElement, event) {
      console.log("pointerdown: ", this.textContent);
      keyPress(this, event);
    });

    key.addEventListener("pointerleave", function (this: HTMLElement, event) {
      console.log("pointerleave: ", this.textContent);
      keyLeave(this, event);
    });

    key.addEventListener("pointerup", function (this: HTMLElement, event) {
      console.log("pointerup: ", this.textContent);
      keyRelease(this, event);
    });

    key.addEventListener("mousedown", function (this: HTMLElement, event) {
      console.log("mousedown: ", this.textContent);
      keyPress(this, event);
    });

    key.addEventListener("mouseleave", function (this: HTMLElement, event) {
      console.log("mouseleave: ", this.textContent);
      keyLeave(this, event);
    });

    key.addEventListener("mouseup", function (this: HTMLElement, event) {
      console.log("mouseup: ", this.textContent);
      keyRelease(this, event);
    });
  }
});
