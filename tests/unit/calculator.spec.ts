import { Calculator } from '@/src/calculator';
import { CALCULATOR_CONFIG, UI_BUTTON_DEFINITIONS, type CommandTag } from '@/src/definitions';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Calculator', () => {
	const config = CALCULATOR_CONFIG;
	const buttons = UI_BUTTON_DEFINITIONS;

	const contentToIdMap = buttons.reduce(
		(acc, button) => {
			acc[button.content] = button.id;
			return acc;
		},
		{} as Record<string, CommandTag>
	);

	let calculator: Calculator;
	const pressButtons = (commands: CommandTag[]) => {
		for (const command of commands) {
			calculator.handleCommand(command);
		}
	};

	beforeEach(() => {
		calculator = new Calculator(config);
	});

	describe('Basic Operations', () => {
		describe('add: Addition', () => {
			[
				{ op1: '0', op2: '0', expected: '0' },
				{ op1: '0', op2: '1', expected: '1' },
				{ op1: '1', op2: '1', expected: '2' },
				{ op1: '2', op2: '2', expected: '4' },
				{ op1: '2', op2: '3', expected: '5' },
				{ op1: '9', op2: '1', expected: '10' },
			].forEach(({ op1, op2, expected }) => {
				it(`${op1} + ${op2} = ${expected}`, () => {
					pressButtons([contentToIdMap[op1], 'add', contentToIdMap[op2], 'equals']);
					expect(calculator.getDisplayValue()).toBe(expected);
				});
			});

			[
				{ op1: '-0', op2: '0', expected: '0' },
				{ op1: '-1', op2: '0', expected: '-1' },
				{ op1: '-1', op2: '1', expected: '0' },
				{ op1: '-2', op2: '1', expected: '-1' },
				{ op1: '-2', op2: '2', expected: '0' },
				{ op1: '-2', op2: '3', expected: '1' },
				{ op1: '-2', op2: '4', expected: '2' },
				{ op1: '-4', op2: '2', expected: '-2' },
			].forEach(({ op1, op2, expected }) => {
				it(`${op1} + ${op2} = ${expected}`, () => {
					pressButtons([
						'subtract',
						contentToIdMap[Math.abs(+op1)],
						'add',
						contentToIdMap[Math.abs(+op2)],
						'equals',
					]);
					expect(calculator.getDisplayValue()).toBe(expected);
				});
			});
		});

		describe('subtract: Subtraction', () => {
			[
				{ op1: '0', op2: '0', expected: '0' },
				{ op1: '0', op2: '1', expected: '-1' },
				{ op1: '1', op2: '1', expected: '0' },
				{ op1: '2', op2: '1', expected: '1' },
				{ op1: '5', op2: '3', expected: '2' },
				{ op1: '3', op2: '5', expected: '-2' },
				{ op1: '9', op2: '1', expected: '8' },
			].forEach(({ op1, op2, expected }) => {
				it(`${op1} - ${op2} = ${expected}`, () => {
					pressButtons([contentToIdMap[op1], 'subtract', contentToIdMap[op2], 'equals']);
					expect(calculator.getDisplayValue()).toBe(expected);
				});
			});

			[
				{ op1: '-0', op2: '0', expected: '0' },
				{ op1: '-0', op2: '1', expected: '-1' },
				{ op1: '-1', op2: '1', expected: '-2' },
				{ op1: '-2', op2: '1', expected: '-3' },
				{ op1: '-5', op2: '3', expected: '-8' },
				{ op1: '-3', op2: '5', expected: '-8' },
				{ op1: '-9', op2: '1', expected: '-10' },
			].forEach(({ op1, op2, expected }) => {
				it(`${op1} - ${op2} = ${expected}`, () => {
					pressButtons([
						'subtract',
						contentToIdMap[Math.abs(+op1)],
						'subtract',
						contentToIdMap[Math.abs(+op2)],
						'equals',
					]);
					expect(calculator.getDisplayValue()).toBe(expected);
				});
			});
		});

		describe('multiply: Multiplication', () => {
			[
				{ op1: '0', op2: '0', expected: '0' },
				{ op1: '1', op2: '0', expected: '0' },
				{ op1: '0', op2: '1', expected: '0' },
				{ op1: '1', op2: '1', expected: '1' },
				{ op1: '2', op2: '2', expected: '4' },
				{ op1: '3', op2: '4', expected: '12' },
			].forEach(({ op1, op2, expected }) => {
				it(`${op1} / ${op2} = ${expected}`, () => {
					pressButtons([
						contentToIdMap[Math.abs(+op1)],
						'multiply',
						contentToIdMap[Math.abs(+op2)],
						'equals',
					]);
					expect(calculator.getDisplayValue()).toBe(expected);
				});
			});

			[
				{ op1: '-0', op2: '0', expected: '0' },
				{ op1: '-1', op2: '0', expected: '0' },
				{ op1: '-0', op2: '1', expected: '0' },
				{ op1: '-1', op2: '1', expected: '-1' },
				{ op1: '-2', op2: '2', expected: '-4' },
				{ op1: '-3', op2: '4', expected: '-12' },
			].forEach(({ op1, op2, expected }) => {
				it(`${op1} / ${op2} = ${expected}`, () => {
					pressButtons([
						'subtract',
						contentToIdMap[Math.abs(+op1)],
						'multiply',
						contentToIdMap[Math.abs(+op2)],
						'equals',
					]);
					expect(calculator.getDisplayValue()).toBe(expected);
				});
			});
		});

		describe('divide: Division', () => {
			[
				{ op1: '1', op2: '2', expected: '0.5' },
				{ op1: '3', op2: '4', expected: '0.75' },
				{ op1: '8', op2: '4', expected: '2' },
				{ op1: '0', op2: '0', expected: 'ERROR' },
				{ op1: '1', op2: '0', expected: 'ERROR' },
				{ op1: '5', op2: '0', expected: 'ERROR' },
			].forEach(({ op1, op2, expected }) => {
				it(`${op1} / ${op2} = ${expected}`, () => {
					pressButtons([
						contentToIdMap[Math.abs(+op1)],
						'divide',
						contentToIdMap[Math.abs(+op2)],
						'equals',
					]);
					expect(calculator.getDisplayValue()).toBe(expected);
				});
			});
		});
	});

	describe('Special Functions', () => {
		describe('percent: Percentage', () => {
			it('should calculate percentage', () => {
				pressButtons(['five', 'zero', 'percent', 'two', 'zero', 'zero', 'equals']);
				expect(calculator.getDisplayValue()).toBe('100');
			});
		});

		describe('power: Power', () => {
			it('should calculate power', () => {
				pressButtons(['two', 'power', 'three', 'equals']);
				expect(calculator.getDisplayValue()).toBe('8');
			});
		});

		describe('square: Square', () => {
			it('should calculate square', () => {
				pressButtons(['five', 'square']);
				expect(calculator.getDisplayValue()).toBe('25');
			});
		});

		describe('sqrt: Square root', () => {
			it('should calculate square root', () => {
				pressButtons(['nine', 'sqrt']);
				expect(calculator.getDisplayValue()).toBe('3');
			});

			it('should handle square root of negative number', () => {
				pressButtons(['subtract', 'four', 'sqrt']);
				expect(calculator.getDisplayValue()).toBe('ERROR');
			});
		});

		describe('ln: Natural logarithm', () => {
			it('should calculate natural logarithm', () => {
				pressButtons(['one', 'zero', 'ln']);
				expect(Number(calculator.getDisplayValue())).toBeCloseTo(2.30258509299, 5);
			});

			it('should handle logarithm of zero', () => {
				pressButtons(['zero', 'ln']);
				expect(calculator.getDisplayValue()).toBe('ERROR');
			});

			it('should handle logarithm of negative number', () => {
				pressButtons(['subtract', 'one', 'ln']);
				expect(calculator.getDisplayValue()).toBe('ERROR');
			});
		});

		describe('log: Common logarithm', () => {
			it('should calculate common logarithm', () => {
				pressButtons(['one', 'zero', 'zero', 'log', 'one', 'zero', 'equals']);
				expect(calculator.getDisplayValue()).toBe('2');
			});

			it('should handle logarithm of zero', () => {
				pressButtons(['zero', 'log', 'one', 'zero', 'equals']);
				expect(calculator.getDisplayValue()).toBe('ERROR');
			});

			it('should handle logarithm of negative number', () => {
				pressButtons(['subtract', 'one', 'log', 'two', 'equals']);
				expect(calculator.getDisplayValue()).toBe('ERROR');
			});
		});

		describe('mod: Modulo', () => {
			it('should calculate modulo', () => {
				pressButtons(['seven', 'mod', 'three', 'equals']);
				expect(calculator.getDisplayValue()).toBe('1');
			});
		});

		describe('half: Half of a number', () => {
			it('should calculate half of zero', () => {
				pressButtons(['zero', 'half']);
				expect(calculator.getDisplayValue()).toBe('0');
			});

			it('should calculate half of an even number', () => {
				pressButtons(['six', 'half']);
				expect(calculator.getDisplayValue()).toBe('3');
			});

			it('should calculate half of an odd number', () => {
				pressButtons(['five', 'half']);
				expect(calculator.getDisplayValue()).toBe('2.5');
			});
		});
	});

	describe('Decimal Operations', () => {
		it('should handle decimal numbers', () => {
			pressButtons(['one', 'decimal', 'five', 'add', 'two', 'decimal', 'seven', 'equals']);
			expect(calculator.getDisplayValue()).toBe('4.2');
		});

		it('should ignore multiple decimal points', () => {
			pressButtons(['one', 'decimal', 'five', 'decimal', 'seven']);
			expect(calculator.getDisplayValue()).toBe('1.57');
		});
	});

	describe('Chained & Continuous Operations', () => {
		it('should handle multiple operations', () => {
			pressButtons(['two', 'add', 'three', 'multiply', 'four', 'subtract', 'six', 'equals']);
			expect(calculator.getDisplayValue()).toBe('14');
		});

		it('should allow continuous same operations', () => {
			pressButtons(['four', 'add', 'one', 'add', 'three', 'add', 'two', 'equals']);
			expect(calculator.getDisplayValue()).toBe('10');
		});

		it('should allow operations on the result', () => {
			pressButtons(['five', 'add', 'three', 'equals', 'multiply', 'two', 'equals']);
			expect(calculator.getDisplayValue()).toBe('16');
		});
	});

	describe('Clear Functionality', () => {
		it('should clear the calculator', () => {
			pressButtons(['five', 'add', 'three', 'clear-all']);
			expect(calculator.getDisplayValue()).toBe('0');
		});

		it('should allow operations after clearing', () => {
			pressButtons([
				'five',
				'add',
				'three',
				'clear-all',
				'two',
				'multiply',
				'four',
				'equals',
			]);
			expect(calculator.getDisplayValue()).toBe('8');
		});
	});

	describe('Large Numbers and Precision', () => {
		it('should handle large numbers', () => {
			pressButtons([
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'multiply',
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'nine',
				'equals',
			]);
			expect(calculator.getDisplayValue()).not.toBe('ERROR');
			expect(Number(calculator.getDisplayValue())).toBeGreaterThan(9.99e15);
		});

		it('should maintain precision for decimal operations', () => {
			pressButtons(['one', 'divide', 'three', 'equals']);
			expect(Number(calculator.getDisplayValue())).toBeCloseTo(0.3333333, 5);
		});
	});

	describe('Input Constraints', () => {
		it('should cap the display buffer at 15 digits', () => {
			for (let i = 0; i < 20; i++) {
				calculator.handleCommand('nine');
			}
			expect(calculator.getDisplayValue().length).toBe(15);
			expect(calculator.getDisplayValue()).toBe('9'.repeat(15));
		});

		it('should allow decimals safely within the limit', () => {
			for (let i = 0; i < 14; i++) {
				calculator.handleCommand('three');
			}
			calculator.handleCommand('decimal');
			for (let i = 0; i < 5; i++) {
				calculator.handleCommand('three');
			}
			expect(calculator.getDisplayValue().length).toBe(16); // 15 digits + 1 decimal
		});
	});

	describe('State Serialization Verification', () => {
		it('should seamlessly resume operations after extracting and loading state', () => {
			pressButtons(['five', 'add', 'one', 'zero']);
			const extractedState = calculator.getState();

			const newCalculator = new Calculator(config);
			newCalculator.setState(extractedState);
			newCalculator.handleCommand('equals');
			expect(newCalculator.getDisplayValue()).toBe('15');

			newCalculator.handleCommand('multiply');
			newCalculator.handleCommand('two');
			newCalculator.handleCommand('equals');
			expect(newCalculator.getDisplayValue()).toBe('30');
		});
	});
});
