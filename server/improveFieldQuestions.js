const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

// Delete programmatically generated questions and keep only the good ones
async function improveQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Delete questions with generic text patterns
    const result = await FieldQuestion.deleteMany({
      question: { $regex: /Question \d+: What is/ }
    });
    
    console.log(`🗑️  Deleted ${result.deletedCount} generic questions`);

    const remaining = await FieldQuestion.countDocuments();
    console.log(`📊 Remaining questions: ${remaining}`);

    // Show count by field
    const fields = ['engineering', 'medical', 'computer-science', 'data-science', 
                    'management', 'law', 'design', 'architecture', 
                    'agriculture', 'pharmacy', 'biotechnology', 'psychology', 
                    'mass-communication', 'hospitality', 'aviation'];
    
    console.log('\n📊 Questions by field after cleanup:');
    for (const field of fields) {
      const count = await FieldQuestion.countDocuments({ field });
      console.log(`   ${field}: ${count} questions`);
    }

    console.log('\n✨ Cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

improveQuestions();
