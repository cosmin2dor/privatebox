const Store = require('electron-store');
const log = require('electron-log');
const request = require('request');

const API_ENDPOINT = "http://localhost:8080/auth"

class Authentication {
    
    static instance;
    
    constructor () {
        if (this.instance) {
            return this.instance
        }

        this.store = new Store()

        // Initiate from storage
        this.loggedIn = this.store.get("loggedIn", false)
        this.accessToken = this.store.get("accessToken", null)
        this.expireDate = this.store.get("expireDate", null)
        this.uniqueCode = this.store.get("uniqueCode", null)

        this.instance = this
    }

    store_value(key, value) {
        if (value == null) {
            this.store.delete(key)
        } else {
            this.store.set(key, value)
        }
    }

    set loggedIn(value) {
        // Store and set
        this.store_value("loggedIn", value)
        this.loggedIn = value
    }

    set accessToken(value) {
        // TODO Validate
        // Store and set
        this.store_value("accessToken", value)
        this.accessToken = value
    }

    set expireDate(value) {
        // TODO Validate
        // Store and set
        this.store_value("expireDate", value)
        this.expireDate = value
    }

    set uniqueCode(value) {
        // Store and set
        this.store_value("uniqueCode", value)
        this.uniqueCode = value
    }

    /*
        Calls login function with uniqueCode
        Gets a *fresh* accessToken and a refreshToken 
    */
    login(uniqueCode) {
        // User should not be already logged in
        if (this.loggedIn) {
            // TODO Maybe we should logout automatically? Or just pop Error Message
            log.debug("Trying to login but already logged in.")
            throw Error("Trying to login but already logged in.")
        }

        // Request login
        const options = {
            url: API_ENDPOINT + '/login',
            method: 'POST',
            form: {
                'unique_id': uniqueCode
            },
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'node agent'
            }
        }
        
        request(options, function(err, res, body) {
            if (err) {
                log.error(err)
                throw err
            }

            if (res.statusCode != 200) {
                log.error(`Non successful response: ${res.statusCode}`)
                throw Error("Status code not 200")
            }

            // TODO Implement JSON Schema for validation
            try {
                let data = JSON.parse(body)
                log.debug(`Login got: ${data}`)

                // IMMEDIATE TODO Change name to match json schema and check if uses setters
                this.accessToken = data.auth_token
                this.expireDate = data.expireDate

                this.uniqueCode = uniqueCode
                this.loggedIn = true

                log.debug("Login was successfully.")
            } catch (e) {
                log.error("Login got invalid data " + e.stack)
            }   
        })
    }

    refresh() {
        // User should be logged in
        if (!this.loggedIn) {
            // TODO Maybe we should logout automatically? Or just pop Error Message
            log.debug("Cannot refresh if not logged in first")
            throw Error("Refresh before login")
        }

        if (this.uniqueCode == null) {
            log.debug("Refresh with uniqueCode null")
            throw Error("Refresh without uniqueCode")
        }

        // Checking if the token expired
        var now = Date.now()
        // Add a buffer of 10 seconds to account for the request delay
        var expireDate = this.expireDate
        expireDate.setSeconds(expireDate.getSeconds() + 10)

        if (now < expireDate) {
            log.debug(`Did not refresh token, now=${now} expireDate=${this.expireDate}`)
            return
        }

        // Request login
        const options = {
            url: API_ENDPOINT + '/login',
            method: 'POST',
            form: {
                'unique_id': this.uniqueCode
            },
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'node agent'
            }
        }
        
        request(options, function(err, res, body) {
            if (err) {
                log.error(err)
                throw err
            }

            if (res.statusCode != 200) {
                log.error(`Non successful response: ${res.statusCode}`)
                throw Error("Status code not 200")
            }

            // TODO Implement JSON Schema for validation
            try {
                let data = JSON.parse(body)
                log.debug(`Refresh got: ${data}`)

                // IMMEDIATE TODO Change name to match json schema and check if uses setters
                this.accessToken = data.auth_token
                this.expireDate = data.expireDate

                log.debug("Refresh was successfully.")
            } catch (e) {
                log.error("Refresh got invalid data " + e.stack)
            }   
        })
    }

    logout() {
        this.accessToken = null
        this.expireDate = null
        this.loggedIn = false
        this.uniqueCode = null
    }

    get accessToken() {
        this.refresh()
        return this.accessToken
    }
}

module.exports.Authentication
