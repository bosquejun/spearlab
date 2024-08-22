import { TooltipProvider } from "@spearlab/design-system";
import { SpearlabProvider } from "@spearlab/react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<SpearlabProvider config={{}}>
			<TooltipProvider>
				<App />
			</TooltipProvider>
		</SpearlabProvider>
	</React.StrictMode>
);
