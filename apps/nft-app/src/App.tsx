import {
	Button,
	ThemeProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@spearlab/design-system";
import React from "react";

function App() {
	return (
		<React.Fragment>
			<ThemeProvider defaultTheme='dark'>
				<div className='w-screen h-screen flex items-center justify-center'>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button>Spearlab</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Button using ShadCN</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</ThemeProvider>
		</React.Fragment>
	);
}

export default App;
