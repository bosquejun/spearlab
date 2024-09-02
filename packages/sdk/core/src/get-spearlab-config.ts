import path from "path";
import { SpearlabConfig } from "./define-config";
import { resolvePaths } from "./utils";

export const SPEARLAB_CONFIG_FILE = "spearlab.config.js";

export async function getSpearlabConfig(
	configFile: string
): Promise<SpearlabConfig> {
	// const configPath = await findConfigFile(SPEARLAB_CONFIG_FILE);

	let configFileLocation;
	try {
		configFileLocation = require.resolve(
			path.join(process.cwd(), configFile)
		);
	} catch {
		throw new Error(`${SPEARLAB_CONFIG_FILE} is not found.`);
	}

	const { default: config } = await import(configFileLocation);

	const configPath = path.dirname(configFileLocation);

	const projectDir = path.resolve(config.projectDir);

	const resolvedConfigs = resolvePaths<SpearlabConfig>(config, projectDir);

	return {
		...resolvedConfigs,
		configPath,
	};
}
