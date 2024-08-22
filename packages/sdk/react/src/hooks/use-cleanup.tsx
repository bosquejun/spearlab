import { useEffect } from "react";

type ModuleCleanupFn = () => Promise<void>;

export function useCleanup(moduleCleanup: ModuleCleanupFn) {
	useEffect(() => {
		window.addEventListener("beforeunload", moduleCleanup);

		return () => {
			window.removeEventListener("beforeunload", moduleCleanup);
		};
	}, []);
}
