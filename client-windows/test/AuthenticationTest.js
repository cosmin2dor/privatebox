var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const assert = chai.assert
const should = chai.should
const expect = chai.expect
const sinon = require('sinon')
const http = require('http')
const { Authentication } = require('../src/Authentication')

const TEST_CODE = "1136615712133170"
const TEST_USER_ID = 1

const TOKEN_DURATION = 24

const API_HOSTNAME = "simplevpn.tech"
const API_PORT = 8080

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_status_request(header) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_HOSTNAME,
            port: API_PORT,
            path: '/auth/status',
            method: 'GET',
            headers: header
        }

        const req = http.request(options, (response) => {
            response.setEncoding('utf8')
            let responseData = ''

            response.on('data', (chunk) => {
                responseData += chunk
            })

            response.on('end', () => {
                if (response.statusCode != 200) {
                    reject(Error(`Status code ${response.statusCode}`))
                    return
                }

                try {
                    let data = JSON.parse(responseData)

                    if (data.status == 'success') {
                        resolve(data.data.user_id)
                        return
                    } else {
                        reject(Error('Not successful'))
                        return
                    }
                } catch (e) {
                    reject(Error(e))
                    return
                }
            })

            response.on('error', (err) => {
                reject(Error(err))
                return
            })
        })

        req.end()
    })
}

describe('Auth Singleton', function() {
    it('It should return same instance', function() {
        assert.equal(new Authentication(), new Authentication())
    })
})

describe('Auth login', function() {
    let auth
    // Make sure we have a clean start
    before(function () {
        auth = new Authentication()
        auth.debug_reset()
    })

    it('First login', function() {
        return expect(auth.login(TEST_CODE))
            .to.be.fulfilled
    })

    it('Second login in a row', function() {
        return expect(auth.login(TEST_CODE))
            .to.be.rejectedWith(Error, "Trying to login but already logged in.")
    })

    it('Debug Reset', function() {
        auth.debug_reset()
        return expect(auth.login(TEST_CODE))
            .to.be.fulfilled
    })

    it('Unregistered unique code', function() {
        auth.debug_reset()
        let unregisteredCode = (parseInt(TEST_CODE) + 10).toString()

        return expect(auth.login(unregisteredCode))
            .to.be.rejectedWith(Error, "Status code 404")
    })

    it('Random alpha characters in unique code', function() {
        auth.debug_reset()
        let wrongCode = TEST_CODE.slice(0, TEST_CODE.length-1) + 'a'

        return expect(auth.login(wrongCode))
            .to.be.rejectedWith(Error, "Status code 404")
    })

    it('Wrong number of characters', function() {
        auth.debug_reset()
        let wrongCode = 'a'.repeat(10)

        return expect(auth.login(wrongCode))
            .to.be.rejectedWith(Error, "Status code 404")
    })

    it('Too many characters', function() {
        auth.debug_reset()
        let wrongCode = 'a'.repeat(512)

        return expect(auth.login(wrongCode))
            .to.be.rejectedWith(Error, "Status code 404")
    })

    it('Integer instead of String', function() {
        auth.debug_reset()
        let wrongCode = parseInt(TEST_CODE)

        return expect(auth.login(wrongCode))
            .to.be.rejectedWith(Error, "Status code 404")
    })
})

describe('Auth Refresh', function() {

    let auth

    before(function() {
        auth = new Authentication()
    })

    beforeEach(function() {
        auth.debug_reset()
    })

    it('Before login', function() {
        return expect(auth.refresh())
            .to.be.rejectedWith(Error, "Refresh before login")
    })

    it('Right after login', function() {
        return auth.login(TEST_CODE)
            .then(() => {
                let oldToken = auth._accessToken
                return expect(auth.refresh())
                    .to.eventually.be.equal(oldToken)
            })
            .catch((err) => expect(err).to.not.exist)
    })

    it('Unique code does not exist', function() {
        return auth.login(TEST_CODE)
            .then(() => {
                auth.uniqueCode = null
                return expect(auth.refresh())
                    .to.be.rejectedWith(Error, "Refresh without uniqueCode")
            })
            .catch((err) => expect(err).to.not.exist)
    })

    it('Fast-forward... expired', function() {
        return auth.login(TEST_CODE)
            .then(() =>
                sleep(1000)
                    .then(() => {
                        let oldToken = auth._accessToken
                        sinon.stub(Date, "now").returns(9587343257000)
        
                        return expect(auth.refresh())
                            .to.eventually.not.be.equal(oldToken)
                    })
                    .catch((err) => expect(err).to.not.exist)
            )
            .catch((err) => expect(err).to.not.exist)
    })

    it('Exactly 24 hours... expired', function() {
        return auth.login(TEST_CODE)
            .then(() =>
                sleep(1000)
                    .then(() => {
                        let oldToken = auth._accessToken
                        let _24hFromNow = Date.now() + 1000 * 3600 * TOKEN_DURATION
                        sinon.stub(Date, "now").returns(_24hFromNow)
        
                        return expect(auth.refresh())
                            .to.eventually.not.be.equal(oldToken)
                    })
                    .catch((err) => expect(err).to.not.exist)
            )
            .catch((err) => expect(err).to.not.exist)
    })

    it('Slightly less than 24 hours... expired', function() {
        return auth.login(TEST_CODE)
            .then(() => 
                sleep(1000)
                    .then(() => {
                        let oldToken = auth._accessToken
                        let _24hFromNow = Date.now() + 1000 * 3600 * TOKEN_DURATION - 9000
                        sinon.stub(Date, "now").returns(_24hFromNow)
        
                        return expect(auth.refresh())
                            .to.eventually.not.be.equal(oldToken)
                    })
                    .catch((err) => expect(err).to.not.exist)
            )
            .catch((err) => expect(err).to.not.exist)
    })

    it('Slightly lesser than 24 hours... expired', function() {
        return auth.login(TEST_CODE)
            .then(() =>
                sleep(1000)
                    .then(() => {
                        let oldToken = auth._accessToken
                        let _24hFromNow = Date.now() + 1000 * 3600 * TOKEN_DURATION - 11000
                        sinon.stub(Date, "now").returns(_24hFromNow)
        
                        return expect(auth.refresh())
                            .to.eventually.not.be.equal(oldToken)
                    })
                    .catch((err) => expect(err).to.not.exist)
            )
            .catch((err) => expect(err).to.not.exist)
    })

    it('Refresh after logout', function() {
        return auth.logout()
            .catch((err) => expect(err).to.exist)
    })

    afterEach(function() {
        if (Date.now.restore) {
            Date.now.restore()
        }
    })
})

describe('Auth headers', function() {

    let auth

    before(async function() {
        auth = new Authentication()
    })

    this.beforeEach(function() {
        auth.debug_reset()
    })

    it('Headers before login', async function() {
        return auth.auth_header()
            .then((header) => expect(header).to.not.exist)
            .catch((err) => expect(err.message).to.equal("Refresh before login"))
    })

    it('Headers after login', async function() {
        return auth.login(TEST_CODE)
            .then(() => auth.auth_header()
            .then((header) => expect(get_status_request(header))
                .to.eventually.be.equal(TEST_USER_ID)))
            .catch((err) => expect(err).to.not.exist)
    })

    it('Headers after logout', async function() {
        return auth.login(TEST_CODE)
            .then(() => 
                auth.logout()
                .then(() => auth.auth_header()
                .then((header) => expect(header)
                    .to.not.exist))
                .catch((err) => expect(err).to.exist)
            )
            .catch((err) => expect(err).to.not.exist)
    })
})

describe('Logout', function() {

    let auth

    before(async function() {
        auth = new Authentication()
    })

    this.beforeEach(function() {
        auth.debug_reset()
    })

    it('Logout before login', function() {
        return expect(auth.logout())
            .to.be.rejectedWith(Error, "Refresh before login")
    })

    it('Logout without token', function() {
        return auth.login(TEST_CODE)
            .then(() => {
                auth._accessToken = null
                return expect(auth.logout())
                    .to.be.rejectedWith(Error, "Token is missing")
            })
    })

    it('Logout after login', function() {
        return sleep(1000)
            .then(() => 
                auth.login(TEST_CODE)
                .then(() => expect(auth.logout())
                    .to.be.fulfilled
                )
            )
    })

    it('Double logout', function() {
        return auth.login(TEST_CODE)
            .then(() => auth.logout()
            .then(() => expect(auth.logout())
                .to.be.rejected
            ))
    })
})