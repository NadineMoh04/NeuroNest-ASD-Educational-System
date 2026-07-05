const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Parent = require('../models/Parent');
const auth = require('../middleware/auth');

router.post('/submit', auth, async (req, res) => {
    try {
        const { answers, score } = req.body;

        if (req.userId) {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.testScore = score;
            user.testCompleted = true;
            await user.save();

            res.json({
                message: 'Test submitted successfully',
                score,
                testCompleted: true
            });
        } else if (req.parentId) {
            const { childId } = req.body;
            if (!childId) {
                return res.status(400).json({ message: 'Child ID is required for parent submissions' });
            }

            const parent = await Parent.findById(req.parentId);
            if (!parent) {
                return res.status(404).json({ message: 'Parent not found' });
            }

            const childIndex = parent.children.findIndex(child => child._id.toString() === childId);
            if (childIndex === -1) {
                return res.status(404).json({ message: 'Child not found' });
            }

            const child = parent.children[childIndex];

            child.progress.totalPoints += score;
            child.progress.completedActivities += 1;

            const today = new Date().toDateString();
            const lastActivityDate = new Date(child.lastActivity).toDateString();

            if (today === lastActivityDate) {
                child.progress.streakDays += 1;
            } else {
                child.progress.streakDays = 1;
            }

            child.lastActivity = Date.now();

            await parent.save();

            res.json({
                message: 'Test submitted successfully',
                score,
                testCompleted: true,
                childId
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Test submission error:', error);
        res.status(500).json({ message: 'Server error during test submission' });
    }
});

router.get('/status', auth, async (req, res) => {
    try {
        if (req.userId) {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                testCompleted: user.testCompleted,
                testScore: user.testScore
            });
        } else if (req.parentId) {
            const parent = await Parent.findById(req.parentId).select('-password');
            if (!parent) {
                return res.status(404).json({ message: 'Parent not found' });
            }

            res.json({
                children: parent.children.map(child => ({
                    id: child._id,
                    name: child.name,
                    progress: child.progress,
                    lastActivity: child.lastActivity
                }))
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Test status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
