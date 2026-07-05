const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (decoded.parentId) {
            req.parentId = decoded.parentId;
        } else if (decoded.userId) {
            req.userId = decoded.userId;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
