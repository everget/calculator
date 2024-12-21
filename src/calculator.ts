type DigitTag =
	| 'one'
	| 'two'
	| 'three'
	| 'four'
	| 'five'
	| 'six'
	| 'seven'
	| 'eight'
	| 'nine'
	| 'zero';

type UnaryOperationTag = 'half' | 'square' | 'sqrt' | 'ln';

type BinaryOperationTag =
	| 'add'
	| 'subtract'
	| 'multiply'
	| 'divide'
	| 'power'
	| 'mod'
	| 'percent'
	| 'log';

type ControlTag = 'clear-all' | 'equals';

// Type helper to check if types are mutually exclusive (have no overlap)
type AreMutuallyExclusive<T extends string, U extends string> =
	Exclude<T, U> extends T ? (Exclude<U, T> extends U ? true : false) : false;

// Type helper to check if multiple types are mutually exclusive
type AreAllMutuallyExclusive<T extends readonly unknown[]> = T extends [
	infer A extends string,
	infer B extends string,
	...infer Rest,
]
	? AreMutuallyExclusive<A, B> extends true
		? AreAllMutuallyExclusive<[B, ...Rest]>
		: false
	: true;

// This type will only be valid if all command types are mutually exclusive
export type CommandTag =
	AreAllMutuallyExclusive<
		[DigitTag, UnaryOperationTag, BinaryOperationTag, ControlTag, 'decimal']
	> extends true
		? DigitTag | UnaryOperationTag | BinaryOperationTag | ControlTag | 'decimal'
		: never;

interface LogItem {
	command: CommandTag;
	result: number | null;
}

export interface ICalculator {
	getDisplayValue(): string;
	handleCommand(command: CommandTag): void;
}

export class Calculator implements ICalculator {
	private static ERROR_MESSAGE = 'ERROR';

	private static DIGITS_MAP: Record<DigitTag, string> = {
		one: '1',
		two: '2',
		three: '3',
		four: '4',
		five: '5',
		six: '6',
		seven: '7',
		eight: '8',
		nine: '9',
		zero: '0',
	};

	private static UNARY_OPERATIONS: Record<UnaryOperationTag, (a: number) => number> = {
		half: (a: number) => a / 2,
		square: (a: number) => a ** 2,
		sqrt: (a: number) => Math.sqrt(a),
		ln: (a: number) => Math.log(a),
	};

	private static BINARY_OPERATIONS: Record<BinaryOperationTag, (a: number, b: number) => number> =
		{
			add: (a: number, b: number) => a + b,
			subtract: (a: number, b: number) => a - b,
			multiply: (a: number, b: number) => a * b,
			divide: (a: number, b: number) => a / b,
			power: (a: number, b: number) => a ** b,
			mod: (a: number, b: number) => a % b,
			percent: (a: number, b: number) => (a * b) / 100,
			log: (a: number, b: number) => Math.log(a) / Math.log(b),
		};

	private hasError: boolean = false;
	private digitsBuffer: string[] = [];
	private operandsBuffer: number[] = [];
	private lastCommand: LogItem | null = null;

	constructor() {}

	getDisplayValue() {
		if (this.digitsBuffer.length === 0) {
			return '0';
		}

		const value = this.convertDigitsBuffer();
		return !this.isNumber(value) || this.hasError ? Calculator.ERROR_MESSAGE : String(value);
	}

	handleCommand(command: CommandTag) {
		switch (true) {
			case this.isUnaryOperator(command):
				this.handleUnaryOperator(command);
				break;
			case this.isBinaryOperator(command):
				this.handleBinaryOperator(command);
				break;
			case this.isControl(command):
				this.handleControl(command);
				break;
			case this.isDigit(command):
				this.handleDigit(command);
				break;
			case this.isDecimal(command):
				if (!this.digitsBuffer.includes('.')) {
					this.digitsBuffer.push('.');
				}
				break;
			default:
				throw new Error('Not supported command');
		}
	}

	private isUnaryOperator(command: CommandTag): command is UnaryOperationTag {
		return Object.keys(Calculator.UNARY_OPERATIONS).includes(command);
	}

	private isBinaryOperator(command: CommandTag): command is BinaryOperationTag {
		return Object.keys(Calculator.BINARY_OPERATIONS).includes(command);
	}

	private isControl(command: CommandTag): command is ControlTag {
		return command === 'clear-all' || command === 'equals';
	}

	private isDigit(command: CommandTag): command is DigitTag {
		return Object.keys(Calculator.DIGITS_MAP).includes(command);
	}

	private isDecimal(command: CommandTag): command is 'decimal' {
		return command === 'decimal';
	}

	private isNumber(value: unknown) {
		return typeof value === 'number' && Number.isFinite(value);
	}

	private clearOperandsBuffer() {
		this.operandsBuffer.length = 0;
	}

	private updateDigitsBuffer(value: number) {
		this.digitsBuffer = value.toString().split('');
	}

	private clearDigitsBuffer() {
		this.digitsBuffer.length = 0;
	}

	private convertDigitsBuffer() {
		return Number.parseFloat(this.digitsBuffer.join(''));
	}

	private addOperand(operand: number) {
		if (this.operandsBuffer.length >= 2) {
			this.operandsBuffer.shift();
		}
		this.operandsBuffer.push(operand);
		return operand;
	}

	private reset() {
		this.clearDigitsBuffer();
		this.clearOperandsBuffer();
		this.hasError = false;
	}

	private logCommand(command: CommandTag, result: number | null) {
		this.lastCommand = {
			command,
			result,
		};
	}

	private handleDigit(command: DigitTag) {
		this.digitsBuffer.push(Calculator.DIGITS_MAP[command]);
	}

	private handleControl(command: ControlTag) {
		switch (command) {
			case 'clear-all':
				this.reset();
				this.logCommand(command, 0);
				break;
			case 'equals':
				if (this.lastCommand !== null && this.isBinaryOperator(this.lastCommand.command)) {
					this.addOperand(this.convertDigitsBuffer());

					const result = Calculator.BINARY_OPERATIONS[
						this.lastCommand.command as BinaryOperationTag
					](this.operandsBuffer[0], this.operandsBuffer[1]);

					this.clearOperandsBuffer();
					this.updateDigitsBuffer(result);
					this.logCommand(command, result);
				}

				break;
			default:
				throw new Error('Not supported command');
		}
	}

	private handleBinaryOperator(command: BinaryOperationTag) {
		if (command === 'subtract' && this.digitsBuffer.length === 0) {
			this.digitsBuffer.unshift('-');
			return;
		}

		if (
			this.operandsBuffer.length > 0 &&
			this.digitsBuffer.length > 0 &&
			this.lastCommand !== null
		) {
			const result = Calculator.BINARY_OPERATIONS[
				this.lastCommand.command as BinaryOperationTag
			](this.operandsBuffer.at(-1) as number, this.convertDigitsBuffer());
			this.clearOperandsBuffer();

			if (!this.isNumber(result)) {
				this.hasError = true;
			}

			this.addOperand(result);
			this.logCommand(command, result);
			this.clearDigitsBuffer();
			return;
		}

		this.logCommand(command, this.addOperand(this.convertDigitsBuffer()));
		this.clearDigitsBuffer();
	}

	private handleUnaryOperator(command: UnaryOperationTag) {
		const result = Calculator.UNARY_OPERATIONS[command](this.convertDigitsBuffer());
		this.updateDigitsBuffer(result);
		this.logCommand(command, result);
	}
}
