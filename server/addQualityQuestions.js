const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

// Helper function to randomize correct answer position
function createQuestion(question, correctAnswer, wrongAnswers, field, difficulty, category, explanation = null) {
  const allAnswers = [correctAnswer, ...wrongAnswers];
  const correctIndex = Math.floor(Math.random() * 4);
  
  // Shuffle answers
  const shuffled = [...allAnswers];
  [shuffled[0], shuffled[correctIndex]] = [shuffled[correctIndex], shuffled[0]];
  
  return {
    question,
    options: shuffled.map((text, index) => ({
      text,
      value: String.fromCharCode(97 + index), // a, b, c, d
      isCorrect: index === correctIndex
    })),
    field,
    difficulty,
    category,
    ...(explanation && { explanation })
  };
}

const qualityQuestions = [
  // Engineering Questions (24 more to reach 50)
  createQuestion(
    "What is the unit of electrical resistance?",
    "Ohm",
    ["Volt", "Ampere", "Watt"],
    "engineering", "easy", "Electrical Engineering"
  ),
  createQuestion(
    "Which law states that energy cannot be created or destroyed?",
    "Law of Conservation of Energy",
    ["Newton's First Law", "Ohm's Law", "Hooke's Law"],
    "engineering", "medium", "Physics"
  ),
  createQuestion(
    "What is the primary function of an operating system?",
    "Manage computer hardware and software resources",
    ["Run applications only", "Store data", "Connect to internet"],
    "engineering", "medium", "Computer Engineering"
  ),
  createQuestion(
    "What does RAM stand for?",
    "Random Access Memory",
    ["Read Access Memory", "Rapid Application Memory", "Remote Access Module"],
    "engineering", "easy", "Computer Hardware"
  ),
  createQuestion(
    "What is the speed of light in vacuum approximately?",
    "3 × 10⁸ m/s",
    ["3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁹ m/s"],
    "engineering", "medium", "Physics"
  ),
  
  // Medical Questions (30 more to reach 50)
  createQuestion(
    "What is the normal resting heart rate for adults?",
    "60-100 beats per minute",
    ["40-60 beats per minute", "100-120 beats per minute", "120-140 beats per minute"],
    "medical", "easy", "Physiology"
  ),
  createQuestion(
    "Which organ produces bile?",
    "Liver",
    ["Gallbladder", "Pancreas", "Stomach"],
    "medical", "easy", "Anatomy"
  ),
  createQuestion(
    "What is the medical term for low blood sugar?",
    "Hypoglycemia",
    ["Hyperglycemia", "Hypotension", "Hypertension"],
    "medical", "medium", "Pathology"
  ),
  createQuestion(
    "How many pairs of ribs does a human have?",
    "12 pairs",
    ["10 pairs", "11 pairs", "13 pairs"],
    "medical", "medium", "Anatomy"
  ),
  createQuestion(
    "What is the largest artery in the human body?",
    "Aorta",
    ["Pulmonary artery", "Carotid artery", "Femoral artery"],
    "medical", "easy", "Anatomy"
  ),
  
  // Computer Science Questions (40 more to reach 50)
  createQuestion(
    "What is the time complexity of accessing an element in an array?",
    "O(1)",
    ["O(n)", "O(log n)", "O(n²)"],
    "computer-science", "medium", "Data Structures"
  ),
  createQuestion(
    "Which data structure uses LIFO principle?",
    "Stack",
    ["Queue", "Array", "Linked List"],
    "computer-science", "easy", "Data Structures"
  ),
  createQuestion(
    "What does HTTP stand for?",
    "HyperText Transfer Protocol",
    ["HyperText Transmission Protocol", "High Transfer Text Protocol", "HyperText Transport Protocol"],
    "computer-science", "easy", "Networks"
  ),
  createQuestion(
    "What is polymorphism in OOP?",
    "Ability of objects to take multiple forms",
    ["Having multiple classes", "Using multiple functions", "Creating multiple objects"],
    "computer-science", "medium", "OOP"
  ),
  createQuestion(
    "Which sorting algorithm has best average case time complexity?",
    "Quick Sort",
    ["Bubble Sort", "Selection Sort", "Insertion Sort"],
    "computer-science", "hard", "Algorithms"
  ),
  
  // Data Science Questions (40 more to reach 50)
  createQuestion(
    "What is overfitting in machine learning?",
    "Model performs well on training data but poorly on new data",
    ["Model performs poorly on all data", "Model is too simple", "Model has too few parameters"],
    "data-science", "medium", "Machine Learning"
  ),
  createQuestion(
    "What is the purpose of cross-validation?",
    "Assess model performance on unseen data",
    ["Train the model faster", "Reduce dataset size", "Increase accuracy"],
    "data-science", "medium", "Machine Learning"
  ),
  createQuestion(
    "What does pandas library in Python primarily handle?",
    "Data manipulation and analysis",
    ["Machine learning", "Web development", "Game development"],
    "data-science", "easy", "Tools"
  ),
  createQuestion(
    "What is a confusion matrix?",
    "Table showing prediction results",
    ["Type of neural network", "Data visualization tool", "Database structure"],
    "data-science", "medium", "Evaluation"
  ),
  createQuestion(
    "What is feature engineering?",
    "Creating new features from existing data",
    ["Removing features", "Collecting data", "Visualizing data"],
    "data-science", "medium", "Data Processing"
  ),
  
  // Management Questions (40 more to reach 50)
  createQuestion(
    "What is SWOT analysis used for?",
    "Strategic planning",
    ["Financial analysis", "Market research", "Product design"],
    "management", "easy", "Strategy"
  ),
  createQuestion(
    "What does ROI measure?",
    "Return on Investment",
    ["Rate of Interest", "Risk of Investment", "Revenue of Industry"],
    "management", "easy", "Finance"
  ),
  createQuestion(
    "What is the primary goal of marketing?",
    "Create and deliver value to customers",
    ["Maximize profits only", "Reduce costs", "Increase production"],
    "management", "easy", "Marketing"
  ),
  createQuestion(
    "What is supply chain management?",
    "Managing flow of goods from supplier to customer",
    ["Managing employees", "Managing finances", "Managing technology"],
    "management", "medium", "Operations"
  ),
  createQuestion(
    "What is organizational culture?",
    "Shared values and beliefs in an organization",
    ["Company rules", "Office location", "Number of employees"],
    "management", "medium", "Organizational Behavior"
  ),
  
  // Law Questions (40 more to reach 50)
  createQuestion(
    "What is the Indian Constitution based on?",
    "Written constitution with federal structure",
    ["Unwritten constitution", "Monarchy system", "Military rule"],
    "law", "easy", "Constitutional Law"
  ),
  createQuestion(
    "What is a tort?",
    "Civil wrong causing harm",
    ["Criminal offense", "Contract breach", "Property dispute"],
    "law", "medium", "Tort Law"
  ),
  createQuestion(
    "What does IPC stand for?",
    "Indian Penal Code",
    ["Indian Property Code", "International Penal Code", "Indian Police Code"],
    "law", "easy", "Criminal Law"
  ),
  createQuestion(
    "What is arbitration?",
    "Alternative dispute resolution method",
    ["Court trial", "Police investigation", "Legal documentation"],
    "law", "medium", "Alternative Dispute Resolution"
  ),
  createQuestion(
    "What is a patent?",
    "Exclusive right to an invention",
    ["Copyright for books", "Trademark for brands", "License to practice"],
    "law", "easy", "Intellectual Property"
  )
];

async function addQualityQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    await FieldQuestion.insertMany(qualityQuestions);
    console.log(`✅ Added ${qualityQuestions.length} quality questions`);

    const total = await FieldQuestion.countDocuments();
    console.log(`📊 Total questions: ${total}`);

    const fields = ['engineering', 'medical', 'computer-science', 'data-science', 
                    'management', 'law', 'design', 'architecture', 
                    'agriculture', 'pharmacy', 'biotechnology', 'psychology', 
                    'mass-communication', 'hospitality', 'aviation'];
    
    console.log('\n📊 Questions by field:');
    for (const field of fields) {
      const count = await FieldQuestion.countDocuments({ field });
      console.log(`   ${field}: ${count} questions`);
    }

    console.log('\n✨ Quality questions added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addQualityQuestions();
