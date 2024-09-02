import { existsSync, readdirSync } from "fs";
import path from "path";

export async function findConfigFile(
	configFileName: string,
	dir: string = process.cwd()
): Promise<string | null> {
	const filesAndDirs = await readdirSync(dir, { withFileTypes: true });

	for (const entry of filesAndDirs) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isFile() && entry.name === configFileName) {
			return fullPath; // Config file found
		} else if (entry.isDirectory()) {
			const foundInSubDir = await findConfigFile(
				configFileName,
				fullPath
			);
			if (foundInSubDir) {
				return foundInSubDir;
			}
		}
	}

	return null; // Config file not found in this directory or its subdirectories
}

// Define the type for the input object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TAnyHash = Record<string, any>;

// Function to resolve relative paths to absolute paths
export const resolvePaths = <T = TAnyHash>(
	obj: TAnyHash,
	currentDir?: string
): T => {
	const resolved: TAnyHash = {};

	const traverse = (currentObj: TAnyHash): void => {
		const resolvePath = (pathValue: string) =>
			currentDir
				? path.resolve(path.join(currentDir, pathValue))
				: path.resolve(pathValue);

		for (const key in currentObj) {
			const value = currentObj[key];

			if (
				typeof value === "object" &&
				!Array.isArray(value) &&
				value !== null
			) {
				// If it's an object, recurse
				resolved[key] = resolvePaths(value);
			} else if (typeof value === "string") {
				// Convert relative path to absolute path
				resolved[key] = resolvePath(value);
			} else {
				resolved[key] = value;
			}
		}
	};

	traverse(obj);
	return resolved as T;
};

// Function to find the first existing file from possible entries
export function findEntryFile(dir: string, filenames: string[]) {
	for (const filename of filenames) {
		const filePath = path.join(dir, filename);
		if (existsSync(filePath)) {
			return filePath;
		}
	}
	throw new Error("No valid entry file found");
}

export async function waitUntil(
	fn: () => Promise<void> | boolean,
	interval: number = 100,
	timeout: number = 10_000
): Promise<void> {
	const startTime = Date.now();

	async function check(): Promise<void> {
		const result = await fn();
		if (typeof result === "boolean" && result) {
			return;
		}

		if (Date.now() - startTime >= timeout) {
			throw new Error("waitUntil timed out");
		}

		await new Promise((resolve) => setTimeout(resolve, interval));
		return check();
	}

	return check();
}
