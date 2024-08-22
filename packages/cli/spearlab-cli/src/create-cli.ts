/* eslint-disable @typescript-eslint/no-explicit-any */
import { build, getSpearlabConfig, SPEARLAB_CONFIG_FILE } from "@spearlab/sdk";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

export default function createCli(argv: any[]) {
	yargs(hideBin(argv))
		.command(
			"build",
			"build the spear app",
			(yargs) => {
				return yargs.positional("configFile", {
					describe: `${SPEARLAB_CONFIG_FILE} relative path file location`,
					default: `./${SPEARLAB_CONFIG_FILE}`,
				});
			},
			async (argv) => {
				if (argv.verbose) console.info(`start server on :${argv.port}`);
				const config = await getSpearlabConfig(argv.configFile);
				await build(config);
			}
		)
		.option("verbose", {
			alias: "v",
			type: "boolean",
			description: "Run with verbose logging",
		})
		.parse();
}
