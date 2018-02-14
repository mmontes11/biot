export default {
    env: process.env.NODE_ENV,
    nodePort: process.env.NODE_PORT,
    debug: process.env.IOT_DEBUG,
    basicAuthUsers: {
        [process.env.BIOT_BASIC_AUTH_USER]: process.env.BIOT_BASIC_AUTH_PASSWORD
    }
};