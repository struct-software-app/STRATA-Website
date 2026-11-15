import { contextBridge } from 'electron';

// Expose safe desktop bridge
contextBridge.exposeInMainWorld('strataDesktop', {
  platform: process.platform,
  version: '2.4.0',
  isElectron: true,
});
