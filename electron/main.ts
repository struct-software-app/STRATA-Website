import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import { pathToFileURL } from 'url';

app.setName('STRATA Suite');

let mainWindow: BrowserWindow | null = null;

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}

function isAllowedAppNavigation(targetUrl: string, isDev: boolean, prodEntryUrl: string): boolean {
  try {
    if (isDev) {
      return new URL(targetUrl).origin === 'http://localhost:5173';
    }
    const lowerTarget = targetUrl.toLowerCase();
    const lowerEntry = prodEntryUrl.toLowerCase();
    if (lowerTarget === lowerEntry) return true;
    if (lowerTarget.startsWith(`${lowerEntry}#`) || lowerTarget.startsWith(`${lowerEntry}?`)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#FFFFFF',
    title: 'STRATA Suite — Engineering Desktop Workspace',
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      spellcheck: false,
    },
  });

  const isDev = process.env.NODE_ENV === 'development';
  const prodIndexPath = path.join(__dirname, '../dist/index.html');
  const prodEntryUrl = pathToFileURL(prodIndexPath).href;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(prodIndexPath);
  }

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isAllowedAppNavigation(url, isDev, prodEntryUrl)) {
      return;
    }
    event.preventDefault();
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
  });

  // Open external links in default OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

if (gotSingleInstanceLock) {
  app.whenReady().then(() => {
    ipcMain.handle('app:get-version', () => app.getVersion());
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
