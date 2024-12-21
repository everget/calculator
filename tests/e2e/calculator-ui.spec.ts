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
});
