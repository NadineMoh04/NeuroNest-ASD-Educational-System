const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Parent = require('../models/Parent');

const register = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { name, email, password, kidname, childInfo } = req.body;

        if (!name || !email || !password || !kidname) {
            console.log('Validation failed - missing required fields');
            console.log('name:', name, 'email:', email, 'password:', password, 'kidname:', kidname);
            return res.status(400).json({
                message: 'All fields (name, email, password, kidname) are required'
            });
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ message: 'Parent already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const childData = {
            name: kidname,
            age: childInfo?.age !== undefined && childInfo?.age !== '' ? childInfo.age : 0,
            sex: childInfo?.sex || '',
            ethnicity: childInfo?.ethnicity || '',
            qchatScore: childInfo?.qchatScore !== undefined ? childInfo.qchatScore : 0,
            asdPrediction: childInfo?.asdPrediction !== undefined ? childInfo.asdPrediction : 0,
            speechDelay: childInfo?.speechDelay !== undefined && childInfo?.speechDelay !== null ? childInfo.speechDelay : null,
            learningDisorder: childInfo?.learningDisorder !== undefined && childInfo?.learningDisorder !== null ? childInfo.learningDisorder : null,
            gddId: childInfo?.gddId !== undefined && childInfo?.gddId !== null ? childInfo.gddId : null,
            geneticDisorders: childInfo?.geneticDisorders !== undefined && childInfo?.geneticDisorders !== null ? childInfo.geneticDisorders : null,
            geneticDisordersNotes: childInfo?.geneticDisordersNotes || '',
            jaundice: childInfo?.jaundice !== undefined && childInfo?.jaundice !== null ? childInfo.jaundice : null,
            anxietyDisorder: childInfo?.anxietyDisorder !== undefined && childInfo?.anxietyDisorder !== null ? childInfo.anxietyDisorder : null,
            depression: childInfo?.depression !== undefined && childInfo?.depression !== null ? childInfo.depression : null,
            socialBehaviouralIssues: childInfo?.socialBehaviouralIssues !== undefined && childInfo?.socialBehaviouralIssues !== null ? childInfo.socialBehaviouralIssues : null,
            familyMemberAsd: childInfo?.familyMemberAsd !== undefined && childInfo?.familyMemberAsd !== null ? childInfo.familyMemberAsd : null,
            whoCompletedTest: childInfo?.whoCompletedTest || null,
            learningLevel: 'beginner',
            preferences: {},
            progress: {
                totalPoints: 0,
                completedActivities: 0,
                streakDays: 0,
                skills: {
                    communication: 0,
                    attention: 0,
                    socialInteraction: 0
                }
            },
            moodTracking: []
        };

        console.log('Constructed child data:', childData);

        const parent = new Parent({
            name,
            email,
            password: hashedPassword,
            children: [childData]
        });

        console.log('Attempting to save parent...');
        await parent.save();
        console.log('Parent saved successfully!');

        const token = jwt.sign(
            { parentId: parent._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Parent and child registered successfully',
            token,
            parent: {
                id: parent._id,
                name: parent.name,
                email: parent.email,
                children: parent.children
            }
        });
    } catch (error) {
        console.error('Parent registration error:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            });
        }

        const parent = await Parent.findOne({ email });
        if (!parent) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, parent.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { parentId: parent._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            parent: {
                id: parent._id,
                name: parent.name,
                email: parent.email,
                children: parent.children
            }
        });
    } catch (error) {
        console.error('Parent login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const getProfile = async (req, res) => {
    try {
        const parent = await Parent.findById(req.parentId).select('-password');

        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        res.json({
            parent: {
                id: parent._id,
                name: parent.name,
                email: parent.email,
                children: parent.children,
                createdAt: parent.createdAt
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getChildren = async (req, res) => {
    try {
        console.log('Fetching children for parent ID:', req.parentId);
        const parent = await Parent.findById(req.parentId).select('-password');

        if (!parent) {
            console.log('Parent not found for ID:', req.parentId);
            return res.status(404).json({ message: 'Parent not found' });
        }

        console.log('Found parent with children:', parent.children);
        res.json({
            children: parent.children
        });
    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getChildById = async (req, res) => {
    try {
        const { childId } = req.params;
        const parent = await Parent.findById(req.parentId).select('-password');

        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const child = parent.children.id(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        res.json({
            child
        });
    } catch (error) {
        console.error('Get child error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateChildProgress = async (req, res) => {
    try {
        const { childId } = req.params;
        const { activityType, pointsEarned, completed, skillsImproved } = req.body;

        const parent = await Parent.findById(req.parentId);

        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const childIndex = parent.children.findIndex(child => child._id.toString() === childId);
        if (childIndex === -1) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const child = parent.children[childIndex];

        if (pointsEarned) {
            child.progress.totalPoints += pointsEarned;
        }

        if (completed) {
            child.progress.completedActivities += 1;

            const today = new Date().toDateString();
            const lastActivityDate = new Date(child.lastActivity).toDateString();

            if (today === lastActivityDate) {
                child.progress.streakDays += 1;
            } else {
                child.progress.streakDays = 1;
            }
        }

        if (skillsImproved) {
            Object.keys(skillsImproved).forEach(skill => {
                if (child.progress.skills[skill] !== undefined) {
                    child.progress.skills[skill] = Math.min(100, child.progress.skills[skill] + (skillsImproved[skill] || 0));
                }
            });
        }

        child.lastActivity = Date.now();

        await parent.save();

        res.json({
            message: 'Child progress updated successfully',
            child: parent.children[childIndex]
        });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ message: 'Server error updating progress' });
    }
};

const updateChild = async (req, res) => {
    try {
        const { childId } = req.params;
        const updateData = req.body;

        const parent = await Parent.findById(req.parentId);

        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const childIndex = parent.children.findIndex(child => child._id.toString() === childId);
        if (childIndex === -1) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const child = parent.children[childIndex];

        if (updateData.name) child.name = updateData.name;
        if (updateData.age) child.age = updateData.age;
        if (updateData.sex) child.sex = updateData.sex;
        if (updateData.ethnicity) child.ethnicity = updateData.ethnicity;

        if (updateData.speechDelay !== undefined) child.speechDelay = updateData.speechDelay;
        if (updateData.learningDisorder !== undefined) child.learningDisorder = updateData.learningDisorder;
        if (updateData.gddId !== undefined) child.gddId = updateData.gddId;
        if (updateData.geneticDisorders !== undefined) child.geneticDisorders = updateData.geneticDisorders;
        if (updateData.geneticDisordersNotes) child.geneticDisordersNotes = updateData.geneticDisordersNotes;
        if (updateData.jaundice !== undefined) child.jaundice = updateData.jaundice;
        if (updateData.anxietyDisorder !== undefined) child.anxietyDisorder = updateData.anxietyDisorder;
        if (updateData.depression !== undefined) child.depression = updateData.depression;
        if (updateData.socialBehaviouralIssues !== undefined) child.socialBehaviouralIssues = updateData.socialBehaviouralIssues;
        if (updateData.familyMemberAsd !== undefined) child.familyMemberAsd = updateData.familyMemberAsd;
        if (updateData.asdPrediction !== undefined) child.asdPrediction = updateData.asdPrediction;

        await parent.save();

        res.json({
            message: 'Child information updated successfully',
            child: parent.children[childIndex]
        });
    } catch (error) {
        console.error('Update child error:', error);
        res.status(500).json({ message: 'Server error updating child' });
    }
};

const recordMood = async (req, res) => {
    try {
        const { childId } = req.params;
        const { mood } = req.body;

        const validMoods = ['happy', 'neutral', 'sad', 'angry'];
        if (!validMoods.includes(mood)) {
            return res.status(400).json({ message: 'Invalid mood value' });
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

        child.moodTracking.push({
            mood,
            date: Date.now()
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        child.moodTracking = child.moodTracking.filter(moodEntry =>
            new Date(moodEntry.date) >= thirtyDaysAgo
        );

        await parent.save();

        res.json({
            message: 'Mood recorded successfully',
            mood: {
                mood,
                date: Date.now()
            }
        });
    } catch (error) {
        console.error('Record mood error:', error);
        res.status(500).json({ message: 'Server error recording mood' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getChildren,
    getChildById,
    updateChild,
    updateChildProgress,
    recordMood
};