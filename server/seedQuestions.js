const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const scienceQuestions = [
  // Chemistry Questions
  {
    question: "What is the chemical symbol for gold?",
    options: [
      { text: "Go", isCorrect: false },
      { text: "Au", isCorrect: true },
      { text: "Ag", isCorrect: false },
      { text: "Gd", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Chemistry",
    explanation: "Au comes from the Latin word 'aurum' meaning gold."
  },
  {
    question: "What is the pH of pure water?",
    options: [
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: true },
      { text: "8", isCorrect: false },
      { text: "9", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Chemistry"
  },
  {
    question: "Which gas makes up about 78% of Earth's atmosphere?",
    options: [
      { text: "Oxygen", isCorrect: false },
      { text: "Carbon Dioxide", isCorrect: false },
      { text: "Nitrogen", isCorrect: true },
      { text: "Argon", isCorrect: false }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Chemistry"
  },
  {
    question: "What is the most abundant element in the universe?",
    options: [
      { text: "Helium", isCorrect: false },
      { text: "Hydrogen", isCorrect: true },
      { text: "Oxygen", isCorrect: false },
      { text: "Carbon", isCorrect: false }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Chemistry"
  },
  {
    question: "Which element has the atomic number 6?",
    options: [
      { text: "Oxygen", isCorrect: false },
      { text: "Carbon", isCorrect: true },
      { text: "Nitrogen", isCorrect: false },
      { text: "Boron", isCorrect: false }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Chemistry"
  },

  // Physics Questions
  {
    question: "What is Newton's first law of motion?",
    options: [
      { text: "F = ma", isCorrect: false },
      { text: "An object at rest stays at rest unless acted upon by a force", isCorrect: true },
      { text: "For every action there is an equal and opposite reaction", isCorrect: false },
      { text: "Energy cannot be created or destroyed", isCorrect: false }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Physics",
    explanation: "Newton's first law is also known as the law of inertia."
  },
  {
    question: "What is the speed of light in vacuum?",
    options: [
      { text: "300,000 km/s", isCorrect: false },
      { text: "299,792,458 m/s", isCorrect: true },
      { text: "150,000 km/s", isCorrect: false },
      { text: "500,000 km/s", isCorrect: false }
    ],
    stream: "science",
    difficulty: "hard",
    category: "Physics"
  },
  {
    question: "What type of energy does a moving object possess?",
    options: [
      { text: "Potential Energy", isCorrect: false },
      { text: "Kinetic Energy", isCorrect: true },
      { text: "Thermal Energy", isCorrect: false },
      { text: "Chemical Energy", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Physics"
  },
  {
    question: "What is the unit of electric current?",
    options: [
      { text: "Volt", isCorrect: false },
      { text: "Watt", isCorrect: false },
      { text: "Ampere", isCorrect: true },
      { text: "Ohm", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Physics"
  },
  {
    question: "Which law states that energy cannot be created or destroyed?",
    options: [
      { text: "Newton's First Law", isCorrect: false },
      { text: "Law of Conservation of Energy", isCorrect: true },
      { text: "Ohm's Law", isCorrect: false },
      { text: "Boyle's Law", isCorrect: false }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Physics"
  },

  // Biology Questions
  {
    question: "What is the powerhouse of the cell?",
    options: [
      { text: "Nucleus", isCorrect: false },
      { text: "Ribosome", isCorrect: false },
      { text: "Mitochondria", isCorrect: true },
      { text: "Endoplasmic Reticulum", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Biology",
    explanation: "Mitochondria produce ATP, the energy currency of cells."
  },
  {
    question: "What is the process by which plants make their own food?",
    options: [
      { text: "Respiration", isCorrect: false },
      { text: "Photosynthesis", isCorrect: true },
      { text: "Digestion", isCorrect: false },
      { text: "Fermentation", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Biology"
  },
  {
    question: "Which blood type is known as the universal donor?",
    options: [
      { text: "A", isCorrect: false },
      { text: "B", isCorrect: false },
      { text: "AB", isCorrect: false },
      { text: "O", isCorrect: true }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Biology"
  },
  {
    question: "What is the largest organ in the human body?",
    options: [
      { text: "Liver", isCorrect: false },
      { text: "Brain", isCorrect: false },
      { text: "Skin", isCorrect: true },
      { text: "Lungs", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Biology"
  },
  {
    question: "How many chambers does a human heart have?",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Biology"
  },

  // Mathematics Questions
  {
    question: "What is the value of π (pi) approximately?",
    options: [
      { text: "3.14159", isCorrect: true },
      { text: "2.71828", isCorrect: false },
      { text: "1.41421", isCorrect: false },
      { text: "2.30259", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Mathematics"
  },
  {
    question: "What is the square root of 144?",
    options: [
      { text: "11", isCorrect: false },
      { text: "12", isCorrect: true },
      { text: "13", isCorrect: false },
      { text: "14", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Mathematics"
  },
  {
    question: "In a right triangle, what is the longest side called?",
    options: [
      { text: "Adjacent", isCorrect: false },
      { text: "Opposite", isCorrect: false },
      { text: "Hypotenuse", isCorrect: true },
      { text: "Base", isCorrect: false }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Mathematics"
  },
  {
    question: "What is 2 raised to the power of 8?",
    options: [
      { text: "128", isCorrect: false },
      { text: "256", isCorrect: true },
      { text: "512", isCorrect: false },
      { text: "64", isCorrect: false }
    ],
    stream: "science",
    difficulty: "medium",
    category: "Mathematics"
  },

  // Astronomy Questions
  {
    question: "Which planet is known as the Red Planet?",
    options: [
      { text: "Venus", isCorrect: false },
      { text: "Mars", isCorrect: true },
      { text: "Jupiter", isCorrect: false },
      { text: "Saturn", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Astronomy"
  },
  {
    question: "What is the closest star to Earth?",
    options: [
      { text: "Alpha Centauri", isCorrect: false },
      { text: "Sirius", isCorrect: false },
      { text: "The Sun", isCorrect: true },
      { text: "Polaris", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Astronomy"
  },
  {
    question: "How many moons does Jupiter have approximately?",
    options: [
      { text: "12", isCorrect: false },
      { text: "25", isCorrect: false },
      { text: "50", isCorrect: false },
      { text: "79", isCorrect: true }
    ],
    stream: "science",
    difficulty: "hard",
    category: "Astronomy"
  },
  {
    question: "What is the largest planet in our solar system?",
    options: [
      { text: "Saturn", isCorrect: false },
      { text: "Jupiter", isCorrect: true },
      { text: "Neptune", isCorrect: false },
      { text: "Uranus", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Astronomy"
  },
  {
    question: "What galaxy do we live in?",
    options: [
      { text: "Andromeda", isCorrect: false },
      { text: "Milky Way", isCorrect: true },
      { text: "Whirlpool", isCorrect: false },
      { text: "Sombrero", isCorrect: false }
    ],
    stream: "science",
    difficulty: "easy",
    category: "Astronomy"
  }
];

const commerceQuestions = [
  // Economics Questions
  {
    question: "What does GDP stand for?",
    options: [
      { text: "Gross Domestic Product", isCorrect: true },
      { text: "General Domestic Product", isCorrect: false },
      { text: "Gross Development Product", isCorrect: false },
      { text: "Global Domestic Product", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Economics",
    explanation: "GDP measures the total value of goods and services produced in a country."
  },
  {
    question: "What is inflation?",
    options: [
      { text: "Decrease in prices", isCorrect: false },
      { text: "Increase in prices", isCorrect: true },
      { text: "Stable prices", isCorrect: false },
      { text: "Currency devaluation", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Economics"
  },
  {
    question: "What is the law of demand?",
    options: [
      { text: "As price increases, demand increases", isCorrect: false },
      { text: "As price decreases, demand decreases", isCorrect: false },
      { text: "As price increases, demand decreases", isCorrect: true },
      { text: "Price and demand are unrelated", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Economics"
  },
  {
    question: "What is a monopoly?",
    options: [
      { text: "Many sellers, one buyer", isCorrect: false },
      { text: "One seller, many buyers", isCorrect: true },
      { text: "Many sellers, many buyers", isCorrect: false },
      { text: "One seller, one buyer", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Economics"
  },
  {
    question: "What does CPI measure?",
    options: [
      { text: "Consumer Price Index - inflation", isCorrect: true },
      { text: "Corporate Profit Index", isCorrect: false },
      { text: "Capital Price Index", isCorrect: false },
      { text: "Currency Price Index", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Economics"
  },

  // Accounting Questions
  {
    question: "What is the basic accounting equation?",
    options: [
      { text: "Assets = Liabilities + Equity", isCorrect: true },
      { text: "Assets = Liabilities - Equity", isCorrect: false },
      { text: "Assets + Liabilities = Equity", isCorrect: false },
      { text: "Assets - Equity = Liabilities", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Accounting",
    explanation: "This fundamental equation must always balance in double-entry bookkeeping."
  },
  {
    question: "Which of the following is a current asset?",
    options: [
      { text: "Building", isCorrect: false },
      { text: "Machinery", isCorrect: false },
      { text: "Cash", isCorrect: true },
      { text: "Land", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Accounting"
  },
  {
    question: "What is depreciation?",
    options: [
      { text: "Increase in asset value", isCorrect: false },
      { text: "Decrease in asset value over time", isCorrect: true },
      { text: "Sale of assets", isCorrect: false },
      { text: "Purchase of new assets", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Accounting"
  },
  {
    question: "What is double-entry bookkeeping?",
    options: [
      { text: "Recording transactions twice", isCorrect: false },
      { text: "Every transaction affects at least two accounts", isCorrect: true },
      { text: "Using two different books", isCorrect: false },
      { text: "Recording only debits", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Accounting"
  },
  {
    question: "What is a balance sheet?",
    options: [
      { text: "Statement of income and expenses", isCorrect: false },
      { text: "Statement of cash flows", isCorrect: false },
      { text: "Statement of assets, liabilities, and equity", isCorrect: true },
      { text: "Statement of retained earnings", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Accounting"
  },

  // Finance Questions
  {
    question: "What does ROI stand for?",
    options: [
      { text: "Return on Investment", isCorrect: true },
      { text: "Rate of Interest", isCorrect: false },
      { text: "Revenue on Investment", isCorrect: false },
      { text: "Risk of Investment", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Finance"
  },
  {
    question: "What is compound interest?",
    options: [
      { text: "Interest on principal only", isCorrect: false },
      { text: "Interest on principal and accumulated interest", isCorrect: true },
      { text: "Simple interest calculation", isCorrect: false },
      { text: "Interest paid monthly", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Finance"
  },
  {
    question: "What is a stock?",
    options: [
      { text: "A loan to a company", isCorrect: false },
      { text: "Ownership share in a company", isCorrect: true },
      { text: "A type of bond", isCorrect: false },
      { text: "A savings account", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Finance"
  },
  {
    question: "What is diversification in investing?",
    options: [
      { text: "Putting all money in one investment", isCorrect: false },
      { text: "Spreading investments across different assets", isCorrect: true },
      { text: "Only investing in stocks", isCorrect: false },
      { text: "Avoiding all risks", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Finance"
  },
  {
    question: "What is liquidity?",
    options: [
      { text: "How quickly an asset can be converted to cash", isCorrect: true },
      { text: "The profitability of an investment", isCorrect: false },
      { text: "The risk level of an investment", isCorrect: false },
      { text: "The interest rate on a loan", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Finance"
  },

  // Business Studies Questions
  {
    question: "What are the 4 Ps of marketing?",
    options: [
      { text: "Product, Price, Place, Promotion", isCorrect: true },
      { text: "People, Process, Physical, Performance", isCorrect: false },
      { text: "Plan, Prepare, Present, Perform", isCorrect: false },
      { text: "Profit, Purpose, People, Planet", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Business Studies"
  },
  {
    question: "What is a SWOT analysis?",
    options: [
      { text: "Strengths, Weaknesses, Opportunities, Threats", isCorrect: true },
      { text: "Sales, Workforce, Operations, Technology", isCorrect: false },
      { text: "Strategy, Work, Organization, Timeline", isCorrect: false },
      { text: "Systems, Workflow, Objectives, Tasks", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Business Studies"
  },
  {
    question: "What is entrepreneurship?",
    options: [
      { text: "Working for a large corporation", isCorrect: false },
      { text: "Starting and running your own business", isCorrect: true },
      { text: "Investing in stocks", isCorrect: false },
      { text: "Managing other people's money", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Business Studies"
  },
  {
    question: "What is market research?",
    options: [
      { text: "Selling products in the market", isCorrect: false },
      { text: "Gathering information about customers and competitors", isCorrect: true },
      { text: "Setting up a market stall", isCorrect: false },
      { text: "Calculating market prices", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Business Studies"
  },
  {
    question: "What is a business plan?",
    options: [
      { text: "A daily work schedule", isCorrect: false },
      { text: "A document outlining business goals and strategies", isCorrect: true },
      { text: "A list of employees", isCorrect: false },
      { text: "A financial statement", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Business Studies"
  },

  // Banking Questions
  {
    question: "What is the Reserve Bank of India's main function?",
    options: [
      { text: "Providing loans to individuals", isCorrect: false },
      { text: "Regulating monetary policy", isCorrect: true },
      { text: "Operating ATMs", isCorrect: false },
      { text: "Selling insurance", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "medium",
    category: "Banking"
  },
  {
    question: "What is a credit score?",
    options: [
      { text: "Amount of money in your account", isCorrect: false },
      { text: "A measure of creditworthiness", isCorrect: true },
      { text: "Interest rate on loans", isCorrect: false },
      { text: "Number of credit cards you have", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Banking"
  },
  {
    question: "What is EMI?",
    options: [
      { text: "Equated Monthly Installment", isCorrect: true },
      { text: "Electronic Money Transfer", isCorrect: false },
      { text: "Emergency Money Insurance", isCorrect: false },
      { text: "Extra Monthly Income", isCorrect: false }
    ],
    stream: "commerce",
    difficulty: "easy",
    category: "Banking"
  }
];

const artsQuestions = [
  // Literature Questions
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      { text: "Charles Dickens", isCorrect: false },
      { text: "William Shakespeare", isCorrect: true },
      { text: "Jane Austen", isCorrect: false },
      { text: "Mark Twain", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "Literature",
    explanation: "Shakespeare wrote this famous tragedy in the early part of his career."
  },
  {
    question: "Who wrote 'Pride and Prejudice'?",
    options: [
      { text: "Charlotte Bronte", isCorrect: false },
      { text: "Emily Dickinson", isCorrect: false },
      { text: "Jane Austen", isCorrect: true },
      { text: "Virginia Woolf", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "Literature"
  },
  {
    question: "Which epic poem was written by Homer?",
    options: [
      { text: "The Aeneid", isCorrect: false },
      { text: "The Iliad", isCorrect: true },
      { text: "Paradise Lost", isCorrect: false },
      { text: "The Divine Comedy", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Literature"
  },
  {
    question: "Who wrote '1984'?",
    options: [
      { text: "Aldous Huxley", isCorrect: false },
      { text: "George Orwell", isCorrect: true },
      { text: "Ray Bradbury", isCorrect: false },
      { text: "H.G. Wells", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Literature"
  },
  {
    question: "What is a sonnet?",
    options: [
      { text: "A 12-line poem", isCorrect: false },
      { text: "A 14-line poem", isCorrect: true },
      { text: "A 16-line poem", isCorrect: false },
      { text: "A 10-line poem", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Literature"
  },

  // History Questions
  {
    question: "In which year did World War II end?",
    options: [
      { text: "1944", isCorrect: false },
      { text: "1945", isCorrect: true },
      { text: "1946", isCorrect: false },
      { text: "1947", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "History"
  },
  {
    question: "Who was the first President of the United States?",
    options: [
      { text: "Thomas Jefferson", isCorrect: false },
      { text: "John Adams", isCorrect: false },
      { text: "George Washington", isCorrect: true },
      { text: "Benjamin Franklin", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "History"
  },
  {
    question: "In which year did India gain independence?",
    options: [
      { text: "1946", isCorrect: false },
      { text: "1947", isCorrect: true },
      { text: "1948", isCorrect: false },
      { text: "1949", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "History"
  },
  {
    question: "Who was known as the 'Iron Lady'?",
    options: [
      { text: "Indira Gandhi", isCorrect: false },
      { text: "Margaret Thatcher", isCorrect: true },
      { text: "Golda Meir", isCorrect: false },
      { text: "Angela Merkel", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "History"
  },
  {
    question: "Which ancient wonder of the world was located in Alexandria?",
    options: [
      { text: "Hanging Gardens", isCorrect: false },
      { text: "Lighthouse of Alexandria", isCorrect: true },
      { text: "Colossus of Rhodes", isCorrect: false },
      { text: "Statue of Zeus", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "hard",
    category: "History"
  },

  // Geography Questions
  {
    question: "What is the capital of France?",
    options: [
      { text: "London", isCorrect: false },
      { text: "Berlin", isCorrect: false },
      { text: "Paris", isCorrect: true },
      { text: "Rome", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "Geography"
  },
  {
    question: "What is the longest river in the world?",
    options: [
      { text: "Amazon River", isCorrect: false },
      { text: "Nile River", isCorrect: true },
      { text: "Mississippi River", isCorrect: false },
      { text: "Yangtze River", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Geography"
  },
  {
    question: "Which is the largest continent?",
    options: [
      { text: "Africa", isCorrect: false },
      { text: "Asia", isCorrect: true },
      { text: "North America", isCorrect: false },
      { text: "Europe", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "Geography"
  },
  {
    question: "What is the highest mountain in the world?",
    options: [
      { text: "K2", isCorrect: false },
      { text: "Mount Everest", isCorrect: true },
      { text: "Kangchenjunga", isCorrect: false },
      { text: "Lhotse", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "Geography"
  },
  {
    question: "Which country has the most time zones?",
    options: [
      { text: "United States", isCorrect: false },
      { text: "Russia", isCorrect: true },
      { text: "China", isCorrect: false },
      { text: "Canada", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "hard",
    category: "Geography"
  },

  // Art Questions
  {
    question: "Who painted the Mona Lisa?",
    options: [
      { text: "Vincent van Gogh", isCorrect: false },
      { text: "Pablo Picasso", isCorrect: false },
      { text: "Leonardo da Vinci", isCorrect: true },
      { text: "Michelangelo", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "easy",
    category: "Art"
  },
  {
    question: "Which art movement was Pablo Picasso associated with?",
    options: [
      { text: "Impressionism", isCorrect: false },
      { text: "Cubism", isCorrect: true },
      { text: "Surrealism", isCorrect: false },
      { text: "Expressionism", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Art"
  },
  {
    question: "Who sculpted 'David'?",
    options: [
      { text: "Leonardo da Vinci", isCorrect: false },
      { text: "Michelangelo", isCorrect: true },
      { text: "Donatello", isCorrect: false },
      { text: "Bernini", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Art"
  },
  {
    question: "What is fresco painting?",
    options: [
      { text: "Painting on canvas", isCorrect: false },
      { text: "Painting on wet plaster", isCorrect: true },
      { text: "Painting with watercolors", isCorrect: false },
      { text: "Painting on wood", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Art"
  },
  {
    question: "Which museum houses the Mona Lisa?",
    options: [
      { text: "British Museum", isCorrect: false },
      { text: "Louvre Museum", isCorrect: true },
      { text: "Metropolitan Museum", isCorrect: false },
      { text: "Uffizi Gallery", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Art"
  },

  // Philosophy Questions
  {
    question: "Who is known as the father of Western philosophy?",
    options: [
      { text: "Plato", isCorrect: false },
      { text: "Aristotle", isCorrect: false },
      { text: "Socrates", isCorrect: true },
      { text: "Pythagoras", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Philosophy"
  },
  {
    question: "What does 'cogito ergo sum' mean?",
    options: [
      { text: "I think, therefore I am", isCorrect: true },
      { text: "I see, therefore I believe", isCorrect: false },
      { text: "I act, therefore I exist", isCorrect: false },
      { text: "I feel, therefore I live", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "hard",
    category: "Philosophy"
  },
  {
    question: "Who wrote 'The Republic'?",
    options: [
      { text: "Socrates", isCorrect: false },
      { text: "Plato", isCorrect: true },
      { text: "Aristotle", isCorrect: false },
      { text: "Marcus Aurelius", isCorrect: false }
    ],
    stream: "arts",
    difficulty: "medium",
    category: "Philosophy"
  }
];

const diplomaQuestions = [
  // Computer Science Questions
  {
    question: "What does HTML stand for?",
    options: [
      { text: "Hyper Text Markup Language", isCorrect: true },
      { text: "High Tech Modern Language", isCorrect: false },
      { text: "Home Tool Markup Language", isCorrect: false },
      { text: "Hyperlink and Text Markup Language", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Computer Science",
    explanation: "HTML is the standard markup language for creating web pages."
  },
  {
    question: "What is the basic unit of computer memory?",
    options: [
      { text: "Bit", isCorrect: false },
      { text: "Byte", isCorrect: true },
      { text: "Kilobyte", isCorrect: false },
      { text: "Megabyte", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Computer Science"
  },
  {
    question: "Which programming language is known as the 'mother of all languages'?",
    options: [
      { text: "Java", isCorrect: false },
      { text: "C", isCorrect: true },
      { text: "Python", isCorrect: false },
      { text: "COBOL", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Programming"
  },
  {
    question: "What does SQL stand for?",
    options: [
      { text: "Structured Query Language", isCorrect: true },
      { text: "Simple Query Language", isCorrect: false },
      { text: "Standard Query Language", isCorrect: false },
      { text: "System Query Language", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Database"
  },
  {
    question: "What is an algorithm?",
    options: [
      { text: "A programming language", isCorrect: false },
      { text: "A step-by-step procedure to solve a problem", isCorrect: true },
      { text: "A type of computer", isCorrect: false },
      { text: "A software application", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Computer Science"
  },
  {
    question: "What does API stand for?",
    options: [
      { text: "Application Programming Interface", isCorrect: true },
      { text: "Advanced Programming Interface", isCorrect: false },
      { text: "Automated Programming Interface", isCorrect: false },
      { text: "Application Process Interface", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Programming"
  },

  // Electrical Engineering Questions
  {
    question: "Which tool is used for measuring electrical current?",
    options: [
      { text: "Voltmeter", isCorrect: false },
      { text: "Ammeter", isCorrect: true },
      { text: "Ohmmeter", isCorrect: false },
      { text: "Wattmeter", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Electrical Engineering"
  },
  {
    question: "What is Ohm's Law?",
    options: [
      { text: "V = I × R", isCorrect: true },
      { text: "P = V × I", isCorrect: false },
      { text: "E = mc²", isCorrect: false },
      { text: "F = ma", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Electrical Engineering"
  },
  {
    question: "What does AC stand for in electricity?",
    options: [
      { text: "Alternating Current", isCorrect: true },
      { text: "Active Current", isCorrect: false },
      { text: "Automatic Current", isCorrect: false },
      { text: "Advanced Current", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Electrical Engineering"
  },
  {
    question: "What is a transformer used for?",
    options: [
      { text: "Converting AC to DC", isCorrect: false },
      { text: "Changing voltage levels", isCorrect: true },
      { text: "Measuring current", isCorrect: false },
      { text: "Storing electricity", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Electrical Engineering"
  },
  {
    question: "What is the unit of electrical resistance?",
    options: [
      { text: "Volt", isCorrect: false },
      { text: "Ampere", isCorrect: false },
      { text: "Ohm", isCorrect: true },
      { text: "Watt", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Electrical Engineering"
  },

  // Mechanical Engineering Questions
  {
    question: "What does CAD stand for in engineering?",
    options: [
      { text: "Computer Aided Design", isCorrect: true },
      { text: "Computer Automated Design", isCorrect: false },
      { text: "Creative Art Design", isCorrect: false },
      { text: "Computer Advanced Design", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Engineering"
  },
  {
    question: "What is the SI unit of force?",
    options: [
      { text: "Joule", isCorrect: false },
      { text: "Newton", isCorrect: true },
      { text: "Pascal", isCorrect: false },
      { text: "Watt", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Mechanical Engineering"
  },
  {
    question: "What is torque?",
    options: [
      { text: "Linear force", isCorrect: false },
      { text: "Rotational force", isCorrect: true },
      { text: "Electrical force", isCorrect: false },
      { text: "Magnetic force", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Mechanical Engineering"
  },
  {
    question: "What is the efficiency of an ideal machine?",
    options: [
      { text: "50%", isCorrect: false },
      { text: "75%", isCorrect: false },
      { text: "90%", isCorrect: false },
      { text: "100%", isCorrect: true }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Mechanical Engineering"
  },
  {
    question: "What is a gear ratio?",
    options: [
      { text: "Speed of input gear to output gear", isCorrect: true },
      { text: "Size of gears", isCorrect: false },
      { text: "Number of teeth", isCorrect: false },
      { text: "Material of gears", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Mechanical Engineering"
  },

  // Civil Engineering Questions
  {
    question: "What is concrete made of?",
    options: [
      { text: "Cement, sand, gravel, and water", isCorrect: true },
      { text: "Only cement and water", isCorrect: false },
      { text: "Sand and gravel only", isCorrect: false },
      { text: "Cement and sand only", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Civil Engineering"
  },
  {
    question: "What is the standard curing time for concrete?",
    options: [
      { text: "7 days", isCorrect: false },
      { text: "14 days", isCorrect: false },
      { text: "28 days", isCorrect: true },
      { text: "56 days", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Civil Engineering"
  },
  {
    question: "What is reinforcement in concrete?",
    options: [
      { text: "Steel bars or mesh", isCorrect: true },
      { text: "Extra cement", isCorrect: false },
      { text: "More water", isCorrect: false },
      { text: "Additional sand", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Civil Engineering"
  },
  {
    question: "What is a foundation in construction?",
    options: [
      { text: "The roof of a building", isCorrect: false },
      { text: "The base that supports a structure", isCorrect: true },
      { text: "The walls of a building", isCorrect: false },
      { text: "The windows and doors", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Civil Engineering"
  },

  // Electronics Questions
  {
    question: "What does LED stand for?",
    options: [
      { text: "Light Emitting Diode", isCorrect: true },
      { text: "Low Energy Device", isCorrect: false },
      { text: "Linear Electronic Display", isCorrect: false },
      { text: "Light Electronic Detector", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Electronics"
  },
  {
    question: "What is a semiconductor?",
    options: [
      { text: "A perfect conductor", isCorrect: false },
      { text: "A perfect insulator", isCorrect: false },
      { text: "A material with conductivity between conductor and insulator", isCorrect: true },
      { text: "A type of battery", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Electronics"
  },
  {
    question: "What is the function of a capacitor?",
    options: [
      { text: "To resist current flow", isCorrect: false },
      { text: "To store electrical energy", isCorrect: true },
      { text: "To amplify signals", isCorrect: false },
      { text: "To convert AC to DC", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "medium",
    category: "Electronics"
  },
  {
    question: "What does PCB stand for?",
    options: [
      { text: "Printed Circuit Board", isCorrect: true },
      { text: "Personal Computer Board", isCorrect: false },
      { text: "Power Control Board", isCorrect: false },
      { text: "Programmable Circuit Board", isCorrect: false }
    ],
    stream: "diploma",
    difficulty: "easy",
    category: "Electronics"
  }
];

// Function to generate more questions for each stream with better variations
function generateMoreQuestions(baseQuestions, stream, targetCount = 100) {
  const questions = [...baseQuestions];
  
  // Create more meaningful variations
  const variationPrefixes = [
    "Which of the following is true about",
    "What is the main characteristic of",
    "Identify the correct statement about",
    "Which statement best describes",
    "What is the primary function of",
    "Which of these facts is accurate regarding",
    "What is the most important aspect of",
    "Which principle applies to",
    "What is the key feature of",
    "Which concept is related to"
  ];
  
  const alternativeQuestionStarters = [
    "In the context of {category}, what is",
    "From a {category} perspective, which is",
    "According to {category} principles, what",
    "In {category} studies, which statement",
    "Regarding {category}, what can be said about"
  ];
  
  while (questions.length < targetCount) {
    const baseQuestion = baseQuestions[Math.floor(Math.random() * baseQuestions.length)];
    const variationType = Math.floor(Math.random() * 3);
    
    let newQuestion = { 
      ...baseQuestion,
      options: baseQuestion.options.map(opt => ({ ...opt })) // Deep copy options
    };
    
    if (variationType === 0 && Math.random() > 0.5) {
      // Use variation prefixes
      const prefix = variationPrefixes[Math.floor(Math.random() * variationPrefixes.length)];
      const concept = baseQuestion.question.split(' ').slice(-2).join(' ').replace('?', '');
      newQuestion.question = `${prefix} ${concept}?`;
    } else if (variationType === 1 && baseQuestion.category && Math.random() > 0.5) {
      // Use category-based variations
      const template = alternativeQuestionStarters[Math.floor(Math.random() * alternativeQuestionStarters.length)];
      const concept = baseQuestion.question.split(' ').slice(-3).join(' ').replace('?', '');
      newQuestion.question = template.replace('{category}', baseQuestion.category.toLowerCase()) + ' ' + concept + '?';
    } else {
      // Create difficulty-based variations
      const difficultyModifiers = {
        easy: ['basic', 'fundamental', 'simple', 'elementary'],
        medium: ['intermediate', 'standard', 'typical', 'common'],
        hard: ['advanced', 'complex', 'detailed', 'comprehensive']
      };
      
      const modifier = difficultyModifiers[baseQuestion.difficulty] || ['general'];
      const selectedModifier = modifier[Math.floor(Math.random() * modifier.length)];
      
      // Sometimes just add the modifier, sometimes keep original with variation number
      if (Math.random() > 0.6) {
        newQuestion.question = `What is the ${selectedModifier} principle behind ${baseQuestion.question.toLowerCase().replace('what is ', '').replace('?', '')}?`;
      } else {
        newQuestion.question = `${baseQuestion.question.replace('?', '')} (Level ${questions.length - baseQuestions.length + 1})?`;
      }
    }
    
    // Ensure the stream is correct
    newQuestion.stream = stream;
    
    // Slightly modify difficulty for some variations
    if (Math.random() > 0.8) {
      const difficulties = ['easy', 'medium', 'hard'];
      const currentIndex = difficulties.indexOf(newQuestion.difficulty);
      if (currentIndex > 0 && Math.random() > 0.5) {
        newQuestion.difficulty = difficulties[currentIndex - 1];
      } else if (currentIndex < difficulties.length - 1 && Math.random() > 0.5) {
        newQuestion.difficulty = difficulties[currentIndex + 1];
      }
    }
    
    questions.push(newQuestion);
  }
  
  return questions;
}

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Generate 100 questions for each stream
    const allScienceQuestions = generateMoreQuestions(scienceQuestions, 'science');
    const allCommerceQuestions = generateMoreQuestions(commerceQuestions, 'commerce');
    const allArtsQuestions = generateMoreQuestions(artsQuestions, 'arts');
    const allDiplomaQuestions = generateMoreQuestions(diplomaQuestions, 'diploma');

    // Insert all questions
    const allQuestions = [
      ...allScienceQuestions,
      ...allCommerceQuestions,
      ...allArtsQuestions,
      ...allDiplomaQuestions
    ];

    await Question.insertMany(allQuestions);
    console.log(`Inserted ${allQuestions.length} questions successfully`);
    console.log(`Science: ${allScienceQuestions.length} questions`);
    console.log(`Commerce: ${allCommerceQuestions.length} questions`);
    console.log(`Arts: ${allArtsQuestions.length} questions`);
    console.log(`Diploma: ${allDiplomaQuestions.length} questions`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding questions:', error);
    mongoose.connection.close();
  }
}

// Run the seeding function
if (require.main === module) {
  seedQuestions();
}

module.exports = { seedQuestions };