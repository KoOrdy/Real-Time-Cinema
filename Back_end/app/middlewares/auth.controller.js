const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const tokenBlacklist = require('./tokenblacklist');

function authMiddleware(req, res, next) {
    const header = req.header('Authorization');

    if (!header) {
        return res.status(401).send({ message: 'Access denied, no token provided.' });
    }

    const token = header.replace('Bearer ', '');

    if (tokenBlacklist && tokenBlacklist.isBlacklisted(token)) {
        return res.status(401).send({ message: 'Token is no longer valid (logged out).' });
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send({ message: 'Invalid token.' });
    }
}

module.exports = authMiddleware;
