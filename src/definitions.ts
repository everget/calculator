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

// Compile error here means two command tag groups share a string literal.
export type CommandTag =
	AreAllMutuallyExclusive<
		[DigitTag, UnaryOperationTag, BinaryOperationTag, ControlTag]
	> extends true
		? DigitTag | UnaryOperationTag | BinaryOperationTag | ControlTag
		: never;

// --- Command definitions (discriminated union) ---

interface BaseCommandDef {
	keys: string[];
	content: string;
	ariaLabel: string;
}

export interface DigitCommandDef extends BaseCommandDef {
	type: 'digit';
	id: DigitTag;
	digitValue: string;
}

export interface UnaryCommandDef extends BaseCommandDef {
	type: 'unary-operator';
	id: UnaryOperationTag;
	fn: (a: number) => number;
}

export interface BinaryCommandDef extends BaseCommandDef {
	type: 'binary-operator';
	id: BinaryOperationTag;
	fn: (a: number, b: number) => number;
}

export interface ControlCommandDef extends BaseCommandDef {
	type: 'control';
	id: ControlTag;
}

export type CommandDefinition =
	| DigitCommandDef
	| UnaryCommandDef
	| BinaryCommandDef
	| ControlCommandDef;

// IMPORTANT: Do not change the order of the entries. The order determines the button layout in the UI.
export const COMMAND_REGISTRY: CommandDefinition[] = [
	{
		type: 'binary-operator',
		id: 'log',
		keys: [],
		content: 'log',
		ariaLabel: 'Logarithm',
		fn: (a, b) => Math.log(a) / Math.log(b),
	},
	{
		type: 'unary-operator',
		id: 'ln',
		keys: [],
		content: 'ln',
		ariaLabel: 'Natural logarithm',
		fn: (a) => Math.log(a),
	},
	{
		type: 'binary-operator',
		id: 'power',
		keys: ['^'],
		content: 'x<sup>n</sup>',
		ariaLabel: 'Power',
		fn: (a, b) => a ** b,
	},
	{
		type: 'unary-operator',
		id: 'square',
		keys: [],
		content: 'x²',
		ariaLabel: 'Square',
		fn: (a) => a ** 2,
	},
	{
		type: 'unary-operator',
		id: 'sqrt',
		keys: ['#'],
		content: '√',
		ariaLabel: 'Square root',
		fn: (a) => Math.sqrt(a),
	},
	{ type: 'digit', id: 'seven', keys: ['7'], content: '7', ariaLabel: '7', digitValue: '7' },
	{ type: 'digit', id: 'eight', keys: ['8'], content: '8', ariaLabel: '8', digitValue: '8' },
	{ type: 'digit', id: 'nine', keys: ['9'], content: '9', ariaLabel: '9', digitValue: '9' },
	{
		type: 'binary-operator',
		id: 'mod',
		keys: ['&'],
		content: 'mod',
		ariaLabel: 'Modulo',
		fn: (a, b) => a % b,
	},
	{
		type: 'binary-operator',
		id: 'percent',
		keys: ['%'],
		content: '%',
		ariaLabel: 'Percent',
		fn: (a, b) => (a * b) / 100,
	},
	{ type: 'digit', id: 'four', keys: ['4'], content: '4', ariaLabel: '4', digitValue: '4' },
	{ type: 'digit', id: 'five', keys: ['5'], content: '5', ariaLabel: '5', digitValue: '5' },
	{ type: 'digit', id: 'six', keys: ['6'], content: '6', ariaLabel: '6', digitValue: '6' },
	{
		type: 'unary-operator',
		id: 'half',
		keys: [],
		content: '½',
		ariaLabel: 'Half',
		fn: (a) => a / 2,
	},
	{
		type: 'binary-operator',
		id: 'divide',
		keys: ['/'],
		content: '÷',
		ariaLabel: 'Divide',
		fn: (a, b) => a / b,
	},
	{ type: 'digit', id: 'one', keys: ['1'], content: '1', ariaLabel: '1', digitValue: '1' },
	{ type: 'digit', id: 'two', keys: ['2'], content: '2', ariaLabel: '2', digitValue: '2' },
	{ type: 'digit', id: 'three', keys: ['3'], content: '3', ariaLabel: '3', digitValue: '3' },
	{
		type: 'binary-operator',
		id: 'subtract',
		keys: ['-'],
		content: '-',
		ariaLabel: 'Subtract',
		fn: (a, b) => a - b,
	},
	{
		type: 'binary-operator',
		id: 'multiply',
		keys: ['*'],
		content: '×',
		ariaLabel: 'Multiply',
		fn: (a, b) => a * b,
	},
	{
		type: 'control',
		id: 'clear-all',
		keys: ['c', 'Backspace'],
		content: 'C',
		ariaLabel: 'Clear all',
	},
	{ type: 'digit', id: 'zero', keys: ['0'], content: '0', ariaLabel: '0', digitValue: '0' },
	{ type: 'control', id: 'decimal', keys: ['.'], content: '.', ariaLabel: 'Decimal point' },
	{
		type: 'binary-operator',
		id: 'add',
		keys: ['+'],
		content: '+',
		ariaLabel: 'Add',
		fn: (a, b) => a + b,
	},
	{ type: 'control', id: 'equals', keys: ['=', 'Enter'], content: '=', ariaLabel: 'Equals' },
];

// --- CalculatorConfig ---

export interface CalculatorConfig {
	errorMsg: string;
	digitsMap: Record<DigitTag, string>;
	unaryOps: Record<UnaryOperationTag, (a: number) => number>;
	binaryOps: Record<BinaryOperationTag, (a: number, b: number) => number>;
	validCommands: ReadonlySet<CommandTag>;
	digitTags: ReadonlySet<DigitTag>;
	unaryTags: ReadonlySet<UnaryOperationTag>;
	binaryTags: ReadonlySet<BinaryOperationTag>;
}

function buildCalculatorConfig(): CalculatorConfig {
	const digitsMap = {} as Record<DigitTag, string>;
	const unaryOps = {} as Record<UnaryOperationTag, (a: number) => number>;
	const binaryOps = {} as Record<BinaryOperationTag, (a: number, b: number) => number>;
	const validCommands = new Set<CommandTag>();

	for (const def of COMMAND_REGISTRY) {
		validCommands.add(def.id);
		if (def.type === 'digit') {
			digitsMap[def.id] = def.digitValue;
		} else if (def.type === 'unary-operator') {
			unaryOps[def.id] = def.fn;
		} else if (def.type === 'binary-operator') {
			binaryOps[def.id] = def.fn;
		}
	}

	return {
		errorMsg: 'ERROR',
		digitsMap,
		unaryOps,
		binaryOps,
		validCommands,
		digitTags: new Set(Object.keys(digitsMap)) as ReadonlySet<DigitTag>,
		unaryTags: new Set(Object.keys(unaryOps)) as ReadonlySet<UnaryOperationTag>,
		binaryTags: new Set(Object.keys(binaryOps)) as ReadonlySet<BinaryOperationTag>,
	};
}

export const CALCULATOR_CONFIG: CalculatorConfig = buildCalculatorConfig();

// --- UIButtonDefinition ---

export interface UIButtonDefinition {
	type: 'operator' | 'digit' | 'control';
	id: CommandTag;
	keys: string[];
	content: string;
	ariaLabel: string;
}

export const UI_BUTTON_DEFINITIONS: UIButtonDefinition[] = COMMAND_REGISTRY.map((def) => ({
	type:
		def.type === 'digit' ? 'digit' : def.type === 'control' ? ('control' as const) : 'operator',
	id: def.id,
	keys: def.keys,
	content: def.content,
	ariaLabel: def.ariaLabel,
}));
