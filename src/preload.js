const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  detectDevices: () => ipcRenderer.invoke('detect-devices'),
  sendCommand: (vendorId, productId, command) => ipcRenderer.invoke('send-command', vendorId, productId, command),
});
