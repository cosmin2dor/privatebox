const { exec } = require('child_process')
const fs = require('fs')

function generate_privatekey() {
    return new Promise((resolve, reject) => {
        exec('wg genkey', (err, stdout, stderr) => {
            if (err) {
                // throw Error('Generating Private Key Failed.')
                reject('Generating Private Key Failed.')
            }
    
            // Hardcode for demo propose only
            // resolve(stdout.trim())
            resolve("aA936LwbQh/qZ5N3JBvT7LGk71ASDP/CSMTOsZb77XU=")
        })
    })
}

function add_peer(pubKey) {
    cmd = `wg set wg0 peer ${pubKey} allowed-ips 10.0.0.0/24`
    exec(cmd)
}

/*  Returns formated wg.conf
    TODO Fix Identation
*/
function configure_wg(port, private_key) {
    template = `[Interface]
Address = 10.0.0.1/24
DNS = 8.8.8.8
PrivateKey = ${private_key}
ListenPort = ${port}
PostUp   = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o ens3 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o ens3 -j MASQUERADE\n`

    return template
}

async function setup_wg() {
    let conf = configure_wg(51820, await generate_privatekey())
    
    await fs.writeFile('/etc/wireguard/wg0.conf', conf, function(err) {
        if (err) {
            throw Error('Saving config to file failed.')
        }
    })

    console.log("wg0.conf wrote")

    exec('wg-quick down wg0')

    console.log('wg-quick down wg0')

    exec('wg-quick up wg0')

    console.log('wg-quick up wg0')
}

module.exports.setup_wg = setup_wg
module.exports.add_peer = add_peer