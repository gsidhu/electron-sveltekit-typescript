// preload.ts

// From Electron 20 onwards, preload scripts are sandboxed by default 
// and no longer have access to a full Node.js environment. Practically, 
// this means that you have a polyfilled require function that only 
// has access to a limited set of APIs.
// Read more: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

import { contextBridge, ipcRenderer } from 'electron';

// expose some IPC channels to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  requestProcessVersions: async () => {
    return await ipcRenderer.invoke('renderer:requestProcessVersions');
  }
});

// we can also expose variables, not just functions
contextBridge.exposeInMainWorld('versions', {
  chrome: () => process.versions.chrome,
})
