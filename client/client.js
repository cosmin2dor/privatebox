const http = require('http')
const { exec } = require('child_process')
const fs = require('fs')

// TODO Find a way to get these from the server
// var hard_server_ip = "209.250.254.111"
// var hard_server_pubKey = "4ObAM0rffIX/yrRAO5jF/NlQGNnXZt346vMPBzcLB20="

let api_server_ip = "172.105.73.141"
let comms_port = "5000"
let countries = null

async function send_connection_request(server_ip, server_pubKey) {
    const data = JSON.stringify({
        pubKey: "VoFEafYuGJvWmhzQYMMhgEXOKQilrbkjJSUwT1xZOW4="
        // pubKey: server_pubKey
    })

    console.log(data)

    const options = {
        hostname: server_ip,
        port: comms_port,
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
            add_server_peer(server_ip, server_pubKey)
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

function add_server_peer(server_ip, pubKey) {
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

async function get_countries(api_server_ip, api_server_port) {

    return new Promise((resolve, reject) => {
        endpoint = "http://" + api_server_ip+ ":" + api_server_port + '/get_nodes'
        console.log(endpoint)

        http.get(endpoint, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            resolve(data.replace(/\"/g, "")
                            .replace("[", "").replace("]", "")
                            .split(", "))
        });

        }).on("error", (err) => {
            reject("Error: " + err.message)
        });
    })
}

async function get_tunnel_config(api_server_ip, api_server_port, country) {

    return new Promise((resolve, reject) => {
        endpoint = "http://" + api_server_ip+ ":" + api_server_port + '/get_available_node?country=' + country
        console.log(endpoint)

        http.get(endpoint, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            resolve(data.replace(/\"/g, ""))
        });

        }).on("error", (err) => {
            reject("Error: " + err.message)
        });
    })
}


async function main() {
    let countries = await get_countries(api_server_ip, comms_port)
    console.log(countries)
    var prompt = require('prompt');
    prompt.start();
    let data = null;

    prompt.get(['country'], async function (err, result) {
        if(countries.indexOf(result.country) >= 0){
            console.log('  country: ' + result.country);
            country = result.country;
            data = await get_tunnel_config(api_server_ip, comms_port, country);
            console.log(data);
            let server_ip = await data.split(":")[1].split(",")[0].replace(" ", "");
            let vpn_port = await data.split(":")[3].split(",")[0].replace(" ", "");
            let pubKey = await data.split(":")[4].split("}")[0].replace(" ", "");
            await console.log(server_ip);
            await console.log(vpn_port);
            await console.log(pubKey);
            await send_connection_request(server_ip, pubKey);
            // await send_connection_request(hard_server_ip, hard_server_pubKey);
        }else{
            throw new Error("Invalid choice.");
        }
      });

    }


console.log("Starting client...")

main()
