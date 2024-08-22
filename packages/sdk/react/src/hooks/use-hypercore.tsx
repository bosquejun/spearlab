/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Hypercore from "hypercore";
import { useEffect, useRef, useState } from "react";
import { useCleanup } from "./use-cleanup";

type Hypecore = {
	ready: () => Promise<void>;
	key: Buffer;
	close: () => Promise<void>;
};

export default function useHypercore(storagePath: string) {
	const [core, setCore] = useState<Hypecore>();
	const coreRef = useRef<Hypecore>();

	async function cleanUp() {
		await coreRef.current?.close();
		console.log("Unloading... cleaning up main modules");
	}

	useCleanup(cleanUp);

	useEffect(() => {
		if (coreRef.current) return;
		coreRef.current = new Hypercore(storagePath);
		setCore(coreRef.current);
	}, [coreRef.current]);

	return core;
}
