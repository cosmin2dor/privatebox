const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')

const CONF_PATH = "bin/Config/wg.conf"
const TS_PATH = "bin/ts.exe"
const PUBKEY_PATH = "pubKey"
const PRIVKEY_PATH = "privKey"

class WG {
    gen_wg_conf(client_privateKey, server_pubKey, server_endpoint, server_port, client_address) {
        let template = `[Interface]
Address = ${client_address}
DNS = 8.8.8.8
PrivateKey = ${client_privateKey}

[Peer]
PublicKey = ${server_pubKey}
Endpoint = ${server_endpoint}:${server_port}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`
    
        fs.writeFileSync(CONF_PATH, template)
    }
    
    initiate_tunnel(client_privateKey, server_pubKey, server_endpoint, server_port, client_address) {
        console.log("asdfjhisahudasuydsauh")
        this.gen_wg_conf(client_privateKey, server_pubKey, server_endpoint, server_port, client_address)
    
        exec(`${path.resolve(TS_PATH)} start ${path.resolve(CONF_PATH)}`, function (err, stdout, stderr) {
            console.log("asdfjhisahudasuydsauh")
            if (err) {
                console.log(err)
            }
    
            console.log(stdout)
        })
    }
    
    stop_tunnel() {
        exec(`${path.resolve(TS_PATH)} stop`, function (err, stdout, sterr) {
            if (err) {
                console.log(err)
            }
        })
    }
    
    gen_private_key() {
        return new Promise((resolve, reject) => {
            exec(`${path.resolve("bin/wg.exe")} genkey`, function(err, stdout, sterr) {
                if (err) {
                    reject(err)
                }
    
                resolve(stdout.trim())
            })
        })
    }
    
    gen_public_key(private_key) {
        
        return new Promise((resolve, reject) => {
            exec(`echo ${private_key} | ${path.resolve("bin/wg.exe")} pubkey`, function(err, stdout, sterr) {
                if (err) {
                    reject(err)
                }
        
                resolve(stdout.trim())
            })
        })
    }

    get_logs() {
        return new Promise((resolve, reject) => {
            exec(`${path.resolve(TS_PATH)} log`, function(err, stdout, stderr) {
                if (err) {
                    reject(err)
                }
    
                resolve(stdout)
            })
        })
    }
    
    async gen_keys() {
        // TODO
        // Add these to the app data storage
        // Don't keep them in plain text
        let private_key = await this.gen_private_key()
        let public_key = await this.gen_public_key(private_key)
    
        fs.writeFileSync(PRIVKEY_PATH, private_key)
        fs.writeFileSync(PUBKEY_PATH, public_key)
    }

    async get_pubKey() {

        if (!fs.existsSync(PUBKEY_PATH) || !fs.existsSync(PRIVKEY_PATH)) {
            await this.gen_keys()
        }

        const public_key = fs.readFileSync(PUBKEY_PATH, 'utf8')

        return public_key
    }

    async get_privKey() {

        if (!fs.existsSync(PUBKEY_PATH) || !fs.existsSync(PRIVKEY_PATH)) {
            await this.gen_keys()
        }

        const private_key = fs.readFileSync(PRIVKEY_PATH, 'utf8')

        return private_key
    }
}

module.exports.WG = WG


// async function test() {
//     wg = new WG()
//     let pubKey = await wg.get_privKey()
//     console.log(pubKey)
// }

// test()

// wg = new WG()
// wg.initiate_tunnel(
//     "2IGMhhCMv498uQbdd6s7fyWfnJ7+qN2dfMXHZAWwSVk=",
//     "4ObAM0rffIX/yrRAO5jF/NlQGNnXZt346vMPBzcLB20=",
//     "209.250.254.111",
//     "51820",
//     "10.1.0.2/24"
// )
// wg.stop_tunnel()

// const sleep = (milliseconds) => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds))
// }

// initiate_tunnel("2IGMhhCMv498uQbdd6s7fyWfnJ7+qN2dfMXHZAWwSVk=",
//                 "4ObAM0rffIX/yrRAO5jF/NlQGNnXZt346vMPBzcLB20=",
//                 "209.250.254.111",
//                 "51820",
//                 "10.8.0.2")

// console.log("Tunnel started... Waiting 10 seconds.")
// sleep(30000).then(() => {
//     console.log("Timeout, Closing the tunnel...")
//     stop_tunnel("wg")
// })