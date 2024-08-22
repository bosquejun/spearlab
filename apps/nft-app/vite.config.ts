import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "src/assets/**/*", // Copy all files and subdirectories
					dest: "assets", // Destination directory inside the build output
				},
				{
					src: "package.json",
					dest: ".",
				},
			],
		}),
	],
	build: {
		minify: false,
		lib: {
			entry: "src/main.tsx", // or .ts if you're using TypeScript
			formats: ["cjs"], // CommonJS format for Node.js compatibility
		},
		rollupOptions: {
			external: ["fs", "path", "events", "hypercore"],
			output: {
				dir: "../../templates/bare-react",
				entryFileNames: "app.cjs", // Output file name pattern for entry files
				format: "cjs", // CommonJS format
				preserveModules: false, // Do not bundle modules, keep the original structure
			},
		},
		target: "node16", // Ensure compatibility with Node.js environment
		outDir: "../../templates/bare-react",
	},
	resolve: {
		alias: {
			"@spearlab/design-system": path.join(
				__dirname,
				"../../packages/design-system/src"
			),
			"@spearlab/design-system/spearlab.css": path.join(
				__dirname,
				"../../packages/design-system/src/spearlab.css"
			),
			"@spearlab/react": path.join(
				__dirname,
				"../../packages/sdk/react/src"
			),
		},
	},
});
