const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const tokenBlacklist = require('../middlewares/tokenblacklist');

function authMiddleware(req, resp, next) {
    const header = req.header('Authorization');
    if (!header) {
        return resp.status(401).send({ message: 'Access denied, no token provided' });
    }
    const token = header.replace('Bearer ', '');
    if (tokenBlacklist.isBlacklisted(token)) {
        return resp.status(401).send({ message: 'Token is no longer valid (logged out).' });
    }
    try {
        const decodedUser = jwt.verify(token, config.secret);
        req.user = decodedUser;
        next();
    } catch (error) {
        return resp.status(400).send({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware;
