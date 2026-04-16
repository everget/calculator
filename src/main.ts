import { Calculator } from './calculator';
import { CalculatorUI } from './calculator-ui';
import { CALCULATOR_CONFIG, UI_BUTTON_DEFINITIONS } from './definitions';
import './index.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;

const calculator = new Calculator(CALCULATOR_CONFIG);
const ui = new CalculatorUI(calculator, UI_BUTTON_DEFINITIONS);
ui.mount(appRoot);
