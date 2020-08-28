import unittest
import ipaddress
import logging
import shutil
import time
import os
import wg

NETWORK = '10.10.0.0/24'
INTERFACE = 'wg-test'
FIRST_ADDRESS = '10.10.0.1'
WG_DIR = '/etc/wireguard'
WG_KEYS_DIR = '/etc/wireguard/keys'
KEY_PRIVATE = '/etc/wireguard/keys/privatekey'
KEY_PUBLIC = '/etc/wireguard/keys/publickey'
WG_PORT = 58555
DNS = '8.8.8.8'
PEER_PUBKEY = 'POC/lMQx/tFZ1AAM2sBsy8rj4/oZkOdrEbAar+vAAio='


class TestWG(unittest.TestCase):

    def test_init_slots(self):
        wg_obj = wg.WG(NETWORK, WG_PORT, DNS)
        # 255 - 3 (Network Address, Broadcast and Server)
        self.assertEqual(len(wg_obj.available_hosts), 253)
        # First address is assigned to the server only
        self.assertFalse(ipaddress.IPv4Address(FIRST_ADDRESS) in wg_obj.available_hosts)

    def test_get_available_host(self):
        wg_obj = wg.WG(NETWORK, WG_PORT, DNS)

        host = wg_obj.get_available_host()

        self.assertIsNotNone(host)
        self.assertTrue(host in wg_obj.used_hosts)
        self.assertFalse(host in wg_obj.available_hosts)

        for i in range(252):
            host = wg_obj.get_available_host()

            self.assertIsNotNone(host)
            self.assertTrue(host in wg_obj.used_hosts)
            self.assertFalse(host in wg_obj.available_hosts)

        host = wg_obj.get_available_host()
        self.assertIsNone(host)
        self.assertEqual(len(wg_obj.used_hosts), 253)
        self.assertEqual(len(wg_obj.available_hosts), 0)

    def test_gen_keys(self):
        try:
            shutil.rmtree(WG_KEYS_DIR)
        except FileNotFoundError:
            pass

        wg_obj = wg.WG(NETWORK, WG_PORT, DNS)

        self.assertIsNotNone(wg_obj.get_pubKey())
        self.assertIsNotNone(wg_obj.get_privKey())

        self.assertEqual(len(wg_obj.get_pubKey()), 44)
        self.assertEqual(len(wg_obj.get_privKey()), 44)

        try:
            shutil.rmtree(WG_KEYS_DIR)
        except FileNotFoundError:
            pass

        wg_obj2 = wg.WG(NETWORK, WG_PORT, DNS)

        pubKey1 = wg_obj2.get_pubKey()
        privKey1 = wg_obj2.get_privKey()

        self.assertIsNotNone(pubKey1)
        self.assertIsNotNone(privKey1)

        wg_obj3 = wg.WG(NETWORK, WG_PORT, DNS)

        pubKey2 = wg_obj3.get_pubKey()
        privKey2 = wg_obj3.get_privKey()

        self.assertEqual(pubKey1, pubKey2)
        self.assertEqual(privKey1, privKey2)

    def test_start_interface(self):
        conf_path = "{}/{}.conf".format(WG_DIR, INTERFACE)

        try:
            shutil.rmtree(conf_path)
        except:
            pass

        wg_obj = wg.WG(NETWORK, WG_PORT, DNS)
        wg_obj.start_interface(INTERFACE)

        self.assertTrue(os.path.exists(conf_path))

        time.sleep(5)

        wg_obj.stop_interface(INTERFACE)

        time.sleep(5)

    def test_add_peer(self):
        wg_obj = wg.WG(NETWORK, WG_PORT, DNS)
        wg_obj.start_interface(INTERFACE)

        time.sleep(5)

        host = wg_obj.get_available_host()

        print(host)

        wg_obj.add_peer(PEER_PUBKEY, "{}/32".format(host), INTERFACE)

        # wg_obj.stop_interface(INTERFACE)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, filename='wg.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')
    unittest.main()
