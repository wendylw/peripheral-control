const { app, BrowserWindow, ipcMain } = require('electron');
const HID = require('node-hid');
HID.setDriverType('libusb'); // 使用 libusb 驱动

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + '/preload.js',
    },
  });

  mainWindow.loadFile('src/renderer/index.html');
}

// 检测设备
ipcMain.handle('detect-devices', async () => {
  const devices = HID.devices();
  console.log('Detected HID devices:', devices); // 打印检测到的设备
  return devices.filter((device) => device.vendorId && device.productId);
});

// 发送命令
ipcMain.handle('send-command', async (event, vendorId, productId, command) => {
  try {
    console.log(`Attempting to open device with vendorId: ${vendorId}, productId: ${productId}`);
    const device = new HID.HID(vendorId, productId);
    console.log(`Device opened successfully, sending command: ${command}`);
    device.write(command);
    device.close();
    return { success: true };
  } catch (error) {
    console.error(`Failed to send command: ${error.message}`);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
