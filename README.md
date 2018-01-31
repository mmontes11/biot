# iot-telegram
Telegram IoT bot that notifies you about measurements and events in your things. It consumes [IoT backend](https://github.com/mmontes11/iot-backend) REST API via [IoT client](https://github.com/mmontes11/iot_client).

### Run in development

```bash
$ npm start
```
### Build image
```bash
$ npm run dist
$ docker build -t biot .
```
### DockerHub
Image available on [Docker Hub](https://hub.docker.com/r/mmontes11/biot/)

### Run image

First, configure your environment variables:
* [.env](https://github.com/mmontes11/biot/blob/develop/.env)

```bash
$ docker run --name biot --restart always --env-file .env -d mmontes11/biot
```
