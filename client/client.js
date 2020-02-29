const http = require('http')
const { exec } = require('child_process')
const fs = require('fs')

// TODO Find a way to get these from the server
var server_ip = "209.250.254.111"
var server_pubKey = "4ObAM0rffIX/yrRAO5jF/NlQGNnXZt346vMPBzcLB20="


async function send_connection_request(server_ip, server_pubKey) {
    const data = JSON.stringify({
        //Hardcoded, we use only one client
        pubKey: "VoFEafYuGJvWmhzQYMMhgEXOKQilrbkjJSUwT1xZOW4="
    })

    console.log(data)

    const options = {
        hostname: server_ip,
        port: 3182,
        path: '/request-accept',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = http.request(options, response => {
        if (response.statusCode == 200) {
            // up_if()
            add_server_peer(server_pubKey)
        }
    })

    req.on('error', err => {
        console.log("send connection failed!")
    })

    req.write(data)
    req.end()
}

function up_if() {
    cmd = `wg-quick up wg0`
    console.log(cmd)
    exec(cmd)
}

function add_server_peer(pubKey) {
    conf = `[Interface]
Address = 10.0.0.2/24
PrivateKey = 2IGMhhCMv498uQbdd6s7fyWfnJ7+qN2dfMXHZAWwSVk=

[Peer]
PublicKey = ${pubKey}
Endpoint = ${server_ip}:51820
AllowedIPs = 0.0.0.0/0`

    console.log(conf)

    fs.writeFile('/etc/wireguard/wg0.conf', conf, function(err) {
        if (err) {
            throw Error('Saving config to file failed.')
        }
    })

    up_if()
}

// function add_server_peer(pubKey) {
//     // cmd = `wg set wg0 peer ${pubKey} allowed-ips 0.0.0.0/24 endpoint ${server_ip}:51820`
//     cmd = "wg set wg0 peer " + pubKey + " allowed-ips 0.0.0.0/24 endpoint " + server_ip + ":51820"
//     // cmd = "wg set wg0 peer 4ObAM0rffI/hyrRAO5jFhNlQGNnXZt346vMPBzcLB20= allowed-ips 0.0.0.0/24 endpoint 209.250.254.111:51820"
//     console.log(cmd)
//     exec(cmd)
// }


console.log("Sending connection request to " + server_ip)
send_connection_request(server_ip, server_pubKey)