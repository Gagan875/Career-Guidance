const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

function createQuestion(question, correctAnswer, wrongAnswers, field, difficulty, category, explanation = null) {
  const allAnswers = [correctAnswer, ...wrongAnswers];
  const correctIndex = Math.floor(Math.random() * 4);
  
  const shuffled = [...allAnswers];
  [shuffled[0], shuffled[correctIndex]] = [shuffled[correctIndex], shuffled[0]];
  
  return {
    question,
    options: shuffled.map((text, index) => ({
      text,
      value: String.fromCharCode(97 + index),
      isCorrect: index === correctIndex
    })),
    field,
    difficulty,
    category,
    ...(explanation && { explanation })
  };
}

const moreQuestions = [
  // Engineering (19 more to reach 50)
  createQuestion("What is binary code?", "Code using 0s and 1s", ["Code using letters", "Code using decimals", "Code using symbols"], "engineering", "easy", "Computer Science"),
  createQuestion("What is a semiconductor?", "Material with conductivity between conductor and insulator", ["Perfect conductor", "Perfect insulator", "Magnetic material"], "engineering", "medium", "Electronics"),
  createQuestion("What is torque?", "Rotational force", ["Linear force", "Magnetic force", "Gravitational force"], "engineering", "medium", "Mechanics"),
  createQuestion("What does CPU stand for?", "Central Processing Unit", ["Central Power Unit", "Computer Processing Unit", "Central Program Unit"], "engineering", "easy", "Computer Hardware"),
  createQuestion("What is Kirchhoff's Current Law?", "Sum of currents entering a node equals sum leaving", ["Voltage is constant", "Resistance is constant", "Power is constant"], "engineering", "hard", "Electrical Engineering"),
  
  // Medical (25 more to reach 50)
  createQuestion("What is hemoglobin?", "Protein that carries oxygen in blood", ["White blood cell", "Blood clotting factor", "Immune system protein"], "medical", "easy", "Hematology"),
  createQuestion("What is diabetes?", "Condition with high blood sugar", ["Low blood pressure", "Heart disease", "Lung disease"], "medical", "easy", "Endocrinology"),
  createQuestion("What is an ECG?", "Electrocardiogram - records heart activity", ["Brain scan", "Lung function test", "Blood test"], "medical", "easy", "Cardiology"),
  createQuestion("What is osteoporosis?", "Bone density loss disease", ["Muscle disease", "Nerve disease", "Skin disease"], "medical", "medium", "Orthopedics"),
  createQuestion("What is anemia?", "Lack of red blood cells or hemoglobin", ["High blood pressure", "Excess white blood cells", "Blood clotting disorder"], "medical", "easy", "Hematology"),
  
  // Computer Science (35 more to reach 50)
  createQuestion("What is recursion?", "Function calling itself", ["Loop structure", "Conditional statement", "Variable declaration"], "computer-science", "medium", "Programming"),
  createQuestion("What is a binary tree?", "Tree where each node has at most 2 children", ["Tree with 3 children per node", "Linear data structure", "Circular structure"], "computer-science", "medium", "Data Structures"),
  createQuestion("What is SQL?", "Structured Query Language for databases", ["Programming language", "Operating system", "Web framework"], "computer-science", "easy", "Databases"),
  createQuestion("What is encryption?", "Converting data into coded form", ["Deleting data", "Copying data", "Storing data"], "computer-science", "easy", "Security"),
  createQuestion("What is a variable?", "Storage location with a name", ["Function", "Loop", "Condition"], "computer-science", "easy", "Programming Basics"),
  
  // Data Science (35 more to reach 50)
  createQuestion("What is regression?", "Predicting continuous values", ["Classifying categories", "Clustering data", "Reducing dimensions"], "data-science", "medium", "Machine Learning"),
  createQuestion("What is a dataset?", "Collection of data", ["Single data point", "Database software", "Analysis tool"], "data-science", "easy", "Fundamentals"),
  createQuestion("What is numpy?", "Python library for numerical computing", ["Database system", "Web framework", "Testing tool"], "data-science", "easy", "Tools"),
  createQuestion("What is data cleaning?", "Removing errors and inconsistencies from data", ["Deleting all data", "Encrypting data", "Visualizing data"], "data-science", "easy", "Data Processing"),
  createQuestion("What is supervised learning?", "Learning from labeled data", ["Learning without data", "Learning from unlabeled data", "Learning from images only"], "data-science", "medium", "Machine Learning"),
  
  // Management (35 more to reach 50)
  createQuestion("What is leadership?", "Ability to guide and influence others", ["Managing finances", "Operating machinery", "Writing reports"], "management", "easy", "Leadership"),
  createQuestion("What is a business model?", "Plan for how company creates value", ["Company logo", "Office layout", "Employee handbook"], "management", "medium", "Strategy"),
  createQuestion("What is market segmentation?", "Dividing market into distinct groups", ["Selling products", "Manufacturing goods", "Hiring employees"], "management", "medium", "Marketing"),
  createQuestion("What is cash flow?", "Movement of money in and out of business", ["Total revenue", "Total expenses", "Profit margin"], "management", "easy", "Finance"),
  createQuestion("What is delegation?", "Assigning tasks to others", ["Doing all work yourself", "Avoiding responsibility", "Ignoring tasks"], "management", "easy", "Management Skills"),
  
  // Law (35 more to reach 50)
  createQuestion("What is bail?", "Temporary release from custody", ["Final verdict", "Prison sentence", "Fine payment"], "law", "easy", "Criminal Law"),
  createQuestion("What is a contract?", "Legally binding agreement", ["Informal promise", "Suggestion", "Opinion"], "law", "easy", "Contract Law"),
  createQuestion("What is defamation?", "False statement harming reputation", ["Physical assault", "Property damage", "Contract breach"], "law", "medium", "Tort Law"),
  createQuestion("What is jurisdiction?", "Authority to make legal decisions", ["Type of crime", "Court building", "Legal document"], "law", "medium", "Legal System"),
  createQuestion("What is precedent?", "Past court decision used as example", ["New law", "Police report", "Witness testimony"], "law", "medium", "Legal Principles"),
  
  // Design (13 more to reach 25)
  createQuestion("What is a wireframe?", "Basic visual guide for layout", ["Final design", "Color palette", "Font style"], "design", "easy", "UX Design"),
  createQuestion("What is contrast in design?", "Difference between elements", ["Similarity of elements", "Size of elements", "Number of elements"], "design", "easy", "Design Principles"),
  createQuestion("What is a prototype?", "Early model to test concept", ["Final product", "Marketing material", "User manual"], "design", "easy", "Product Design"),
  createQuestion("What is white space?", "Empty space in design", ["Background color", "Text content", "Image area"], "design", "medium", "Layout"),
  createQuestion("What is a mood board?", "Collection of visual inspiration", ["Project timeline", "Budget plan", "Client contract"], "design", "easy", "Creative Process"),
  
  // Architecture (14 more to reach 25)
  createQuestion("What is a floor plan?", "Scaled diagram of room layout", ["Building exterior", "Roof design", "Foundation plan"], "architecture", "easy", "Technical Drawing"),
  createQuestion("What is load-bearing wall?", "Wall supporting weight from above", ["Decorative wall", "Glass wall", "Movable partition"], "architecture", "medium", "Structural Design"),
  createQuestion("What is zoning?", "Land use regulations", ["Building materials", "Construction methods", "Interior design"], "architecture", "medium", "Urban Planning"),
  createQuestion("What is a cantilever?", "Beam supported at one end only", ["Vertical column", "Horizontal floor", "Circular dome"], "architecture", "hard", "Structural Engineering"),
  createQuestion("What is vernacular architecture?", "Traditional local building style", ["Modern architecture", "Industrial design", "Futuristic buildings"], "architecture", "medium", "Architectural History"),
  
  // Agriculture (14 more to reach 25)
  createQuestion("What is photosynthesis?", "Process plants use to make food", ["Plant reproduction", "Soil formation", "Water absorption"], "agriculture", "easy", "Plant Science"),
  createQuestion("What is a pesticide?", "Substance to control pests", ["Fertilizer", "Irrigation system", "Harvesting tool"], "agriculture", "easy", "Crop Protection"),
  createQuestion("What is monoculture?", "Growing single crop repeatedly", ["Growing multiple crops", "Organic farming", "Animal husbandry"], "agriculture", "medium", "Farming Practices"),
  createQuestion("What is composting?", "Decomposing organic matter for fertilizer", ["Planting seeds", "Harvesting crops", "Irrigating fields"], "agriculture", "easy", "Soil Management"),
  createQuestion("What is a greenhouse?", "Structure for controlled plant growth", ["Storage facility", "Animal shelter", "Processing plant"], "agriculture", "easy", "Agricultural Technology"),
  
  // Pharmacy (14 more to reach 25)
  createQuestion("What is a prescription?", "Written order for medication", ["Over-the-counter drug", "Medical diagnosis", "Hospital admission"], "pharmacy", "easy", "Pharmaceutical Practice"),
  createQuestion("What is dosage?", "Amount of medicine to take", ["Type of medicine", "Medicine color", "Medicine shape"], "pharmacy", "easy", "Pharmacology"),
  createQuestion("What is a side effect?", "Unintended effect of medication", ["Desired effect", "Medicine cost", "Medicine name"], "pharmacy", "easy", "Pharmacology"),
  createQuestion("What is compounding?", "Preparing customized medications", ["Selling medicines", "Prescribing medicines", "Testing medicines"], "pharmacy", "medium", "Pharmaceutical Practice"),
  createQuestion("What is bioavailability?", "Amount of drug reaching bloodstream", ["Drug color", "Drug taste", "Drug price"], "pharmacy", "hard", "Pharmacokinetics"),
  
  // Biotechnology (14 more to reach 25)
  createQuestion("What is PCR?", "Polymerase Chain Reaction - DNA amplification", ["Protein synthesis", "Cell division", "Gene deletion"], "biotechnology", "hard", "Molecular Biology"),
  createQuestion("What is a vaccine?", "Substance providing immunity", ["Antibiotic", "Pain reliever", "Vitamin supplement"], "biotechnology", "easy", "Immunology"),
  createQuestion("What is gene therapy?", "Treating disease by modifying genes", ["Surgery", "Medication", "Physical therapy"], "biotechnology", "hard", "Medical Biotechnology"),
  createQuestion("What is fermentation?", "Metabolic process producing energy", ["Cell division", "DNA replication", "Protein folding"], "biotechnology", "medium", "Biochemistry"),
  createQuestion("What is a plasmid?", "Small DNA molecule in bacteria", ["Large protein", "Cell membrane", "Virus particle"], "biotechnology", "hard", "Molecular Biology"),
  
  // Psychology (14 more to reach 25)
  createQuestion("What is perception?", "Process of interpreting sensory information", ["Memory storage", "Emotional response", "Physical movement"], "psychology", "easy", "Cognitive Psychology"),
  createQuestion("What is motivation?", "Drive to achieve goals", ["Memory", "Perception", "Sensation"], "psychology", "easy", "Behavioral Psychology"),
  createQuestion("What is stress?", "Body's response to challenges", ["Happiness", "Relaxation", "Sleep"], "psychology", "easy", "Health Psychology"),
  createQuestion("What is conditioning?", "Learning through association", ["Forgetting", "Sleeping", "Eating"], "psychology", "medium", "Behavioral Psychology"),
  createQuestion("What is empathy?", "Understanding others' feelings", ["Self-awareness", "Memory", "Intelligence"], "psychology", "easy", "Social Psychology"),
  
  // Mass Communication (14 more to reach 25)
  createQuestion("What is media literacy?", "Ability to analyze media messages", ["Creating media", "Selling media", "Distributing media"], "mass-communication", "easy", "Media Studies"),
  createQuestion("What is a press release?", "Official statement to media", ["News article", "Advertisement", "Editorial"], "mass-communication", "easy", "Public Relations"),
  createQuestion("What is viral content?", "Content spreading rapidly online", ["Deleted content", "Private content", "Archived content"], "mass-communication", "easy", "Digital Media"),
  createQuestion("What is a byline?", "Author's name in article", ["Headline", "Photo caption", "Advertisement"], "mass-communication", "easy", "Journalism"),
  createQuestion("What is censorship?", "Suppressing information", ["Publishing news", "Editing content", "Distributing media"], "mass-communication", "medium", "Media Ethics"),
  
  // Hospitality (14 more to reach 25)
  createQuestion("What is occupancy rate?", "Percentage of rooms occupied", ["Room price", "Number of staff", "Hotel rating"], "hospitality", "easy", "Hotel Management"),
  createQuestion("What is a concierge?", "Hotel staff assisting guests", ["Chef", "Accountant", "Security guard"], "hospitality", "easy", "Hotel Operations"),
  createQuestion("What is mise en place?", "Preparing ingredients before cooking", ["Serving food", "Cleaning kitchen", "Taking orders"], "hospitality", "medium", "Culinary Arts"),
  createQuestion("What is a buffet?", "Self-service meal arrangement", ["Table service", "Room service", "Takeaway service"], "hospitality", "easy", "Food Service"),
  createQuestion("What is guest satisfaction?", "Measure of guest happiness", ["Room price", "Hotel location", "Building age"], "hospitality", "easy", "Customer Service"),
  
  // Aviation (14 more to reach 25)
  createQuestion("What is altitude?", "Height above sea level", ["Speed of aircraft", "Weight of aircraft", "Length of aircraft"], "aviation", "easy", "Flight Operations"),
  createQuestion("What is turbulence?", "Irregular air movement", ["Engine failure", "Landing procedure", "Takeoff speed"], "aviation", "easy", "Aviation Safety"),
  createQuestion("What is a runway?", "Strip for aircraft takeoff and landing", ["Passenger terminal", "Control tower", "Hangar"], "aviation", "easy", "Airport Infrastructure"),
  createQuestion("What is thrust?", "Force propelling aircraft forward", ["Weight", "Drag", "Lift"], "aviation", "medium", "Aerodynamics"),
  createQuestion("What is a black box?", "Flight data recorder", ["Engine part", "Navigation system", "Communication device"], "aviation", "easy", "Aviation Technology")
];

async function addMoreQuality() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    await FieldQuestion.insertMany(moreQuestions);
    console.log(`✅ Added ${moreQuestions.length} more quality questions`);

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

    console.log('\n✨ More quality questions added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMoreQuality();
