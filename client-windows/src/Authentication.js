const log = require('electron-log');
const http = require('http');
const Store = require('electron-store');

const API_ENDPOINT = "http://simplevpn.tech:8080/auth"
const API_HOSTNAME = "simplevpn.tech"
const API_PORT = 8080

class Authentication {
    
    static instance = null
    
    constructor () {
        if (Authentication.instance != null) {
            return Authentication.instance
        }

        this.store = new Store()

        // Initiate from storage
        this._loggedIn = this.store.get("loggedIn", false)
        this._accessToken = this.store.get("accessToken", null)
        this._expireDate = this.store.get("expireDate", null)
        this._uniqueCode = this.store.get("uniqueCode", null)
        
        Authentication.instance = this
    }

    store_value(key, value) {
        if (value == null) {
            this.store.delete(key)
        } else {
            this.store.set(key, value)
            log.debug(`Storing [${key}]=${value}`)
        }
    }

    debug_reset() {
        log.debug("DEBUG MODE")
        this.store = new Store()

        this.loggedIn = false
        this.accessToken = null
        this.expireDate = null
        this.uniqueCode = null
    }

    set loggedIn(value) {
        log.debug(`Setting loggedIn to ${value}`)
        // Store and set
        this.store_value("loggedIn", value)
        this._loggedIn = value
        log.debug(`Actual value is ${this._loggedIn}`)
    }

    set accessToken(value) {
        // TODO Validate
        // Store and set
        this.store_value("accessToken", value)
        this._accessToken = value
    }

    set expireDate(value) {
        // TODO Validate
        // Store and set
        this.store_value("expireDate", value)
        this._expireDate = value
    }

    set uniqueCode(value) {
        // Store and set
        this.store_value("uniqueCode", value)
        this._uniqueCode = value
    }

    get loggedIn() {
        return this._loggedIn
    }

    get expireDate() {
        return this._expireDate
    }

    get uniqueCode() {
        return this._uniqueCode
    }

    get accessToken() {
        return this._accessToken
    }

    mock_expire() {
        let now = Date.now()
        return (now + 1000 * 3600 * 24)
    }

    /*
        Calls login function with uniqueCode
        Gets a *fresh* accessToken and a refreshToken 
    */
    login(uniqueCode) {
        return new Promise((resolve, reject) => {
            log.debug(`logging in with loggedIn=${this.loggedIn}`)
            // User should not be already logged in
            if (this.loggedIn) {
                // TODO Maybe we should logout automatically? Or just pop Error Message
                log.debug("Trying to login but already logged in.")
                reject(Error("Trying to login but already logged in."))
                return
            }
    
            // Request login
            const postData = JSON.stringify({
                'unique_id': uniqueCode
            })
    
            const options = {
                hostname: API_HOSTNAME,
                port: API_PORT,
                path: '/auth/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
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
                        log.error(`Non successful response: ${response.statusCode}`)
                        reject(Error(`Status code ${response.statusCode}`))
                        return
                    }
    
                    try {
                        let data = JSON.parse(responseData)
                        log.debug(`Login got: ${{data}}`)
    
                        if (data.status == 'success') {
                            this.accessToken = data.auth_token
                            this.expireDate = this.mock_expire()
                            console.log(`Expiration date ${this.expireDate}`)
    
                            this.uniqueCode = uniqueCode
                            this.loggedIn = true
    
                            log.debug('Login successfully.')
                            resolve()
                            return
                        } else {
                            this.loggedIn = false
                            log.debug('Login was not successfully.')
                            reject('Login not successful')
                            return
                        }
                    } catch (e) {
                        log.error('Login got invalid data')
                        reject(Error(e))
                        return
                    }
                })
    
                response.on('error', (err) => {
                    log.error('Error while requesting login')
                    reject(Error(err))
                    return
                })
            })

            req.write(postData)
            req.end()
        })
    }

    refresh() {
        return new Promise((resolve, reject) => {
            // User should be logged in
            if (!this.loggedIn) {
                // TODO Maybe we should logout automatically? Or just pop Error Message
                log.debug("Cannot refresh if not logged in first")
                reject(Error("Refresh before login"))
                return
            }
    
            if (this.uniqueCode == null) {
                log.debug("Refresh with uniqueCode null")
                reject(Error("Refresh without uniqueCode"))
                return
            }
    
            // Checking if the token expired
            var now = Date.now()
            // Add a buffer of 10 seconds to account for the request delay
            var expireDate = new Date(this.expireDate)
            expireDate.setSeconds(expireDate.getSeconds() - 10)
    
            if (now < expireDate) {
                log.debug(`Did not refresh token, now=${now} expireDate=${this.expireDate}`)
                resolve(this._accessToken)
                return
            }
    
            // Request login
            const postData = JSON.stringify({
                'unique_id': this.uniqueCode
            })
    
            const options = {
                hostname: API_HOSTNAME,
                port: API_PORT,
                path: '/auth/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
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
                        log.error(`Non successful response: ${response.statusCode}`)
                        reject(Error(`Status code ${response.statusCode}`))
                        return
                    }
    
                    try {
                        let data = JSON.parse(responseData)
                        log.debug(`Refresg got: ${{data}}`)
    
                        if (data.status == 'success') {
                            log.debug(`oldToken=${this._accessToken} newToken=${data.auth_token}`)
                            this.accessToken = data.auth_token
                            this.expireDate = this.mock_expire()
    
                            log.debug('Refresh successfully.')
                            resolve(data.auth_token)
                            return
                        } else {
                            this.loggedIn = false
                            log.debug('Refresh was not successfully.')
                            reject(Error('Refresh not successful'))
                            return
                        }
                    } catch (e) {
                        log.error('Refresh got invalid data')
                        reject(Error(e))
                        return
                    }
                })
    
                response.on('error', (err) => {
                    log.error('Error while requesting refresh')
                    reject(Error(err))
                    return
                })
            })

            req.write(postData)
            req.end()
        })
    }

    async logout() {
        let header = await this.auth_header()

        return new Promise((resolve, reject) => {

            // You have to be logged in before logging out
            if (!this.loggedIn) {
                reject(Error("Logout before login"))
                return
            }

            if (this.accessToken == null) {
                reject(Error("Token is missing"))
                return
            }

            // Logout request

            const options = {
                hostname: API_HOSTNAME,
                port: API_PORT,
                path: '/auth/logout',
                method: 'POST',
                headers: header
            }

            log.debug(options)
    
            const req = http.request(options, (response) => {
                response.setEncoding('utf8')
                let responseData = ''
    
                response.on('data', (chunk) => {
                    responseData += chunk
                })
    
                response.on('end', () => {
                    if (response.statusCode != 200) {
                        log.error(`Non successful response: ${response.statusCode}`)
                        reject(Error(`Status code ${response.statusCode}`))
                        return
                    }
    
                    try {
                        let data = JSON.parse(responseData)
                        log.debug(`Logout got: ${{data}}`)
    
                        if (data.status == 'success') {
                            this.accessToken = null
                            this.expireDate = null
                            this.loggedIn = false
                            this.uniqueCode = null
    
                            log.debug('Logout successfully.')
                            resolve()
                            return
                        } else {
                            this.loggedIn = false
                            log.debug('Logout was not successfully.')
                            reject(Error('Logout not successful'))
                            return
                        }
                    } catch (e) {
                        log.error('Logout got invalid data')
                        reject(Error(e))
                        return
                    }
                })
    
                response.on('error', (err) => {
                    log.error('Error while requesting logout')
                    reject(Error(err))
                    return
                })
            })
    
            req.end()
        })
    }

    async auth_header() {
        return this.refresh()
            .then((token) => {
                return {
                    'Authorization': 'Bearer ' + token
                }
            })
            .catch((error) => {
                return Promise.reject(error)
            })
    }
}

module.exports.Authentication = Authentication
