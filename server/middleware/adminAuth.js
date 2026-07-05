const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (!decoded.adminId) {
            return res.status(401).json({ message: 'Not authorized as admin' });
        }

        const admin = await Admin.findById(decoded.adminId);
        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: 'Admin account not found or deactivated' });
        }

        req.adminId = decoded.adminId;
        req.adminRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};