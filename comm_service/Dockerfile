FROM python:3-alpine

WORKDIR /usr/src/comm_node

RUN apk update && apk add wireguard-tools

COPY requirements.txt ./
RUN pip install --no-cache -r requirements.txt

COPY . .

CMD [ "python", "comm.py" ]