import {
	type BinaryOperationTag,
	type CalculatorConfig,
	type CommandTag,
	type DigitTag,
	type UnaryOperationTag,
} from './definitions';

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
	private readonly config: CalculatorConfig;

	constructor(config: CalculatorConfig) {
		this.config = config;
	}

	getDisplayValue(): string {
		switch (this.#state.type) {
			case 'idle':
				return '0';
			case 'entering-number': {
				if (this.#state.input.isEmpty()) return '0';
				const value = this.#state.input.toNumber();
				return this.isFiniteNumber(value)
					? this.#state.input.toString()
					: this.config.errorMsg;
			}
			case 'awaiting-operand':
				return String(this.#state.firstOperand);
			case 'result':
				return String(this.#state.value);
			case 'error':
				return this.config.errorMsg;
		}
	}

	handleCommand(command: CommandTag): void {
		if (!this.isValidCommand(command)) {
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
				input: new NumberInput().addDigit(this.config.digitsMap[command]),
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
			const result = this.config.unaryOps[command](0);
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
			return { ...state, input: state.input.addDigit(this.config.digitsMap[command]) };
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
				const result = this.config.binaryOps[state.pending.operator](
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
				const result = this.config.binaryOps[state.pending.operator](
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
			const result = this.config.unaryOps[command](currentValue);
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
				input: new NumberInput().addDigit(this.config.digitsMap[command]),
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
			const result = this.config.unaryOps[command](state.firstOperand);
			if (!this.isFiniteNumber(result)) return { type: 'error' };
			return { ...state, firstOperand: result };
		}
		if (command === 'equals') {
			const result = this.config.binaryOps[state.operator](
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
				input: new NumberInput().addDigit(this.config.digitsMap[command]),
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
			const result = this.config.unaryOps[command](state.value);
			if (!this.isFiniteNumber(result)) return { type: 'error' };
			return { type: 'result', value: result };
		}
		return state;
	}

	// --- Utilities ---

	private isFiniteNumber(value: unknown): boolean {
		return typeof value === 'number' && Number.isFinite(value);
	}

	private isValidCommand(command: unknown): command is CommandTag {
		return (
			typeof command === 'string' &&
			this.config.validCommands.includes(command as unknown as CommandTag)
		);
	}

	private isUnaryOperator(command: CommandTag): command is UnaryOperationTag {
		return Object.keys(this.config.unaryOps).includes(command);
	}

	private isBinaryOperator(command: CommandTag): command is BinaryOperationTag {
		return Object.keys(this.config.binaryOps).includes(command);
	}

	private isDigit(command: CommandTag): command is DigitTag {
		return Object.keys(this.config.digitsMap).includes(command);
	}

	private isDecimal(command: CommandTag): command is 'decimal' {
		return command === 'decimal';
	}
}
