// Globally declared types used by both Electron and SvelteKit

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	// The Window interface is where the preload script exposes its API to the renderer process.
	// Compare this to the contextBridge.exposeInMainWorld() call in src/preload.ts.
	interface Window {
    electronAPI?: Electron.IpcRenderer;
		versions?: Electron.IpcRenderer;
  }

	// This is where declarations for types you want to use in the main process and the renderer process go.
	type ProcessVersions = NodeJS.ProcessVersions;
}

export {};
