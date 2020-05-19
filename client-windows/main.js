const electron = require('electron')
const { autoUpdater } = require('electron-updater')
const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = electron
const { Authentication } = require('./src/Authentication')
const log = require('electron-log')
const http = require('http');
const wg = require('./src/wg')

const util = require('util')

const constants = require('./src/Constants')
const WG = new wg.WG()

const MAX_RETRIES = 3

let win;

async function createWindow() {
    win = new BrowserWindow({
        // 370
        width: 370,
        height: 622,
        frame: false,
        title: "SimpleVPN Client",
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (new Authentication().loggedIn) {
        win.loadURL('http://localhost:3000/main');
    } else {
        win.loadURL('http://localhost:3000/login');
    }

    // Handle the autoupdater
    win.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify()
    })

    win.once('close', function() {
        log.debug("Shutting down... Stopping tunnel.")
        WG.stop_tunnel()
    })
}

app.whenReady()
    .then(createWindow)
    .then(() => {
        tray = new Tray('./src/assets/logo_tray.png')

        const contextMenu = Menu.buildFromTemplate([
            { label: 'Show', click: () => {
                win.show();
            }},
            { label: 'Quit', click: () => {
                app.quit()
            }}
          ])

        tray.setToolTip('SimpleVPN')
        tray.setContextMenu(contextMenu)
    })

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() })
})

ipcMain.on('tray', (event) => {
    log.debug("Closing the app to tray")
    event.preventDefault();
    win.hide();
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

ipcMain.on('login', (event, uniqueCode) => {
    log.debug("Logging in with " + uniqueCode)

    new Authentication().login(uniqueCode)
        .then(() => event.sender.send('loginResult', 'ok'))
        .catch((err) => {
            if (err.message == "Status code 404") {
                dialog.showErrorBox("Your Unique Code does not appear to be registered", "Please contact us at simplevpn.tech if you think it's a mistake.")
            }
        })
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

ipcMain.on('get_locations_request', async (event) => {
    log.debug("Getting locations")

    const options = {
        hostname: constants.API_HOSTNAME,
        port: constants.API_PORT,
        path: '/get_locations',
        method: 'GET',
        headers: await new Authentication().auth_header()
    }

    const req = http.request(options, (response) => {
        response.setEncoding('utf8')
        let responseData = ''

        response.on('data', (chunk) => {
            responseData += chunk
        })

        response.on('end', () => {
            if (response.statusCode != 200) {
                log.error(`Non successful response: ${response.statusCode}`)
            }

            try{
                let data = JSON.parse(responseData)

                let locations = data.data.locations
                log.debug(`Get locations got: ${locations}`)

                event.sender.send('get_locations_result', locations)
                return

            } catch (e) {
                log.error('Get locations got invalid data')
            }
        })
    })

    req.end()

    event.sender.send('get_locations_result', 'failed')
})

async function request_connection(country_code, client_pubKey, client_privKey, num_retry, callback) {

    log.debug("Request connection called")

    let auth_header

    try {
        auth_header = new Authentication().auth_header()
    } catch(err) {
        log.error("Connection request auth failed with: " + err)
        // TODO If there is a connection error, pop the dialog, if timeout raise timeout and retry
        return callback(Error("Auth failed"))
    }

    const postData = JSON.stringify({
        'country_code': country_code,
        'pub_key': await client_pubKey,
    })

    const options = {
        hostname: constants.API_HOSTNAME,
        port: constants.API_PORT,
        path: '/request_connection',
        method: 'POST',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': (await auth_header).Authorization,
        }
    }

    const req = http.request(options, (response) => {
        response.setEncoding('utf8')
        let responseData = ''

        response.on('data', (chunk) => {
            responseData += chunk
        })

        response.on('end', async () => {
            if (response.statusCode != 200) {
                log.error(`Request connection response: ${response.statusCode}`)

                let data = JSON.parse(responseData)

                log.error(data.message)

                if (data.message == "Device already connected. Please disconnect first." || data.message == "Device already connected.") {

                    request_revoke(client_pubKey, 0, (err) => {
                        if (err) {
                            return callback(Error("connection error"))
                        }
                    })

                    await sleep(1000)

                    if (num_retry < MAX_RETRIES) {
                        log.debug("Retrying Request Connection")
                        return request_connection(country_code, client_pubKey, client_privKey, num_retry + 1, callback)
                    } else {
                        log.debug("Request Connection failed")
                        return callback(Error("connection error"))
                    }
                }
            }

            try {
                let data = JSON.parse(responseData)
                let status = data.status

                if (status == "success") {
                    log.debug("Starting the tunnel.")
                    WG.initiate_tunnel(
                        (await client_privKey),
                        data.data.node_pub_key,
                        data.data.external_endpoint,
                        data.data.wg_port,
                        data.data.assigned_ip
                    )
                        
                    setTimeout(async () => {
                        let logs = WG.get_logs()

                        if ((await logs).includes("Connection established.")) {
                            log.debug("Connection established!")
                            win.webContents.send('connected')
                            return callback(null)
                        } else {
                            log.debug("Connection failed!")
                            return callback(Error("connection failed"))
                        }
                    }, 1000)
                }
            } catch (e) {
                log.error('Request connection got invalid data ' + e)
                return callback(Error("bad response"))
            }
        })
    })

    req.on('error', (err) => {
        if (err.errno == "ENOTFOUND") {
            return callback(Error("connection error"))
        }
    })

    req.on('timeout', () => {
        log.debug("Request Connection Timeout")

        if (num_retry < MAX_RETRIES) {
            log.debug("Retrying Request Connection")
            return request_connection(country_code, client_pubKey, client_privKey, num_retry + 1, callback)
        } else {
            log.debug("Request Connection failed")
            return callback(Error("connection error"))
        }
    })

    req.write(postData)
    req.end()
}

ipcMain.on('connect', async (event, country_code) => {
    log.debug(`Connecting to ${country_code}`)

    let client_pubKey = WG.get_pubKey()
    let client_privKey = WG.get_privKey()

    request_connection(country_code, client_pubKey, client_privKey, 0, async (err) => {

        if (err != null) {
            if (err.message == "connection failed") {
                win.webContents.send('connection_error')
                dialog.showErrorBox("Connection has failed.",
                "We do appologies for this issue. Please restart the app and try again.")

            } else if (err.message == "bad response") {
                // break
            } else if (err.message == "connection error" || err.message == "Auth failed") {
                win.webContents.send('connection_error')
                dialog.showErrorBox("A Connection Error has occured.",
                "Please make sure you have a working Internet Connection")
            }
        }
    })
})

async function request_revoke(client_pubKey, num_retry, callback) {
    let auth_header

    try {
        auth_header = new Authentication().auth_header()
    } catch(err) {
        log.error("Connection revoke auth failed with: " + err)
        // TODO If there is a connection error, pop the dialog, if timeout raise timeout and retry
        return callback(Error("Auth failed"))
    }

    const postData = JSON.stringify({
        'pub_key': await client_pubKey
    })
    
    const options = {
        hostname: constants.API_HOSTNAME,
        port: constants.API_PORT,
        path: '/revoke_connection',
        method: 'POST',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': (await auth_header).Authorization,
        }
    }

    const req = http.request(options, (response) => {
        response.setEncoding('utf8')
        let responseData = ''

        response.on('data', (chunk) => {
            responseData += chunk
        })

        response.on('end', () => {
            if (response.statusCode != 200) {
                log.error(`Revoke connection response: ${response.statusCode}`)

                let data = JSON.parse(responseData)

                if (data.message == "Cannot revoke, device not connected.") {
                    log.debug(data.message)

                    log.debug("Stopping the tunnel.")
                    WG.stop_tunnel()

                    return callback(Error("not connected"))
                }
            }

            try{
                let data = JSON.parse(responseData)
                let status = data.status

                if (status == "success") {
                    log.debug("Stopping the tunnel.")
                    WG.stop_tunnel()

                    win.webContents.send('disconnected')

                    return callback(null)
                }
                

            } catch (e) {
                log.error('Revoke connection got invalid data ' + e)
                return callback(Error("bad response"))
            }
        })
    })

    req.on('timeout', () => {
        if (num_retry < MAX_RETRIES) {
            log.debug("Retrying Revoke Connection")
            request_revoke(client_pubKey, num_retry + 1, callback)
        } else {
            log.debug("Revoke Connection failed")
            return callback(Error("connection error"))
        }
    })

    req.write(postData)
    req.end()
}

ipcMain.on('disconnect', async (event) => {
    log.debug(`Disconnecting...`)

    
    let client_pubKey = WG.get_pubKey()

    request_revoke(client_pubKey, 0, (err) => {

        if (err != null) {
            if (err.message == "connection error") {
                win.webContents.send('connection_error')
            } else if (err.message == "bad response") {

            } else if (err.message == "not connected") {
                win.webContents.send('disconnected')
            } else if (err.message == "Auth failed") {
                win.webContents.send('connection_error')
                dialog.showErrorBox("A Connection Error has occured.",
                "Please make sure you have a working Internet Connection")
            }
        }
    })
})