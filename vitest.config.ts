import path from 'node:path';
import { defineConfig } from 'vitest/config';

const scriptExtensions = '{,m,c}{j,t}s{,x}';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: [
			`src/**/*.{test,spec}.${scriptExtensions}`,
			`tests/unit/**/*.{test,spec}.${scriptExtensions}`,
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
		},
	},
});
