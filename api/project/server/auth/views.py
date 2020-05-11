# project/server/auth/views.py

from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView

import secrets
import requests
import json
from sqlalchemy.orm import load_only

from project.server import db
from project.server.models import User, BlacklistToken, Node

auth_blueprint = Blueprint('auth', __name__)


class GenerateAPI(MethodView):
    """
    Unique Code Generator
    """

    def get(self):
        my_secure_rng = secrets.SystemRandom()
        unique_id = my_secure_rng.randrange(int(16 * '1'), int(16 * '9'))
        response_object = {
            'status': 'success',
            'message': 'Successfully generated user unique id.',
            'unique_id': unique_id
        }
        return make_response(jsonify(response_object)), 200


class RegisterAPI(MethodView):
    """
    User Registration Resource
    """

    @staticmethod
    def post():
        # get the post data
        post_data = request.get_json()
        # check if user already exists
        user = User.query.filter_by(unique_id=post_data.get('unique_id')).first()
        if not user:
            try:
                user = User(
                    unique_id=post_data.get('unique_id')
                )

                # insert the user
                db.session.add(user)
                db.session.commit()
                # generate the auth token
                auth_token = user.encode_auth_token(user_id=user.id)
                response_object = {
                    'status': 'success',
                    'message': 'Successfully registered.',
                    'auth_token': auth_token.decode()
                }
                return make_response(jsonify(response_object)), 201
            except Exception as e:
                response_object = {
                    'status': 'fail',
                    'message': 'Some error occurred. Please try again.'
                }
                return make_response(jsonify(response_object)), 401
        else:
            response_object = {
                'status': 'fail',
                'message': 'User already exists. Please Log in.',
            }
            return make_response(jsonify(response_object)), 202


class LoginAPI(MethodView):
    """
    User Login Resource
    """

    def post(self):
        # get the post data
        post_data = request.get_json()
        try:
            # fetch the user data
            user = User.query.filter_by(
                unique_id=post_data.get('unique_id')
            ).first()
            if user:
                auth_token = user.encode_auth_token(user.id)
                if auth_token:
                    response_object = {
                        'status': 'success',
                        'message': 'Successfully logged in.',
                        'auth_token': auth_token.decode()
                    }
                    return make_response(jsonify(response_object)), 200
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'User does not exist.'
                }
                return make_response(jsonify(response_object)), 404
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return make_response(jsonify(response_object)), 500


class UserAPI(MethodView):
    """
    User Resource
    """

    def get(self):
        # get the auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                auth_token = auth_header.split(" ")[1]
            except IndexError:
                response_object = {
                    'status': 'fail',
                    'message': 'Bearer token malformed.'
                }
                return make_response(jsonify(response_object)), 401
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                user = User.query.filter_by(id=resp).first()
                response_object = {
                    'status': 'success',
                    'data': {
                        'user_id': user.id,
                        'unique_id': user.unique_id,
                        'admin': user.admin,
                        'registered_on': user.registered_on
                    }
                }
                return make_response(jsonify(response_object)), 200
            response_object = {
                'status': 'fail',
                'message': resp
            }
            return make_response(jsonify(response_object)), 401
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return make_response(jsonify(response_object)), 401


class LogoutAPI(MethodView):
    """
    Logout Resource
    """

    @staticmethod
    def post():
        # get auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                # mark the token as blacklisted
                blacklist_token = BlacklistToken(token=auth_token)
                try:
                    # insert the token
                    db.session.add(blacklist_token)
                    db.session.commit()
                    response_object = {
                        'status': 'success',
                        'message': 'Successfully logged out.'
                    }
                    return make_response(jsonify(response_object)), 200
                except Exception as e:
                    response_object = {
                        'status': 'fail',
                        'message': e
                    }
                    return make_response(jsonify(response_object)), 200
            else:
                response_object = {
                    'status': 'fail',
                    'message': resp
                }
                return make_response(jsonify(response_object)), 401
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return make_response(jsonify(response_object)), 403


class LocationsAPI(MethodView):
    """
    Locations Resource
    """

    def get(self):
        # get the auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                auth_token = auth_header.split(" ")[1]
            except IndexError:
                response_object = {
                    'status': 'fail',
                    'message': 'Bearer token malformed.'
                }
                return make_response(jsonify(response_object)), 401
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if isinstance(resp, str):
                response_object = {
                    'status': 'fail',
                    'message': resp
                }
                return make_response(jsonify(response_object)), 401

            locations = list(set(Node.query.options(load_only(Node.country_code)).all()))
            response_object = {
                'status': 'success',
                'data': {
                    'locations': locations
                }
            }
            return make_response(jsonify(response_object)), 200
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return make_response(jsonify(response_object)), 401


class ConnectionAPI(MethodView):
    """
    Connection Resource
    """

    @staticmethod
    def post():
        # get the auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                auth_token = auth_header.split(" ")[1]
            except IndexError:
                response_object = {
                    'status': 'fail',
                    'message': 'Bearer token malformed.'
                }
                return make_response(jsonify(response_object)), 401
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if isinstance(resp, str):
                response_object = {
                    'status': 'fail',
                    'message': resp
                }
                return make_response(jsonify(response_object)), 401

            if request.is_json:
                req = request.get_json()
                pub_key = req.get('pub_key')
                country_code = req.get('country_code')
            else:
                response_object = {
                    'status': 'fail',
                    'message': 'Request was not JSON.'
                }
                return make_response(jsonify(response_object)), 402

            node = Node.query.filter_by(pub_key=pub_key, country_code=country_code).first()
            if node is None:
                response_object = {
                    'status': 'fail',
                    'message': 'Provide valid pubKey and countryCode.'
                }
                return make_response(jsonify(response_object)), 402

            url = 'http://' + node.ip + ':' + node.comm_port + '/request_accept'

            response = requests.post(url, json={'pub_key': pub_key})
            if response.status_code != 200:
                response_object = {
                    'status': 'fail',
                    'message': response.content
                }
                return make_response(jsonify(response_object)), response.status_code

            data = json.loads(response.content)
            response_object = {
                'status': 'success',
                'data': {
                    'wg_port': data.get('wg_port'),
                    'external_endpoint': data.get('external_endpoint'),
                    'node_pub_key': data.get('node_pub_key'),
                    'assigned_ip': data.get('assigned_ip')
                }
            }
            return make_response(jsonify(response_object)), 200
        else:
            response_object = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return make_response(jsonify(response_object)), 401


# define the API resources
generation_view = GenerateAPI.as_view('generate_api')
registration_view = RegisterAPI.as_view('register_api')
login_view = LoginAPI.as_view('login_api')
user_view = UserAPI.as_view('user_api')
logout_view = LogoutAPI.as_view('logout_api')
locations_view = LocationsAPI.as_view('locations_api')
connection_view = ConnectionAPI.as_view('connection_api')

# add Rules for API Endpoints
auth_blueprint.add_url_rule(
    '/auth/register',
    view_func=registration_view,
    methods=['POST']
)
auth_blueprint.add_url_rule(
    '/auth/login',
    view_func=login_view,
    methods=['POST']
)
auth_blueprint.add_url_rule(
    '/auth/status',
    view_func=user_view,
    methods=['GET']
)
auth_blueprint.add_url_rule(
    '/auth/logout',
    view_func=logout_view,
    methods=['POST']
)
auth_blueprint.add_url_rule(
    '/auth/generate',
    view_func=generation_view,
    methods=['GET']
)
auth_blueprint.add_url_rule(
    '/get_locations',
    view_func=locations_view,
    methods=['GET']
)
auth_blueprint.add_url_rule(
    '/request_connection',
    view_func=connection_view,
    methods=['POST']
)
