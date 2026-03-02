const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const quizRoutes = require('./routes/quiz');
const streamQuizRoutes = require('./routes/streamQuiz');
const collegeRoutes = require('./routes/colleges');
const courseRoutes = require('./routes/courses');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/stream-quiz', streamQuizRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/courses', courseRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('📖 Please check the MongoDB Setup Guide: ../MONGODB_SETUP.md');
    console.error('💡 Common solutions:');
    console.error('   1. Make sure MongoDB is running locally, or');
    console.error('   2. Update MONGODB_URI in .env with your Atlas connection string');
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});