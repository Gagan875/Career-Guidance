const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

const final10Questions = [
  {
    question: "What is responsive web design?",
    options: [
      { text: "Design that adapts to different screen sizes", value: "a", isCorrect: true },
      { text: "Design that responds to user clicks", value: "b", isCorrect: false },
      { text: "Fast loading design", value: "c", isCorrect: false },
      { text: "Interactive design", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Web Design"
  },
  {
    question: "What is LEED certification in architecture?",
    options: [
      { text: "Green building certification", value: "a", isCorrect: true },
      { text: "Architect license", value: "b", isCorrect: false },
      { text: "Building permit", value: "c", isCorrect: false },
      { text: "Construction approval", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "medium",
    category: "Sustainable Architecture"
  },
  {
    question: "What is hydroponics in agriculture?",
    options: [
      { text: "Growing plants without soil", value: "a", isCorrect: true },
      { text: "Water management", value: "b", isCorrect: false },
      { text: "Irrigation system", value: "c", isCorrect: false },
      { text: "Fertilizer application", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "medium",
    category: "Modern Agriculture"
  },
  {
    question: "What is a generic drug in pharmacy?",
    options: [
      { text: "Drug with same active ingredient as brand name", value: "a", isCorrect: true },
      { text: "Over-the-counter drug", value: "b", isCorrect: false },
      { text: "Prescription drug", value: "c", isCorrect: false },
      { text: "Herbal medicine", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "easy",
    category: "Pharmaceutical Practice"
  },
  {
    question: "What is GMO in biotechnology?",
    options: [
      { text: "Genetically Modified Organism", value: "a", isCorrect: true },
      { text: "General Medical Operation", value: "b", isCorrect: false },
      { text: "Global Molecular Organization", value: "c", isCorrect: false },
      { text: "Genetic Molecular Observation", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "easy",
    category: "Genetic Engineering"
  },
  {
    question: "What is cognitive behavioral therapy in psychology?",
    options: [
      { text: "Therapy focusing on thoughts and behaviors", value: "a", isCorrect: true },
      { text: "Physical therapy", value: "b", isCorrect: false },
      { text: "Group therapy", value: "c", isCorrect: false },
      { text: "Art therapy", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "medium",
    category: "Clinical Psychology"
  },
  {
    question: "What is investigative journalism?",
    options: [
      { text: "In-depth reporting to uncover hidden information", value: "a", isCorrect: true },
      { text: "Crime reporting", value: "b", isCorrect: false },
      { text: "Sports journalism", value: "c", isCorrect: false },
      { text: "Entertainment news", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Journalism"
  },
  {
    question: "What is revenue management in hospitality?",
    options: [
      { text: "Optimizing pricing to maximize revenue", value: "a", isCorrect: true },
      { text: "Collecting payments", value: "b", isCorrect: false },
      { text: "Managing expenses", value: "c", isCorrect: false },
      { text: "Accounting", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "medium",
    category: "Hotel Management"
  },
  {
    question: "What is ICAO in aviation?",
    options: [
      { text: "International Civil Aviation Organization", value: "a", isCorrect: true },
      { text: "Indian Civil Aviation Office", value: "b", isCorrect: false },
      { text: "International Commercial Airline Organization", value: "c", isCorrect: false },
      { text: "Interstate Civil Aviation Office", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "medium",
    category: "Aviation Regulations"
  },
  {
    question: "What is 3D modeling in design?",
    options: [
      { text: "Creating three-dimensional digital representations", value: "a", isCorrect: true },
      { text: "Drawing on paper", value: "b", isCorrect: false },
      { text: "Photography", value: "c", isCorrect: false },
      { text: "Painting", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "3D Design"
  }
];

async function addFinal10() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    await FieldQuestion.insertMany(final10Questions);
    console.log(`✅ Successfully added final 10 questions`);

    const totalCount = await FieldQuestion.countDocuments();
    console.log(`📊 Total field questions in database: ${totalCount}`);

    const fields = ['engineering', 'medical', 'management', 'law', 'design', 'architecture', 
                    'agriculture', 'pharmacy', 'computer-science', 'data-science', 
                    'biotechnology', 'psychology', 'mass-communication', 'hospitality', 'aviation'];
    
    console.log('\n📊 Final count by field:');
    for (const field of fields) {
      const count = await FieldQuestion.countDocuments({ field });
      console.log(`   ${field}: ${count} questions`);
    }

    console.log('\n🎉 Successfully reached 500 field questions!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addFinal10();
