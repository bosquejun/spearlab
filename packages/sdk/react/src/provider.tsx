/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import { PropsWithChildren, useEffect } from "react";
import { SpearlabContext, SpearlabProviderConfig } from "./context";
import useHypercore from "./hooks/use-hypercore";

declare const Pear: any;

export function SpearlabProvider({
	config,
	children,
}: PropsWithChildren & {
	config: SpearlabProviderConfig;
}) {
	const core = useHypercore(path.join(Pear.config.storage, "main-core"));

	const context: SpearlabContext = {
		config,
	};

	useEffect(() => {
		if (!core) return;
		core.ready().then(() => {
			console.log(core.key.toString("hex"));
		});
	}, [core]);

	return (
		<SpearlabContext.Provider value={context}>
			{children}
		</SpearlabContext.Provider>
	);
}
