import { contextBridge, ipcRenderer } from 'electron';

// Expose safe desktop bridge
contextBridge.exposeInMainWorld('strataDesktop', {
  platform: process.platform,
  isElectron: true,
  getVersion: () => ipcRenderer.invoke('app:get-version'),
});
