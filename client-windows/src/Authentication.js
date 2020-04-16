const Store = require('electron-store');
const log = require('electron-log');
const request = require('request');

const API_ENDPOINT = "http://localhost:8080"

class Authentication {
    
    static instance;
    
    constructor () {
        if (instance) {
            return instance
        }

        this.store = new Store()

        // Initiate from storage
        this.loggedIn = this.store.get("loggedIn", false)
        this.accessToken = this.store.get("accessToken", null)
        this.refreshToken = this.store.get("refreshToken", null)
        this.expireDate = this.store.get("expireDate", null)

        this.instance = this
    }

    set loggedIn(value) {
        // Store and set
        this.store.set("loggedIn", value)
        this.loggedIn = value
    }

    set accessToken(value) {
        // TODO Validate
        // Store and set
        this.store.set("accessToken", value)
        this.accessToken = value
    }

    set refreshToken(value) {
        // TODO Validate
        // Store and set
        this.store.set("refreshToken", value)
        this.refreshToken = value
    }

    set expireDate(value) {
        // TODO Validate
        // Store and set
        this.store.set("expireDate", value)
        this.expireDate = value
    }

    /*
        Requires an loggedIn state and non-null accessToken and refreshToken
        Checks if the token expired and tries to renew it if that's the case
        Must be called before any attempt to get the accessToken
    */
    refresh() {
        // We can refresh only if we've logged in in the past
        if (!this.loggedIn) {
            log.debug("Cannot refresh, User is not logged in")
            throw Error("User is not logged in")
        }

        // Checking Authentication State Integrity
        if (this.accessToken == null || this.refresh == null) {
            // TODO General Error Message, logout the user and force him to log again
            log.error("Invalid Authentication State. Refreshing with null components.")
            log.debug(`Refreshing with accessToken=${this.accessToken} refreshToken=${this.refresh}`)
            throw Error("Refreshing with null components")
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

        // Refresh the token
        const options = {
            url: API_ENDPOINT + '/refresh_token',
            method: 'POST',
            form: {
                // TODO Change this
                'refresh_token': this.refreshToken
            },
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'node agent'
            }
        };
        
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
                let data = JSON.parse(body);
                log.debug(`Refresh got: ${data}`)

                // IMMEDIATE TODO Change name to match json schema and check if uses setters
                this.accessToken = data.accessToken
                this.refreshToken = data.refreshToken
                this.expireDate = data.expireDate

                log.debug("Token successfuly refreshed.")

            } catch (e) {
                log.error("Refresh got invalid data " + e.stack)
            }    
        });
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
                'unique_code': uniqueCode
            },
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'node agent'
            }
        };
        
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
                this.accessToken = data.accessToken
                this.refreshToken = data.refreshToken
                this.expireDate = data.expireDate

                log.debug("Login was successfully.")
            }
        });
    }

    logout() {
        this.accessToken = null
        this.refreshToken = null
        this.expireDate = null
        this.loggedIn = false
    }

    get accessToken() {
        this.refresh()
        return this.accessToken
    }
}

export default Authentication