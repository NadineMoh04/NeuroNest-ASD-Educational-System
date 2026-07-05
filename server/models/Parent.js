const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    ethnicity: {
        type: String,
        enum: ['asian', 'black', 'hispanic', 'white', 'mixed', 'other']
    },
    qchatScore: {
        type: Number,
        default: 0
    },
    asdPrediction: {
        type: Number,
        default: 0
    },
    learningLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    speechDelay: {
        type: Boolean,
        default: null
    },
    learningDisorder: {
        type: Boolean,
        default: null
    },
    gddId: {
        type: Boolean,
        default: null
    },
    geneticDisorders: {
        type: Boolean,
        default: null
    },
    geneticDisordersNotes: {
        type: String,
        default: ''
    },
    jaundice: {
        type: Boolean,
        default: null
    },
    anxietyDisorder: {
        type: Boolean,
        default: null
    },
    depression: {
        type: Boolean,
        default: null
    },
    socialBehaviouralIssues: {
        type: Boolean,
        default: null
    },
    familyMemberAsd: {
        type: Boolean,
        default: null
    },
    whoCompletedTest: {
        type: String,
        enum: ['Parent', 'Guardian', 'Teacher', 'Specialist', null, ''],
        default: null
    },
    preferences: {
        favoriteColors: [{
            type: String
        }],
        favoriteCharacters: [{
            type: String
        }],
        interests: [{
            type: String
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    progress: {
        totalPoints: {
            type: Number,
            default: 0
        },
        completedActivities: {
            type: Number,
            default: 0
        },
        streakDays: {
            type: Number,
            default: 0
        },
        skills: {
            communication: {
                type: Number,
                default: 0
            },
            attention: {
                type: Number,
                default: 0
            },
            socialInteraction: {
                type: Number,
                default: 0
            }
        }
    },
    moodTracking: [{
        date: {
            type: Date,
            default: Date.now
        },
        mood: {
            type: String,
            enum: ['happy', 'neutral', 'sad', 'angry']
        }
    }]
});

const parentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    children: [childSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Parent', parentSchema);