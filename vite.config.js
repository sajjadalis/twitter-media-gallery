import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [vue()],
		build: {
			outDir: process.env.VITE_BUILD_DIR,
		},
		server: {
			host: true,
		},
	});
};
