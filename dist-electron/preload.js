"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose safe desktop bridge
electron_1.contextBridge.exposeInMainWorld('siecDesktop', {
    platform: process.platform,
    version: '2.4.0',
    isElectron: true,
});
