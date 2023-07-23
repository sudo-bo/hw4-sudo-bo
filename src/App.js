import React, { useState } from "react";
import "./App.css";

const Button = ({ onClick, className, value }) => {
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
};

const Output = ({ children, value }) => {
  return (
    <div className="calculator">
      <div className="output">
        <div className="deg-rad" data-deg>
        </div>
        <div className="current">{value}</div>
      </div>
      {children}
    </div>
  );
};

// Evaluate the order of expression without brackets.
function evaluateWithoutBrackets(str) {
  let match = null;
  const regex = /[-]?\d+(\.\d+)?/g;
  const tokens = [];

  while ((match = regex.exec(str)) !== null) {
    tokens.push(match[0]);
    if (match.index + match[0].length < str.length) {
      regex.lastIndex += 1;
      tokens.push(str[match.index + match[0].length]);
    }
  }

  // Compute addition and subtraction.
  while (tokens.length) {
    if (tokens.length === 1) {
      return tokens[0];
    }
    const [num1, op, num2] = [tokens.shift(), tokens.shift(), tokens.shift()];
    tokens.unshift(compute(num1, op, num2));
  }

  // Compute multiplication and division.
  let i = 0;
  while (i < tokens.length) {
    if (i < tokens.length - 1) {
      let op = tokens[i + 1];
      if (op === "*" || op === "/") {
        tokens.splice(i, 3, compute(tokens[i], op, tokens[i + 2]));
      } else {
        i += 2;
      }
    } else {
      break;
    }
  }

  return str;

  //Make the computation.
  function compute(num1, op, num2) {
    num1 = Number(num1);
    num2 = Number(num2);

    switch (op) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num1 / num2;
      default:
        alert("Operator Unknown! Please try again!");
    }
  }
}

// Convert Degrees to Radians.
function toRadian(rad) {
  return parseFloat(rad) * (Math.PI / 180);
}

// Validate the input.
function validateInput(input) {
  let searchRegExp = new RegExp("×", "g");
  let s = input.replace(searchRegExp, "*");

  searchRegExp = new RegExp("÷", "g");
  s = s.replace(searchRegExp, "/");
  s = s.replace(/\s/g, "");

  try {
    eval(s);
  } catch (e) {
    if (e instanceof SyntaxError) {
      alert("Please input a valid expression!");
      return;
    } else {
      alert("Please input a valid expression!");
    }
  }
  return evaluateWithBrackets("(" + s + ")", 1)[0];
}

// Compute factorial (x!).
function factorial(n) {
  let factoria = 1;

  for (let i = 2; i <= n; i++) {
    factoria = factoria * i;
  }
  return factoria;
}

const App = () => {
  const [mode, setMode] = useState("Rad");
  const [calculatorState, setCalculatorState] = useState({
    operation: "",
    expression: "",
    result: 0,
  });

  const isNumber = (val) => {
    if (!isNaN(val)) {
      return true;
    } else if (val === ".") {
      return true;
    } else {
      return false;
    }
  };

  // Handle the mode (Deg/Rad) button.
  const modeHandler = () => {
    if (document.querySelector("[data-deg]").innerHTML === "Rad") {
      setMode("Deg");
      document.querySelector("[data-deg]").innerHTML = "Deg";
      document.querySelector("[data-mode]").innerHTML = "Rad";
    } else {
      setMode("Rad");
      document.querySelector("[data-deg]").innerHTML = "Rad";
      document.querySelector("[data-mode]").innerHTML = "Deg";
    }
  };

  // Handle the trigonometric (sin, cos, tan) buttons.
  const trigonometricHandler = (e) => {
    e.preventDefault();

    const value = e.target.innerHTML;
    var result = "";
    const parseExp = validateInput(calculatorState.expression);

    switch (value) {
      case "sin":
        if (mode === "Deg") {
          result = Math.sin(toRadian(parseFloat(parseExp)));
        } else {
          result = Math.sin(parseFloat(parseExp));
        }
        break;
      case "cos":
        if (mode === "Deg") {
          result = Math.cos(toRadian(parseFloat(parseExp)));
        } else {
          result = Math.cos(parseFloat(parseExp));
        }
        if (result <= 0.01 && result >= 0) {
          result = 0;
        }
        break;
      case "tan":
        if (mode === "Deg") {
          result = Math.tan(toRadian(parseFloat(parseExp)));
        } else {
          result = Math.tan(parseFloat(parseExp));
        }
        break;
      default:
        return;
    }

    setCalculatorState({
      ...calculatorState,
      operation: value,
      result: result,
      expression: "0",
    });
  };

  // Handle the number (0-9) buttons.
  const numHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalculatorState({
      ...calculatorState,
      expression:
        calculatorState.operation === "" && calculatorState.result > 0
          ? calculatorState.result.toString() + value
          : calculatorState.operation === "%" && calculatorState.result !== 0
          ? calculatorState.result.toString() + value
          : calculatorState.operation === "%" &&
            calculatorState.expression !== "0"
          ? calculatorState.expression + value
          : calculatorState.expression === "0" && value === "0"
          ? "0"
          : calculatorState.expression === "0" && value !== "0"
          ? value
          : calculatorState.expression + value,
      result: !calculatorState.operation
        ? 0
        : calculatorState.operation === "%"
        ? 0
        : calculatorState.result,
    });
  };

  // Handle the factorial (x!) button.
  const factorialHandler = (e) => {
    e.preventDefault();

    let num =
      calculatorState.expression !== "0"
        ? parseFloat(validateInput(calculatorState.expression))
        : 0;

    let result = calculatorState.result
      ? parseFloat(calculatorState.result)
      : 0;

    setCalculatorState({
      ...calculatorState,
      expression: factorial(parseFloat(num)).toString(),
      operation: "ln",
      result: factorial(parseFloat(result)).toString(),
    });
  };

  // Handle the parenthesis ( ( and ) ) button.
  const parenthesisHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalculatorState({
      ...calculatorState,
      expression:
        calculatorState.expression === "0" && value === "("
          ? "("
          : calculatorState.expression + value,
    });
  };

  // Handle the percent (%) button.
  const percentHandler = (e) => {
    e.preventDefault();

    let num =
      calculatorState.expression !== "0"
        ? parseFloat(validateInput(calculatorState.expression))
        : 0;

    let result = calculatorState.result
      ? parseFloat(calculatorState.result)
      : 0;

    setCalculatorState({
      ...calculatorState,
      expression: (num /= 100).toString(),
      operation: "%",
      result: (result /= 100),
    });
  };

  // Handle the clear (AC) button.
  const clearHandler = () => {
    setCalculatorState({
      ...calculatorState,
      operation: "",
      expression: "0",
      result: 0,
    });
  };

  // Handle the ln (ln) button.
  const lnHandler = (e) => {
    e.preventDefault();

    let num =
      calculatorState.expression !== "0"
        ? parseFloat(validateInput(calculatorState.expression))
        : 0;

    let result = calculatorState.result
      ? parseFloat(calculatorState.result)
      : 0;

    setCalculatorState({
      ...calculatorState,
      expression: Math.log(parseFloat(num)).toString(),
      operation: "ln",
      result: Math.log(parseFloat(result)).toString(),
    });
  };

  // Handle the log (log) button.
  const logHandler = (e) => {
    e.preventDefault();

    let num =
      calculatorState.expression !== "0"
        ? parseFloat(validateInput(calculatorState.expression))
        : 0;

    let result = calculatorState.result
      ? parseFloat(calculatorState.result)
      : 0;

    setCalculatorState({
      ...calculatorState,
      expression: Math.log10(parseFloat(num)).toString(),
      operation: "log",
      result: Math.log10(parseFloat(result)).toString(),
    });
  };

  // Handle the square root (√) button.
  const rootHandler = (e) => {
    e.preventDefault();

    let num =
      calculatorState.expression !== "0"
        ? parseFloat(validateInput(calculatorState.expression))
        : 0;

    let result = calculatorState.result
      ? parseFloat(calculatorState.result)
      : 0;

    setCalculatorState({
      ...calculatorState,
      expression: Math.sqrt(parseFloat(num)).toString(),
      operation: "√",
      result: Math.sqrt(parseFloat(result)).toString(),
    });
  };

  // Handle the exponent (EXP) button.
  const exponentHandler = (e) => {
    e.preventDefault();

    let num =
      calculatorState.expression !== "0"
        ? parseFloat(validateInput(calculatorState.expression))
        : 0;

    let result = calculatorState.result
      ? parseFloat(calculatorState.result)
      : 0;

    setCalculatorState({
      ...calculatorState,
      expression: (num *= 10).toString(),
      operation: "EXP",
      result: (result *= 10),
    });
  };

  // Handle the exponent (x^y) button.
  const powerHandler = (e) => {
    e.preventDefault();

    setCalculatorState({
      ...calculatorState,
      expression:
        calculatorState.expression === "0"
          ? "0"
          : calculatorState.expression + "^",
      operation: calculatorState.expression === "0" ? "" : "^",
    });
  };

  // Handle the point (.) button.
  const pointHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalculatorState({
      ...calculatorState,
      expression: !calculatorState.expression.toString().includes(".")
        ? calculatorState.expression + value
        : calculatorState.expression,
    });
  };

  // Handle the equal (=) button.
  const equalsHandler = () => {
    if (calculatorState.operation === "^") {
      var tmpResult = 0;
      const exponentSplit = calculatorState.expression.split("^");

      tmpResult = exponentSplit[0];

      for (let i = 0; i < exponentSplit.length - 1; i++) {
        tmpResult = Math.pow(tmpResult, exponentSplit[i + 1]);
      }

      setCalculatorState({
        ...calculatorState,
        expression: "0",
        operation: "",
        result: tmpResult,
      });

      return;
    }

    const result = validateInput(calculatorState.expression);

    setCalculatorState({
      ...calculatorState,
      expression: "0",
      operation: "",
      result: result,
    });
  };

  // Button order.
  const buttons = [
    ["%", "(", ")", "sin", "x!"],
    ["ln", "AC", "cos", 7, 8],
    [9, "log", 4, 5, 6],
    ["tan", 1, 2, 3, "EXP"],
    ["xʸ", 0, ".", "√", "+"],
    ["-", "=", "÷", "×"],
];



  // Render.
  return (
    <div className="container">
      <Output
        value={
          calculatorState.expression !== "0"
            ? calculatorState.expression
            : calculatorState.result
        }
      >
        <button onClick={modeHandler} className="keys operations" data-mode>
          Deg
        </button>
        {buttons.flat().map((button, i) => {
          return (
            <Button
              key={i}
              className={
                button === "="
                  ? "keys equals"
                  : isNumber(button)
                  ? "keys nums"
                  : "keys operations"
              }
              value={button}
              onClick={
                button === "AC"
                  ? clearHandler
                  : button === "%"
                  ? percentHandler
                  : button === "EXP"
                  ? exponentHandler
                  : button === "√"
                  ? rootHandler
                  : button === "log"
                  ? logHandler
                  : button === "ln"
                  ? lnHandler
                  : button === "x!"
                  ? factorialHandler
                  : button === "sin" || button === "cos" || button === "tan"
                  ? trigonometricHandler
                  : button === "(" || button === ")"
                  ? parenthesisHandler
                  : button === "xʸ"
                  ? powerHandler
                  : button === "="
                  ? equalsHandler
                  : button === "."
                  ? pointHandler
                  : numHandler
              }
            />
          );
        })}
      </Output>
    </div>
  );
};

// Evaluate the order of expression with brackets.
function evaluateWithBrackets(input, start) {
  let str = "";
  for (let i = start; i < input.length; i++) {
    if (input[i] === "(") {
      const [val, j] = evaluateWithBrackets(input, i + 1);
      i = j;
      str += val;
    } else if (input[i] === ")") {
      return [evaluateWithoutBrackets(str), i];
    } else {
      str += input[i];
    }
  }
  return [evaluateWithoutBrackets(str), input.length - 1];
}

export default App;
