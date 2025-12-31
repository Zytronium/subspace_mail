const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  gmail: {
    authenticate: () => ipcRenderer.invoke('gmail:auth'),
    fetchEmails: (params) => ipcRenderer.invoke('gmail:fetch', params),
    sendEmail: (email) => ipcRenderer.invoke('gmail:send', email),
  },
  outlook: {
    authenticate: () => ipcRenderer.invoke('outlook:auth'),
    fetchEmails: (params) => ipcRenderer.invoke('outlook:fetch', params),
  },
  yahoo: {
    authenticate: () => ipcRenderer.invoke('yahoo:auth'),
    fetchEmails: (params) => ipcRenderer.invoke('yahoo:fetch', params),
  },
  imap: {
    connect: (config) => ipcRenderer.invoke('imap:connect', config),
    fetchEmails: (params) => ipcRenderer.invoke('imap:fetch', params),
    sendEmail: (params) => ipcRenderer.invoke('imap:send', params),
    disconnect: (user) => ipcRenderer.invoke('imap:disconnect', user),
  },
  store: {
    get: (key) => ipcRenderer.invoke('store:get', key),
    set: (key, value) => ipcRenderer.invoke('store:set', key, value),
    delete: (key) => ipcRenderer.invoke('store:delete', key),
  },
});
