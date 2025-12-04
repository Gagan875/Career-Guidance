const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Import the FieldQuestion model
    const FieldQuestion = require('./models/FieldQuestion');
    
    // Test fetching 5 questions from each field
    const fields = [
      'engineering', 'medical', 'computer-science', 'data-science',
      'management', 'law', 'design', 'architecture', 'agriculture',
      'pharmacy', 'biotechnology', 'psychology', 'mass-communication',
      'hospitality', 'aviation'
    ];
    
    console.log('\n🧪 Testing field quiz question fetch...\n');
    
    let allQuestions = [];
    
    for (const field of fields) {
      const questions = await FieldQuestion.aggregate([
        { $match: { field: field } },
        { $sample: { size: 5 } }
      ]);
      
      console.log(`${field}: ${questions.length} questions fetched`);
      allQuestions.push(...questions);
    }
    
    console.log(`\n✅ Total questions fetched: ${allQuestions.length}`);
    console.log(`Expected: 75 (5 per field × 15 fields)`);
    
    if (allQuestions.length === 75) {
      console.log('✅ Field quiz API should work correctly!');
    } else {
      console.log('⚠️  Warning: Not enough questions in some fields');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
