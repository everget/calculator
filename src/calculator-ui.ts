import type { ICalculator } from './calculator';
import { type CommandTag, type UIButtonDefinition } from './definitions';

interface ShortcutData {
	key: string;
	description: string;
}

export class CalculatorUI {
	private calculator: ICalculator;
	private buttons: UIButtonDefinition[];
	private root: HTMLElement | null = null;
	private displayElement: HTMLInputElement | null = null;
	private buttonElements = new Map<CommandTag, HTMLButtonElement>();
	private cleanup: (() => void)[] = [];

	private keyToButtonIdMap: Record<string, CommandTag> = {};

	constructor(calculator: ICalculator, buttons: UIButtonDefinition[]) {
		this.calculator = calculator;
		this.buttons = buttons;

		// Initialize key map
		this.buttons.forEach((button) => {
			button.keys.forEach((key) => {
				this.keyToButtonIdMap[key] = button.id;
			});
		});
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

		this.buttons.forEach((button) => {
			const btn = document.createElement('button');
			btn.className = button.type;

			if (button.id === 'clear-all') btn.classList.add('clear');
			if (button.id === 'equals') btn.classList.add('equals');

			btn.dataset.testid = `button-${button.id}`;
			btn.dataset.command = button.id;
			btn.setAttribute('aria-label', button.ariaLabel);

			if (button.keys.length > 0) {
				btn.title = `Keyboard: ${button.keys.join(', ')}`;
			}

			// Use innerHTML only for content with markup (e.g. <sup>)
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

		this.deriveShortcutsData().forEach(({ key, description }) => {
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

	private deriveShortcutsData(): ShortcutData[] {
		const data: ShortcutData[] = [];

		// Digit range — derive from the actual digit button keys
		const digitKeys = this.buttons
			.filter((b) => b.type === 'digit' && b.keys.length > 0)
			.map((b) => b.keys[0])
			.sort();
		if (digitKeys.length > 0) {
			data.push({
				key: `${digitKeys[0]}-${digitKeys[digitKeys.length - 1]}`,
				description: 'Digits',
			});
		}

		// Basic arithmetic ops — derive and sort in natural +, -, *, / order
		const basicOpOrder = ['+', '-', '*', '/'];
		const basicKeys = this.buttons
			.filter(
				(b) =>
					b.type === 'operator' && b.keys.length > 0 && basicOpOrder.includes(b.keys[0])
			)
			.sort((a, b) => basicOpOrder.indexOf(a.keys[0]) - basicOpOrder.indexOf(b.keys[0]))
			.map((b) => b.keys[0]);
		if (basicKeys.length > 0) {
			data.push({ key: basicKeys.join(' '), description: 'Basic operations' });
		}

		// Other operator shortcuts (individual)
		this.buttons.forEach((b) => {
			if (b.type === 'operator' && b.keys.length > 0 && !basicOpOrder.includes(b.keys[0])) {
				data.push({ key: b.keys.join(', '), description: b.ariaLabel });
			}
		});

		// Control shortcuts (individual)
		this.buttons.forEach((b) => {
			if (b.type === 'control' && b.keys.length > 0) {
				data.push({ key: b.keys.join(', '), description: b.ariaLabel });
			}
		});

		return data;
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

		const handleMouseRelease = (e: Event) => {
			const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
				'button[data-testid^="button-"]'
			);
			if (button) button.classList.remove('button-pressed');
		};

		buttonsContainer.addEventListener('click', handleClick);
		buttonsContainer.addEventListener('mousedown', handleMouseDown);
		buttonsContainer.addEventListener('mouseup', handleMouseRelease);
		buttonsContainer.addEventListener('mouseleave', handleMouseRelease);

		this.cleanup.push(
			() => buttonsContainer.removeEventListener('click', handleClick),
			() => buttonsContainer.removeEventListener('mousedown', handleMouseDown),
			() => buttonsContainer.removeEventListener('mouseup', handleMouseRelease),
			() => buttonsContainer.removeEventListener('mouseleave', handleMouseRelease)
		);
	}

	private handleButtonClick(button: HTMLButtonElement): void {
		const command = button.dataset.command;
		if (!command) {
			console.error('Button has no data-command attribute');
			return;
		}
		this.dispatchCommand(command as CommandTag);
	}

	private dispatchCommand(commandTag: CommandTag): void {
		this.calculator.handleCommand(commandTag);
		this.updateDisplay();
	}

	private updateDisplay(): void {
		if (!this.displayElement) return;
		this.displayElement.value = this.calculator.getDisplayValue();
	}

	private handleKeyDown(event: KeyboardEvent) {
		const key = event.key;
		this.pressButton(key);

		// Prevent default behavior for calculator keys
		if (this.keyToButtonIdMap[key]) {
			event.preventDefault();
		}

		// Prevent browser default for Shift+key combos that produce calculator-mapped characters
		// ('%' = Shift+5, '&' = Shift+7, '^' = Shift+6, '#' = Shift+3)
		if (event.shiftKey && ['3', '5', '6', '7'].includes(key)) {
			event.preventDefault();
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		const key = event.key;
		this.releaseButton(key);
	}

	private pressButton(key: string) {
		const commandTag = this.keyToButtonIdMap[key];
		if (commandTag) {
			const button = this.buttonElements.get(commandTag);
			if (button) {
				button.classList.add('button-pressed');
				this.dispatchCommand(commandTag);
			}
		}
	}

	private releaseButton(key: string) {
		const commandTag = this.keyToButtonIdMap[key];
		if (commandTag) {
			const button = this.buttonElements.get(commandTag);
			if (button) {
				button.classList.remove('button-pressed');
			}
		}
	}
}
