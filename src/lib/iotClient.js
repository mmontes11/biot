import IoTClient from "@mmontes11/iot-client";

const iotClient = new IoTClient({
    host: process.env.IOT_SERVER_HOST,
    username: process.env.IOT_SERVER_BIOT_USERNAME,
    password: process.env.IOT_SERVER_BIOT_PASSWORD
});

export default iotClient;