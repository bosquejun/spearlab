import { Config as TailwindConfig } from "tailwindcss";
import { InlineConfig } from "vite";

export type SpearlabConfig = {
	assetsDir: string;
	sourceDir: string;
	projectDir: string;
	outputDir: string;
	configPath: string;
	pear?: {
		name?: string;
	};
	viteOptions?: InlineConfig;
	tailwindOptions?: boolean | TailwindConfig;
};

export function defineConfig(
	config: Omit<Partial<SpearlabConfig>, "configPath">
) {
	const projectDir = config?.projectDir || ".";
	const sourceDir = config?.sourceDir || "./src";
	const assetsDir = config?.assetsDir || "./src/assets";
	const outputDir = config?.outputDir || "./dist";
	return Object.assign(config, {
		assetsDir,
		sourceDir,
		outputDir,
		projectDir,
	});
}
