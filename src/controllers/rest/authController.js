import _ from 'underscore';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import iotClient from '../../lib/iotClient';
import config from '../../config/index';

const getToken = async (req, res, next) => {
    const credentials = req.body;
    if (_validateCredentialsFields(credentials)) {
        try {
            await iotClient.authService.checkAuth(credentials);
            const token = jwt.sign({ username: credentials.username }, config.biotJwtSecret);
            res.status(httpStatus.OK).json({ token });
        } catch (err) {
            res.sendStatus(httpStatus.UNAUTHORIZED);
        }
    } else {
        res.sendStatus(httpStatus.UNAUTHORIZED);
    }
};

const _validateCredentialsFields = (credentials) => {
    return !_.isUndefined(credentials.username) && !_.isUndefined(credentials.password);
};

export default { getToken }