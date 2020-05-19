#!/bin/bash

kill $(pidof venv/bin/python comm_service.py)
nohup venv/bin/python comm_service.py &
