const http = require('http')
const fastify = require('fastify')({
    logger: true
});

fastify.get('/test', async (request, reply) => {
    send()
    return 'pong'
});

const start = async () => {
    try {
        // TODO Fastify should listen on eth only
        await fastify.listen(3821, '127.0.0.1')
    } catch (err) {
        // TODO Verify if error is related to busy port and randomize the port
        fastify.log.error(err)
        process.exit(1)
    }
}

function send() {
    const data = JSON.stringify({
        pubKey: 'nC5EhmrfGcYajtRaEK2ardOkjGcjsDZcwSWIwATLe14='
    })

    console.log(data)

    const options = {
        hostname: '127.0.0.1',
        port: 31822,
        path: '/request-accept',
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