import { InlineConfig } from "vite";
import { SpearlabConfig } from "./define-config";
import { getViteConfig } from "./vite-config";

export async function build(config: SpearlabConfig) {
	const viteConfig = await getViteConfig(config);
	const buildConfig: InlineConfig = {
		mode: "production",
		logLevel: "error",
	};

	const vite = await import("vite");

	const build = await vite.build(vite.mergeConfig(viteConfig, buildConfig));

	console.log(build);
}
