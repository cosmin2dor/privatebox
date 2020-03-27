const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')

function gen_wg_conf(client_privateKey, server_pubKey, server_endpoint, server_port, client_address) {
    template = `[Interface]
Address = ${client_address}/24
DNS = 8.8.8.8
PrivateKey = ${client_privateKey}

[Peer]
PublicKey = ${server_pubKey}
Endpoint = ${server_endpoint}:${server_port}
AllowedIPs = 0.0.0.0/0
PersistantKeepalive = 30`

    fs.writeFileSync("wg.conf", template)
}

function initiate_tunnel(client_privateKey, server_pubKey, server_endpoint, server_port, client_address) {
    gen_wg_conf(client_privateKey, server_pubKey, server_endpoint, server_port, client_address)

    exec(`${path.resolve("bin/wireguard.exe")} /installtunnelservice ${path.resolve("wg.conf")}`, function (err, stdout, stderr) {
        if (err) {
            console.log(err)
        }

        console.log(stdout)
    })
}

function stop_tunnel(tunnel_name) {
    exec(`${path.resolve("bin/wireguard.exe")} /uninstalltunnelservice ${tunnel_name}`, function (err, stdout, sterr) {
        if (err) {
            console.log(err)
        }
    })
}

function gen_private_key() {
    return new Promise((resolve, reject) => {
        exec(`${path.resolve("bin/wg.exe")} genkey`, function(err, stdout, sterr) {
            if (err) {
                reject(err)
            }

            resolve(stdout.trim())
        })
    })
}

function gen_public_key(private_key) {
    return new Promise((resolve, reject) => {
        exec(`echo ${private_key} | ${path.resolve("bin/wg.exe")} pubkey`, function(err, stdout, sterr) {
            if (err) {
                reject(err)
            }
    
            resolve(stdout.trim())
        })
    })
}

async function gen_keys() {
    // TODO
    // Add these to the app data storage
    // Don't keep them in plain text
    private_key = await gen_private_key()
    public_key = await gen_public_key(private_key)

    fs.writeFile('private', private_key, function (err, data) {
        if (err) {
            console.log(err)
            return -1
        }
    })

    fs.writeFile('public', public_key, function (err, data) {
        if (err) {
            console.log(err)
            return -1
        }
    })
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

initiate_tunnel("2IGMhhCMv498uQbdd6s7fyWfnJ7+qN2dfMXHZAWwSVk=",
                "4ObAM0rffIX/yrRAO5jF/NlQGNnXZt346vMPBzcLB20=",
                "209.250.254.111",
                "51820",
                "10.8.0.2")

console.log("Tunnel started... Waiting 10 seconds.")
sleep(30000).then(() => {
    console.log("Timeout, Closing the tunnel...")
    stop_tunnel("wg")
})