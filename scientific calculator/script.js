let display = document.getElementById("display");
let secondaryDisplay = document.getElementById("secondaryDisplay");
let currentInput = "0";
let previousInput = "";
let operation = null;
let shouldResetDisplay = false;
let memory = 0;
let angleMode = "DEG"; // DEG, RAD, GRAD
let shiftActive = false;

function updateDisplay() {
  display.textContent = currentInput;
  if (previousInput && operation) {
    secondaryDisplay.textContent = previousInput + " " + operation;
  }
}

function appendNumber(num) {
  if (shouldResetDisplay) {
    currentInput = num;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === "0" ? num : currentInput + num;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (operation !== null && !shouldResetDisplay) {
    calculateResult();
  }
  previousInput = currentInput;
  operation = op;
  shouldResetDisplay = true;
  shiftActive = false;
  updateDisplay();
}

function appendFunction(func) {
  currentInput += func;
  updateDisplay();
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  operation = null;
  secondaryDisplay.textContent = "";
  shouldResetDisplay = false;
  shiftActive = false;
  updateDisplay();
}

function clearEntry() {
  currentInput = currentInput.slice(0, -1) || "0";
  updateDisplay();
}

function calculateResult() {
  if (operation === null || shouldResetDisplay) return;

  let result;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  switch (operation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      result = current !== 0 ? prev / current : "Error";
      break;
    case "^":
      result = Math.pow(prev, current);
      break;
    default:
      return;
  }

  currentInput = result.toString();
  operation = null;
  previousInput = "";
  secondaryDisplay.textContent = "";
  shouldResetDisplay = true;
  updateDisplay();
}

function calculate(func) {
  let num = parseFloat(currentInput);
  let result;

  if (shiftActive) {
    switch (func) {
      case "sin":
        result = Math.asin(num);
        result = angleMode === "DEG" ? result * (180 / Math.PI) : result;
        break;
      case "cos":
        result = Math.acos(num);
        result = angleMode === "DEG" ? result * (180 / Math.PI) : result;
        break;
      case "tan":
        result = Math.atan(num);
        result = angleMode === "DEG" ? result * (180 / Math.PI) : result;
        break;
      case "log":
        result = Math.pow(10, num);
        break;
      case "ln":
        result = Math.exp(num);
        break;
      case "sqrt":
        result = num * num;
        break;
      default:
        return;
    }
    shiftActive = false;
  } else {
    let angleInRadians = num;
    if (
      angleMode === "DEG" &&
      (func === "sin" || func === "cos" || func === "tan")
    ) {
      angleInRadians = num * (Math.PI / 180);
    }

    switch (func) {
      case "sin":
        result = Math.sin(angleInRadians);
        break;
      case "cos":
        result = Math.cos(angleInRadians);
        break;
      case "tan":
        result = Math.tan(angleInRadians);
        break;
      case "log":
        result = num > 0 ? Math.log10(num) : "Error";
        break;
      case "ln":
        result = num > 0 ? Math.log(num) : "Error";
        break;
      case "sqrt":
        result = num >= 0 ? Math.sqrt(num) : "Error";
        break;
      case "factorial":
        if (num < 0 || !Number.isInteger(num)) {
          result = "Error";
        } else {
          result = 1;
          for (let i = 2; i <= num; i++) result *= i;
        }
        break;
      case "inverse":
        result = num !== 0 ? 1 / num : "Error";
        break;
      case "percent":
        result = num / 100;
        break;
      default:
        return;
    }
  }

  if (result === "Error") {
    display.classList.add("error");
    setTimeout(() => display.classList.remove("error"), 1000);
  }

  currentInput = typeof result === "number" ? result.toString() : result;
  shouldResetDisplay = true;
  updateDisplay();
}

function shift() {
  shiftActive = !shiftActive;
  document.querySelector(".calculator").style.filter = shiftActive
    ? "hue-rotate(20deg)"
    : "none";
}

function changeMode() {
  const modes = ["DEG", "RAD", "GRAD"];
  let currentIndex = modes.indexOf(angleMode);
  angleMode = modes[(currentIndex + 1) % modes.length];
  document.getElementById("angleMode").textContent = angleMode;
}

function memoryRecall() {
  if (shiftActive) {
    memory += parseFloat(currentInput);
    shiftActive = false;
  } else {
    currentInput = memory.toString();
  }
  updateMemoryIndicator();
  shouldResetDisplay = true;
  updateDisplay();
}

function memoryClear() {
  if (shiftActive) {
    memory -= parseFloat(currentInput);
    shiftActive = false;
  } else {
    memory = 0;
  }
  updateMemoryIndicator();
  updateDisplay();
}

function updateMemoryIndicator() {
  document.getElementById("memoryIndicator").textContent =
    memory !== 0 ? "M" : "";
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") appendNumber(e.key);
  else if (e.key === ".") appendNumber(".");
  else if (e.key === "+") appendOperator("+");
  else if (e.key === "-") appendOperator("-");
  else if (e.key === "*") appendOperator("*");
  else if (e.key === "/") appendOperator("/");
  else if (e.key === "Enter") calculateResult();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "Backspace") clearEntry();
});

updateDisplay();
