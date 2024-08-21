import { TooltipProvider } from "@spearlab/design-system";
import "@spearlab/design-system/spearlab.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<TooltipProvider>
			<App />
		</TooltipProvider>
	</React.StrictMode>
);
