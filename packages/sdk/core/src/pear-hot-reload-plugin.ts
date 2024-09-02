/* eslint-disable @typescript-eslint/no-explicit-any */
export default function pearHotReloadPlugin(wsPort: number) {
	const virtualModuleId = "virtual:pear-hot-reload";
	const resolvedVirtualModuleId = "\0" + virtualModuleId;

	return {
		name: "pear-hot-reload-plugin", // required, will show up in warnings and errors
		resolveId(id: string) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		load(id: string) {
			if (id === resolvedVirtualModuleId) {
				return `
                console.log("Initiated virtual:pear-hot-reload");
                const socket = new WebSocket('ws://localhost:${wsPort}');
                socket.onmessage = (event) => {
					if(event.data === "hot-reload"){
						console.log('detected hot-reload event from the server.');
						window.location.reload();
					}
                };
                socket.onopen = () => {
                    console.log('Hot-reload connection has been established.');
                };
                socket.onclose = () => {
                    console.warn('Hot-reload connection has been closed. Please restart the command to reconnect.');
                };
                socket.onerror = (error) => {
                    console.error('Hot-reload connection has failed. Please restart the command to reconnect.');
                };`;
			}
		},
	};
}
