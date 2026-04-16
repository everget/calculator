import { expect, Page, test } from '@playwright/test';

let page: Page;

test.beforeEach(async ({ browser }) => {
	page = await browser.newPage();
	await page.goto('/');
});

test.afterEach(async () => {
	await page.close();
});

async function pressButtons(buttons: string[]) {
	for (const button of buttons) {
		await page.click(`[data-testid="button-${button}"]`);
	}
}

async function getDisplayValue() {
	return await page.inputValue('[data-testid="calculator-display"]');
}

test.describe('Calculator UI', () => {
	test('Button Order Correctness', async () => {
		const expectedButtonOrder = [
			'log',
			'ln',
			'power',
			'square',
			'sqrt',
			'seven',
			'eight',
			'nine',
			'mod',
			'percent',
			'four',
			'five',
			'six',
			'half',
			'divide',
			'one',
			'two',
			'three',
			'subtract',
			'multiply',
			'clear-all',
			'zero',
			'decimal',
			'add',
			'equals',
		];

		const buttons = await page.locator('[data-testid^="button-"]').all();
		const buttonIds = await Promise.all(
			buttons.map(async (button) => {
				return await button.getAttribute('data-testid');
			})
		);

		expectedButtonOrder.forEach((expectedId, index) => {
			expect(buttonIds[index]).toBe(`button-${expectedId}`);
		});

		expect(buttonIds.length).toBe(expectedButtonOrder.length);
	});
});

test.describe('Calculator Operations', () => {
	test('Addition ', async () => {
		await pressButtons(['zero', 'decimal', 'zero', 'one', 'add', 'two', 'equals']);
		expect(await getDisplayValue()).toBe('2.01');
	});

	test('Subtraction ', async () => {
		await pressButtons(['five', 'decimal', 'zero', 'one', 'subtract', 'two', 'equals']);
		expect(await getDisplayValue()).toBe('3.01');
	});

	test('Multiplication ', async () => {
		await pressButtons(['two', 'multiply', 'two', 'one', 'equals']);
		expect(await getDisplayValue()).toBe('42');
	});

	test('Division ', async () => {
		await pressButtons(['five', 'decimal', 'zero', 'two', 'divide', 'two', 'equals']);
		expect(await getDisplayValue()).toBe('2.51');
	});

	test('Percentage', async () => {
		await pressButtons(['one', 'zero', 'zero', 'percent', 'one', 'equals']);
		expect(await getDisplayValue()).toBe('1');

		await pressButtons(['clear-all', 'five', 'zero', 'percent', 'one', 'zero', 'equals']);
		expect(await getDisplayValue()).toBe('5');
	});

	test('Power', async () => {
		await pressButtons(['two', 'power', 'three', 'equals']);
		expect(await getDisplayValue()).toBe('8');
	});

	test('Square', async () => {
		await pressButtons(['five', 'square']);
		expect(await getDisplayValue()).toBe('25');
	});

	test('Square root', async () => {
		await pressButtons(['nine', 'sqrt']);
		expect(await getDisplayValue()).toBe('3');
	});

	test('Natural logarithm', async () => {
		await pressButtons(['one', 'zero', 'ln']);
		expect(await getDisplayValue()).toBe('2.302585092994046');
	});

	test('Base 10 logarithm', async () => {
		await pressButtons(['one', 'zero', 'zero', 'log', 'one', 'zero', 'equals']);
		expect(await getDisplayValue()).toBe('2');
	});

	test('Modulo operation', async () => {
		await pressButtons(['seven', 'mod', 'three', 'equals']);
		expect(await getDisplayValue()).toBe('1');
	});

	test('Half', async () => {
		await pressButtons(['six', 'half']);
		expect(await getDisplayValue()).toBe('3');
	});

	test('Clear functionality', async () => {
		await pressButtons(['five', 'add', 'three', 'clear-all']);
		expect(await getDisplayValue()).toBe('0');
	});
});

test.describe('Calculator Edge Cases & Error Handling', () => {
	test('Chained operations', async () => {
		await pressButtons([
			'two',
			'add',
			'three',
			'multiply',
			'four',
			'subtract',
			'six',
			'equals',
		]);
		expect(await getDisplayValue()).toBe('14');
	});

	test('Dividing by zero', async () => {
		await pressButtons(['five', 'divide', 'zero', 'equals']);
		expect(await getDisplayValue()).toBe('ERROR');
	});

	test('Square root of negative number', async () => {
		await pressButtons(['subtract', 'four', 'sqrt']);
		expect(await getDisplayValue()).toBe('ERROR');
	});

	test('Logarithm of zero or negative number', async () => {
		await pressButtons(['zero', 'ln']);
		expect(await getDisplayValue()).toBe('ERROR');

		await pressButtons(['clear-all', 'subtract', 'one', 'log', 'equals']);
		expect(await getDisplayValue()).toBe('ERROR');
	});

	test('Multiple decimal points are ignored', async () => {
		await pressButtons(['one', 'decimal', 'five', 'decimal', 'seven']);
		expect(await getDisplayValue()).toBe('1.57');
	});

	test('Leading zeros are handled correctly', async () => {
		await pressButtons(['zero', 'zero', 'three']);
		expect(await getDisplayValue()).toBe('3');

		await pressButtons(['clear-all', 'zero', 'decimal', 'zero', 'five']);
		expect(await getDisplayValue()).toBe('0.05');
	});

	test('Limits inputs natively graphically to 15 digits', async () => {
		for (let i = 0; i < 20; i++) {
			await page.keyboard.press('9');
		}
		expect(await getDisplayValue()).toBe('9'.repeat(15));
	});
});

test.describe('Keyboard & Accessibility Support', () => {
	test('Accessibility attributes are thoroughly bound to display', async () => {
		const display = page.locator('[data-testid="calculator-display"]');
		await expect(display).toHaveAttribute('aria-live', 'polite');
		await expect(display).toHaveAttribute('aria-label', 'Calculator display');
		await expect(page.locator('[data-testid="button-add"]')).toHaveAttribute(
			'aria-label',
			'Add'
		);
	});

	test('Keyboard seamlessly mirrors user UI interactions', async () => {
		await page.keyboard.press('5');
		await page.keyboard.press('+');
		await page.keyboard.press('1');
		await page.keyboard.press('0');
		await page.keyboard.press('Enter');
		expect(await getDisplayValue()).toBe('15');

		await page.keyboard.press('Backspace');
		expect(await getDisplayValue()).toBe('0');
	});
});

test.describe('Practical Workflow Chains', () => {
	test('Calculating 15% of 42.5 successfully models daily user cases', async () => {
		// 15 % 42.5 = 6.375
		await page.keyboard.type('15%42.5=');
		expect(await getDisplayValue()).toBe('6.375');
	});

	test('Sequential operations compute immediately rather than following strict scientific PEMDAS', async () => {
		// (5 + 3) * 2 = 16
		await page.keyboard.type('5+3*2=');
		expect(await getDisplayValue()).toBe('16');
	});

	test('Compound interest over 3 periods (1000 * 1.05³)', async () => {
		await page.keyboard.type('1000*1.05=');
		expect(await getDisplayValue()).toBe('1050');

		await page.keyboard.type('*1.05=');
		expect(await getDisplayValue()).toBe('1102.5');

		await page.keyboard.type('*1.05=');
		expect(await getDisplayValue()).toBe('1157.625');
	});

	test('Currency conversion and 3-way distribution split', async () => {
		// Convert $500 at 0.85 rate, then split between 3 accounts
		await page.keyboard.type('500*0.85/3=');
		expect(await getDisplayValue()).toMatch(/^141\.66666/);
	});

	test('Area of a circle (πr² where r=5)', async () => {
		// Calculate 5² = 25. Then * 3.14159.
		await page.keyboard.type('5');
		await page.click('[data-testid="button-square"]');
		await page.keyboard.type('*3.14159=');
		expect(await getDisplayValue()).toBe('78.53975');
	});

	test('Simple variance ((12 - 8)² / 2)', async () => {
		await page.keyboard.type('12-8=');
		await page.click('[data-testid="button-square"]');
		await page.click('[data-testid="button-half"]');
		expect(await getDisplayValue()).toBe('8');
	});
});
