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

		const shortcuts: ShortcutData[] = this.deriveShortcutsData();

		shortcuts.forEach(({ key, description }) => {
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
		// Group shortcuts logically for the panel
		const data: ShortcutData[] = [];

		// Digits (0-9)
		data.push({ key: '0-9', description: 'Digits' });

		// Basic ops
		data.push({ key: '+ - * /', description: 'Basic operations' });

		// Functional ops
		this.buttons.forEach((b) => {
			if (b.type === 'operator' && b.keys.length > 0) {
				const isBasic = ['+', '-', '*', '/'].includes(b.keys[0]);
				if (!isBasic) {
					data.push({ key: b.keys.join(', '), description: b.ariaLabel });
				}
			}
		});

		// Controls
		data.push({ key: 'Equals, Enter', description: 'Equals' });
		data.push({ key: 'c, Backspace', description: 'Clear' });
		data.push({ key: '.', description: 'Decimal' });

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
		if (this.keyToButtonIdMap[key]) {
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
		const commandTag = this.keyToButtonIdMap[key];
		if (commandTag) {
			const button = this.buttonElements.get(commandTag);
			if (button) {
				button.classList.add('button-pressed');
				button.click();
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
