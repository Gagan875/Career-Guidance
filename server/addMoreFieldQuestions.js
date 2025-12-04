const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

// Additional Engineering Questions (79 more to make 100 total)
const additionalEngineeringQuestions = [
  {
    question: "What is the first law of thermodynamics?",
    options: [
      { text: "Energy cannot be created or destroyed", value: "a", isCorrect: true },
      { text: "Entropy always increases", value: "b", isCorrect: false },
      { text: "Heat flows from hot to cold", value: "c", isCorrect: false },
      { text: "Work equals force times distance", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Thermodynamics"
  },
  {
    question: "What is a microcontroller?",
    options: [
      { text: "A small computer on a single chip", value: "a", isCorrect: true },
      { text: "A small motor", value: "b", isCorrect: false },
      { text: "A measuring device", value: "c", isCorrect: false },
      { text: "A power supply", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Electronics"
  },
  {
    question: "What does API stand for in software?",
    options: [
      { text: "Application Programming Interface", value: "a", isCorrect: true },
      { text: "Advanced Program Integration", value: "b", isCorrect: false },
      { text: "Automated Process Interface", value: "c", isCorrect: false },
      { text: "Application Process Integration", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Software Engineering"
  },
  {
    question: "What is stress in material science?",
    options: [
      { text: "Force per unit area", value: "a", isCorrect: true },
      { text: "Total force applied", value: "b", isCorrect: false },
      { text: "Deformation of material", value: "c", isCorrect: false },
      { text: "Material hardness", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Material Science"
  },
  {
    question: "What is the purpose of a diode?",
    options: [
      { text: "Allow current flow in one direction", value: "a", isCorrect: true },
      { text: "Amplify signals", value: "b", isCorrect: false },
      { text: "Store energy", value: "c", isCorrect: false },
      { text: "Generate electricity", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Electronics"
  }
];

// Generate more questions programmatically for each field
function generateMoreQuestions() {
  const moreQuestions = [];
  
  // Engineering - 74 more questions
  const engineeringTopics = [
    { topic: "Mechanics", count: 15 },
    { topic: "Circuits", count: 15 },
    { topic: "Programming", count: 15 },
    { topic: "Materials", count: 14 },
    { topic: "Systems", count: 15 }
  ];
  
  engineeringTopics.forEach(({ topic, count }) => {
    for (let i = 1; i <= count; i++) {
      moreQuestions.push({
        question: `Engineering ${topic} Question ${i}: What is a key concept in ${topic.toLowerCase()}?`,
        options: [
          { text: `Correct answer for ${topic} ${i}`, value: "a", isCorrect: true },
          { text: `Incorrect option B`, value: "b", isCorrect: false },
          { text: `Incorrect option C`, value: "c", isCorrect: false },
          { text: `Incorrect option D`, value: "d", isCorrect: false }
        ],
        field: "engineering",
        difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
        category: topic
      });
    }
  });
  
  // Medical - 80 more questions
  const medicalTopics = [
    { topic: "Anatomy", count: 16 },
    { topic: "Physiology", count: 16 },
    { topic: "Pharmacology", count: 16 },
    { topic: "Pathology", count: 16 },
    { topic: "Surgery", count: 16 }
  ];
  
  medicalTopics.forEach(({ topic, count }) => {
    for (let i = 1; i <= count; i++) {
      moreQuestions.push({
        question: `Medical ${topic} Question ${i}: What is important in ${topic.toLowerCase()}?`,
        options: [
          { text: `Correct answer for ${topic} ${i}`, value: "a", isCorrect: true },
          { text: `Incorrect option B`, value: "b", isCorrect: false },
          { text: `Incorrect option C`, value: "c", isCorrect: false },
          { text: `Incorrect option D`, value: "d", isCorrect: false }
        ],
        field: "medical",
        difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
        category: topic
      });
    }
  });
  
  // Management - 40 more questions
  const managementTopics = [
    { topic: "Strategy", count: 10 },
    { topic: "Marketing", count: 10 },
    { topic: "Finance", count: 10 },
    { topic: "Operations", count: 10 }
  ];
  
  managementTopics.forEach(({ topic, count }) => {
    for (let i = 1; i <= count; i++) {
      moreQuestions.push({
        question: `Management ${topic} Question ${i}: What is a principle of ${topic.toLowerCase()}?`,
        options: [
          { text: `Correct answer for ${topic} ${i}`, value: "a", isCorrect: true },
          { text: `Incorrect option B`, value: "b", isCorrect: false },
          { text: `Incorrect option C`, value: "c", isCorrect: false },
          { text: `Incorrect option D`, value: "d", isCorrect: false }
        ],
        field: "management",
        difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
        category: topic
      });
    }
  });
  
  // Law - 40 more questions
  const lawTopics = [
    { topic: "Constitutional Law", count: 10 },
    { topic: "Criminal Law", count: 10 },
    { topic: "Corporate Law", count: 10 },
    { topic: "Civil Law", count: 10 }
  ];
  
  lawTopics.forEach(({ topic, count }) => {
    for (let i = 1; i <= count; i++) {
      moreQuestions.push({
        question: `Law ${topic} Question ${i}: What is a key aspect of ${topic.toLowerCase()}?`,
        options: [
          { text: `Correct answer for ${topic} ${i}`, value: "a", isCorrect: true },
          { text: `Incorrect option B`, value: "b", isCorrect: false },
          { text: `Incorrect option C`, value: "c", isCorrect: false },
          { text: `Incorrect option D`, value: "d", isCorrect: false }
        ],
        field: "law",
        difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
        category: topic
      });
    }
  });
  
  // Computer Science - 40 more questions
  const csTopics = [
    { topic: "Algorithms", count: 10 },
    { topic: "Data Structures", count: 10 },
    { topic: "Databases", count: 10 },
    { topic: "Networks", count: 10 }
  ];
  
  csTopics.forEach(({ topic, count }) => {
    for (let i = 1; i <= count; i++) {
      moreQuestions.push({
        question: `Computer Science ${topic} Question ${i}: What is fundamental in ${topic.toLowerCase()}?`,
        options: [
          { text: `Correct answer for ${topic} ${i}`, value: "a", isCorrect: true },
          { text: `Incorrect option B`, value: "b", isCorrect: false },
          { text: `Incorrect option C`, value: "c", isCorrect: false },
          { text: `Incorrect option D`, value: "d", isCorrect: false }
        ],
        field: "computer-science",
        difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
        category: topic
      });
    }
  });
  
  // Data Science - 40 more questions
  const dsTopics = [
    { topic: "Statistics", count: 10 },
    { topic: "Machine Learning", count: 10 },
    { topic: "Data Mining", count: 10 },
    { topic: "Visualization", count: 10 }
  ];
  
  dsTopics.forEach(({ topic, count }) => {
    for (let i = 1; i <= count; i++) {
      moreQuestions.push({
        question: `Data Science ${topic} Question ${i}: What is essential in ${topic.toLowerCase()}?`,
        options: [
          { text: `Correct answer for ${topic} ${i}`, value: "a", isCorrect: true },
          { text: `Incorrect option B`, value: "b", isCorrect: false },
          { text: `Incorrect option C`, value: "c", isCorrect: false },
          { text: `Incorrect option D`, value: "d", isCorrect: false }
        ],
        field: "data-science",
        difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
        category: topic
      });
    }
  });
  
  return moreQuestions;
}

// Database connection and seeding
async function addMoreFieldQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    const additionalQuestions = [
      ...additionalEngineeringQuestions,
      ...generateMoreQuestions()
    ];

    // Insert additional questions
    await FieldQuestion.insertMany(additionalQuestions);
    console.log(`✅ Successfully added ${additionalQuestions.length} more field questions`);

    // Show total count
    const totalCount = await FieldQuestion.countDocuments();
    console.log(`📊 Total field questions in database: ${totalCount}`);

    // Show count by field
    const fields = ['engineering', 'medical', 'management', 'law', 'design', 'architecture', 
                    'agriculture', 'pharmacy', 'computer-science', 'data-science', 
                    'biotechnology', 'psychology', 'mass-communication', 'hospitality', 'aviation'];
    
    console.log('\n📊 Questions by field:');
    for (const field of fields) {
      const count = await FieldQuestion.countDocuments({ field });
      console.log(`   ${field}: ${count} questions`);
    }

    console.log('\n✨ Additional field questions added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding field questions:', error);
    process.exit(1);
  }
}

// Run the function
addMoreFieldQuestions();
