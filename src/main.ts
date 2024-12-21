import { Calculator } from './calculator';
import { CalculatorUI } from './calculator-ui';
import './index.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;

new CalculatorUI(appRoot, new Calculator());
