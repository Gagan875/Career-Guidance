const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

async function testAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const fields = [
      'engineering', 'medical', 'computer-science', 'data-science', 
      'management', 'law', 'design', 'architecture', 
      'agriculture', 'pharmacy', 'biotechnology', 'psychology', 
      'mass-communication', 'hospitality', 'aviation'
    ];

    let allQuestions = [];
    
    console.log('\n🧪 Testing question fetch for each field:');
    for (const field of fields) {
      const questions = await FieldQuestion.aggregate([
        { $match: { field: field, isActive: true } },
        { $sample: { size: 5 } }
      ]);
      
      console.log(`   ${field}: ${questions.length} questions fetched`);
      allQuestions = allQuestions.concat(questions);
    }

    console.log(`\n📊 Total questions fetched: ${allQuestions.length}`);
    console.log(`✅ Expected: 75 (5 × 15 fields)`);
    
    if (allQuestions.length === 75) {
      console.log('✅ SUCCESS: All 75 questions fetched correctly!');
    } else {
      console.log(`❌ ERROR: Only ${allQuestions.length} questions fetched`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAPI();
