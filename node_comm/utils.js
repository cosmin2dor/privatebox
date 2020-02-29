const https = require('https')

/*  Simple function that returns promises on IP Address
*/
function get_external_ip() {
    return new Promise((resolve, reject) => {
        const request = {
            hostname: 'ipinfo.io',
            path: '/ip',
            port: 443,
            method: 'GET',
        }

        const req = https.request(request, response => {
            if (response.statusCode != 200) {
                reject(`Request failed with $response.statusCode`)
            }

            response.on('data', data => {
                resolve(data.toString().trim())
            })
        })

        req.on('error', err => {
            reject(`Request error $err`)
        })

        req.end()
    })
}

module.exports.get_external_ip = get_external_ip;