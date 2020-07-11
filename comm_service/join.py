import os
import json
import requests
import logging

METADATA_URL = "http://169.254.169.254/latest/user-data"
WG_CONF_DIR = '/etc/wireguard'

class Join:
    def __init__(self):
        self.user_data = self.get_user_data()

    def get_user_data(self):
        try:
            user_data = requests.get(METADATA_URL, timeout=10).content

            return json.loads(user_data)
        except requests.exceptions.RequestException as e:
            logging.error("Requesting metadata failed")
            raise SystemExit(e)

        except ValueError:
            logging.error("Failed to decode JSON from metadata")
            raise SystemExit(-1)

    def generate_config(self):
        config = "" + \
        "[Interface]\n" + \
        "Address = {}\n".format(self.user_data['address']) + \
        "PrivateKey = {}\n".format(self.user_data['private_key']) + \
        "\n" + \
        "[Peer]\n" + \
        "PublicKey = {}\n".format(self.user_data['agent']['public_key']) + \
        "Endpoint = {}\n".format(self.user_data['agent']['endpoint']) + \
        "AllowedIPs = {}\n".format(self.user_data['agent']['allowed_ips']) + \
        "PersistentKeepalive = {}\n".format(self.user_data['agent']['keep_alive'])

        with open(WG_CONF_DIR + "/comm.conf", "w") as file:
            file.write(config)

    def start_interface(self):
        os.system('wg-quick up comm')

if __name__ == "__main__":
    join = Join()
    join.generate_config()
    join.start_interface()
