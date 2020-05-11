const electron = require('electron')
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = electron
const { Authentication } = require('./src/Authentication')

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL('http://localhost:3000');
    // Handle the autoupdater
    win.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify()
    })

    auth = new Authentication()
    console.log(auth)
}

app.whenReady()
    .then(createWindow)

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() })
})

// Auto updater notifications
autoUpdater.on('update-available', () => {
    win.webContents.send('update-available')
})

autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded')
})

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});