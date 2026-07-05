const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learningfun-education';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected for admin creation'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const createDefaultAdmin = async () => {
    try {
        let admin = await Admin.findOne({ email: 'admin@neuronest.com' });

        if (admin) {
            console.log('Admin already exists, updating password...');
            admin.password = 'admin2026';
            await admin.save();
            console.log('✅ Admin password updated successfully!');
        } else {
            admin = new Admin({
                name: 'System Administrator',
                email: 'admin@neuronest.com',
                password: 'admin2026',
                role: 'superadmin',
                permissions: ['manage_users', 'manage_parents', 'view_reports', 'manage_content', 'system_settings'],
                isActive: true
            });

            await admin.save();
            console.log('✅ Default admin created successfully!');
        }

        console.log('Email: admin@neuronest.com');
        console.log('Password: admin2026');
        console.log('Role:', admin.role);
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating/updating admin:', error);
        process.exit(1);
    }
};

createDefaultAdmin();