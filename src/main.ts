import { Calculator } from './calculator';
import { CalculatorUI } from './calculator-ui';
import { getCalculatorConfig, getUIButtonDefinitions } from './definitions';
import './index.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;

const calculatorConfig = getCalculatorConfig();
const buttonDefinitions = getUIButtonDefinitions();

const calculator = new Calculator(calculatorConfig);
const ui = new CalculatorUI(calculator, buttonDefinitions);
ui.mount(appRoot);
