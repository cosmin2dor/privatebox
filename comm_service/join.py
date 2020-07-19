import os
import wg
import json
import requests
import logging

DEBUG = True

if DEBUG:
    METADATA_URL = "http://127.0.0.1:4444/latest/user-data"
else:
    METADATA_URL = "http://169.254.169.254/latest/user-data"


class Join:
    def __init__(self, interface):
        self.interface = interface
        self.user_data = None

    def get_user_data(self):
        try:
            user_data = requests.get(METADATA_URL, timeout=10).content
            self.user_data = json.loads(user_data)
        except requests.exceptions.RequestException as e:
            logging.error("AWS User-Data not properly configured " + str(e))
            exit(-1)
        except ValueError:
            logging.error("AWS User-Data contains non-JSON or malformed data")
            exit(-1)

    def verify_user_data(self):
        return True

    def start(self):
        # Pull data from AWS user_data endpoint
        self.get_user_data()
        # Verify data
        if not self.verify_user_data():
            logging.error("AWS User-Data is missing critical data")
            exit(-1)
        # Generate wireguard config
        config = wg.WG.generate_config(self.user_data['address'], self.user_data['private_key'])
        # Start the comm interface
        wg.WG.start_raw_interface(self.interface, config)
        # Join the network by adding the core as peer
        peer = self.user_data['agent']
        wg.WG.add_peer(peer['public_key'], peer['allowed_ips'], self.interface, peer['endpoint'], peer['keep_alive'])
