const constants = require('./constants')
const utils = require('./utils')
const wg = require('./wg')

const upnp = require('nat-upnp')
const http = require('http')
const fastify = require('fastify')({
    logger: true
});

fastify.route({
    method: 'POST',
    url: '/request-accept',
    schema: {
        body: {
            pubKey: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object'
        }
    },
    handler: function (request, reply) {
        reply.send('ok')
        request_accept(request.body.pubKey)
    }
})

/* Seen message. Used to track status of the node. */
fastify.get('/ping', async (request, reply) => {
    return 'pong'
});

let comm_port = constants.SERVER_CONF.PORT
let vpn_port = constants.DEFAULTS.VPN_PORT

const start = async () => {
    try {
        // TODO Fastify should listen on eth only
        await fastify.listen(comm_port, '0.0.0.0')
    } catch (err) {
        // TODO Verify if error is related to busy port and randomize the port
        fastify.log.error(err)
        process.exit(1)
    }
}

function initialize() {
    send_init()
    // nat_upnp()
    wg.setup_wg()
}

function request_accept(pubKey) {
    // TODO Validate PubKey
    wg.add_peer(pubKey)
}

/*  UPnP - Universal Plug and Play
    Instructs Router to port forward
    Firstly, unmap the ports (might yield errors).
    My hope is that this will reset the ttl
    Secondly, map back the ports.
    TODO if this fails, hole punch
*/
function nat_upnp() {
    var client = upnp.createClient()

    unmap_port = function (port) {
        client.portUnmapping({
            public: port
        })
    }

    map_port = function (port, protocol) {
        client.portMapping({
            public: port,
            private: port,
            // TODO Find a way to remap after ttl expires
            ttl: 100,
            protocol: protocol,
        }, function (err) {
            if (err) {
                fastify.log.info(`UPnP Failed with $err`)
                return err
            }
        })
    }

    let ret = 0;

    ret = unmap_port(comm_port)
    ret = unmap_port(vpn_port)

    ret = map_port(comm_port, 'TCP')
    ret = map_port(vpn_port, 'UDP')

    return ret;
}

function get_publickey() {
    return fs.readFileSync('/root/publickey', 'utf8').trim()
}

async function send_init() {
    const data = JSON.stringify({
        external_ip: await (async () => {
            try {
                return await utils.get_external_ip()
            } catch (e) {
                console.log(e)
                return "Unknown"
            }
        })(),
        pubKey: get_publickey(),
        comm_port: comm_port,
        vpn_port: vpn_port,
        extra: 0.1
    })

    console.log(data)

    const options = {
        hostname: constants.SERVER_CONF.ENDPOINT,
        port: constants.SERVER_CONF.PORT,
        path: '/register_node',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = http.request(options, response => {
        console.log(response.statusCode)
    })

    req.on('error', err => {
        fastify.log.error(err)
    })

    req.write(data)
    req.end()
}

start()
initialize()

