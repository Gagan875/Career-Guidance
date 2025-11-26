const mongoose = require('mongoose');
const Question = require('./models/Question');
const User = require('./models/User');
require('dotenv').config();

async function testNoRepeatLogic() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a test user (you'll need to replace this with an actual user ID)
    const users = await User.find().limit(1);
    if (users.length === 0) {
      console.log('No users found. Please create a user first.');
      return;
    }

    const testUser = users[0];
    console.log('Testing with user:', testUser.email);

    // Simulate the question selection logic
    const streams = ['science', 'commerce', 'arts', 'diploma'];
    const questionsPerStream = 5;
    const maxQuizHistory = 90;

    let excludeQuestionIds = [];

    if (testUser.questionHistory) {
      const recentHistory = testUser.questionHistory
        .sort((a, b) => b.usedAt - a.usedAt)
        .slice(0, maxQuizHistory * 20);
      
      excludeQuestionIds = recentHistory.map(h => h.questionId);
      console.log('Excluding', excludeQuestionIds.length, 'previously used questions');
    }

    // Test question selection for each stream
    for (const stream of streams) {
      const matchQuery = { 
        stream: stream, 
        isActive: true 
      };
      
      if (excludeQuestionIds.length > 0) {
        matchQuery._id = { $nin: excludeQuestionIds };
      }

      const availableCount = await Question.countDocuments(matchQuery);
      console.log(`${stream}: ${availableCount} available questions (${excludeQuestionIds.length} excluded)`);

      // Get sample questions
      const questions = await Question.aggregate([
        { $match: matchQuery },
        { $sample: { size: Math.min(questionsPerStream, availableCount) } },
        { $project: { _id: 1, question: 1, stream: 1 } }
      ]);

      console.log(`Selected ${questions.length} ${stream} questions:`);
      questions.forEach((q, i) => {
        console.log(`  ${i + 1}. ${q.question.substring(0, 50)}...`);
      });
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Test error:', error);
    mongoose.connection.close();
  }
}

testNoRepeatLogic();