import './style.css'

class Calculator {
  private currentInput = '';
  private previousInput = '';
  private operator: string | null = null;

  public setInput(value: string) {
    this.currentInput = value;
  }

  public setPreviousInput(value: string) {
    this.previousInput = value;
  }

  public setOperator(value: string | null) {
    this.operator = value;
  }

  public getInput() {
    return this.currentInput;
  }

  public getPreviousInput() {
    return this.previousInput;
  }

  public getOperator() {
    return this.operator;
  }

  public clear() {
    this.currentInput = '';
    this.previousInput = '';
    this.operator = null;
  }

  public overflow() {
    if (this.currentInput.length > 10) {
      this.currentInput = 'OVERFLOW';
    }
  }

  public compute() {
    if (this.previousInput && this.currentInput && this.operator) {
      const prev = parseFloat(this.previousInput);
      const curr = parseFloat(this.currentInput);
      switch (this.operator) {
        case '+':
          return prev + curr;
        case '-':
          return prev - curr;
        case '*':
          return prev * curr;
        case '/':
          return prev / curr;
        default:
          return null;
      }
    }
    return null;
  }
}
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const calculator = new Calculator();
const display = document.getElementById('display') as HTMLInputElement;
const buttons = document.querySelectorAll('#calculator button');

let shouldResetInput = false;

function updateDisplay(value: string) {
  display.value = value;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent || '';
    if (!isNaN(Number(value)) || value === '.') {
      if (shouldResetInput) {
        calculator.setInput('');
        shouldResetInput = false;
      }
      calculator.setInput(calculator.getInput() + value);
      if (calculator.getInput().length > 16) {
        calculator.setInput('OVERFLOW');
        buttons.forEach(btn => ((btn as HTMLButtonElement).disabled = true));
        delay(1000).then(() => {
          calculator.clear();
          buttons.forEach(btn => ((btn as HTMLButtonElement).disabled = false));
          updateDisplay('');
        });
      }
      updateDisplay(calculator.getInput());
      if (calculator.getInput() === '80085') {
        updateDisplay('BOOBIES');
        delay(1000).then(() => {
          calculator.clear();
          updateDisplay('');
        });
      }
    } else if (value === 'C') {
        calculator.clear();
        updateDisplay('CLEAR');
        buttons.forEach(btn => ((btn as HTMLButtonElement).disabled = true));
        delay(1000).then(() => {
          updateDisplay('');
          buttons.forEach(btn => ((btn as HTMLButtonElement).disabled = false));
        });
    } else if (value === '=') {
      const result = calculator.compute();
      if (result !== null) {
        updateDisplay(result.toString());
        calculator.setInput(result.toString());
        calculator.setPreviousInput('');
        calculator.setOperator(null);
        shouldResetInput = true;
        if (result.toString().length > 10) {
          calculator.overflow();
          buttons.forEach(btn => ((btn as HTMLButtonElement).disabled = true));
          delay(1000).then(() => {
            updateDisplay('');
            buttons.forEach(btn => ((btn as HTMLButtonElement).disabled = false));
          });
        }
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      if (calculator.getInput()) {
        calculator.setPreviousInput(calculator.getInput());
        calculator.setInput('');
        calculator.setOperator(value);
      }
    }
  });
});