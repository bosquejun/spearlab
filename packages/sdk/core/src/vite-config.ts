import path from "path";
import { InlineConfig } from "vite";
import { SpearlabConfig } from "./define-config";
import { findEntryFile } from "./utils";

// Possible entry file names
const possibleEntries = ["index.jsx", "index.tsx", "main.jsx", "main.tsx"];

export async function getViteConfig({
	sourceDir,
	outputDir,
	projectDir,
	assetsDir,
}: SpearlabConfig): Promise<InlineConfig> {
	const { default: copy } = await import("rollup-plugin-copy");

	const entryFile = findEntryFile(sourceDir, possibleEntries);

	return {
		plugins: [
			copy({
				targets: [
					{
						src: path.join(assetsDir, "**/*"), // Copy all files and subdirectories
						dest: "assets", // Destination directory inside the build output
					},
					{
						src: path.join(projectDir, "package.json"),
						dest: outputDir,
					},
				],
			}),
		],
		build: {
			minify: false,
			lib: {
				entry: entryFile, // or .ts if you're using TypeScript
				formats: ["cjs"], // CommonJS format for Node.js compatibility
			},
			rollupOptions: {
				external: ["fs", "path", "events", "react", "hypercore"],
				output: {
					dir: outputDir,
					entryFileNames: "react-app.cjs", // Output file name pattern for entry files
					format: "cjs", // CommonJS format
					preserveModules: false, // Do not bundle modules, keep the original structure
				},
			},
			target: "node16", // Ensure compatibility with Node.js environment
			outDir: "dist",
		},
		resolve: {
			alias: {
				"@spearlab/design-system": path.join(
					projectDir,

					"node_modules",
					"@spearlab/design-system"
				),
				"@spearlab/design-system/spearlab.css": path.join(
					projectDir,
					"node_modules",
					"@spearlab/design-system/spearlab.css"
				),
			},
		},
	};
}
