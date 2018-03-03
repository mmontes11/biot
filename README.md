# biot
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmontes11/iot)

Telegram IoT bot that notifies you about measurements and events in your things. 
It consumes [IoT backend](https://github.com/mmontes11/iot-backend) REST API via [IoT client](https://github.com/mmontes11/iot_client) and provides its own REST API to receive notifications.

### Run in development
```bash
$ npm start
```
### Build image
```bash
$ npm run build
$ docker build -t biot .
```
### DockerHub
Image available on [Docker Hub](https://hub.docker.com/r/mmontes11/biot/)

### Run image
Configure:
* [.env](https://github.com/mmontes11/biot/blob/develop/.env)

```bash
$ docker run --name biot --restart always --env-file .env -d mmontes11/biot
```
### Test REST API with Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9ac0c99ff1cd0cb35393#?env%5Bbiot-dev%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5Ijoic2VydmVyIiwidmFsdWUiOiJsb2NhbGhvc3Q6OTA5MCIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJiYXNpY0F1dGgiLCJ2YWx1ZSI6IllXUnRhVzQ2WVdSdGFXNCIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ1c2VybmFtZSIsInZhbHVlIjoiYWRtaW4iLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoicGFzc3dvcmQiLCJ2YWx1ZSI6ImFBMTIzNDU2NzgmIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InRva2VuIiwidmFsdWUiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlibUZ0WlNJNkltRmtiV2x1SWl3aWFXRjBJam94TlRFNU5qY3dPRFF6ZlEub0x2WDNyQjRJUGRENEdxYTRoNTdRNU1Jb2paMXNzVVowX0NSRk9DNTBQcyIsInR5cGUiOiJ0ZXh0In1d)
