import IoTClient from "@mmontes11/iot-client";
import config from '../config/index';

const iotClient = new IoTClient({
    host: config.iotServerHost,
    username: config.iotServerUsername,
    password: config.iotServerPassword
});

export default iotClient;