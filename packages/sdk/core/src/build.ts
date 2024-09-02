/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec } from "child_process";
import { existsSync } from "fs";
import { createServer } from "http";
import path from "path";
import { OutputOptions, RollupOptions } from "rollup";
import { BuildOptions, createLogger, InlineConfig, LogLevel } from "vite";
import { WebSocketServer } from "ws";
import { SpearlabConfig } from "./define-config";
import { waitUntil } from "./utils";
import { getViteConfig } from "./vite-config";

export type ArgvOptions = {
	watch?: BuildOptions["watch"];
	mode?: "production" | "development";
	logLevel?: LogLevel;
	wsPort?: number;
};

function createWsConnection(argvOptions: ArgvOptions) {
	if (!argvOptions?.watch) return { ws: null };
	const httpServer = createServer();

	// Initialize WebSocket server
	const ws = new WebSocketServer({ server: httpServer });

	// Listen to a specific port
	httpServer.listen(argvOptions.wsPort, () => {
		console.log("WebSocket server is running on ws://localhost:3001");
	});

	return {
		httpServer,
		ws,
	};
}

export async function build(config: SpearlabConfig, argvOptions: ArgvOptions) {
	const { watch, ...nonBuildOptions } = Object.assign(argvOptions, {
		wsPort: 5229,
	});
	const logger = createLogger(nonBuildOptions.logLevel, {
		prefix: "[Spearlab]",
	});

	try {
		const { ws } = createWsConnection(argvOptions);
		const viteConfig = await getViteConfig(config, argvOptions);
		const buildConfig: InlineConfig = {
			mode: "production",
			logLevel: "error",
			...nonBuildOptions,
			build: {
				...viteConfig.build,
				watch,
			},
		};

		const vite = await import("vite");

		const build = (await vite.build(
			vite.mergeConfig(viteConfig, buildConfig)
		)) as any;

		if (watch && ws) {
			let pear_process: any = null;
			let _socket: WebSocket | null;
			ws.on("connection", (socket: WebSocket) => {
				_socket = socket;
			});

			build.on("event", async (event: any) => {
				if (event.code === "BUNDLE_START") {
					logger.info(
						pear_process === null
							? "App bundling started.."
							: `Changes detected on ${event.input}.`,
						{
							clear: true,
							timestamp: true,
						}
					);
					if (pear_process) {
						logger.info("Re-bundling started..", {
							timestamp: true,
						});
					}
				} else if (event.code === "BUNDLE_END") {
					if (!pear_process) {
						logger.info(
							`Bundling completed.. [${(event.duration / 1_000).toFixed(2)}s]`,
							{
								timestamp: true,
							}
						);
						logger.info("Starting Pear runtime..", {
							timestamp: true,
						});
						pear_process = exec(
							`pear run -d  ${config.projectDir}`
						);
						logger.info("Pear app started..", {
							timestamp: true,
						});
					} else {
						logger.info(
							`Re-bundling completed.. [${(event.duration / 1_000).toFixed(2)}s]`,
							{
								timestamp: true,
							}
						);
						await waitForDistAvailability(
							viteConfig.build?.rollupOptions as RollupOptions
						);
						logger.info("Reloading pear app..");
						if (_socket) {
							_socket.send("hot-reload");
						}
					}
				} else if (event.code === "ERROR") {
					logger.error("Building failed.", {
						timestamp: true,
					});
				}
			});
		}
	} catch (error) {
		const { message } = error as Error;
		logger.error(message);
	}
}

async function waitForDistAvailability(rollupOptions: RollupOptions) {
	const { dir, entryFileNames } = rollupOptions.output as OutputOptions;
	const watchFile = path.join(dir!, entryFileNames as string);

	try {
		await waitUntil(() => existsSync(watchFile));
	} catch {
		throw new Error(`Timed out. Failed to detect ${entryFileNames}`);
	}
}
