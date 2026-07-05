const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Parent = require('../models/Parent');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!admin.isActive) {
            return res.status(400).json({ message: 'Account is deactivated' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        admin.lastLogin = Date.now();
        await admin.save();

        const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalParents = await Parent.countDocuments();

        const recentParents = await Parent.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt');

        const parentsWithChildren = await Parent.find({ 'children.0': { $exists: true } })
            .select('name email children');

        let allChildren = [];
        parentsWithChildren.forEach(parent => {
            parent.children.forEach(child => {
                allChildren.push({ ...child.toObject(), parentName: parent.name });
            });
        });

        const totalChildren = allChildren.length;

        const lowRisk = allChildren.filter(c => c.asdPrediction > 0 && c.asdPrediction <= 30).length;
        const mediumRisk = allChildren.filter(c => c.asdPrediction > 30 && c.asdPrediction <= 70).length;
        const highRisk = allChildren.filter(c => c.asdPrediction > 70).length;
        const noAssessment = allChildren.filter(c => !c.asdPrediction || c.asdPrediction === 0).length;

        const beginner = allChildren.filter(c => c.learningLevel === 'beginner').length;
        const intermediate = allChildren.filter(c => c.learningLevel === 'intermediate').length;
        const advanced = allChildren.filter(c => c.learningLevel === 'advanced').length;

        const qchatScores = allChildren.map(c => c.qchatScore).filter(s => s !== undefined && s !== null);
        const avgQchatScore = qchatScores.length > 0
            ? (qchatScores.reduce((a, b) => a + b, 0) / qchatScores.length).toFixed(1)
            : 0;

        const recentChildren = allChildren
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(c => ({
                _id: c._id,
                name: c.name,
                age: c.age,
                qchatScore: c.qchatScore,
                asdPrediction: c.asdPrediction,
                learningLevel: c.learningLevel,
                parentName: c.parentName,
                createdAt: c.createdAt
            }));

        res.json({
            stats: {
                totalParents,
                totalChildren,
                avgQchatScore,
                riskDistribution: { lowRisk, mediumRisk, highRisk, noAssessment },
                levelBreakdown: { beginner, intermediate, advanced }
            },
            recentActivity: {
                parents: recentParents,
                children: recentChildren
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllParents = async (req, res) => {
    try {
        const parents = await Parent.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            parents,
            pagination: {
                current: 1,
                pages: 1,
                total: parents.length
            }
        });
    } catch (error) {
        console.error('Get parents error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);
        if (admin.role !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Super admin required.' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const admins = await Admin.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Admin.countDocuments();

        res.json({
            admins,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get admins error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);
        if (admin.role !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Super admin required.' });
        }

        const { name, email, password, role, permissions } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const newAdmin = new Admin({
            name,
            email,
            password,
            role: role || 'admin',
            permissions: permissions || ['manage_users', 'manage_parents']
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role,
                permissions: newAdmin.permissions,
                isActive: newAdmin.isActive
            }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error during admin creation' });
    }
};

const updateAdminStatus = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);
        if (admin.role !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Super admin required.' });
        }

        const { id } = req.params;
        const { isActive } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({
            message: 'Admin status updated successfully',
            admin: updatedAdmin
        });
    } catch (error) {
        console.error('Update admin status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);
        if (admin.role !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Super admin required.' });
        }

        const { id } = req.params;

        if (id === req.adminId.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteParent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedParent = await Parent.findByIdAndDelete(id);

        if (!deletedParent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        res.json({
            message: 'Parent deleted successfully',
            parent: {
                id: deletedParent._id,
                name: deletedParent.name,
                email: deletedParent.email
            }
        });
    } catch (error) {
        console.error('Delete parent error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateParent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.password;

        const updatedParent = await Parent.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedParent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        res.json({
            message: 'Parent updated successfully',
            parent: updatedParent
        });
    } catch (error) {
        console.error('Update parent error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteChild = async (req, res) => {
    try {
        const { parentId, childId } = req.params;

        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const childIndex = parent.children.findIndex(child => child._id.toString() === childId);
        if (childIndex === -1) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const deletedChild = parent.children[childIndex];

        await Parent.findByIdAndDelete(parentId);

        res.json({
            message: 'Child and associated parent deleted successfully',
            child: {
                id: deletedChild._id,
                name: deletedChild.name
            }
        });
    } catch (error) {
        console.error('Delete child error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateChild = async (req, res) => {
    try {
        const { parentId, childId } = req.params;
        const updates = req.body;

        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const childIndex = parent.children.findIndex(child => child._id.toString() === childId);
        if (childIndex === -1) {
            return res.status(404).json({ message: 'Child not found' });
        }

        Object.keys(updates).forEach(key => {
            if (key !== '_id' && key !== '__v') {
                parent.children[childIndex][key] = updates[key];
            }
        });

        await parent.save();

        res.json({
            message: 'Child updated successfully',
            child: parent.children[childIndex]
        });
    } catch (error) {
        console.error('Update child error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllChildren = async (req, res) => {
    try {
        const parents = await Parent.find({ children: { $exists: true, $ne: [] } })
            .select('name email children')
            .sort({ createdAt: -1 });

        let allChildren = [];
        parents.forEach(parent => {
            parent.children.forEach(child => {
                allChildren.push({
                    ...child.toObject(),
                    parentId: parent._id,
                    parentName: parent.name,
                    parentEmail: parent.email
                });
            });
        });

        res.json({
            children: allChildren,
            pagination: {
                current: 1,
                pages: 1,
                total: allChildren.length
            }
        });
    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    getDashboardStats,
    getAllParents,
    getAllUsers,
    getAllAdmins,
    createAdmin,
    updateAdminStatus,
    deleteAdmin,
    deleteParent,
    updateParent,
    deleteChild,
    updateChild,
    getAllChildren
};