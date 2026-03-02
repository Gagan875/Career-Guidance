const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

async function checkQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Count total questions
    const totalCount = await Question.countDocuments();
    console.log(`Total questions in database: ${totalCount}`);

    // Count by stream
    const streamCounts = await Question.aggregate([
      { $group: { _id: '$stream', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\nQuestions by stream:');
    streamCounts.forEach(item => {
      console.log(`${item._id}: ${item.count} questions`);
    });

    // Show sample questions
    console.log('\nSample questions:');
    const samples = await Question.find().limit(3);
    samples.forEach((q, index) => {
      console.log(`${index + 1}. [${q.stream}] ${q.question}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking questions:', error);
    mongoose.connection.close();
  }
}

checkQuestions();