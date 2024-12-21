import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['coverage', 'dist', 'build', 'tests/e2e/report/*', 'tests/e2e/test-results/*'],
	},
	{ files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}', 'tests/**/*.spec.{js,mjs,cjs,ts,jsx,tsx'] },
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
