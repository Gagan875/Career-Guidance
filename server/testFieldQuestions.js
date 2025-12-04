const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const count = await FieldQuestion.countDocuments();
    console.log(`📊 Total field questions: ${count}`);
    
    const fields = ['engineering', 'medical', 'computer-science', 'data-science', 
                    'management', 'law', 'design', 'architecture', 
                    'agriculture', 'pharmacy', 'biotechnology', 'psychology', 
                    'mass-communication', 'hospitality', 'aviation'];
    
    console.log('\n📊 Questions by field:');
    for (const field of fields) {
      const fieldCount = await FieldQuestion.countDocuments({ field });
      console.log(`   ${field}: ${fieldCount} questions`);
    }
    
    // Test fetching 5 random questions from engineering
    console.log('\n🧪 Testing random question fetch for engineering:');
    const testQuestions = await FieldQuestion.aggregate([
      { $match: { field: 'engineering', isActive: true } },
      { $sample: { size: 5 } }
    ]);
    console.log(`   Fetched ${testQuestions.length} questions`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

test();
