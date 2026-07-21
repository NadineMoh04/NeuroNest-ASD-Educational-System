const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learningfun-education';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const parentRoutes = require('./routes/parent');
const testRoutes = require('./routes/test');
const predictionRoutes = require('./routes/predictionRoutes');
const adminRoutes = require('./routes/admin');

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to NeuroNest Educational System API' });
});

app.use('/api/parent', parentRoutes);
app.use('/api/test', testRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/admin', adminRoutes);

// Serve static assets from React client build if present
const clientBuildPath = path.join(__dirname, '../client/build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


