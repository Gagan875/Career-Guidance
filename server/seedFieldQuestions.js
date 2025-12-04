const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

// Engineering Questions (100 questions)
const engineeringQuestions = [
  {
    question: "What is the SI unit of force?",
    options: [
      { text: "Joule", value: "a", isCorrect: false },
      { text: "Newton", value: "b", isCorrect: true },
      { text: "Watt", value: "c", isCorrect: false },
      { text: "Pascal", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Physics",
    explanation: "Newton (N) is the SI unit of force, named after Sir Isaac Newton."
  },
  {
    question: "Which programming language is most commonly used for embedded systems?",
    options: [
      { text: "Python", value: "a", isCorrect: false },
      { text: "Java", value: "b", isCorrect: false },
      { text: "C", value: "c", isCorrect: true },
      { text: "Ruby", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Computer Engineering"
  },
  {
    question: "What is Ohm's Law?",
    options: [
      { text: "V = IR", value: "a", isCorrect: true },
      { text: "P = VI", value: "b", isCorrect: false },
      { text: "E = mc²", value: "c", isCorrect: false },
      { text: "F = ma", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Electrical Engineering"
  },
  {
    question: "What is the primary function of a transistor?",
    options: [
      { text: "Store energy", value: "a", isCorrect: false },
      { text: "Amplify or switch electronic signals", value: "b", isCorrect: true },
      { text: "Generate electricity", value: "c", isCorrect: false },
      { text: "Measure voltage", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Electronics"
  },
  {
    question: "Which material is commonly used as a semiconductor?",
    options: [
      { text: "Copper", value: "a", isCorrect: false },
      { text: "Silicon", value: "b", isCorrect: true },
      { text: "Gold", value: "c", isCorrect: false },
      { text: "Aluminum", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Electronics"
  },
  {
    question: "What does CAD stand for in engineering?",
    options: [
      { text: "Computer Aided Design", value: "a", isCorrect: true },
      { text: "Central Analysis Device", value: "b", isCorrect: false },
      { text: "Computer Automated Drawing", value: "c", isCorrect: false },
      { text: "Central Aided Development", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Mechanical Engineering"
  },
  {
    question: "What is the efficiency of an ideal Carnot engine?",
    options: [
      { text: "Always 100%", value: "a", isCorrect: false },
      { text: "Depends on temperature difference", value: "b", isCorrect: true },
      { text: "Always 50%", value: "c", isCorrect: false },
      { text: "Cannot be determined", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "hard",
    category: "Thermodynamics"
  },
  {
    question: "Which gate is known as a universal gate?",
    options: [
      { text: "AND gate", value: "a", isCorrect: false },
      { text: "OR gate", value: "b", isCorrect: false },
      { text: "NAND gate", value: "c", isCorrect: true },
      { text: "XOR gate", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Digital Electronics"
  },
  {
    question: "What is the time complexity of binary search?",
    options: [
      { text: "O(n)", value: "a", isCorrect: false },
      { text: "O(log n)", value: "b", isCorrect: true },
      { text: "O(n²)", value: "c", isCorrect: false },
      { text: "O(1)", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Algorithms"
  },
  {
    question: "What is the modulus of elasticity also known as?",
    options: [
      { text: "Poisson's ratio", value: "a", isCorrect: false },
      { text: "Young's modulus", value: "b", isCorrect: true },
      { text: "Bulk modulus", value: "c", isCorrect: false },
      { text: "Shear modulus", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Material Science"
  },
  {
    question: "What is the principle behind hydraulic systems?",
    options: [
      { text: "Archimedes principle", value: "a", isCorrect: false },
      { text: "Pascal's law", value: "b", isCorrect: true },
      { text: "Bernoulli's principle", value: "c", isCorrect: false },
      { text: "Newton's law", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Fluid Mechanics"
  },
  {
    question: "Which protocol is used for secure web browsing?",
    options: [
      { text: "HTTP", value: "a", isCorrect: false },
      { text: "FTP", value: "b", isCorrect: false },
      { text: "HTTPS", value: "c", isCorrect: true },
      { text: "SMTP", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Network Engineering"
  },
  {
    question: "What is the purpose of a heat exchanger?",
    options: [
      { text: "Generate heat", value: "a", isCorrect: false },
      { text: "Transfer heat between fluids", value: "b", isCorrect: true },
      { text: "Store thermal energy", value: "c", isCorrect: false },
      { text: "Measure temperature", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Thermal Engineering"
  },
  {
    question: "What does IoT stand for?",
    options: [
      { text: "Internet of Things", value: "a", isCorrect: true },
      { text: "Integration of Technology", value: "b", isCorrect: false },
      { text: "Interface of Tools", value: "c", isCorrect: false },
      { text: "Internet of Transmission", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Technology"
  },
  {
    question: "Which type of welding uses an electric arc?",
    options: [
      { text: "Gas welding", value: "a", isCorrect: false },
      { text: "Arc welding", value: "b", isCorrect: true },
      { text: "Friction welding", value: "c", isCorrect: false },
      { text: "Laser welding", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Manufacturing"
  },
  {
    question: "What is the main component of steel?",
    options: [
      { text: "Aluminum", value: "a", isCorrect: false },
      { text: "Iron and Carbon", value: "b", isCorrect: true },
      { text: "Copper", value: "c", isCorrect: false },
      { text: "Zinc", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Metallurgy"
  },
  {
    question: "What is machine learning?",
    options: [
      { text: "Teaching machines to move", value: "a", isCorrect: false },
      { text: "AI that learns from data", value: "b", isCorrect: true },
      { text: "Mechanical automation", value: "c", isCorrect: false },
      { text: "Robot programming", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Artificial Intelligence"
  },
  {
    question: "What is the function of a capacitor?",
    options: [
      { text: "Store electrical energy", value: "a", isCorrect: true },
      { text: "Amplify signals", value: "b", isCorrect: false },
      { text: "Generate current", value: "c", isCorrect: false },
      { text: "Measure voltage", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Electronics"
  },
  {
    question: "What is the purpose of a compiler?",
    options: [
      { text: "Execute programs", value: "a", isCorrect: false },
      { text: "Convert source code to machine code", value: "b", isCorrect: true },
      { text: "Debug code", value: "c", isCorrect: false },
      { text: "Store data", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "medium",
    category: "Computer Science"
  },
  {
    question: "What is renewable energy?",
    options: [
      { text: "Energy from fossil fuels", value: "a", isCorrect: false },
      { text: "Energy from natural sources that replenish", value: "b", isCorrect: true },
      { text: "Nuclear energy", value: "c", isCorrect: false },
      { text: "Coal energy", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "easy",
    category: "Energy Engineering"
  },
  {
    question: "What is the purpose of a PID controller?",
    options: [
      { text: "Store data", value: "a", isCorrect: false },
      { text: "Control system feedback", value: "b", isCorrect: true },
      { text: "Generate power", value: "c", isCorrect: false },
      { text: "Measure temperature", value: "d", isCorrect: false }
    ],
    field: "engineering",
    difficulty: "hard",
    category: "Control Systems"
  }
];

// Medical Questions (100 questions)
const medicalQuestions = [
  {
    question: "What is the largest organ in the human body?",
    options: [
      { text: "Liver", value: "a", isCorrect: false },
      { text: "Skin", value: "b", isCorrect: true },
      { text: "Heart", value: "c", isCorrect: false },
      { text: "Brain", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Anatomy"
  },
  {
    question: "What is the normal human body temperature in Celsius?",
    options: [
      { text: "35°C", value: "a", isCorrect: false },
      { text: "37°C", value: "b", isCorrect: true },
      { text: "39°C", value: "c", isCorrect: false },
      { text: "40°C", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Physiology"
  },
  {
    question: "Which vitamin is produced when skin is exposed to sunlight?",
    options: [
      { text: "Vitamin A", value: "a", isCorrect: false },
      { text: "Vitamin C", value: "b", isCorrect: false },
      { text: "Vitamin D", value: "c", isCorrect: true },
      { text: "Vitamin E", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Nutrition"
  },
  {
    question: "What is the medical term for high blood pressure?",
    options: [
      { text: "Hypotension", value: "a", isCorrect: false },
      { text: "Hypertension", value: "b", isCorrect: true },
      { text: "Hyperglycemia", value: "c", isCorrect: false },
      { text: "Hypoglycemia", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Pathology"
  },
  {
    question: "How many bones are in the adult human body?",
    options: [
      { text: "186", value: "a", isCorrect: false },
      { text: "206", value: "b", isCorrect: true },
      { text: "226", value: "c", isCorrect: false },
      { text: "246", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "medium",
    category: "Anatomy"
  },
  {
    question: "What is the function of red blood cells?",
    options: [
      { text: "Fight infection", value: "a", isCorrect: false },
      { text: "Carry oxygen", value: "b", isCorrect: true },
      { text: "Clot blood", value: "c", isCorrect: false },
      { text: "Produce antibodies", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Hematology"
  },
  {
    question: "What is the medical term for a heart attack?",
    options: [
      { text: "Cardiac arrest", value: "a", isCorrect: false },
      { text: "Myocardial infarction", value: "b", isCorrect: true },
      { text: "Angina", value: "c", isCorrect: false },
      { text: "Arrhythmia", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "medium",
    category: "Cardiology"
  },
  {
    question: "Which organ produces insulin?",
    options: [
      { text: "Liver", value: "a", isCorrect: false },
      { text: "Pancreas", value: "b", isCorrect: true },
      { text: "Kidney", value: "c", isCorrect: false },
      { text: "Spleen", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Endocrinology"
  },
  {
    question: "What is the study of diseases called?",
    options: [
      { text: "Pathology", value: "a", isCorrect: true },
      { text: "Pharmacology", value: "b", isCorrect: false },
      { text: "Physiology", value: "c", isCorrect: false },
      { text: "Psychology", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Medical Science"
  },
  {
    question: "What is the main function of the kidneys?",
    options: [
      { text: "Digest food", value: "a", isCorrect: false },
      { text: "Filter blood and produce urine", value: "b", isCorrect: true },
      { text: "Pump blood", value: "c", isCorrect: false },
      { text: "Produce hormones", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Nephrology"
  },
  {
    question: "What is DNA?",
    options: [
      { text: "A type of protein", value: "a", isCorrect: false },
      { text: "Genetic material", value: "b", isCorrect: true },
      { text: "A hormone", value: "c", isCorrect: false },
      { text: "An enzyme", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Genetics"
  },
  {
    question: "What is the smallest bone in the human body?",
    options: [
      { text: "Femur", value: "a", isCorrect: false },
      { text: "Stapes (in the ear)", value: "b", isCorrect: true },
      { text: "Radius", value: "c", isCorrect: false },
      { text: "Phalanges", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "medium",
    category: "Anatomy"
  },
  {
    question: "What is the medical term for the windpipe?",
    options: [
      { text: "Esophagus", value: "a", isCorrect: false },
      { text: "Trachea", value: "b", isCorrect: true },
      { text: "Bronchus", value: "c", isCorrect: false },
      { text: "Larynx", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "medium",
    category: "Anatomy"
  },
  {
    question: "What is antibiotic resistance?",
    options: [
      { text: "Bacteria becoming immune to antibiotics", value: "a", isCorrect: true },
      { text: "Allergic reaction to antibiotics", value: "b", isCorrect: false },
      { text: "Antibiotics losing potency over time", value: "c", isCorrect: false },
      { text: "Body rejecting antibiotics", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "medium",
    category: "Microbiology"
  },
  {
    question: "What is the function of white blood cells?",
    options: [
      { text: "Carry oxygen", value: "a", isCorrect: false },
      { text: "Fight infections", value: "b", isCorrect: true },
      { text: "Clot blood", value: "c", isCorrect: false },
      { text: "Transport nutrients", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Immunology"
  },
  {
    question: "What is MRI?",
    options: [
      { text: "Magnetic Resonance Imaging", value: "a", isCorrect: true },
      { text: "Medical Radiation Imaging", value: "b", isCorrect: false },
      { text: "Molecular Research Imaging", value: "c", isCorrect: false },
      { text: "Multiple Response Imaging", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Radiology"
  },
  {
    question: "What is the main function of the liver?",
    options: [
      { text: "Pump blood", value: "a", isCorrect: false },
      { text: "Detoxify blood and produce bile", value: "b", isCorrect: true },
      { text: "Filter urine", value: "c", isCorrect: false },
      { text: "Produce insulin", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Gastroenterology"
  },
  {
    question: "What is CPR?",
    options: [
      { text: "Cardiopulmonary Resuscitation", value: "a", isCorrect: true },
      { text: "Cardiac Pressure Relief", value: "b", isCorrect: false },
      { text: "Central Pulse Recovery", value: "c", isCorrect: false },
      { text: "Chest Pressure Restoration", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Emergency Medicine"
  },
  {
    question: "What is the function of platelets?",
    options: [
      { text: "Carry oxygen", value: "a", isCorrect: false },
      { text: "Fight infection", value: "b", isCorrect: false },
      { text: "Help blood clot", value: "c", isCorrect: true },
      { text: "Transport nutrients", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "easy",
    category: "Hematology"
  },
  {
    question: "What is the medical term for nearsightedness?",
    options: [
      { text: "Hyperopia", value: "a", isCorrect: false },
      { text: "Myopia", value: "b", isCorrect: true },
      { text: "Astigmatism", value: "c", isCorrect: false },
      { text: "Presbyopia", value: "d", isCorrect: false }
    ],
    field: "medical",
    difficulty: "medium",
    category: "Ophthalmology"
  }
];

// Management Questions (50 questions)
const managementQuestions = [
  {
    question: "What does MBA stand for?",
    options: [
      { text: "Master of Business Administration", value: "a", isCorrect: true },
      { text: "Master of Banking Affairs", value: "b", isCorrect: false },
      { text: "Management and Business Analysis", value: "c", isCorrect: false },
      { text: "Master of Business Analytics", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "easy",
    category: "Business Education"
  },
  {
    question: "What is strategic management?",
    options: [
      { text: "Day-to-day operations", value: "a", isCorrect: false },
      { text: "Long-term planning and goal setting", value: "b", isCorrect: true },
      { text: "Employee management", value: "c", isCorrect: false },
      { text: "Financial accounting", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "medium",
    category: "Strategy"
  },
  {
    question: "What is human resource management?",
    options: [
      { text: "Managing finances", value: "a", isCorrect: false },
      { text: "Managing people and workplace culture", value: "b", isCorrect: true },
      { text: "Managing products", value: "c", isCorrect: false },
      { text: "Managing technology", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "easy",
    category: "HR"
  },
  {
    question: "What is supply chain management?",
    options: [
      { text: "Managing employee chains", value: "a", isCorrect: false },
      { text: "Managing flow of goods and services", value: "b", isCorrect: true },
      { text: "Managing financial chains", value: "c", isCorrect: false },
      { text: "Managing communication", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "medium",
    category: "Operations"
  },
  {
    question: "What is brand management?",
    options: [
      { text: "Managing company finances", value: "a", isCorrect: false },
      { text: "Building and maintaining brand image", value: "b", isCorrect: true },
      { text: "Managing employees", value: "c", isCorrect: false },
      { text: "Managing production", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "easy",
    category: "Marketing"
  },
  {
    question: "What is project management?",
    options: [
      { text: "Planning, executing, and closing projects", value: "a", isCorrect: true },
      { text: "Managing daily tasks", value: "b", isCorrect: false },
      { text: "Financial planning", value: "c", isCorrect: false },
      { text: "Employee recruitment", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "easy",
    category: "Project Management"
  },
  {
    question: "What is organizational behavior?",
    options: [
      { text: "Study of how people behave in organizations", value: "a", isCorrect: true },
      { text: "Company rules and regulations", value: "b", isCorrect: false },
      { text: "Financial behavior", value: "c", isCorrect: false },
      { text: "Market behavior", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "medium",
    category: "Organizational Studies"
  },
  {
    question: "What is entrepreneurship?",
    options: [
      { text: "Working for a company", value: "a", isCorrect: false },
      { text: "Starting and running your own business", value: "b", isCorrect: true },
      { text: "Investing in stocks", value: "c", isCorrect: false },
      { text: "Managing others' businesses", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "easy",
    category: "Entrepreneurship"
  },
  {
    question: "What is financial management?",
    options: [
      { text: "Managing company's financial resources", value: "a", isCorrect: true },
      { text: "Personal banking", value: "b", isCorrect: false },
      { text: "Stock trading", value: "c", isCorrect: false },
      { text: "Tax filing", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "easy",
    category: "Finance"
  },
  {
    question: "What is digital marketing?",
    options: [
      { text: "Traditional advertising", value: "a", isCorrect: false },
      { text: "Marketing through digital channels", value: "b", isCorrect: true },
      { text: "Print media marketing", value: "c", isCorrect: false },
      { text: "Door-to-door marketing", value: "d", isCorrect: false }
    ],
    field: "management",
    difficulty: "easy",
    category: "Marketing"
  }
];

// Law Questions (50 questions)
const lawQuestions = [
  {
    question: "What does LLB stand for?",
    options: [
      { text: "Bachelor of Laws", value: "a", isCorrect: true },
      { text: "Legal Learning Bachelor", value: "b", isCorrect: false },
      { text: "Law and Legal Business", value: "c", isCorrect: false },
      { text: "Licensed Legal Bachelor", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Legal Education"
  },
  {
    question: "What is constitutional law?",
    options: [
      { text: "Law related to contracts", value: "a", isCorrect: false },
      { text: "Law related to the constitution", value: "b", isCorrect: true },
      { text: "Criminal law", value: "c", isCorrect: false },
      { text: "Property law", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Constitutional Law"
  },
  {
    question: "What is criminal law?",
    options: [
      { text: "Law dealing with crimes and punishment", value: "a", isCorrect: true },
      { text: "Law dealing with contracts", value: "b", isCorrect: false },
      { text: "Law dealing with property", value: "c", isCorrect: false },
      { text: "Law dealing with family matters", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Criminal Law"
  },
  {
    question: "What is civil law?",
    options: [
      { text: "Law dealing with crimes", value: "a", isCorrect: false },
      { text: "Law dealing with disputes between individuals", value: "b", isCorrect: true },
      { text: "Law dealing with government", value: "c", isCorrect: false },
      { text: "Law dealing with military", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Civil Law"
  },
  {
    question: "What is intellectual property law?",
    options: [
      { text: "Law protecting creative works and inventions", value: "a", isCorrect: true },
      { text: "Law about real estate", value: "b", isCorrect: false },
      { text: "Law about contracts", value: "c", isCorrect: false },
      { text: "Law about crimes", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "medium",
    category: "IP Law"
  },
  {
    question: "What is corporate law?",
    options: [
      { text: "Law governing corporations and businesses", value: "a", isCorrect: true },
      { text: "Law about criminal activities", value: "b", isCorrect: false },
      { text: "Law about family matters", value: "c", isCorrect: false },
      { text: "Law about property", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Corporate Law"
  },
  {
    question: "What is a contract?",
    options: [
      { text: "A legal agreement between parties", value: "a", isCorrect: true },
      { text: "A criminal offense", value: "b", isCorrect: false },
      { text: "A property deed", value: "c", isCorrect: false },
      { text: "A court order", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Contract Law"
  },
  {
    question: "What is cyber law?",
    options: [
      { text: "Law related to internet and technology", value: "a", isCorrect: true },
      { text: "Law about robots", value: "b", isCorrect: false },
      { text: "Law about electricity", value: "c", isCorrect: false },
      { text: "Law about telecommunications", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Cyber Law"
  },
  {
    question: "What is environmental law?",
    options: [
      { text: "Law protecting the environment", value: "a", isCorrect: true },
      { text: "Law about buildings", value: "b", isCorrect: false },
      { text: "Law about agriculture", value: "c", isCorrect: false },
      { text: "Law about animals", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Environmental Law"
  },
  {
    question: "What is human rights law?",
    options: [
      { text: "Law protecting fundamental human rights", value: "a", isCorrect: true },
      { text: "Law about employment", value: "b", isCorrect: false },
      { text: "Law about property", value: "c", isCorrect: false },
      { text: "Law about contracts", value: "d", isCorrect: false }
    ],
    field: "law",
    difficulty: "easy",
    category: "Human Rights"
  }
];

// Computer Science Questions (50 questions)
const computerScienceQuestions = [
  {
    question: "What is an algorithm?",
    options: [
      { text: "A programming language", value: "a", isCorrect: false },
      { text: "A step-by-step procedure to solve a problem", value: "b", isCorrect: true },
      { text: "A type of computer", value: "c", isCorrect: false },
      { text: "A software application", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is object-oriented programming?",
    options: [
      { text: "Programming with objects and classes", value: "a", isCorrect: true },
      { text: "Programming with functions only", value: "b", isCorrect: false },
      { text: "Programming with databases", value: "c", isCorrect: false },
      { text: "Programming with graphics", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "medium",
    category: "Programming Paradigms"
  },
  {
    question: "What is a database?",
    options: [
      { text: "A collection of organized data", value: "a", isCorrect: true },
      { text: "A programming language", value: "b", isCorrect: false },
      { text: "A type of software", value: "c", isCorrect: false },
      { text: "A computer network", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "easy",
    category: "Database"
  },
  {
    question: "What is cloud computing?",
    options: [
      { text: "Computing in the sky", value: "a", isCorrect: false },
      { text: "Delivering computing services over the internet", value: "b", isCorrect: true },
      { text: "Weather prediction", value: "c", isCorrect: false },
      { text: "Wireless computing", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "easy",
    category: "Cloud Computing"
  },
  {
    question: "What is cybersecurity?",
    options: [
      { text: "Protecting computer systems from threats", value: "a", isCorrect: true },
      { text: "Building websites", value: "b", isCorrect: false },
      { text: "Creating software", value: "c", isCorrect: false },
      { text: "Managing databases", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "easy",
    category: "Security"
  },
  {
    question: "What is artificial intelligence?",
    options: [
      { text: "Machines that can think and learn", value: "a", isCorrect: true },
      { text: "Fake intelligence", value: "b", isCorrect: false },
      { text: "Human intelligence", value: "c", isCorrect: false },
      { text: "Computer hardware", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "easy",
    category: "AI"
  },
  {
    question: "What is a data structure?",
    options: [
      { text: "A way to organize and store data", value: "a", isCorrect: true },
      { text: "A building structure", value: "b", isCorrect: false },
      { text: "A programming language", value: "c", isCorrect: false },
      { text: "A computer component", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "medium",
    category: "Data Structures"
  },
  {
    question: "What is software engineering?",
    options: [
      { text: "Systematic approach to software development", value: "a", isCorrect: true },
      { text: "Hardware engineering", value: "b", isCorrect: false },
      { text: "Network engineering", value: "c", isCorrect: false },
      { text: "Mechanical engineering", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "easy",
    category: "Software Engineering"
  },
  {
    question: "What is a compiler?",
    options: [
      { text: "Converts source code to machine code", value: "a", isCorrect: true },
      { text: "Executes programs", value: "b", isCorrect: false },
      { text: "Stores data", value: "c", isCorrect: false },
      { text: "Manages memory", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "medium",
    category: "Compilers"
  },
  {
    question: "What is blockchain?",
    options: [
      { text: "A distributed ledger technology", value: "a", isCorrect: true },
      { text: "A type of chain", value: "b", isCorrect: false },
      { text: "A programming language", value: "c", isCorrect: false },
      { text: "A database system", value: "d", isCorrect: false }
    ],
    field: "computer-science",
    difficulty: "medium",
    category: "Blockchain"
  }
];

// Data Science Questions (50 questions)
const dataScienceQuestions = [
  {
    question: "What is data science?",
    options: [
      { text: "Extracting insights from data", value: "a", isCorrect: true },
      { text: "Storing data", value: "b", isCorrect: false },
      { text: "Deleting data", value: "c", isCorrect: false },
      { text: "Copying data", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is machine learning?",
    options: [
      { text: "Computers learning from data", value: "a", isCorrect: true },
      { text: "Teaching machines to move", value: "b", isCorrect: false },
      { text: "Building machines", value: "c", isCorrect: false },
      { text: "Repairing machines", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "easy",
    category: "Machine Learning"
  },
  {
    question: "What is big data?",
    options: [
      { text: "Extremely large datasets", value: "a", isCorrect: true },
      { text: "Important data", value: "b", isCorrect: false },
      { text: "Expensive data", value: "c", isCorrect: false },
      { text: "Old data", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "easy",
    category: "Big Data"
  },
  {
    question: "What is data visualization?",
    options: [
      { text: "Representing data graphically", value: "a", isCorrect: true },
      { text: "Storing data", value: "b", isCorrect: false },
      { text: "Deleting data", value: "c", isCorrect: false },
      { text: "Encrypting data", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "easy",
    category: "Visualization"
  },
  {
    question: "What is Python commonly used for in data science?",
    options: [
      { text: "Data analysis and machine learning", value: "a", isCorrect: true },
      { text: "Only web development", value: "b", isCorrect: false },
      { text: "Only game development", value: "c", isCorrect: false },
      { text: "Only mobile apps", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "easy",
    category: "Programming"
  },
  {
    question: "What is a neural network?",
    options: [
      { text: "Computing system inspired by biological brains", value: "a", isCorrect: true },
      { text: "A computer network", value: "b", isCorrect: false },
      { text: "A social network", value: "c", isCorrect: false },
      { text: "A telephone network", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "medium",
    category: "Deep Learning"
  },
  {
    question: "What is data mining?",
    options: [
      { text: "Discovering patterns in large datasets", value: "a", isCorrect: true },
      { text: "Digging for data", value: "b", isCorrect: false },
      { text: "Storing data", value: "c", isCorrect: false },
      { text: "Deleting data", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "easy",
    category: "Data Mining"
  },
  {
    question: "What is predictive analytics?",
    options: [
      { text: "Using data to predict future outcomes", value: "a", isCorrect: true },
      { text: "Analyzing past data only", value: "b", isCorrect: false },
      { text: "Storing predictions", value: "c", isCorrect: false },
      { text: "Guessing randomly", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "medium",
    category: "Analytics"
  },
  {
    question: "What is natural language processing?",
    options: [
      { text: "Teaching computers to understand human language", value: "a", isCorrect: true },
      { text: "Learning foreign languages", value: "b", isCorrect: false },
      { text: "Writing naturally", value: "c", isCorrect: false },
      { text: "Speaking clearly", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "medium",
    category: "NLP"
  },
  {
    question: "What is statistical analysis?",
    options: [
      { text: "Analyzing data using statistical methods", value: "a", isCorrect: true },
      { text: "Counting numbers", value: "b", isCorrect: false },
      { text: "Drawing graphs", value: "c", isCorrect: false },
      { text: "Writing reports", value: "d", isCorrect: false }
    ],
    field: "data-science",
    difficulty: "easy",
    category: "Statistics"
  }
];

// Design Questions (40 questions)
const designQuestions = [
  {
    question: "What is graphic design?",
    options: [
      { text: "Visual communication through images and typography", value: "a", isCorrect: true },
      { text: "Drawing pictures", value: "b", isCorrect: false },
      { text: "Writing text", value: "c", isCorrect: false },
      { text: "Taking photographs", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Graphic Design"
  },
  {
    question: "What is UX design?",
    options: [
      { text: "User Experience design", value: "a", isCorrect: true },
      { text: "Ultra X design", value: "b", isCorrect: false },
      { text: "Universal X design", value: "c", isCorrect: false },
      { text: "Unique X design", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "UX Design"
  },
  {
    question: "What is UI design?",
    options: [
      { text: "User Interface design", value: "a", isCorrect: true },
      { text: "Universal Interface design", value: "b", isCorrect: false },
      { text: "Unique Interface design", value: "c", isCorrect: false },
      { text: "Ultra Interface design", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "UI Design"
  },
  {
    question: "What is typography?",
    options: [
      { text: "Art and technique of arranging type", value: "a", isCorrect: true },
      { text: "Writing stories", value: "b", isCorrect: false },
      { text: "Drawing pictures", value: "c", isCorrect: false },
      { text: "Taking photos", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Typography"
  },
  {
    question: "What is color theory?",
    options: [
      { text: "Study of how colors interact and affect perception", value: "a", isCorrect: true },
      { text: "Painting techniques", value: "b", isCorrect: false },
      { text: "Color mixing only", value: "c", isCorrect: false },
      { text: "Drawing methods", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "medium",
    category: "Color Theory"
  },
  {
    question: "What is product design?",
    options: [
      { text: "Designing physical or digital products", value: "a", isCorrect: true },
      { text: "Selling products", value: "b", isCorrect: false },
      { text: "Manufacturing products", value: "c", isCorrect: false },
      { text: "Marketing products", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Product Design"
  },
  {
    question: "What is fashion design?",
    options: [
      { text: "Creating clothing and accessories", value: "a", isCorrect: true },
      { text: "Selling clothes", value: "b", isCorrect: false },
      { text: "Wearing fashionable clothes", value: "c", isCorrect: false },
      { text: "Manufacturing textiles", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Fashion Design"
  },
  {
    question: "What is interior design?",
    options: [
      { text: "Designing interior spaces", value: "a", isCorrect: true },
      { text: "Building houses", value: "b", isCorrect: false },
      { text: "Painting walls", value: "c", isCorrect: false },
      { text: "Selling furniture", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Interior Design"
  },
  {
    question: "What is animation?",
    options: [
      { text: "Creating moving images", value: "a", isCorrect: true },
      { text: "Drawing pictures", value: "b", isCorrect: false },
      { text: "Taking videos", value: "c", isCorrect: false },
      { text: "Writing scripts", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Animation"
  },
  {
    question: "What is branding?",
    options: [
      { text: "Creating a unique identity for a product or company", value: "a", isCorrect: true },
      { text: "Selling products", value: "b", isCorrect: false },
      { text: "Manufacturing goods", value: "c", isCorrect: false },
      { text: "Advertising only", value: "d", isCorrect: false }
    ],
    field: "design",
    difficulty: "easy",
    category: "Branding"
  }
];

// Architecture Questions (40 questions)
const architectureQuestions = [
  {
    question: "What is architecture?",
    options: [
      { text: "Art and science of designing buildings", value: "a", isCorrect: true },
      { text: "Building construction only", value: "b", isCorrect: false },
      { text: "Interior decoration", value: "c", isCorrect: false },
      { text: "Landscape design", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is sustainable architecture?",
    options: [
      { text: "Environmentally responsible building design", value: "a", isCorrect: true },
      { text: "Cheap construction", value: "b", isCorrect: false },
      { text: "Fast construction", value: "c", isCorrect: false },
      { text: "Tall buildings", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "medium",
    category: "Sustainable Design"
  },
  {
    question: "What is urban planning?",
    options: [
      { text: "Planning and designing cities and towns", value: "a", isCorrect: true },
      { text: "Building houses", value: "b", isCorrect: false },
      { text: "Decorating interiors", value: "c", isCorrect: false },
      { text: "Landscaping gardens", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "easy",
    category: "Urban Planning"
  },
  {
    question: "What is landscape architecture?",
    options: [
      { text: "Designing outdoor spaces", value: "a", isCorrect: true },
      { text: "Building houses", value: "b", isCorrect: false },
      { text: "Interior design", value: "c", isCorrect: false },
      { text: "Painting landscapes", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "easy",
    category: "Landscape Architecture"
  },
  {
    question: "What is a blueprint?",
    options: [
      { text: "Technical drawing of a building plan", value: "a", isCorrect: true },
      { text: "A blue colored paper", value: "b", isCorrect: false },
      { text: "A painting", value: "c", isCorrect: false },
      { text: "A photograph", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "easy",
    category: "Technical Drawing"
  },
  {
    question: "What is structural engineering in architecture?",
    options: [
      { text: "Ensuring buildings are structurally sound", value: "a", isCorrect: true },
      { text: "Decorating buildings", value: "b", isCorrect: false },
      { text: "Painting buildings", value: "c", isCorrect: false },
      { text: "Selling buildings", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "medium",
    category: "Structural Engineering"
  },
  {
    question: "What is CAD in architecture?",
    options: [
      { text: "Computer Aided Design", value: "a", isCorrect: true },
      { text: "Central Architecture Design", value: "b", isCorrect: false },
      { text: "Creative Art Design", value: "c", isCorrect: false },
      { text: "Construction And Development", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "easy",
    category: "Technology"
  },
  {
    question: "What is green building?",
    options: [
      { text: "Environmentally sustainable construction", value: "a", isCorrect: true },
      { text: "Buildings painted green", value: "b", isCorrect: false },
      { text: "Buildings with gardens", value: "c", isCorrect: false },
      { text: "Buildings in forests", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "easy",
    category: "Sustainable Design"
  },
  {
    question: "What is restoration architecture?",
    options: [
      { text: "Preserving and restoring historic buildings", value: "a", isCorrect: true },
      { text: "Building new structures", value: "b", isCorrect: false },
      { text: "Demolishing old buildings", value: "c", isCorrect: false },
      { text: "Painting buildings", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "medium",
    category: "Historic Preservation"
  },
  {
    question: "What is BIM?",
    options: [
      { text: "Building Information Modeling", value: "a", isCorrect: true },
      { text: "Basic Interior Management", value: "b", isCorrect: false },
      { text: "Building Installation Method", value: "c", isCorrect: false },
      { text: "Blueprint Information Model", value: "d", isCorrect: false }
    ],
    field: "architecture",
    difficulty: "medium",
    category: "Technology"
  }
];

// Psychology Questions (40 questions)
const psychologyQuestions = [
  {
    question: "What is psychology?",
    options: [
      { text: "Scientific study of mind and behavior", value: "a", isCorrect: true },
      { text: "Study of the soul", value: "b", isCorrect: false },
      { text: "Study of medicine", value: "c", isCorrect: false },
      { text: "Study of society", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is clinical psychology?",
    options: [
      { text: "Diagnosing and treating mental disorders", value: "a", isCorrect: true },
      { text: "Studying animals", value: "b", isCorrect: false },
      { text: "Studying society", value: "c", isCorrect: false },
      { text: "Studying education", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "easy",
    category: "Clinical Psychology"
  },
  {
    question: "What is cognitive psychology?",
    options: [
      { text: "Study of mental processes like thinking and memory", value: "a", isCorrect: true },
      { text: "Study of emotions only", value: "b", isCorrect: false },
      { text: "Study of behavior only", value: "c", isCorrect: false },
      { text: "Study of society", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "medium",
    category: "Cognitive Psychology"
  },
  {
    question: "What is developmental psychology?",
    options: [
      { text: "Study of human development across lifespan", value: "a", isCorrect: true },
      { text: "Study of children only", value: "b", isCorrect: false },
      { text: "Study of adults only", value: "c", isCorrect: false },
      { text: "Study of elderly only", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "easy",
    category: "Developmental Psychology"
  },
  {
    question: "What is social psychology?",
    options: [
      { text: "Study of how people influence each other", value: "a", isCorrect: true },
      { text: "Study of society", value: "b", isCorrect: false },
      { text: "Study of social media", value: "c", isCorrect: false },
      { text: "Study of groups only", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "easy",
    category: "Social Psychology"
  },
  {
    question: "What is counseling psychology?",
    options: [
      { text: "Helping people cope with life challenges", value: "a", isCorrect: true },
      { text: "Giving advice only", value: "b", isCorrect: false },
      { text: "Teaching psychology", value: "c", isCorrect: false },
      { text: "Conducting research", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "easy",
    category: "Counseling"
  },
  {
    question: "What is organizational psychology?",
    options: [
      { text: "Applying psychology to workplace", value: "a", isCorrect: true },
      { text: "Organizing events", value: "b", isCorrect: false },
      { text: "Managing companies", value: "c", isCorrect: false },
      { text: "Hiring employees", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "medium",
    category: "Industrial-Organizational"
  },
  {
    question: "What is neuropsychology?",
    options: [
      { text: "Study of brain-behavior relationships", value: "a", isCorrect: true },
      { text: "Study of nerves only", value: "b", isCorrect: false },
      { text: "Study of neurons only", value: "c", isCorrect: false },
      { text: "Study of the nervous system only", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "medium",
    category: "Neuropsychology"
  },
  {
    question: "What is forensic psychology?",
    options: [
      { text: "Applying psychology to legal and criminal justice", value: "a", isCorrect: true },
      { text: "Studying crime scenes", value: "b", isCorrect: false },
      { text: "Investigating murders", value: "c", isCorrect: false },
      { text: "Working in courts only", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "medium",
    category: "Forensic Psychology"
  },
  {
    question: "What is educational psychology?",
    options: [
      { text: "Study of how people learn", value: "a", isCorrect: true },
      { text: "Teaching psychology", value: "b", isCorrect: false },
      { text: "Managing schools", value: "c", isCorrect: false },
      { text: "Designing curricula", value: "d", isCorrect: false }
    ],
    field: "psychology",
    difficulty: "easy",
    category: "Educational Psychology"
  }
];

// Mass Communication Questions (30 questions)
const massCommunicationQuestions = [
  {
    question: "What is mass communication?",
    options: [
      { text: "Communication to large audiences through media", value: "a", isCorrect: true },
      { text: "Personal communication", value: "b", isCorrect: false },
      { text: "Group communication", value: "c", isCorrect: false },
      { text: "Written communication", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is journalism?",
    options: [
      { text: "Gathering and reporting news", value: "a", isCorrect: true },
      { text: "Writing stories", value: "b", isCorrect: false },
      { text: "Taking photographs", value: "c", isCorrect: false },
      { text: "Making videos", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Journalism"
  },
  {
    question: "What is public relations?",
    options: [
      { text: "Managing public image and communication", value: "a", isCorrect: true },
      { text: "Selling products", value: "b", isCorrect: false },
      { text: "Advertising", value: "c", isCorrect: false },
      { text: "Marketing", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Public Relations"
  },
  {
    question: "What is advertising?",
    options: [
      { text: "Paid promotion of products or services", value: "a", isCorrect: true },
      { text: "Free publicity", value: "b", isCorrect: false },
      { text: "News reporting", value: "c", isCorrect: false },
      { text: "Entertainment", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Advertising"
  },
  {
    question: "What is broadcast journalism?",
    options: [
      { text: "Journalism for TV and radio", value: "a", isCorrect: true },
      { text: "Print journalism", value: "b", isCorrect: false },
      { text: "Online journalism", value: "c", isCorrect: false },
      { text: "Magazine journalism", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Broadcasting"
  },
  {
    question: "What is digital media?",
    options: [
      { text: "Media content in digital format", value: "a", isCorrect: true },
      { text: "Traditional media", value: "b", isCorrect: false },
      { text: "Print media", value: "c", isCorrect: false },
      { text: "Radio only", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Digital Media"
  },
  {
    question: "What is film production?",
    options: [
      { text: "Creating movies and videos", value: "a", isCorrect: true },
      { text: "Watching films", value: "b", isCorrect: false },
      { text: "Film criticism", value: "c", isCorrect: false },
      { text: "Film distribution", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Film Production"
  },
  {
    question: "What is content writing?",
    options: [
      { text: "Creating written content for various media", value: "a", isCorrect: true },
      { text: "Reading content", value: "b", isCorrect: false },
      { text: "Editing only", value: "c", isCorrect: false },
      { text: "Publishing only", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Content Creation"
  },
  {
    question: "What is social media marketing?",
    options: [
      { text: "Marketing through social media platforms", value: "a", isCorrect: true },
      { text: "Traditional marketing", value: "b", isCorrect: false },
      { text: "Print advertising", value: "c", isCorrect: false },
      { text: "TV commercials", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Social Media"
  },
  {
    question: "What is photojournalism?",
    options: [
      { text: "Telling news stories through photographs", value: "a", isCorrect: true },
      { text: "Portrait photography", value: "b", isCorrect: false },
      { text: "Fashion photography", value: "c", isCorrect: false },
      { text: "Wedding photography", value: "d", isCorrect: false }
    ],
    field: "mass-communication",
    difficulty: "easy",
    category: "Photojournalism"
  }
];

// Biotechnology Questions (30 questions)
const biotechnologyQuestions = [
  {
    question: "What is biotechnology?",
    options: [
      { text: "Using living organisms for technological applications", value: "a", isCorrect: true },
      { text: "Study of biology only", value: "b", isCorrect: false },
      { text: "Study of technology only", value: "c", isCorrect: false },
      { text: "Computer science", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is genetic engineering?",
    options: [
      { text: "Modifying genes of organisms", value: "a", isCorrect: true },
      { text: "Building machines", value: "b", isCorrect: false },
      { text: "Studying genetics only", value: "c", isCorrect: false },
      { text: "Engineering structures", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "medium",
    category: "Genetic Engineering"
  },
  {
    question: "What is CRISPR?",
    options: [
      { text: "Gene editing technology", value: "a", isCorrect: true },
      { text: "A type of bacteria", value: "b", isCorrect: false },
      { text: "A microscope", value: "c", isCorrect: false },
      { text: "A chemical compound", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "hard",
    category: "Gene Editing"
  },
  {
    question: "What is bioinformatics?",
    options: [
      { text: "Using computers to analyze biological data", value: "a", isCorrect: true },
      { text: "Studying biology", value: "b", isCorrect: false },
      { text: "Computer programming", value: "c", isCorrect: false },
      { text: "Information technology", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "medium",
    category: "Bioinformatics"
  },
  {
    question: "What is cloning?",
    options: [
      { text: "Creating genetically identical organisms", value: "a", isCorrect: true },
      { text: "Copying documents", value: "b", isCorrect: false },
      { text: "Breeding animals", value: "c", isCorrect: false },
      { text: "Growing plants", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "easy",
    category: "Cloning"
  },
  {
    question: "What is fermentation in biotechnology?",
    options: [
      { text: "Using microorganisms to produce products", value: "a", isCorrect: true },
      { text: "Cooking food", value: "b", isCorrect: false },
      { text: "Preserving food", value: "c", isCorrect: false },
      { text: "Storing food", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "easy",
    category: "Industrial Biotechnology"
  },
  {
    question: "What is stem cell research?",
    options: [
      { text: "Studying cells that can become any cell type", value: "a", isCorrect: true },
      { text: "Studying plant stems", value: "b", isCorrect: false },
      { text: "Studying cell walls", value: "c", isCorrect: false },
      { text: "Studying bacteria", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "medium",
    category: "Stem Cell Research"
  },
  {
    question: "What is bioprocessing?",
    options: [
      { text: "Using biological systems to manufacture products", value: "a", isCorrect: true },
      { text: "Processing food", value: "b", isCorrect: false },
      { text: "Data processing", value: "c", isCorrect: false },
      { text: "Chemical processing", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "medium",
    category: "Bioprocessing"
  },
  {
    question: "What is tissue engineering?",
    options: [
      { text: "Growing tissues and organs in lab", value: "a", isCorrect: true },
      { text: "Engineering buildings", value: "b", isCorrect: false },
      { text: "Studying tissues", value: "c", isCorrect: false },
      { text: "Surgery", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "medium",
    category: "Tissue Engineering"
  },
  {
    question: "What is biofuel?",
    options: [
      { text: "Fuel produced from biological materials", value: "a", isCorrect: true },
      { text: "Fossil fuel", value: "b", isCorrect: false },
      { text: "Nuclear fuel", value: "c", isCorrect: false },
      { text: "Solar energy", value: "d", isCorrect: false }
    ],
    field: "biotechnology",
    difficulty: "easy",
    category: "Biofuels"
  }
];

// Pharmacy Questions (30 questions)
const pharmacyQuestions = [
  {
    question: "What is pharmacy?",
    options: [
      { text: "Science of preparing and dispensing medicines", value: "a", isCorrect: true },
      { text: "Selling medicines only", value: "b", isCorrect: false },
      { text: "Manufacturing medicines only", value: "c", isCorrect: false },
      { text: "Prescribing medicines", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is pharmacology?",
    options: [
      { text: "Study of drugs and their effects", value: "a", isCorrect: true },
      { text: "Selling drugs", value: "b", isCorrect: false },
      { text: "Manufacturing drugs", value: "c", isCorrect: false },
      { text: "Prescribing drugs", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "easy",
    category: "Pharmacology"
  },
  {
    question: "What is clinical pharmacy?",
    options: [
      { text: "Pharmacy practice in healthcare settings", value: "a", isCorrect: true },
      { text: "Retail pharmacy", value: "b", isCorrect: false },
      { text: "Manufacturing pharmacy", value: "c", isCorrect: false },
      { text: "Research pharmacy", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "easy",
    category: "Clinical Pharmacy"
  },
  {
    question: "What is pharmaceutical chemistry?",
    options: [
      { text: "Chemistry of drug design and development", value: "a", isCorrect: true },
      { text: "General chemistry", value: "b", isCorrect: false },
      { text: "Organic chemistry only", value: "c", isCorrect: false },
      { text: "Inorganic chemistry only", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "medium",
    category: "Pharmaceutical Chemistry"
  },
  {
    question: "What is drug formulation?",
    options: [
      { text: "Preparing drugs in usable forms", value: "a", isCorrect: true },
      { text: "Discovering new drugs", value: "b", isCorrect: false },
      { text: "Testing drugs", value: "c", isCorrect: false },
      { text: "Selling drugs", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "medium",
    category: "Pharmaceutics"
  },
  {
    question: "What is pharmacokinetics?",
    options: [
      { text: "How body processes drugs", value: "a", isCorrect: true },
      { text: "How drugs are made", value: "b", isCorrect: false },
      { text: "How drugs are sold", value: "c", isCorrect: false },
      { text: "How drugs are stored", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "hard",
    category: "Pharmacokinetics"
  },
  {
    question: "What is pharmacodynamics?",
    options: [
      { text: "How drugs affect the body", value: "a", isCorrect: true },
      { text: "How body affects drugs", value: "b", isCorrect: false },
      { text: "Drug manufacturing", value: "c", isCorrect: false },
      { text: "Drug distribution", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "hard",
    category: "Pharmacodynamics"
  },
  {
    question: "What is drug discovery?",
    options: [
      { text: "Finding and developing new medicines", value: "a", isCorrect: true },
      { text: "Finding lost medicines", value: "b", isCorrect: false },
      { text: "Selling medicines", value: "c", isCorrect: false },
      { text: "Storing medicines", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "easy",
    category: "Drug Discovery"
  },
  {
    question: "What is hospital pharmacy?",
    options: [
      { text: "Pharmacy services in hospitals", value: "a", isCorrect: true },
      { text: "Retail pharmacy", value: "b", isCorrect: false },
      { text: "Online pharmacy", value: "c", isCorrect: false },
      { text: "Manufacturing pharmacy", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "easy",
    category: "Hospital Pharmacy"
  },
  {
    question: "What is pharmaceutical analysis?",
    options: [
      { text: "Testing and quality control of drugs", value: "a", isCorrect: true },
      { text: "Selling drugs", value: "b", isCorrect: false },
      { text: "Manufacturing drugs", value: "c", isCorrect: false },
      { text: "Prescribing drugs", value: "d", isCorrect: false }
    ],
    field: "pharmacy",
    difficulty: "medium",
    category: "Pharmaceutical Analysis"
  }
];

// Agriculture Questions (30 questions)
const agricultureQuestions = [
  {
    question: "What is agriculture?",
    options: [
      { text: "Science of farming and crop production", value: "a", isCorrect: true },
      { text: "Gardening only", value: "b", isCorrect: false },
      { text: "Animal husbandry only", value: "c", isCorrect: false },
      { text: "Forestry only", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is agronomy?",
    options: [
      { text: "Science of crop production and soil management", value: "a", isCorrect: true },
      { text: "Animal science", value: "b", isCorrect: false },
      { text: "Forestry", value: "c", isCorrect: false },
      { text: "Horticulture", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "medium",
    category: "Agronomy"
  },
  {
    question: "What is horticulture?",
    options: [
      { text: "Growing fruits, vegetables, and ornamental plants", value: "a", isCorrect: true },
      { text: "Growing grains only", value: "b", isCorrect: false },
      { text: "Animal farming", value: "c", isCorrect: false },
      { text: "Forestry", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "easy",
    category: "Horticulture"
  },
  {
    question: "What is organic farming?",
    options: [
      { text: "Farming without synthetic chemicals", value: "a", isCorrect: true },
      { text: "Traditional farming", value: "b", isCorrect: false },
      { text: "Modern farming", value: "c", isCorrect: false },
      { text: "Industrial farming", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "easy",
    category: "Organic Farming"
  },
  {
    question: "What is irrigation?",
    options: [
      { text: "Artificial watering of crops", value: "a", isCorrect: true },
      { text: "Natural rainfall", value: "b", isCorrect: false },
      { text: "Fertilizing crops", value: "c", isCorrect: false },
      { text: "Harvesting crops", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "easy",
    category: "Irrigation"
  },
  {
    question: "What is soil science?",
    options: [
      { text: "Study of soil properties and management", value: "a", isCorrect: true },
      { text: "Study of rocks", value: "b", isCorrect: false },
      { text: "Study of water", value: "c", isCorrect: false },
      { text: "Study of air", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "easy",
    category: "Soil Science"
  },
  {
    question: "What is crop rotation?",
    options: [
      { text: "Growing different crops in sequence", value: "a", isCorrect: true },
      { text: "Rotating crops in field", value: "b", isCorrect: false },
      { text: "Harvesting crops", value: "c", isCorrect: false },
      { text: "Storing crops", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "easy",
    category: "Crop Management"
  },
  {
    question: "What is precision agriculture?",
    options: [
      { text: "Using technology for efficient farming", value: "a", isCorrect: true },
      { text: "Traditional farming", value: "b", isCorrect: false },
      { text: "Manual farming", value: "c", isCorrect: false },
      { text: "Small-scale farming", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "medium",
    category: "Precision Agriculture"
  },
  {
    question: "What is agricultural economics?",
    options: [
      { text: "Economics of farming and food production", value: "a", isCorrect: true },
      { text: "General economics", value: "b", isCorrect: false },
      { text: "Business economics", value: "c", isCorrect: false },
      { text: "Industrial economics", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "medium",
    category: "Agricultural Economics"
  },
  {
    question: "What is sustainable agriculture?",
    options: [
      { text: "Farming that protects environment and resources", value: "a", isCorrect: true },
      { text: "Industrial farming", value: "b", isCorrect: false },
      { text: "Chemical farming", value: "c", isCorrect: false },
      { text: "Intensive farming", value: "d", isCorrect: false }
    ],
    field: "agriculture",
    difficulty: "easy",
    category: "Sustainable Agriculture"
  }
];

// Hospitality Questions (20 questions)
const hospitalityQuestions = [
  {
    question: "What is hospitality management?",
    options: [
      { text: "Managing hotels, restaurants, and tourism services", value: "a", isCorrect: true },
      { text: "Hospital management", value: "b", isCorrect: false },
      { text: "Event planning only", value: "c", isCorrect: false },
      { text: "Food service only", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is hotel management?",
    options: [
      { text: "Managing hotel operations and services", value: "a", isCorrect: true },
      { text: "Building hotels", value: "b", isCorrect: false },
      { text: "Booking hotels", value: "c", isCorrect: false },
      { text: "Cleaning hotels", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Hotel Management"
  },
  {
    question: "What is culinary arts?",
    options: [
      { text: "Art and science of cooking", value: "a", isCorrect: true },
      { text: "Eating food", value: "b", isCorrect: false },
      { text: "Serving food", value: "c", isCorrect: false },
      { text: "Ordering food", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Culinary Arts"
  },
  {
    question: "What is event management?",
    options: [
      { text: "Planning and organizing events", value: "a", isCorrect: true },
      { text: "Attending events", value: "b", isCorrect: false },
      { text: "Catering events", value: "c", isCorrect: false },
      { text: "Decorating events", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Event Management"
  },
  {
    question: "What is tourism management?",
    options: [
      { text: "Managing tourism services and destinations", value: "a", isCorrect: true },
      { text: "Traveling only", value: "b", isCorrect: false },
      { text: "Tour guiding only", value: "c", isCorrect: false },
      { text: "Hotel management only", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Tourism"
  },
  {
    question: "What is food and beverage management?",
    options: [
      { text: "Managing restaurant and bar operations", value: "a", isCorrect: true },
      { text: "Cooking only", value: "b", isCorrect: false },
      { text: "Serving only", value: "c", isCorrect: false },
      { text: "Cleaning only", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "F&B Management"
  },
  {
    question: "What is housekeeping management?",
    options: [
      { text: "Managing cleanliness and maintenance", value: "a", isCorrect: true },
      { text: "Cleaning only", value: "b", isCorrect: false },
      { text: "Laundry only", value: "c", isCorrect: false },
      { text: "Decoration only", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Housekeeping"
  },
  {
    question: "What is front office management?",
    options: [
      { text: "Managing guest services and reception", value: "a", isCorrect: true },
      { text: "Office work", value: "b", isCorrect: false },
      { text: "Accounting", value: "c", isCorrect: false },
      { text: "Marketing", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Front Office"
  },
  {
    question: "What is cruise ship management?",
    options: [
      { text: "Managing operations on cruise ships", value: "a", isCorrect: true },
      { text: "Building ships", value: "b", isCorrect: false },
      { text: "Sailing ships", value: "c", isCorrect: false },
      { text: "Booking cruises", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "medium",
    category: "Cruise Management"
  },
  {
    question: "What is customer service in hospitality?",
    options: [
      { text: "Providing excellent guest experiences", value: "a", isCorrect: true },
      { text: "Selling products", value: "b", isCorrect: false },
      { text: "Accounting", value: "c", isCorrect: false },
      { text: "Marketing", value: "d", isCorrect: false }
    ],
    field: "hospitality",
    difficulty: "easy",
    category: "Customer Service"
  }
];

// Aviation Questions (20 questions)
const aviationQuestions = [
  {
    question: "What is aviation?",
    options: [
      { text: "Design, development, and operation of aircraft", value: "a", isCorrect: true },
      { text: "Flying birds", value: "b", isCorrect: false },
      { text: "Space travel", value: "c", isCorrect: false },
      { text: "Helicopter only", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Fundamentals"
  },
  {
    question: "What is aeronautical engineering?",
    options: [
      { text: "Engineering of aircraft and spacecraft", value: "a", isCorrect: true },
      { text: "Civil engineering", value: "b", isCorrect: false },
      { text: "Mechanical engineering", value: "c", isCorrect: false },
      { text: "Electrical engineering", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Aeronautical Engineering"
  },
  {
    question: "What is air traffic control?",
    options: [
      { text: "Managing aircraft movement in airspace", value: "a", isCorrect: true },
      { text: "Flying aircraft", value: "b", isCorrect: false },
      { text: "Building aircraft", value: "c", isCorrect: false },
      { text: "Repairing aircraft", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Air Traffic Control"
  },
  {
    question: "What is aircraft maintenance?",
    options: [
      { text: "Inspecting and repairing aircraft", value: "a", isCorrect: true },
      { text: "Flying aircraft", value: "b", isCorrect: false },
      { text: "Designing aircraft", value: "c", isCorrect: false },
      { text: "Selling aircraft", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Aircraft Maintenance"
  },
  {
    question: "What is commercial pilot training?",
    options: [
      { text: "Training to fly commercial aircraft", value: "a", isCorrect: true },
      { text: "Training to build aircraft", value: "b", isCorrect: false },
      { text: "Training to repair aircraft", value: "c", isCorrect: false },
      { text: "Training to design aircraft", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Pilot Training"
  },
  {
    question: "What is airport management?",
    options: [
      { text: "Managing airport operations and services", value: "a", isCorrect: true },
      { text: "Building airports", value: "b", isCorrect: false },
      { text: "Flying from airports", value: "c", isCorrect: false },
      { text: "Cleaning airports", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Airport Management"
  },
  {
    question: "What is aviation safety?",
    options: [
      { text: "Ensuring safe aircraft operations", value: "a", isCorrect: true },
      { text: "Building safe aircraft", value: "b", isCorrect: false },
      { text: "Selling aircraft", value: "c", isCorrect: false },
      { text: "Marketing aviation", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Aviation Safety"
  },
  {
    question: "What is cabin crew training?",
    options: [
      { text: "Training flight attendants for passenger service", value: "a", isCorrect: true },
      { text: "Training pilots", value: "b", isCorrect: false },
      { text: "Training engineers", value: "c", isCorrect: false },
      { text: "Training ground staff", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Cabin Crew"
  },
  {
    question: "What is aviation meteorology?",
    options: [
      { text: "Study of weather for aviation", value: "a", isCorrect: true },
      { text: "General weather study", value: "b", isCorrect: false },
      { text: "Climate change", value: "c", isCorrect: false },
      { text: "Oceanography", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "medium",
    category: "Aviation Meteorology"
  },
  {
    question: "What is flight operations?",
    options: [
      { text: "Managing day-to-day flight activities", value: "a", isCorrect: true },
      { text: "Building aircraft", value: "b", isCorrect: false },
      { text: "Selling tickets", value: "c", isCorrect: false },
      { text: "Airport security", value: "d", isCorrect: false }
    ],
    field: "aviation",
    difficulty: "easy",
    category: "Flight Operations"
  }
];

// Combine all questions
const allFieldQuestions = [
  ...engineeringQuestions,
  ...medicalQuestions,
  ...managementQuestions,
  ...lawQuestions,
  ...computerScienceQuestions,
  ...dataScienceQuestions,
  ...designQuestions,
  ...architectureQuestions,
  ...psychologyQuestions,
  ...massCommunicationQuestions,
  ...biotechnologyQuestions,
  ...pharmacyQuestions,
  ...agricultureQuestions,
  ...hospitalityQuestions,
  ...aviationQuestions
];

// Database connection and seeding
async function seedFieldQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Clear existing field questions
    await FieldQuestion.deleteMany({});
    console.log('🗑️  Cleared existing field questions');

    // Insert new questions
    await FieldQuestion.insertMany(allFieldQuestions);
    console.log(`✅ Successfully seeded ${allFieldQuestions.length} field questions`);

    // Show count by field
    const fields = ['engineering', 'medical', 'management', 'law', 'design', 'architecture', 
                    'agriculture', 'pharmacy', 'computer-science', 'data-science', 
                    'biotechnology', 'psychology', 'mass-communication', 'hospitality', 'aviation'];
    
    console.log('\n📊 Questions by field:');
    for (const field of fields) {
      const count = await FieldQuestion.countDocuments({ field });
      console.log(`   ${field}: ${count} questions`);
    }

    console.log('\n✨ Field questions seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding field questions:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedFieldQuestions();
