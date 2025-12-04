const mongoose = require('mongoose');
const FieldQuestion = require('./models/FieldQuestion');
require('dotenv').config();

function createQuestion(question, correctAnswer, wrongAnswers, field, difficulty, category) {
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
    category
  };
}

// Add questions to fields that need more (to reach at least 20 per field)
const additionalQuestions = [
  // Design (need 3 more to reach 20)
  createQuestion("What is the golden ratio?", "1.618", ["1.414", "2.718", "3.142"], "design", "medium", "Design Principles"),
  createQuestion("What is kerning?", "Space between individual letters", ["Space between lines", "Font size", "Text alignment"], "design", "medium", "Typography"),
  createQuestion("What is a vector graphic?", "Image made of paths and points", ["Pixel-based image", "3D model", "Animated image"], "design", "easy", "Digital Design"),
  
  // Architecture (need 4 more to reach 20)
  createQuestion("What is a facade?", "Front face of a building", ["Building foundation", "Roof structure", "Interior wall"], "architecture", "easy", "Architecture Basics"),
  createQuestion("What is an atrium?", "Large open space in a building", ["Small room", "Basement", "Rooftop"], "architecture", "easy", "Architecture Terms"),
  createQuestion("What is a skylight?", "Window in the roof", ["Door to balcony", "Underground window", "Wall opening"], "architecture", "easy", "Building Elements"),
  createQuestion("What is a column?", "Vertical structural support", ["Horizontal beam", "Roof element", "Floor tile"], "architecture", "easy", "Structural Elements"),
  
  // Agriculture (need 4 more to reach 20)
  createQuestion("What is a herbicide?", "Chemical to kill weeds", ["Insect killer", "Fertilizer", "Irrigation tool"], "agriculture", "easy", "Crop Protection"),
  createQuestion("What is tillage?", "Preparing soil for planting", ["Harvesting crops", "Watering plants", "Storing grain"], "agriculture", "easy", "Farming Practices"),
  createQuestion("What is a greenhouse effect?", "Trapping heat to warm plants", ["Cooling system", "Pest control", "Fertilization method"], "agriculture", "medium", "Agricultural Science"),
  createQuestion("What is crop yield?", "Amount of crop produced", ["Type of seed", "Farming tool", "Soil quality"], "agriculture", "easy", "Agriculture Economics"),
  
  // Pharmacy (need 4 more to reach 20)
  createQuestion("What is a tablet?", "Solid oral medication form", ["Liquid medicine", "Injectable drug", "Topical cream"], "pharmacy", "easy", "Pharmaceutical Forms"),
  createQuestion("What is a capsule?", "Medicine in a gelatin shell", ["Liquid medicine", "Powder form", "Injection"], "pharmacy", "easy", "Drug Forms"),
  createQuestion("What is an antibiotic?", "Medicine that kills bacteria", ["Pain reliever", "Vitamin supplement", "Antiviral drug"], "pharmacy", "easy", "Pharmacology"),
  createQuestion("What is a prescription drug?", "Medicine requiring doctor's order", ["Over-the-counter drug", "Herbal supplement", "Vitamin"], "pharmacy", "easy", "Pharmaceutical Practice"),
  
  // Biotechnology (need 4 more to reach 20)
  createQuestion("What is DNA sequencing?", "Determining DNA base order", ["Creating new DNA", "Destroying DNA", "Copying DNA"], "biotechnology", "medium", "Molecular Biology"),
  createQuestion("What is a cell culture?", "Growing cells in lab", ["Studying cell death", "Destroying cells", "Freezing cells"], "biotechnology", "easy", "Cell Biology"),
  createQuestion("What is an enzyme?", "Protein that speeds reactions", ["Type of cell", "DNA molecule", "Vitamin"], "biotechnology", "easy", "Biochemistry"),
  createQuestion("What is a mutation?", "Change in DNA sequence", ["Normal cell division", "Protein synthesis", "Energy production"], "biotechnology", "medium", "Genetics"),
  
  // Psychology (need 4 more to reach 20)
  createQuestion("What is memory?", "Ability to store and recall information", ["Emotional response", "Physical sensation", "Motor skill"], "psychology", "easy", "Cognitive Psychology"),
  createQuestion("What is anxiety?", "Feeling of worry or fear", ["Happiness", "Anger", "Confusion"], "psychology", "easy", "Mental Health"),
  createQuestion("What is behavior?", "Observable actions", ["Thoughts only", "Emotions only", "Dreams"], "psychology", "easy", "Behavioral Psychology"),
  createQuestion("What is therapy?", "Treatment for mental health", ["Medical surgery", "Physical exercise", "Diet plan"], "psychology", "easy", "Clinical Psychology"),
  
  // Mass Communication (need 4 more to reach 20)
  createQuestion("What is a headline?", "Title of a news article", ["Article body", "Photo caption", "Advertisement"], "mass-communication", "easy", "Journalism"),
  createQuestion("What is broadcasting?", "Transmitting content to audience", ["Writing articles", "Taking photos", "Editing videos"], "mass-communication", "easy", "Media"),
  createQuestion("What is an editorial?", "Opinion piece by editor", ["News report", "Advertisement", "Photo essay"], "mass-communication", "easy", "Journalism"),
  createQuestion("What is a podcast?", "Digital audio program", ["TV show", "Newspaper", "Magazine"], "mass-communication", "easy", "Digital Media"),
  
  // Hospitality (need 4 more to reach 20)
  createQuestion("What is check-in?", "Guest arrival registration", ["Leaving hotel", "Room cleaning", "Food service"], "hospitality", "easy", "Hotel Operations"),
  createQuestion("What is a suite?", "Luxury hotel room with multiple areas", ["Standard room", "Lobby", "Restaurant"], "hospitality", "easy", "Hotel Types"),
  createQuestion("What is catering?", "Providing food service", ["Room cleaning", "Reception desk", "Laundry service"], "hospitality", "easy", "Food Service"),
  createQuestion("What is hospitality?", "Welcoming and serving guests", ["Building hotels", "Cooking food", "Cleaning rooms"], "hospitality", "easy", "Industry Basics"),
  
  // Aviation (need 4 more to reach 20)
  createQuestion("What is a cockpit?", "Pilot's control area", ["Passenger cabin", "Cargo hold", "Wing section"], "aviation", "easy", "Aircraft Parts"),
  createQuestion("What is takeoff?", "Aircraft leaving ground", ["Landing", "Taxiing", "Parking"], "aviation", "easy", "Flight Operations"),
  createQuestion("What is a flight attendant?", "Cabin crew member", ["Pilot", "Engineer", "Ground staff"], "aviation", "easy", "Aviation Careers"),
  createQuestion("What is an airport?", "Facility for aircraft operations", ["Aircraft factory", "Flight school", "Airline office"], "aviation", "easy", "Aviation Infrastructure"),
  
  // Add more to smaller fields
  createQuestion("What is responsive design?", "Design adapting to screen sizes", ["Fast loading design", "Colorful design", "Simple design"], "design", "easy", "Web Design"),
  createQuestion("What is a mood board?", "Visual inspiration collection", ["Project timeline", "Budget sheet", "Contract"], "design", "easy", "Design Process"),
  createQuestion("What is accessibility?", "Design usable by everyone", ["Expensive design", "Complex design", "Artistic design"], "design", "medium", "UX Design"),
  
  createQuestion("What is a foundation?", "Base supporting a building", ["Roof structure", "Wall decoration", "Window frame"], "architecture", "easy", "Construction"),
  createQuestion("What is insulation?", "Material preventing heat transfer", ["Decoration", "Lighting", "Plumbing"], "architecture", "easy", "Building Materials"),
  createQuestion("What is a permit?", "Official building approval", ["Design sketch", "Construction tool", "Building material"], "architecture", "easy", "Regulations"),
  
  createQuestion("What is livestock?", "Farm animals", ["Crops", "Tools", "Buildings"], "agriculture", "easy", "Animal Husbandry"),
  createQuestion("What is a silo?", "Storage for grain", ["Animal shelter", "Tractor", "Irrigation system"], "agriculture", "easy", "Farm Structures"),
  createQuestion("What is organic farming?", "Farming without synthetic chemicals", ["Industrial farming", "Fish farming", "Urban farming"], "agriculture", "easy", "Farming Methods"),
  
  createQuestion("What is a pharmacist?", "Licensed medication expert", ["Doctor", "Nurse", "Chemist"], "pharmacy", "easy", "Pharmacy Profession"),
  createQuestion("What is drug interaction?", "Effect of combining medications", ["Drug color", "Drug shape", "Drug price"], "pharmacy", "medium", "Pharmacology"),
  createQuestion("What is over-the-counter?", "Medicine without prescription", ["Prescription drug", "Hospital drug", "Experimental drug"], "pharmacy", "easy", "Drug Classification"),
  
  createQuestion("What is a microscope?", "Tool to see small objects", ["Measuring device", "Heating equipment", "Storage container"], "biotechnology", "easy", "Lab Equipment"),
  createQuestion("What is a petri dish?", "Shallow dish for cultures", ["Measuring cup", "Test tube", "Beaker"], "biotechnology", "easy", "Lab Tools"),
  createQuestion("What is sterilization?", "Killing all microorganisms", ["Cooling samples", "Mixing chemicals", "Measuring volume"], "biotechnology", "easy", "Lab Techniques"),
  
  createQuestion("What is depression?", "Persistent sad mood", ["Temporary sadness", "Anger", "Excitement"], "psychology", "easy", "Mental Health"),
  createQuestion("What is self-esteem?", "Confidence in oneself", ["Physical health", "Intelligence", "Memory"], "psychology", "easy", "Personality"),
  createQuestion("What is a phobia?", "Intense irrational fear", ["Normal worry", "Sadness", "Anger"], "psychology", "easy", "Mental Health"),
  
  createQuestion("What is a reporter?", "Person gathering news", ["Editor", "Photographer", "Designer"], "mass-communication", "easy", "Journalism"),
  createQuestion("What is a blog?", "Online personal journal", ["Newspaper", "TV show", "Radio program"], "mass-communication", "easy", "Digital Media"),
  createQuestion("What is media ethics?", "Moral principles in media", ["Media technology", "Media business", "Media design"], "mass-communication", "medium", "Ethics"),
  
  createQuestion("What is room service?", "Food delivered to room", ["Cleaning service", "Laundry service", "Concierge service"], "hospitality", "easy", "Hotel Services"),
  createQuestion("What is a reservation?", "Booking in advance", ["Check-in", "Check-out", "Payment"], "hospitality", "easy", "Hotel Operations"),
  createQuestion("What is housekeeping?", "Cleaning and maintenance", ["Food service", "Reception", "Security"], "hospitality", "easy", "Hotel Departments"),
  
  createQuestion("What is a hangar?", "Building for aircraft storage", ["Passenger terminal", "Control tower", "Runway"], "aviation", "easy", "Airport Facilities"),
  createQuestion("What is a pilot?", "Person flying aircraft", ["Flight attendant", "Engineer", "Controller"], "aviation", "easy", "Aviation Careers"),
  createQuestion("What is navigation?", "Determining aircraft position", ["Refueling", "Cleaning", "Loading"], "aviation", "medium", "Flight Operations")
];

async function addQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await FieldQuestion.insertMany(additionalQuestions);
    console.log(`✅ Added ${additionalQuestions.length} questions`);

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

    console.log('\n✨ Questions added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addQuestions();
