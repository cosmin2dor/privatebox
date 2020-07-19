import os
import sys
import logging
import service
import join

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, filename='comm.log', filemode='a', format='%(name)s - %(levelname)s - %(message)s')

    # Internal VPN network used for core-node communication
    # TODO Remove default
    COMM_NETWORK = os.getenv("COMM_NETWORK", default="127.0.0.1")

    # The external endpoint
    CORE_ADDRESS = "simplevpn.tech"

    # Interface serving the clients
    NODE_INTERFACE = "TunnelPeer-node"
    # Interface for encrypted communication
    COMM_INTERFACE = "TunnelPeer-comm"

    if COMM_NETWORK is None:
        logging.error("COMM_NETWORK not set.")
        sys.exit(0)

    # Join the encrypted network within the organization
    join.Join(COMM_INTERFACE).start()
    # Start the manager service
    service.Service(NODE_INTERFACE, COMM_NETWORK).start()
