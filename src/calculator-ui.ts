import type { CommandTag, ICalculator } from './calculator';

interface ButtonData {
	type: 'operator' | 'digit' | 'control';
	id: CommandTag;
	keys: string[];
	content: string;
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

	static BUTTONS: ButtonData[] = [
		{ type: 'digit', id: 'zero', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.ZERO], content: '0' },
		{ type: 'digit', id: 'one', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.ONE], content: '1' },
		{ type: 'digit', id: 'two', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.TWO], content: '2' },
		{ type: 'digit', id: 'three', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.THREE], content: '3' },
		{ type: 'digit', id: 'four', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.FOUR], content: '4' },
		{ type: 'digit', id: 'five', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.FIVE], content: '5' },
		{ type: 'digit', id: 'six', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SIX], content: '6' },
		{ type: 'digit', id: 'seven', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SEVEN], content: '7' },
		{ type: 'digit', id: 'eight', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.EIGHT], content: '8' },
		{ type: 'digit', id: 'nine', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.NINE], content: '9' },
		{ type: 'operator', id: 'add', keys: [CalculatorUI.KEYBOARD_SHORTCUTS.ADD], content: '+' },
		{
			type: 'operator',
			id: 'divide',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.DIVIDE],
			content: '÷',
		},
		{ type: 'operator', id: 'half', keys: [], content: '½' },
		{
			type: 'operator',
			id: 'percent',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.PERCENT],
			content: '%',
		},
		{
			type: 'operator',
			id: 'power',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.POWER],
			content: 'x<sup>n</sup>',
		},
		{ type: 'operator', id: 'ln', keys: [], content: 'ln' },
		{ type: 'operator', id: 'log', keys: [], content: 'log' },
		{
			type: 'operator',
			id: 'mod',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.MODULO],
			content: 'mod',
		},
		{
			type: 'operator',
			id: 'multiply',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.MULTIPLY],
			content: '×',
		},
		{ type: 'operator', id: 'square', keys: [], content: 'x²' },
		{
			type: 'operator',
			id: 'sqrt',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SQUARE_ROOT],
			content: '√',
		},
		{
			type: 'operator',
			id: 'subtract',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.SUBTRACT],
			content: '-',
		},
		{
			type: 'control',
			id: 'clear-all',
			keys: [
				CalculatorUI.KEYBOARD_SHORTCUTS.CLEAR,
				CalculatorUI.KEYBOARD_SHORTCUTS.BACKSPACE,
			],
			content: 'C',
		},
		{
			type: 'control',
			id: 'decimal',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.DECIMAL],
			content: '.',
		},
		{
			type: 'control',
			id: 'equals',
			keys: [CalculatorUI.KEYBOARD_SHORTCUTS.EQUALS, CalculatorUI.KEYBOARD_SHORTCUTS.ENTER],
			content: '=',
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

	constructor(root: HTMLElement, calculator: ICalculator) {
		this.calculator = calculator;
		this.render(root);
		this.addEventListeners();
	}

	private render(root: HTMLElement) {
		root.innerHTML = `
            <div class="calculator-container">
                <div class="calculator">
                    <input
                        class="calculator-display"
                        type="text"
                        value="0"
                        readonly
                        data-js-id="calculator-display"
                    />
                    ${this.renderButtons(CalculatorUI.BUTTONS)}
                    ${this.renderShortcuts(CalculatorUI.KEYBOARD_SHORTCUTS_DATA)}
                </div>
			</div>
        `;
	}

	private renderButtons(buttons: ButtonData[]): string {
		return ''.concat(
			...[
				'<div class="calculator-buttons">',
				buttons
					.map((button) => {
						return `<button class="${button.type} ${button.id === 'clear-all' ? 'clear' : ''} ${button.id === 'equals' ? 'equals' : ''}" data-js-id="${button.id}">${button.content}</button>`;
					})
					.join('\n'),
				'</div>',
			]
		);
	}

	private renderShortcuts(shortcuts: ShortcutData[]): string {
		return ''.concat(
			...[
				'<div class="shortcuts-panel">',
				'<h3>Keyboard Shortcuts</h3>',
				'<div class="shortcuts-list">',
				shortcuts
					.map(({ key, description }) => {
						return `
                            <div class="shortcut-item">
                                <span class="shortcut-item__key">${key}</span>
                                <span class="shortcut-item__description">${description}</span>
                            </div>
                    `;
					})
					.join('\n'),
				'</div>',
				'</div>',
			]
		);
	}

	private addEventListeners(): void {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));

		const buttons = document.querySelectorAll<HTMLButtonElement>(
			'.calculator button[data-js-id]'
		);
		buttons.forEach(this.bindButtonEvents.bind(this));
	}

	private bindButtonEvents(button: HTMLButtonElement): void {
		button.onclick = () => this.handleButtonClick(button);
		button.onmousedown = () => this.addButtonPressedClass(button);
		button.onmouseup = () => this.removeButtonPressedClass(button);
		button.onmouseleave = () => this.removeButtonPressedClass(button);
	}

	private handleButtonClick(button: HTMLButtonElement): void {
		const command = button.dataset.jsId;
		if (command) {
			this.calculator.handleCommand(command as CommandTag);
			this.updateDisplay();
		}
	}

	private updateDisplay(): void {
		const display = document.querySelector<HTMLInputElement>(
			'.calculator [data-js-id="calculator-display"]'
		);

		if (!display) {
			return;
		}

		display.value = this.calculator.getDisplayValue();
	}

	private addButtonPressedClass(button: HTMLButtonElement) {
		button.classList.add('button-pressed');
	}

	private removeButtonPressedClass(button: HTMLButtonElement) {
		button.classList.remove('button-pressed');
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
			const button = document.querySelector<HTMLButtonElement>(
				`[data-js-id="${commandTag}"]`
			);
			if (button) {
				button.classList.add('button-pressed');
				button.click();
			}
		}
	}

	private releaseButton(key: string) {
		const commandTag = CalculatorUI.KEY_TO_BUTTON_ID_MAP[key];
		if (commandTag) {
			const button = document.querySelector<HTMLButtonElement>(
				`[data-js-id="${commandTag}"]`
			);
			if (button) {
				button.classList.remove('button-pressed');
			}
		}
	}
}
