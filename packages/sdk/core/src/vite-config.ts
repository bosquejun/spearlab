import path from "path";
import { InlineConfig } from "vite";
import { ArgvOptions } from "./build";
import { createTailwindConfig } from "./create-tailwind-config";
import { SpearlabConfig } from "./define-config";
import { findEntryFile } from "./utils";

// Possible entry file names
const possibleEntries = ["index.jsx", "index.tsx", "main.jsx", "main.tsx"];

export async function getViteConfig(
	config: SpearlabConfig,
	argvOptions: ArgvOptions = {}
): Promise<InlineConfig> {
	const {
		sourceDir,
		outputDir,
		projectDir,
		assetsDir,
		viteOptions,
		tailwindOptions,
	} = config;
	const { default: copy } = await import("rollup-plugin-copy");
	const { default: pearHotReloadPlugin } = await import(
		"./pear-hot-reload-plugin"
	);

	const entryFile = findEntryFile(sourceDir, possibleEntries);

	const plugins = [
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
	];

	if (argvOptions?.watch) {
		plugins.push(pearHotReloadPlugin(argvOptions?.wsPort as number));
	}

	const vite = await import("vite");

	const defaultViteConfig: InlineConfig = {
		plugins,
		build: {
			minify: argvOptions.mode === "development" ? false : true,
			lib: {
				entry: entryFile, // or .ts if you're using TypeScript
				formats: ["cjs"], // CommonJS format for Node.js compatibility
			},
			rollupOptions: {
				external: ["fs", "path", "events", "react", "hypercore"],
				output: {
					dir: outputDir,
					entryFileNames: "index.cjs", // Output file name pattern for entry files
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
		...(typeof tailwindOptions !== "undefined" && {
			css: {
				postcss: {
					plugins: [
						(await import("tailwindcss")).default({
							config: await createTailwindConfig(config),
						}),
					],
				},
			},
		}),
	};

	const mergedConfigs = vite.mergeConfig(
		defaultViteConfig,
		viteOptions || {}
	);

	return mergedConfigs;
}
