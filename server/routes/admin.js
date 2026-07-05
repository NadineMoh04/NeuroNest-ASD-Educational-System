const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
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
} = require('../controllers/adminController');

router.post('/login', login);

router.get('/dashboard', adminAuth, getDashboardStats);

router.get('/parents', adminAuth, getAllParents);

router.get('/users', adminAuth, getAllUsers);

router.get('/admins', adminAuth, getAllAdmins);

router.post('/admins', adminAuth, createAdmin);

router.put('/admins/:id/status', adminAuth, updateAdminStatus);

router.delete('/admins/:id', adminAuth, deleteAdmin);

router.delete('/parents/:id', adminAuth, deleteParent);
router.put('/parents/:id', adminAuth, updateParent);

router.get('/children', adminAuth, getAllChildren);
router.delete('/parents/:parentId/children/:childId', adminAuth, deleteChild);
router.put('/parents/:parentId/children/:childId', adminAuth, updateChild);

module.exports = router;