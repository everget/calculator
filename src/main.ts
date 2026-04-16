import { Calculator } from './calculator';
import { CalculatorUI } from './calculator-ui';
import './index.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;

const calculator = new Calculator();
const ui = new CalculatorUI(calculator);
ui.mount(appRoot);
