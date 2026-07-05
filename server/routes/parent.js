const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    getChildren,
    getChildById,
    updateChild,
    updateChildProgress,
    recordMood
} = require('../controllers/parentController');

router.post('/register', register);

router.post('/login', login);

router.get('/profile', auth, getProfile);

router.get('/children', auth, getChildren);

router.get('/children/:childId', auth, getChildById);

router.put('/children/:childId', auth, updateChild);

router.put('/children/:childId/progress', auth, updateChildProgress);

router.post('/children/:childId/mood', auth, recordMood);

module.exports = router;