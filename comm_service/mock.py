from flask import Flask
app = Flask(__name__)

@app.route('/latest/user-data')
def mock_user_data():
    return '{"address":"172.25.0.10/16","private_key":"nNRJXYrqzklzaTwVl2lZjesVfcnfzHQU9nUpF3O1D3Q=","agent":{"public_key":"m6rkRxAi9CeBZo6jmuwI0lszmsDIGkQTHPly4HcBLhE=","endpoint":"172.105.73.141:58556","allowed_ips":"172.25.0.0/16","keep_alive":25}}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4444)
