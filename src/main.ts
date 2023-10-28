import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import serve = require('electron-serve');

const serveURL = serve({ directory: '.' });
const isDev: Boolean = !app.isPackaged;
const port: string = process.env.PORT ? process.env.PORT.toString() : '5173';

let mainWindow: BrowserWindow | null;

// Create the main browser window
function createMainWindow() {
  console.log(path.join(__dirname, "preload.js"));
  
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
      nodeIntegration: true,
      contextIsolation: true,
      sandbox: true
    },
    width: 800,
  });

  return mainWindow;
}

// Load Vite to launch Svelte
function loadVite(port: string) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function launchMainWindow() {
	mainWindow = createMainWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	if (isDev) loadVite(port);
	else serveURL(mainWindow);
}

async function sendProcessVersionsToRender() {
  const processVersions: ProcessVersions = process.versions;
  console.log("sending processVersions to IPC to pass on to renderer");
  return processVersions;
	// mainWindow.webContents.send('system:sendProcessVersions', processVersions);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  launchMainWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) launchMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.once('ready', () => {  
  ipcMain.handle('renderer:requestProcessVersions', (event) => {
    console.log("Renderer is asking for process versions");
    const versionsToSend = sendProcessVersionsToRender();
    return versionsToSend;
  });
});