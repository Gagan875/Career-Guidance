const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const sampleCourses = [
  // Science Stream Courses
  {
    name: "Bachelor of Science in Computer Science",
    code: "BSC-CS",
    stream: "science",
    degree: "bachelor",
    duration: { years: 3, months: 0 },
    description: "A comprehensive program covering programming, algorithms, data structures, and software development.",
    eligibility: {
      minimumMarks: 75,
      requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
      entranceExam: "University Entrance Test"
    },
    careerPaths: [
      {
        jobTitle: "Software Developer",
        industry: "Information Technology",
        averageSalary: { min: 300000, max: 800000 },
        description: "Develop software applications and systems"
      },
      {
        jobTitle: "Data Analyst",
        industry: "Analytics",
        averageSalary: { min: 400000, max: 900000 },
        description: "Analyze data to help businesses make decisions"
      }
    ],
    higherEducationOptions: [
      {
        courseName: "Master of Computer Applications",
        degree: "master",
        description: "Advanced study in computer applications and software development"
      }
    ],
    governmentExams: [
      {
        examName: "GATE Computer Science",
        description: "Graduate Aptitude Test in Engineering",
        eligibility: "Bachelor's degree in relevant field"
      }
    ],
    skills: ["Programming", "Problem Solving", "Database Management", "Web Development"],
    subjects: ["Programming in C++", "Data Structures", "Database Systems", "Web Technologies"],
    popularity: 95
  },
  {
    name: "Bachelor of Technology in Mechanical Engineering",
    code: "BTECH-ME",
    stream: "engineering",
    degree: "bachelor",
    duration: { years: 4, months: 0 },
    description: "Engineering program focusing on mechanical systems, design, and manufacturing.",
    eligibility: {
      minimumMarks: 80,
      requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
      entranceExam: "JEE Main"
    },
    careerPaths: [
      {
        jobTitle: "Mechanical Engineer",
        industry: "Manufacturing",
        averageSalary: { min: 350000, max: 1000000 },
        description: "Design and develop mechanical systems and products"
      },
      {
        jobTitle: "Project Manager",
        industry: "Engineering",
        averageSalary: { min: 600000, max: 1500000 },
        description: "Manage engineering projects and teams"
      }
    ],
    higherEducationOptions: [
      {
        courseName: "Master of Technology in Mechanical Engineering",
        degree: "master",
        description: "Advanced engineering studies and research"
      }
    ],
    governmentExams: [
      {
        examName: "GATE Mechanical Engineering",
        description: "Graduate Aptitude Test in Engineering",
        eligibility: "Bachelor's degree in engineering"
      }
    ],
    skills: ["CAD Design", "Manufacturing Processes", "Project Management", "Problem Solving"],
    subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Manufacturing Technology"],
    popularity: 88
  },
  // Commerce Stream Courses
  {
    name: "Bachelor of Commerce",
    code: "BCOM",
    stream: "commerce",
    degree: "bachelor",
    duration: { years: 3, months: 0 },
    description: "Comprehensive business education covering accounting, finance, and management.",
    eligibility: {
      minimumMarks: 60,
      requiredSubjects: ["Mathematics", "Accountancy", "Business Studies"],
      entranceExam: "Merit Based"
    },
    careerPaths: [
      {
        jobTitle: "Chartered Accountant",
        industry: "Finance",
        averageSalary: { min: 500000, max: 2000000 },
        description: "Provide accounting and financial advisory services"
      },
      {
        jobTitle: "Financial Analyst",
        industry: "Banking",
        averageSalary: { min: 400000, max: 1200000 },
        description: "Analyze financial data and market trends"
      }
    ],
    higherEducationOptions: [
      {
        courseName: "Master of Business Administration",
        degree: "master",
        description: "Advanced business management and leadership skills"
      }
    ],
    governmentExams: [
      {
        examName: "CA Foundation",
        description: "Chartered Accountancy entrance exam",
        eligibility: "12th pass with commerce subjects"
      }
    ],
    skills: ["Financial Analysis", "Accounting", "Business Communication", "Data Analysis"],
    subjects: ["Financial Accounting", "Business Law", "Economics", "Statistics"],
    popularity: 85
  },
  {
    name: "Bachelor of Business Administration",
    code: "BBA",
    stream: "commerce",
    degree: "bachelor",
    duration: { years: 3, months: 0 },
    description: "Management-focused program covering all aspects of business administration.",
    eligibility: {
      minimumMarks: 55,
      requiredSubjects: ["Any stream"],
      entranceExam: "University Entrance Test"
    },
    careerPaths: [
      {
        jobTitle: "Business Manager",
        industry: "Corporate",
        averageSalary: { min: 350000, max: 1000000 },
        description: "Manage business operations and strategy"
      },
      {
        jobTitle: "Marketing Executive",
        industry: "Marketing",
        averageSalary: { min: 300000, max: 800000 },
        description: "Develop and execute marketing strategies"
      }
    ],
    higherEducationOptions: [
      {
        courseName: "Master of Business Administration",
        degree: "master",
        description: "Advanced business management studies"
      }
    ],
    governmentExams: [
      {
        examName: "CAT",
        description: "Common Admission Test for MBA",
        eligibility: "Bachelor's degree in any field"
      }
    ],
    skills: ["Leadership", "Strategic Planning", "Communication", "Team Management"],
    subjects: ["Management Principles", "Marketing", "Human Resources", "Operations Management"],
    popularity: 82
  },
  // Arts Stream Courses
  {
    name: "Bachelor of Arts in English Literature",
    code: "BA-ENG",
    stream: "arts",
    degree: "bachelor",
    duration: { years: 3, months: 0 },
    description: "Study of English language, literature, and creative writing.",
    eligibility: {
      minimumMarks: 50,
      requiredSubjects: ["English"],
      entranceExam: "Merit Based"
    },
    careerPaths: [
      {
        jobTitle: "Content Writer",
        industry: "Media",
        averageSalary: { min: 250000, max: 600000 },
        description: "Create written content for various media platforms"
      },
      {
        jobTitle: "Teacher",
        industry: "Education",
        averageSalary: { min: 300000, max: 700000 },
        description: "Teach English language and literature"
      }
    ],
    higherEducationOptions: [
      {
        courseName: "Master of Arts in English",
        degree: "master",
        description: "Advanced study of English literature and language"
      }
    ],
    governmentExams: [
      {
        examName: "UGC NET English",
        description: "National Eligibility Test for teaching",
        eligibility: "Master's degree in English"
      }
    ],
    skills: ["Writing", "Communication", "Critical Thinking", "Research"],
    subjects: ["British Literature", "American Literature", "Creative Writing", "Linguistics"],
    popularity: 70
  },
  // Diploma Courses
  {
    name: "Diploma in Computer Applications",
    code: "DCA",
    stream: "diploma",
    degree: "diploma",
    duration: { years: 1, months: 0 },
    description: "Basic computer skills and applications for office work.",
    eligibility: {
      minimumMarks: 45,
      requiredSubjects: ["Any stream"],
      entranceExam: "Direct Admission"
    },
    careerPaths: [
      {
        jobTitle: "Computer Operator",
        industry: "IT Support",
        averageSalary: { min: 150000, max: 300000 },
        description: "Operate computer systems and provide basic IT support"
      },
      {
        jobTitle: "Data Entry Operator",
        industry: "Administration",
        averageSalary: { min: 120000, max: 250000 },
        description: "Enter and manage data in computer systems"
      }
    ],
    higherEducationOptions: [
      {
        courseName: "Bachelor of Computer Applications",
        degree: "bachelor",
        description: "Advanced computer applications and programming"
      }
    ],
    governmentExams: [
      {
        examName: "SSC Data Entry Operator",
        description: "Staff Selection Commission exam",
        eligibility: "12th pass with typing skills"
      }
    ],
    skills: ["Computer Operations", "MS Office", "Data Entry", "Basic Programming"],
    subjects: ["Computer Fundamentals", "MS Office", "Internet Applications", "Basic Programming"],
    popularity: 75
  }
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`Inserted ${insertedCourses.length} courses successfully`);

    // Display breakdown by stream
    const streamCounts = {};
    insertedCourses.forEach(course => {
      streamCounts[course.stream] = (streamCounts[course.stream] || 0) + 1;
    });

    Object.entries(streamCounts).forEach(([stream, count]) => {
      console.log(`${stream}: ${count} courses`);
    });

    console.log('Course seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();