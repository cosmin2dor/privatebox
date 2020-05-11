import socket, errno
import requests

def is_port_available(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        s.bind(('localhost', port))
    except socket.error as e:
        return False

    return True

def get_endpoint():
    r = requests.get('https://api.ipify.org?format=json')

    if r.status_code != 200:
        return None

    try:
        data = r.json()
        ip = data['ip']

        return ip
    except:
        return None
