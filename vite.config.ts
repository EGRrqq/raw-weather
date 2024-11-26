import { defineConfig } from "vite";

// plugins
import glsl from "vite-plugin-glsl";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	root: "src",
	build: {
		outDir: "../build",
		assetsDir: "",
	},
	base: "/raw-weather/",
	plugins: [glsl(), tsconfigPaths()],
});
