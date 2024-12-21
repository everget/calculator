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
		await page.click(`[data-js-id="${button}"]`);
	}
}

async function getDisplayValue() {
	return await page.inputValue('[data-js-id="calculator-display"]');
}

test.describe('Calculator E2E Tests', () => {
	test('Basic arithmetic operations', async () => {
		await pressButtons(['two', 'add', 'three', 'equals']);
		expect(await getDisplayValue()).toBe('5');

		await pressButtons(['clear-all', 'five', 'subtract', 'two', 'equals']);
		expect(await getDisplayValue()).toBe('3');

		await pressButtons(['clear-all', 'four', 'multiply', 'three', 'equals']);
		expect(await getDisplayValue()).toBe('12');

		await pressButtons(['clear-all', 'eight', 'divide', 'two', 'equals']);
		expect(await getDisplayValue()).toBe('4');
	});

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

	test('Decimal operations', async () => {
		await pressButtons(['one', 'decimal', 'five', 'add', 'two', 'decimal', 'seven', 'equals']);
		expect(await getDisplayValue()).toBe('4.2');
	});

	test('Percentage calculation', async () => {
		await pressButtons(['one', 'zero', 'zero', 'percent', 'one', 'equals']);
		expect(await getDisplayValue()).toBe('1');

		await pressButtons(['clear-all', 'five', 'zero', 'percent', 'one', 'zero', 'equals']);
		expect(await getDisplayValue()).toBe('5');
	});

	test('Power function', async () => {
		await pressButtons(['two', 'power', 'three', 'equals']);
		expect(await getDisplayValue()).toBe('8');
	});

	test('Square function', async () => {
		await pressButtons(['five', 'square']);
		expect(await getDisplayValue()).toBe('25');
	});

	test('Square root function', async () => {
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

	test('Half function', async () => {
		await pressButtons(['six', 'half']);
		expect(await getDisplayValue()).toBe('3');
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

	test('Clear functionality', async () => {
		await pressButtons(['five', 'add', 'three', 'clear-all']);
		expect(await getDisplayValue()).toBe('0');
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
