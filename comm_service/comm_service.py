import os
import wg
import sys
import json
import utils
import logging
import traceback
import requests
import threading
from time import sleep
from random import randint
from flask import Flask, Response, jsonify, request
app = Flask(__name__)

PORT_RANGE_START   = 25555
PORT_RANGE_END     = 55555

DEFAULT_PORT_1     = 45555
DEFAULT_PORT_2     = 55555

API_ENDPOINT       = "172.25.0.1"
API_PORT           = 8080

DNS_DEFAULT        = "8.8.8.8"
WG_NETWORK_DEFAULT = "10.10.0.0/16"

NODE_INTERFACE     = "simpleVPN-node"

INTRANET_NETWORK   = os.getenv("INTRA_ADDR", default="127.0.0.1")

# 2 hours
CONNECTION_TIMEOUT = 30
REMOVAL_DELAY = 10

def timeout_handler(pubKey):
    logging.debug("Client timout. Disconnecting {}".format(pubKey))

    if not service.is_device_connected(pubKey):
        logging.error("Hanging timer")
        try:
            del service.session_timers[pubKey]
        except KeyError:
            logging.error("Cannot remove timer")
            return

    try:
        service.wg_o.remove_peer(pubKey, NODE_INTERFACE)
        service.device_revoked(pubKey)

        # Inform API that this client was disconnected
        url = "http://{}:{}/timeout_client".format(API_ENDPOINT, API_PORT)
        data = {
            'pub_key': pubKey
        }

        r = requests.post(url, data)
        if r.status_code != 200:
            logging.debug("Timeout notification failed with {}".format(r.status_code))
    except:
        traceback.print_exc()

def delayed_remove(pubKey, interface):
    logging.debug("Delayed Removing {}".format(pubKey))

    try:
        service.wg_o.remove_peer(pubKey, interface)
    except:
        logging.error("There was an error Delayed Removing {}".format(pubKey))

class Service:
    def __init__(self):
        self.comm_port = DEFAULT_PORT_1
        self.wg_port = DEFAULT_PORT_2
        self.network = self.get_available_network()
        self.dns = DNS_DEFAULT
        self.connected_devices = set()
        self.devices_hosts_map = {}
        self.session_timers = {}

    def set_endpoint(self):
        self.endpoint = utils.get_endpoint()

        if self.endpoint is None:
            logging.error("Could not determine the endpoint of the node.")

    def get_available_port(self):
        # Check the defaults first
        if utils.is_port_available(DEFAULT_PORT_1):
            return DEFAULT_PORT_1

        if utils.is_port_available(DEFAULT_PORT_2):
            return DEFAULT_PORT_2

        # Get a random port from the range
        while True:
            port = randint(PORT_RANGE_START, PORT_RANGE_END)

            if utils.is_port_available(port):
                return port

    def is_device_connected(self, pubKey):
        return pubKey in self.connected_devices

    def stop_all_timers(self):
        for _, timer in self.session_timers.items():
            timer.cancel()

    def set_timer(self, pubKey):
        self.session_timers[pubKey] = threading.Timer(\
            CONNECTION_TIMEOUT, timeout_handler, kwargs={'pubKey': pubKey})
        self.session_timers[pubKey].start()

    def device_accepted(self, pubKey, host):
        self.connected_devices.add(pubKey)
        self.devices_hosts_map[pubKey] = host
        self.set_timer(pubKey)

    def device_revoked(self, pubKey):
        try:
            host = self.devices_hosts_map[pubKey]
        except KeyError:
            logging.error("Revoking user with unknown host.")
            return None

        self.wg_o.free_host(host)
        self.connected_devices.remove(pubKey)
        del self.devices_hosts_map[pubKey]
        # Cancel and free the timer
        service.session_timers[pubKey].cancel()
        del service.session_timers[pubKey]

    def get_available_network(self):
        # TODO Check if there is any other interface conflicting with this network
        return WG_NETWORK_DEFAULT

    def stop(self):
        if self.wg_o is None:
            return

        self.wg_o.stop_server(NODE_INTERFACE)

    def start(self):
        logging.debug("Starting the service...")
        # Initialize and start the wg server
        self.set_endpoint()

        logging.debug("Endpoint: {}".format(self.endpoint))

        try:
            self.wg_o = wg.WG(self.network, self.wg_port, self.dns)
            self.wg_o.start_server(NODE_INTERFACE)

            WG = self.wg_o
        except:
            logging.error("Could not start server.")

        # Start the flask thread
        app.run(host=INTRANET_NETWORK, port=self.comm_port)

        logging.debug("Stopping the service...")

        # Stop when the process stops
        self.stop()
        self.stop_all_timers()

@app.route('/revoke_connection/', methods=['POST'])
def revoke_connection():

    try:
        pubKey = request.get_json()['pub_key']
    except KeyError:
        logging.info("Provide pubKey argument.")
        return Response(
            status = 400,
            response = "Provide pubKey argument."
        )

    logging.debug("Revoking peer {}".format(pubKey))

    if not service.is_device_connected(pubKey):
        logging.info("Revoking but the device is not connected.")
        return Response(
            status = 400,
            response = "Cannot revoke, device not connected."
        )

    # Delay the removal of the client
    threading.Timer(REMOVAL_DELAY, delayed_remove, kwargs={'pubKey': pubKey,\
        'interface': NODE_INTERFACE}).start()

    # Client revoked successfully
    service.device_revoked(pubKey)

    return Response(
        status = 200,
        response = json.dumps({
            "message": "Device revoked successfully."
        })
    )

@app.route('/request_accept/', methods=['POST'])
def accept_connection():

    try:
        pubKey = request.get_json()['pub_key']
    except KeyError:
        logging.info("Provide pubKey argument.")
        return Response(
            status = 400,
            response = "Provide pubKey argument."
        )

    logging.debug("Adding peer {}".format(pubKey))

    if service.is_device_connected(pubKey):
        return Response(
            status = 400,
            response = "Device already connected."
        )

    if service is None:
        logging.error("accept_connection with WG None")
        return Response(
            status = 500,
            response = "Server is not property initialized. Please restart."
        )

    (host, mask) = service.wg_o.get_available_host(with_mask=True)

    # Node cannot accept any user
    if host is None:
        logging.info("Trying to add another peer, but server is full.")
        return Response(
            status = 423,
            response = "Node is full. Cannot accept any other clients."
        )

    allowed_ips = "{}/32".format(str(host))

    try:
        service.wg_o.add_peer(pubKey, allowed_ips, NODE_INTERFACE)
    except:
        logging.error("WG.add_peer fails")
        return Response(
            status = 500,
            response = "Server cannot accept the client. Internal Error."
        )

    # Client accepted successfully
    service.device_accepted(pubKey, host)

    return Response(
        status = 200,
        response = json.dumps({
            'wg_port': service.wg_port,
            'external_endpoint': service.endpoint,
            'node_pub_key': service.wg_o.get_pubKey(),
            'assigned_ip': "{host}/{mask}".format(host=str(host), mask=str(mask))
        })
    )

@app.route('/keep_alive/', methods=['POST'])
def keep_alive():

    try:
        pubKey = request.get_json()['pub_key']
    except KeyError:
        logging.info("Provide pubKey argument.")
        return Response(
            status = 400,
            response = "Provide pubKey argument."
        )

    if not service.is_device_connected(pubKey):
        logging.error("Recieved keep alive for not connected device.")
        return Response(
            status = 400,
            response = "Device not connected."
        )

    # Reset the timer
    service.session_timers[pubKey].cancel()
    service.set_timer(pubKey)

    return Response(
        status = 200,
        response = "Keep alive OK."
    )


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, \
        filename='comm_service.log', filemode='w', \
        format='%(name)s - %(levelname)s - %(message)s')

    if INTRANET_NETWORK is None:
        logging.error("INTRA_ADDR not set.")
        sys.exit(0)

    service = Service()
    service.start()
