const mongoose = require('mongoose');
const Question = require('./models/Question');
const User = require('./models/User');
require('dotenv').config();

async function addTestHistory() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the test user
    const user = await User.findOne({ email: '12326gaganrawal@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Found user:', user.email);

    // Get some random questions to add to history
    const questions = await Question.find().limit(40); // 2 quizzes worth
    
    // Initialize question history if it doesn't exist
    user.questionHistory = user.questionHistory || [];
    
    // Add fake history entries
    const historyEntries = questions.map((q, index) => ({
      questionId: q._id,
      usedAt: new Date(Date.now() - (index * 60000)), // Spread over time
      quizNumber: Math.floor(index / 20) + 1
    }));

    user.questionHistory.push(...historyEntries);
    await user.save();

    console.log(`Added ${historyEntries.length} question history entries`);
    console.log(`Total question history: ${user.questionHistory.length}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

addTestHistory();