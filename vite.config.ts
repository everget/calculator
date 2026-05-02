import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const port = Number(env.VITE_DEV_PORT) || 5174;

	return {
		base: '/calculator/',
		plugins: [],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: { port },
	};
});
