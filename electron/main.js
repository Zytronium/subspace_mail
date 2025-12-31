const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('electron-store').default;
const GmailService = require('./services/gmail.js');
const OutlookService = require('./services/outlook.js');
const YahooService = require('./services/yahoo.js');
const ImapService = require('./services/imap.js');

const store = new Store({
  encryptionKey: process.env.ENCRYPTION_KEY || 'cosmic-mail-default-key-change-in-production'
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    frame: false,
    backgroundColor: '#0a0a0f',
    titleBarStyle: 'hidden',
    show: false
  });

  const isDev = !app.isPackaged;
  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Window controls
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

// Gmail IPC handlers
ipcMain.handle('gmail:auth', async () => {
  try {
    return await GmailService.authenticate();
  } catch (error) {
    console.error('Gmail auth error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('gmail:fetch', async (event, params) => {
  try {
    return await GmailService.fetchEmails(params);
  } catch (error) {
    console.error('Gmail fetch error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('gmail:send', async (event, email) => {
  try {
    return await GmailService.sendEmail(email);
  } catch (error) {
    console.error('Gmail send error:', error);
    return { success: false, error: error.message };
  }
});

// Outlook IPC handlers
ipcMain.handle('outlook:auth', async () => {
  try {
    return await OutlookService.authenticate();
  } catch (error) {
    console.error('Outlook auth error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('outlook:fetch', async (event, params) => {
  try {
    return await OutlookService.fetchEmails(params);
  } catch (error) {
    console.error('Outlook fetch error:', error);
    return { success: false, error: error.message };
  }
});

// Yahoo IPC handlers
ipcMain.handle('yahoo:auth', async () => {
  try {
    return await YahooService.authenticate();
  } catch (error) {
    console.error('Yahoo auth error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('yahoo:fetch', async (event, params) => {
  try {
    return await YahooService.fetchEmails(params);
  } catch (error) {
    console.error('Yahoo fetch error:', error);
    return { success: false, error: error.message };
  }
});

// IMAP IPC handlers
ipcMain.handle('imap:connect', async (event, config) => {
  try {
    return await ImapService.connect(config);
  } catch (error) {
    console.error('IMAP connect error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('imap:fetch', async (event, params) => {
  try {
    return await ImapService.fetchEmails(params);
  } catch (error) {
    console.error('IMAP fetch error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('imap:send', async (event, params) => {
  try {
    return await ImapService.sendEmail(params);
  } catch (error) {
    console.error('IMAP send error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('imap:disconnect', async (event, user) => {
  try {
    return await ImapService.disconnect(user);
  } catch (error) {
    console.error('IMAP disconnect error:', error);
    return { success: false, error: error.message };
  }
});

// Store IPC handlers
ipcMain.handle('store:get', async (event, key) => {
  try {
    return store.get(key);
  } catch (error) {
    console.error('Store get error:', error);
    return null;
  }
});

ipcMain.handle('store:set', async (event, key, value) => {
  try {
    store.set(key, value);
    return { success: true };
  } catch (error) {
    console.error('Store set error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('store:delete', async (event, key) => {
  try {
    store.delete(key);
    return { success: true };
  } catch (error) {
    console.error('Store delete error:', error);
    return { success: false, error: error.message };
  }
});
