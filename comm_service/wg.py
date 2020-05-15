# This module is the interface between the comm_service and the wireguard.
# It exposes methods to accept clients as peers
# Requires basic setup first

import os
import logging
import ipaddress
import subprocess

WG_CONF_DIR = '/etc/wireguard'
WG_KEYS_DIR = '/etc/wireguard/keys'
KEY_PRIVATE = 'privatekey'
KEY_PUBLIC = 'publickey'
KEYS_MODE = 0o700

class WG:
    def __init__(self, network_addr, wg_port, dns):
        self.network_addr = network_addr
        self.wg_port = wg_port
        self.dns = dns

        self.initialize_slots()
        self.gen_keys()

    def initialize_slots(self):
        self.network = ipaddress.IPv4Network(self.network_addr)
        self.hosts = self.network.hosts()

        # The first address will going to be used by the server
        self.server_addr = next(self.hosts)

        self.available_hosts = set(self.hosts)
        self.used_hosts = set()

    def get_available_host(self, with_mask=False):
        try:
            # Get a random available host
            host = self.available_hosts.pop()
            # Mark it as used
            self.used_hosts.add(host)

            if with_mask:
                return (host, self.network.prefixlen)
            else:
                return host
        except KeyError:
            # No available host
            return None

    def free_host(self, host):
        if host not in self.used_hosts:
            return None

        # Add it back to available, remove from used
        self.used_hosts.remove(host)
        self.available_hosts.add(host)

    def gen_keys(self):
        # Keys are stored as files at WG_KEYS_DIR
        # Kf key files already exist, read them, else generate

        # Check if the dir exists
        if not os.path.exists(WG_KEYS_DIR):
            try:
                os.mkdir(WG_KEYS_DIR, KEYS_MODE)
            except OSError:
                logging.error("Could not create directory at {}.".format(WG_KEYS_DIR))
                raise

        private_path = WG_KEYS_DIR + "/" + KEY_PRIVATE
        public_path = WG_KEYS_DIR + "/" + KEY_PUBLIC

        if (not os.path.exists(private_path)) or \
            (not os.path.exists(public_path)):
            # Generate keys
            try:
                os.system('umask 077')
                os.system('wg genkey | tee {} | wg pubkey > {}'.format(
                    private_path,
                    public_path
                ))
            except:
                logging.error("Could not generate keys.")
                raise

        # Read the keys
        with open(private_path, 'r') as file:
            self.privKey = file.readline().strip()

        with open(public_path, 'r') as file:
            self.pubKey = file.readline().strip()

    def get_pubKey(self):
        return self.pubKey

    def get_privKey(self):
        return self.privKey

    def generate_config(self):

        try:
            iface = subprocess.check_output('ip r s default | cut -d " " -f5', \
                shell=True).decode('utf-8').strip()
        except:
            iface = 'ens3'

        base_cmd = "iptables {action} FORWARD -i %i -j ACCEPT; iptables " + \
        "{action} FORWARD -o %i -j ACCEPT; iptables -t nat {action} POSTROUTING " + \
        "-o {interface} -j MASQUERADE"

        ip_with_mask = "{}/{}".format(str(self.server_addr), self.network.prefixlen)

        post_up = base_cmd.format(action='-A', interface=iface)
        post_down = base_cmd.format(action='-D', interface=iface)

        return "" + \
        "[Interface]\n" + \
        "Address = {}\n".format(ip_with_mask) + \
        "DNS = {}\n".format(self.dns) + \
        "PrivateKey = {}\n".format(self.get_privKey()) + \
        "ListenPort = {}\n".format(self.wg_port) + \
        "PostUp = {}\n".format(post_up) + \
        "PostDown = {}\n".format(post_down)

    def start_server(self, interface):
        self.stop_server(interface)
        logging.debug("Starting server...")
        conf_path = "{}/{}.conf".format(WG_CONF_DIR, interface)

        with open(conf_path, 'w+') as file:
            content = self.generate_config()
            file.write(content)

        try:
            os.system('wg-quick up {}'.format(interface))
        except:
            logging.error("There was an error starting the server interface.")
            raise

    def stop_server(self, interface):
        logging.debug("Stopping server...")

        try:
            os.system('wg-quick down {}'.format(interface))
        except:
            logging.error("There was an error stopping the server.")
            raise

    def add_peer(self, pubKey, allowed_ip, interface):
        try:
            os.system('wg set {interface} peer {pubKey} allowed-ips \
                {allowed_ip}'.format(interface=interface, pubKey=pubKey, allowed_ip=allowed_ip))
        except:
            logging.error("There was an error adding the peer.")
            raise

    def remove_peer(self, pubKey, interface):
        try:
            os.system('wg set {interface} peer {pubKey} remove'.format(interface=interface, pubKey=pubKey))
        except:
            logging.error("There was an error removing the peer.")
            raise
