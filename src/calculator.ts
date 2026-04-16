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

interface PendingOperation {
	operator: BinaryOperationTag;
	firstOperand: number;
}

export class NumberInput {
	static readonly MAX_DIGITS = 15;

	constructor(
		private readonly _value: string = '',
		private readonly _hasDecimal: boolean = false
	) {}

	static fromNumber(value: number): NumberInput {
		const str = String(value);
		return new NumberInput(str, str.includes('.'));
	}

	private _digitCount(): number {
		return this._value.replace(/^-|\./g, '').length;
	}

	value(): string {
		return this._value;
	}

	hasDecimal(): boolean {
		return this._hasDecimal;
	}

	addDigit(digit: string): NumberInput {
		if (this._digitCount() >= NumberInput.MAX_DIGITS) return this;

		if (this._value === '0') {
			return new NumberInput(digit, this._hasDecimal);
		}
		if (this._value === '-0') {
			return new NumberInput('-' + digit, this._hasDecimal);
		}
		return new NumberInput(this._value + digit, this._hasDecimal);
	}

	addDecimal(): NumberInput {
		if (this._hasDecimal) return this;
		return new NumberInput(this._value + '.', true);
	}

	addNegative(): NumberInput {
		if (this._value.startsWith('-')) return this;
		return new NumberInput('-' + this._value, this._hasDecimal);
	}

	toNumber(): number {
		return this._value === '' || this._value === '-' ? 0 : Number(this._value);
	}

	toString(): string {
		return this._value === '' || this._value === '-' ? '0' : this._value;
	}

	isEmpty(): boolean {
		return this._value === '';
	}
}

const ERROR_MESSAGE = 'ERROR';

const VALID_COMMANDS: readonly CommandTag[] = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'zero',
	'half',
	'square',
	'sqrt',
	'ln',
	'add',
	'subtract',
	'multiply',
	'divide',
	'power',
	'mod',
	'percent',
	'log',
	'clear-all',
	'equals',
	'decimal',
];

const DIGITS_MAP: Record<DigitTag, string> = {
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

const UNARY_OPERATIONS: Record<UnaryOperationTag, (a: number) => number> = {
	half: (a: number) => a / 2,
	square: (a: number) => a ** 2,
	sqrt: (a: number) => Math.sqrt(a),
	ln: (a: number) => Math.log(a),
};

const BINARY_OPERATIONS: Record<BinaryOperationTag, (a: number, b: number) => number> = {
	add: (a: number, b: number) => a + b,
	subtract: (a: number, b: number) => a - b,
	multiply: (a: number, b: number) => a * b,
	divide: (a: number, b: number) => a / b,
	power: (a: number, b: number) => a ** b,
	mod: (a: number, b: number) => a % b,
	percent: (a: number, b: number) => (a * b) / 100,
	log: (a: number, b: number) => Math.log(a) / Math.log(b),
};

export type CalculatorState =
	| { type: 'idle' }
	| { type: 'entering-number'; input: NumberInput; pending: PendingOperation | null }
	| { type: 'awaiting-operand'; operator: BinaryOperationTag; firstOperand: number }
	| { type: 'result'; value: number }
	| { type: 'error' };

export interface ICalculator {
	getDisplayValue(): string;
	handleCommand(command: CommandTag): void;
}

export class Calculator implements ICalculator {
	#state: CalculatorState = { type: 'idle' };

	constructor() {}

	getDisplayValue(): string {
		switch (this.#state.type) {
			case 'idle':
				return '0';
			case 'entering-number': {
				if (this.#state.input.isEmpty()) return '0';
				const value = this.#state.input.toNumber();
				return this.isFiniteNumber(value) ? this.#state.input.toString() : ERROR_MESSAGE;
			}
			case 'awaiting-operand':
				return String(this.#state.firstOperand);
			case 'result':
				return String(this.#state.value);
			case 'error':
				return ERROR_MESSAGE;
		}
	}

	handleCommand(command: CommandTag): void {
		if (!Calculator.isValidCommand(command)) {
			console.error('Invalid command:', command);
			return;
		}

		try {
			this.#state = this.transition(this.#state, command);
		} catch (error) {
			console.error('Calculator error:', error);
			this.#state = { type: 'error' };
		}
	}

	getState(): CalculatorState {
		const state = structuredClone(this.#state);
		if (state.type === 'entering-number' && this.#state.type === 'entering-number') {
			state.input = new NumberInput(
				this.#state.input.value(),
				this.#state.input.hasDecimal()
			);
		}
		return state;
	}

	setState(state: CalculatorState): void {
		this.#state = structuredClone(state);
		if (this.#state.type === 'entering-number' && state.type === 'entering-number') {
			// Rehydrate using getters from the original state to avoid type assertions
			this.#state.input = new NumberInput(state.input.value(), state.input.hasDecimal());
		}
	}

	// --- State transitions ---

	private transition(state: CalculatorState, command: CommandTag): CalculatorState {
		if (command === 'clear-all') {
			return { type: 'idle' };
		}

		switch (state.type) {
			case 'idle':
				return this.transitionFromIdle(command);
			case 'entering-number':
				return this.transitionFromEnteringNumber(state, command);
			case 'awaiting-operand':
				return this.transitionFromAwaitingOperand(state, command);
			case 'result':
				return this.transitionFromResult(state, command);
			case 'error':
				return state; // Only clear-all can exit error state (handled above)
		}
	}

	private transitionFromIdle(command: CommandTag): CalculatorState {
		if (this.isDigit(command)) {
			return {
				type: 'entering-number',
				input: new NumberInput().addDigit(DIGITS_MAP[command]),
				pending: null,
			};
		}
		if (this.isDecimal(command)) {
			return {
				type: 'entering-number',
				input: new NumberInput().addDecimal(),
				pending: null,
			};
		}
		if (command === 'subtract') {
			return {
				type: 'entering-number',
				input: new NumberInput().addNegative(),
				pending: null,
			};
		}
		if (this.isBinaryOperator(command)) {
			return { type: 'awaiting-operand', operator: command, firstOperand: 0 };
		}
		if (this.isUnaryOperator(command)) {
			const result = UNARY_OPERATIONS[command](0);
			if (!this.isFiniteNumber(result)) return { type: 'error' };
			return { type: 'result', value: result };
		}
		return { type: 'idle' };
	}

	private transitionFromEnteringNumber(
		state: Extract<CalculatorState, { type: 'entering-number' }>,
		command: CommandTag
	): CalculatorState {
		if (this.isDigit(command)) {
			return { ...state, input: state.input.addDigit(DIGITS_MAP[command]) };
		}
		if (this.isDecimal(command)) {
			return { ...state, input: state.input.addDecimal() };
		}
		if (command === 'subtract' && state.input.isEmpty()) {
			return { ...state, input: state.input.addNegative() };
		}
		if (this.isBinaryOperator(command)) {
			const currentValue = state.input.toNumber();

			if (state.pending) {
				const result = BINARY_OPERATIONS[state.pending.operator](
					state.pending.firstOperand,
					currentValue
				);
				if (!this.isFiniteNumber(result)) return { type: 'error' };
				return { type: 'awaiting-operand', operator: command, firstOperand: result };
			}

			return { type: 'awaiting-operand', operator: command, firstOperand: currentValue };
		}
		if (command === 'equals') {
			if (state.pending) {
				const currentValue = state.input.toNumber();
				const result = BINARY_OPERATIONS[state.pending.operator](
					state.pending.firstOperand,
					currentValue
				);
				if (!this.isFiniteNumber(result)) return { type: 'error' };
				return { type: 'result', value: result };
			}
			return state;
		}
		if (this.isUnaryOperator(command)) {
			const currentValue = state.input.toNumber();
			const result = UNARY_OPERATIONS[command](currentValue);
			if (!this.isFiniteNumber(result)) return { type: 'error' };
			return { ...state, input: NumberInput.fromNumber(result) };
		}
		return state;
	}

	private transitionFromAwaitingOperand(
		state: Extract<CalculatorState, { type: 'awaiting-operand' }>,
		command: CommandTag
	): CalculatorState {
		const pending: PendingOperation = {
			operator: state.operator,
			firstOperand: state.firstOperand,
		};

		if (this.isDigit(command)) {
			return {
				type: 'entering-number',
				input: new NumberInput().addDigit(DIGITS_MAP[command]),
				pending,
			};
		}
		if (this.isDecimal(command)) {
			return { type: 'entering-number', input: new NumberInput().addDecimal(), pending };
		}
		if (command === 'subtract') {
			return { type: 'entering-number', input: new NumberInput().addNegative(), pending };
		}
		if (this.isBinaryOperator(command)) {
			return { ...state, operator: command };
		}
		if (this.isUnaryOperator(command)) {
			const result = UNARY_OPERATIONS[command](state.firstOperand);
			if (!this.isFiniteNumber(result)) return { type: 'error' };
			return { ...state, firstOperand: result };
		}
		if (command === 'equals') {
			const result = BINARY_OPERATIONS[state.operator](
				state.firstOperand,
				state.firstOperand
			);
			if (!this.isFiniteNumber(result)) return { type: 'error' };
			return { type: 'result', value: result };
		}
		return state;
	}

	private transitionFromResult(
		state: Extract<CalculatorState, { type: 'result' }>,
		command: CommandTag
	): CalculatorState {
		if (this.isDigit(command)) {
			return {
				type: 'entering-number',
				input: new NumberInput().addDigit(DIGITS_MAP[command]),
				pending: null,
			};
		}
		if (this.isDecimal(command)) {
			return {
				type: 'entering-number',
				input: new NumberInput().addDecimal(),
				pending: null,
			};
		}
		if (this.isBinaryOperator(command)) {
			return { type: 'awaiting-operand', operator: command, firstOperand: state.value };
		}
		if (this.isUnaryOperator(command)) {
			const result = UNARY_OPERATIONS[command](state.value);
			if (!this.isFiniteNumber(result)) return { type: 'error' };
			return { type: 'result', value: result };
		}
		return state;
	}

	// --- Utilities ---

	private isFiniteNumber(value: unknown): boolean {
		return typeof value === 'number' && Number.isFinite(value);
	}

	private static isValidCommand(command: unknown): command is CommandTag {
		return typeof command === 'string' && VALID_COMMANDS.includes(command as CommandTag);
	}

	private isUnaryOperator(command: CommandTag): command is UnaryOperationTag {
		return Object.keys(UNARY_OPERATIONS).includes(command);
	}

	private isBinaryOperator(command: CommandTag): command is BinaryOperationTag {
		return Object.keys(BINARY_OPERATIONS).includes(command);
	}

	private isDigit(command: CommandTag): command is DigitTag {
		return Object.keys(DIGITS_MAP).includes(command);
	}

	private isDecimal(command: CommandTag): command is 'decimal' {
		return command === 'decimal';
	}
}
