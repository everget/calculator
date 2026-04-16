import type { CommandTag, ICalculator } from './calculator';

interface ButtonData {
	type: 'operator' | 'digit' | 'control';
	id: CommandTag;
	keys: string[];
	content: string;
	ariaLabel: string;
}

interface ShortcutData {
	key: string;
	description: string;
}

export class CalculatorUI {
	static KEYBOARD_SHORTCUTS = {
		CLEAR: 'c',
		ENTER: 'Enter',
		BACKSPACE: 'Backspace',
		DECIMAL: '.',
		EQUALS: '=',
		ADD: '+',
		SUBTRACT: '-',
		MULTIPLY: '*',
		DIVIDE: '/',
		PERCENT: '%',
		MODULO: '&',
		POWER: '^',
		SQUARE_ROOT: '#',
		ZERO: '0',
		ONE: '1',
		TWO: '2',
		THREE: '3',
		FOUR: '4',
		FIVE: '5',
		SIX: '6',
		SEVEN: '7',
		EIGHT: '8',
		NINE: '9',
	};

	static KEYBOARD_SHORTCUTS_DATA: ShortcutData[] = [
		{
			key: `${CalculatorUI.KEYBOARD_SHORTCUTS.ZERO}-${CalculatorUI.KEYBOARD_SHORTCUTS.NINE}`,
			description: 'Digits',
		},
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.DECIMAL, description: 'Decimal' },
		{
			key: `${CalculatorUI.KEYBOARD_SHORTCUTS.ADD} ${CalculatorUI.KEYBOARD_SHORTCUTS.SUBTRACT} ${CalculatorUI.KEYBOARD_SHORTCUTS.MULTIPLY} ${CalculatorUI.KEYBOARD_SHORTCUTS.DIVIDE}`,
			description: 'Basic operations',
		},
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.PERCENT, description: 'Percent' },
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.MODULO, description: 'Modulo' },
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.POWER, description: 'Power' },
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.SQUARE_ROOT, description: 'Square root' },
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.EQUALS, description: 'Equals' },
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.ENTER, description: 'Equals' },
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.CLEAR, description: 'Clear' },
		{ key: CalculatorUI.KEYBOARD_SHORTCUTS.BACKSPACE, description: 'Clear' },
	];

	// WARNING: Do not change the order of the buttons
	static BUTTONS: ButtonData[] = [
		{ type: 'operator', id: 'log', keys: [], content: 'log', ariaLabel: 'Logarithm' },
		{ type: 'operator', id: 'ln', keys: [], content: 'ln', ariaLabel: 'Natural logarithm' },
		{
			type: 'operator',
			id: 'power',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.POWER],
			content: 'x<sup>n</sup>',
			ariaLabel: 'Power',
		},
		{ type: 'operator', id: 'square', keys: [], content: 'x²', ariaLabel: 'Square' },
		{
			type: 'operator',
			id: 'sqrt',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SQUARE_ROOT],
			content: '√',
			ariaLabel: 'Square root',
		},
		{
			type: 'digit',
			id: 'seven',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SEVEN],
			content: '7',
			ariaLabel: '7',
		},
		{
			type: 'digit',
			id: 'eight',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.EIGHT],
			content: '8',
			ariaLabel: '8',
		},
		{
			type: 'digit',
			id: 'nine',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.NINE],
			content: '9',
			ariaLabel: '9',
		},
		{
			type: 'operator',
			id: 'mod',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.MODULO],
			content: 'mod',
			ariaLabel: 'Modulo',
		},
		{
			type: 'operator',
			id: 'percent',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.PERCENT],
			content: '%',
			ariaLabel: 'Percent',
		},
		{
			type: 'digit',
			id: 'four',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.FOUR],
			content: '4',
			ariaLabel: '4',
		},
		{
			type: 'digit',
			id: 'five',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.FIVE],
			content: '5',
			ariaLabel: '5',
		},
		{
			type: 'digit',
			id: 'six',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SIX],
			content: '6',
			ariaLabel: '6',
		},
		{ type: 'operator', id: 'half', keys: [], content: '½', ariaLabel: 'Half' },
		{
			type: 'operator',
			id: 'divide',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.DIVIDE],
			content: '÷',
			ariaLabel: 'Divide',
		},
		{
			type: 'digit',
			id: 'one',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.ONE],
			content: '1',
			ariaLabel: '1',
		},
		{
			type: 'digit',
			id: 'two',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.TWO],
			content: '2',
			ariaLabel: '2',
		},
		{
			type: 'digit',
			id: 'three',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.THREE],
			content: '3',
			ariaLabel: '3',
		},
		{
			type: 'operator',
			id: 'subtract',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SUBTRACT],
			content: '-',
			ariaLabel: 'Subtract',
		},
		{
			type: 'operator',
			id: 'multiply',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.MULTIPLY],
			content: '×',
			ariaLabel: 'Multiply',
		},
		{
			type: 'control',
			id: 'clear-all',
			keys: [
				CalculatorUI.KEYBOARD_SHORTCUTS.CLEAR,
				CalculatorUI.KEYBOARD_SHORTCUTS.BACKSPACE,
			],
			content: 'C',
			ariaLabel: 'Clear all',
		},
		{
			type: 'digit',
			id: 'zero',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.ZERO],
			content: '0',
			ariaLabel: '0',
		},
		{
			type: 'control',
			id: 'decimal',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.DECIMAL],
			content: '.',
			ariaLabel: 'Decimal point',
		},
		{
			type: 'operator',
			id: 'add',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.ADD],
			content: '+',
			ariaLabel: 'Add',
		},
		{
			type: 'control',
			id: 'equals',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.EQUALS, CalculatorUI.KEYBOARD_SHORTCUTS.ENTER],
			content: '=',
			ariaLabel: 'Equals',
		},
	];

	static CONTENT_TO_BUTTON_ID_MAP: Record<string, CommandTag> = {
		...CalculatorUI.BUTTONS.reduce(
			(acc, button) => {
				acc[button.content] = button.id;
				return acc;
			},
			{} as Record<string, CommandTag>
		),
	};

	static KEY_TO_BUTTON_ID_MAP: Record<string, CommandTag> = {
		...CalculatorUI.BUTTONS.reduce(
			(acc, button) => {
				if (button.keys.length > 0) {
					button.keys.forEach((key) => {
						acc[key] = button.id;
					});
					return acc;
				}
				return acc;
			},
			{} as Record<string, CommandTag>
		),
	} as const;

	private calculator: ICalculator;
	private root: HTMLElement | null = null;
	private displayElement: HTMLInputElement | null = null;
	private buttonElements = new Map<CommandTag, HTMLButtonElement>();
	private cleanup: (() => void)[] = [];

	constructor(calculator: ICalculator) {
		this.calculator = calculator;
	}

	mount(root: HTMLElement): void {
		this.root = root;
		this.render();
		this.attachEventListeners();
	}

	unmount(): void {
		this.cleanup.forEach((fn) => fn());
		this.cleanup = [];
		this.buttonElements.clear();
		this.displayElement = null;

		if (this.root) {
			this.root.innerHTML = '';
			this.root = null;
		}
	}

	private render(): void {
		if (!this.root) return;

		const container = document.createElement('div');
		container.className = 'calculator-container';

		const calculator = document.createElement('div');
		calculator.className = 'calculator';

		// Display
		const display = document.createElement('input');
		display.className = 'calculator-display';
		display.type = 'text';
		display.value = '0';
		display.readOnly = true;
		display.dataset.testid = 'calculator-display';
		display.setAttribute('aria-label', 'Calculator display');
		display.setAttribute('aria-live', 'polite');
		display.setAttribute('aria-atomic', 'true');
		this.displayElement = display;

		calculator.appendChild(display);
		calculator.appendChild(this.createButtonsElement());
		calculator.appendChild(this.createShortcutsElement());

		container.appendChild(calculator);
		this.root.appendChild(container);
	}

	private createButtonsElement(): HTMLElement {
		const container = document.createElement('div');
		container.className = 'calculator-buttons';

		CalculatorUI.BUTTONS.forEach((button) => {
			const btn = document.createElement('button');
			btn.className = button.type;

			if (button.id === 'clear-all') btn.classList.add('clear');
			if (button.id === 'equals') btn.classList.add('equals');

			btn.dataset.testid = `button-${button.id}`;
			btn.setAttribute('aria-label', button.ariaLabel);

			if (button.keys.length > 0) {
				btn.title = `Keyboard: ${button.keys.join(', ')}`;
			}

			// Use innerHTML only for the power button which contains <sup>
			if (button.content.includes('<')) {
				btn.innerHTML = button.content;
			} else {
				btn.textContent = button.content;
			}

			this.buttonElements.set(button.id, btn);
			container.appendChild(btn);
		});

		return container;
	}

	private createShortcutsElement(): HTMLElement {
		const panel = document.createElement('div');
		panel.className = 'shortcuts-panel';

		const heading = document.createElement('h3');
		heading.textContent = 'Keyboard Shortcuts';
		panel.appendChild(heading);

		const list = document.createElement('div');
		list.className = 'shortcuts-list';

		CalculatorUI.KEYBOARD_SHORTCUTS_DATA.forEach(({ key, description }) => {
			const item = document.createElement('div');
			item.className = 'shortcut-item';

			const keySpan = document.createElement('span');
			keySpan.className = 'shortcut-item__key';
			keySpan.textContent = key;

			const descSpan = document.createElement('span');
			descSpan.className = 'shortcut-item__description';
			descSpan.textContent = description;

			item.appendChild(keySpan);
			item.appendChild(descSpan);
			list.appendChild(item);
		});

		panel.appendChild(list);
		return panel;
	}

	private attachEventListeners(): void {
		if (!this.root) return;

		// Keyboard listeners
		const handleKeyDown = this.handleKeyDown.bind(this);
		const handleKeyUp = this.handleKeyUp.bind(this);

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		this.cleanup.push(
			() => document.removeEventListener('keydown', handleKeyDown),
			() => document.removeEventListener('keyup', handleKeyUp)
		);

		// Delegated button listeners
		const buttonsContainer = this.root.querySelector('.calculator-buttons');
		if (!buttonsContainer) return;

		const handleClick = (e: Event) => {
			const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
				'button[data-testid^="button-"]'
			);
			if (button) this.handleButtonClick(button);
		};

		const handleMouseDown = (e: Event) => {
			const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
				'button[data-testid^="button-"]'
			);
			if (button) button.classList.add('button-pressed');
		};

		const handlePointerUp = (e: Event) => {
			const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
				'button[data-testid^="button-"]'
			);
			if (button) button.classList.remove('button-pressed');
		};

		buttonsContainer.addEventListener('click', handleClick);
		buttonsContainer.addEventListener('mousedown', handleMouseDown);
		buttonsContainer.addEventListener('mouseup', handlePointerUp);
		buttonsContainer.addEventListener('mouseleave', handlePointerUp);

		this.cleanup.push(
			() => buttonsContainer.removeEventListener('click', handleClick),
			() => buttonsContainer.removeEventListener('mousedown', handleMouseDown),
			() => buttonsContainer.removeEventListener('mouseup', handlePointerUp),
			() => buttonsContainer.removeEventListener('mouseleave', handlePointerUp)
		);
	}

	private handleButtonClick(button: HTMLButtonElement): void {
		const testId = button.dataset.testid;
		if (!testId) {
			console.error('Button has no data-testid attribute');
			return;
		}

		const command = testId.replace('button-', '');
		if (command) {
			this.calculator.handleCommand(command as CommandTag);
			this.updateDisplay();
		}
	}

	private updateDisplay(): void {
		if (!this.displayElement) return;
		this.displayElement.value = this.calculator.getDisplayValue();
	}

	private handleKeyDown(event: KeyboardEvent) {
		const key = event.key;
		this.pressButton(key);

		// Prevent default behavior for calculator keys
		if (Object.keys(CalculatorUI.KEY_TO_BUTTON_ID_MAP).includes(key)) {
			event.preventDefault();
		}

		// Prevent default behavior for these keys ('%', '&', '^', '#') to avoid unwanted scrolling or other actions
		if (
			(event.ctrlKey && (key === '3' || (event.shiftKey && key === '3'))) ||
			(event.ctrlKey && (key === '5' || (event.shiftKey && key === '5'))) ||
			(event.ctrlKey && (key === '6' || (event.shiftKey && key === '6'))) ||
			(event.ctrlKey && (key === '7' || (event.shiftKey && key === '7')))
		) {
			event.preventDefault();
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		const key = event.key;
		this.releaseButton(key);
	}

	private pressButton(key: string) {
		const commandTag = CalculatorUI.KEY_TO_BUTTON_ID_MAP[key];
		if (commandTag) {
			const button = this.buttonElements.get(commandTag);
			if (button) {
				button.classList.add('button-pressed');
				button.click();
			}
		}
	}

	private releaseButton(key: string) {
		const commandTag = CalculatorUI.KEY_TO_BUTTON_ID_MAP[key];
		if (commandTag) {
			const button = this.buttonElements.get(commandTag);
			if (button) {
				button.classList.remove('button-pressed');
			}
		}
	}
}
