import basicAuth from 'basic-auth';
import GLOBALS from '../app-config/constants.js';

/**
 * Function is for authenticate swagger auth credentials before document load
 * @param {req} req
 * @param {Function} callback
 */
const authenticateDoc = (req, res, next) => {
    const credentials = basicAuth(req);
    if (
        !credentials ||
        credentials.name !== GLOBALS.SWAGGER_USERNAME ||
        credentials.pass !== GLOBALS.SWAGGER_PASSWORD
    ) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
};

export default {
    authenticateDoc,
};
