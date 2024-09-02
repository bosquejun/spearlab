import { existsSync, readFileSync } from "fs";
import { merge } from "lodash";
import path from "path";
import { Config } from "tailwindcss";
import { SpearlabConfig } from "./define-config";

function designSystemEnabled(projectDir: string) {
	const pkgJsonPath = path.join(projectDir, "package.json");

	if (!existsSync(pkgJsonPath)) {
		return false;
	}

	const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));

	return pkgJson["dependencies"]["@spearlab/design-system"];
}

export async function createTailwindConfig({
	tailwindOptions,
	projectDir,
}: SpearlabConfig): Promise<Config> {
	const defaultConfig: Config = {
		darkMode: ["class"],
		content: [
			path.join(projectDir, "./pages/**/*.{ts,tsx}"),
			path.join(projectDir, "./components/**/*.{ts,tsx}"),
			path.join(projectDir, "./app/**/*.{ts,tsx}"),
			path.join(projectDir, "./src/**/*.{ts,tsx}"),
			...(designSystemEnabled(projectDir)
				? [
						path.join(
							projectDir,
							"node_modules/@spearlab/design-system/**/*.{ts,tsx,js,jsx}"
						),
					]
				: []),
		],
		prefix: "",
		theme: {
			container: {
				center: true,
				padding: "2rem",
				screens: {
					"2xl": "1400px",
				},
			},
			extend: {
				colors: {
					border: "hsl(var(--border))",
					input: "hsl(var(--input))",
					ring: "hsl(var(--ring))",
					background: "hsl(var(--background))",
					foreground: "hsl(var(--foreground))",
					primary: {
						DEFAULT: "hsl(var(--primary))",
						foreground: "hsl(var(--primary-foreground))",
					},
					secondary: {
						DEFAULT: "hsl(var(--secondary))",
						foreground: "hsl(var(--secondary-foreground))",
					},
					destructive: {
						DEFAULT: "hsl(var(--destructive))",
						foreground: "hsl(var(--destructive-foreground))",
					},
					muted: {
						DEFAULT: "hsl(var(--muted))",
						foreground: "hsl(var(--muted-foreground))",
					},
					accent: {
						DEFAULT: "hsl(var(--accent))",
						foreground: "hsl(var(--accent-foreground))",
					},
					popover: {
						DEFAULT: "hsl(var(--popover))",
						foreground: "hsl(var(--popover-foreground))",
					},
					card: {
						DEFAULT: "hsl(var(--card))",
						foreground: "hsl(var(--card-foreground))",
					},
				},
				borderRadius: {
					lg: "var(--radius)",
					md: "calc(var(--radius) - 2px)",
					sm: "calc(var(--radius) - 4px)",
				},
				keyframes: {
					"accordion-down": {
						from: { height: "0" },
						to: { height: "var(--radix-accordion-content-height)" },
					},
					"accordion-up": {
						from: {
							height: "var(--radix-accordion-content-height)",
						},
						to: { height: "0" },
					},
				},
				animation: {
					"accordion-down": "accordion-down 0.2s ease-out",
					"accordion-up": "accordion-up 0.2s ease-out",
				},
			},
		},
		plugins: [(await import("tailwindcss-animate")).default],
		corePlugins: {
			preflight: false,
		},
	};

	if (typeof tailwindOptions === "boolean") return defaultConfig;

	return merge(tailwindOptions, defaultConfig);
}
