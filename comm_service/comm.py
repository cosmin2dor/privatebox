import os
import sys
import logging
import service
import join
import wg

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, filename='comm.log', filemode='a', format='%(name)s - %(levelname)s - %(message)s')

    # The external endpoint
    CORE_ADDRESS = "simplevpn.tech"

    # Interface serving the clients
    NODE_INTERFACE = "TunnelPeer-node"
    # Interface for encrypted communication
    COMM_INTERFACE = "TunnelPeer-comm"

    # Join the encrypted network within the organization
    wg.WG.stop_interface(COMM_INTERFACE)
    j = join.Join(COMM_INTERFACE)
    j.start()

    comm_address = j.user_data['address'].split('/')[0]
    # Start the manager service
    wg.WG.stop_interface(NODE_INTERFACE)
    service.Service(NODE_INTERFACE, comm_address).start()
