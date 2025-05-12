const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../../../config.js');

const isAdmin = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;

        if (req.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ message: 'Forbidden: You do not have admin access.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

module.exports = isAdmin;
