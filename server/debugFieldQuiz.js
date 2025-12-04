const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const fields = [
      'engineering', 'medical', 'computer-science', 'data-science', 
      'management', 'law', 'design', 'architecture', 
      'agriculture', 'pharmacy', 'biotechnology', 'psychology', 
      'mass-communication', 'hospitality', 'aviation'
    ];

    console.log('\n🔍 Checking each field:');
    let totalQuestions = 0;
    
    for (const field of fields) {
      const totalInField = await FieldQuestion.countDocuments({ field, isActive: true });
      const sample = await FieldQuestion.aggregate([
        { $match: { field, isActive: true } },
        { $sample: { size: 5 } }
      ]);
      
      const status = sample.length === 5 ? '✅' : '❌';
      console.log(`${status} ${field}: ${sample.length}/5 questions (${totalInField} total available)`);
      totalQuestions += sample.length;
    }

    console.log(`\n📊 Total questions that would be fetched: ${totalQuestions}`);
    console.log(`Expected: 75`);
    
    if (totalQuestions < 75) {
      console.log(`\n⚠️  Missing ${75 - totalQuestions} questions!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debug();
