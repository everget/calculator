export type DigitTag =
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

export type UnaryOperationTag = 'half' | 'square' | 'sqrt' | 'ln';

export type BinaryOperationTag =
	| 'add'
	| 'subtract'
	| 'multiply'
	| 'divide'
	| 'power'
	| 'mod'
	| 'percent'
	| 'log';

type AreMutuallyExclusive<T extends string, U extends string> =
	Exclude<T, U> extends T ? (Exclude<U, T> extends U ? true : false) : false;

type AreAllMutuallyExclusive<T extends readonly unknown[]> = T extends [
	infer A extends string,
	infer B extends string,
	...infer Rest,
]
	? AreMutuallyExclusive<A, B> extends true
		? AreAllMutuallyExclusive<[B, ...Rest]>
		: false
	: true;

export type ControlTag = 'clear-all' | 'equals' | 'decimal';

export type CommandTag =
	AreAllMutuallyExclusive<
		[DigitTag, UnaryOperationTag, BinaryOperationTag, ControlTag]
	> extends true
		? DigitTag | UnaryOperationTag | BinaryOperationTag | ControlTag
		: never;

export interface CommandDefinition {
	id: CommandTag;
	type: 'digit' | 'operator' | 'control';
	keys: string[];
	content: string;
	ariaLabel: string;
	digitValue?: string;
	unaryFn?: (a: number) => number;
	binaryFn?: (a: number, b: number) => number;
}

// IMPORTANT: Do not change the order of the buttons. The order in this array determines the layout in the UI.
export const COMMAND_REGISTRY: CommandDefinition[] = [
	{
		id: 'log',
		type: 'operator',
		keys: [],
		content: 'log',
		ariaLabel: 'Logarithm',
		binaryFn: (a, b) => Math.log(a) / Math.log(b),
	},
	{
		id: 'ln',
		type: 'operator',
		keys: [],
		content: 'ln',
		ariaLabel: 'Natural logarithm',
		unaryFn: (a) => Math.log(a),
	},
	{
		id: 'power',
		type: 'operator',
		keys: ['^'],
		content: 'x<sup>n</sup>',
		ariaLabel: 'Power',
		binaryFn: (a, b) => a ** b,
	},
	{
		id: 'square',
		type: 'operator',
		keys: [],
		content: 'x²',
		ariaLabel: 'Square',
		unaryFn: (a) => a ** 2,
	},
	{
		id: 'sqrt',
		type: 'operator',
		keys: ['#'],
		content: '√',
		ariaLabel: 'Square root',
		unaryFn: (a) => Math.sqrt(a),
	},
	{
		id: 'seven',
		type: 'digit',
		keys: ['7'],
		content: '7',
		ariaLabel: '7',
		digitValue: '7',
	},
	{
		id: 'eight',
		type: 'digit',
		keys: ['8'],
		content: '8',
		ariaLabel: '8',
		digitValue: '8',
	},
	{
		id: 'nine',
		type: 'digit',
		keys: ['9'],
		content: '9',
		ariaLabel: '9',
		digitValue: '9',
	},
	{
		id: 'mod',
		type: 'operator',
		keys: ['&'],
		content: 'mod',
		ariaLabel: 'Modulo',
		binaryFn: (a, b) => a % b,
	},
	{
		id: 'percent',
		type: 'operator',
		keys: ['%'],
		content: '%',
		ariaLabel: 'Percent',
		binaryFn: (a, b) => (a * b) / 100,
	},
	{
		id: 'four',
		type: 'digit',
		keys: ['4'],
		content: '4',
		ariaLabel: '4',
		digitValue: '4',
	},
	{
		id: 'five',
		type: 'digit',
		keys: ['5'],
		content: '5',
		ariaLabel: '5',
		digitValue: '5',
	},
	{
		id: 'six',
		type: 'digit',
		keys: ['6'],
		content: '6',
		ariaLabel: '6',
		digitValue: '6',
	},
	{
		id: 'half',
		type: 'operator',
		keys: [],
		content: '½',
		ariaLabel: 'Half',
		unaryFn: (a) => a / 2,
	},
	{
		id: 'divide',
		type: 'operator',
		keys: ['/'],
		content: '÷',
		ariaLabel: 'Divide',
		binaryFn: (a, b) => a / b,
	},
	{
		id: 'one',
		type: 'digit',
		keys: ['1'],
		content: '1',
		ariaLabel: '1',
		digitValue: '1',
	},
	{
		id: 'two',
		type: 'digit',
		keys: ['2'],
		content: '2',
		ariaLabel: '2',
		digitValue: '2',
	},
	{
		id: 'three',
		type: 'digit',
		keys: ['3'],
		content: '3',
		ariaLabel: '3',
		digitValue: '3',
	},
	{
		id: 'subtract',
		type: 'operator',
		keys: ['-'],
		content: '-',
		ariaLabel: 'Subtract',
		binaryFn: (a, b) => a - b,
	},
	{
		id: 'multiply',
		type: 'operator',
		keys: ['*'],
		content: '×',
		ariaLabel: 'Multiply',
		binaryFn: (a, b) => a * b,
	},
	{
		id: 'clear-all',
		type: 'control',
		keys: ['c', 'Backspace'],
		content: 'C',
		ariaLabel: 'Clear all',
	},
	{
		id: 'zero',
		type: 'digit',
		keys: ['0'],
		content: '0',
		ariaLabel: '0',
		digitValue: '0',
	},
	{
		id: 'decimal',
		type: 'control',
		keys: ['.'],
		content: '.',
		ariaLabel: 'Decimal point',
	},
	{
		id: 'add',
		type: 'operator',
		keys: ['+'],
		content: '+',
		ariaLabel: 'Add',
		binaryFn: (a, b) => a + b,
	},
	{
		id: 'equals',
		type: 'control',
		keys: ['=', 'Enter'],
		content: '=',
		ariaLabel: 'Equals',
	},
];

export interface CalculatorConfig {
	errorMsg: string;
	digitsMap: Record<DigitTag, string>;
	unaryOps: Record<UnaryOperationTag, (a: number) => number>;
	binaryOps: Record<BinaryOperationTag, (a: number, b: number) => number>;
	validCommands: CommandTag[];
}

export function getCalculatorConfig(): CalculatorConfig {
	const digitsMap: Partial<Record<DigitTag, string>> = {};
	const unaryOps: Partial<Record<UnaryOperationTag, (a: number) => number>> = {};
	const binaryOps: Partial<Record<BinaryOperationTag, (a: number, b: number) => number>> = {};
	const validCommands: CommandTag[] = [];

	COMMAND_REGISTRY.forEach((def) => {
		validCommands.push(def.id);
		if (def.type === 'digit' && def.digitValue) {
			digitsMap[def.id as DigitTag] = def.digitValue;
		} else if (def.type === 'operator') {
			if (def.unaryFn) {
				unaryOps[def.id as UnaryOperationTag] = def.unaryFn;
			} else if (def.binaryFn) {
				binaryOps[def.id as BinaryOperationTag] = def.binaryFn;
			}
		}
	});

	return {
		errorMsg: 'ERROR',
		digitsMap: digitsMap as Record<DigitTag, string>,
		unaryOps: unaryOps as Record<UnaryOperationTag, (a: number) => number>,
		binaryOps: binaryOps as Record<BinaryOperationTag, (a: number, b: number) => number>,
		validCommands,
	};
}

export interface UIButtonDefinition {
	type: 'operator' | 'digit' | 'control';
	id: CommandTag;
	keys: string[];
	content: string;
	ariaLabel: string;
}

export function getUIButtonDefinitions(): UIButtonDefinition[] {
	return COMMAND_REGISTRY.map((def) => ({
		type: def.type,
		id: def.id,
		keys: def.keys,
		content: def.content,
		ariaLabel: def.ariaLabel,
	}));
}
