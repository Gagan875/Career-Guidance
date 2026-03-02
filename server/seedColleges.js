const mongoose = require('mongoose');
const College = require('./models/College');
require('dotenv').config();

const sampleColleges = [
  {
    name: "Delhi University",
    type: "government",
    location: {
      state: "Delhi",
      district: "New Delhi",
      city: "Delhi",
      address: "University Enclave, Delhi",
      coordinates: { latitude: 28.6869, longitude: 77.2090 }
    },
    contact: {
      phone: "+91-11-27666666",
      email: "info@du.ac.in",
      website: "https://www.du.ac.in"
    },
    facilities: {
      hostel: true,
      library: true,
      laboratory: true,
      internetAccess: true,
      sportsComplex: true,
      canteen: true
    },
    admissionInfo: {
      applicationDeadline: new Date('2024-06-30'),
      entranceExam: "CUET",
      cutoffMarks: { general: 85, obc: 82, sc: 78, st: 75 }
    },
    fees: {
      tuitionFee: 15000,
      hostelFee: 25000,
      otherFees: 5000
    },
    rating: 4.5
  },
  {
    name: "Mumbai University",
    type: "government",
    location: {
      state: "Maharashtra",
      district: "Mumbai",
      city: "Mumbai",
      address: "Kalina Campus, Santacruz East, Mumbai",
      coordinates: { latitude: 19.0760, longitude: 72.8777 }
    },
    contact: {
      phone: "+91-22-26543000",
      email: "info@mu.ac.in",
      website: "https://www.mu.ac.in"
    },
    facilities: {
      hostel: true,
      library: true,
      laboratory: true,
      internetAccess: true,
      sportsComplex: true,
      canteen: true
    },
    admissionInfo: {
      applicationDeadline: new Date('2024-07-15'),
      entranceExam: "MHT-CET",
      cutoffMarks: { general: 80, obc: 77, sc: 73, st: 70 }
    },
    fees: {
      tuitionFee: 12000,
      hostelFee: 30000,
      otherFees: 8000
    },
    rating: 4.2
  },
  {
    name: "Bangalore University",
    type: "government",
    location: {
      state: "Karnataka",
      district: "Bangalore",
      city: "Bangalore",
      address: "Jnana Bharathi Campus, Bangalore",
      coordinates: { latitude: 12.9716, longitude: 77.5946 }
    },
    contact: {
      phone: "+91-80-22961315",
      email: "info@bangaloreuniversity.ac.in",
      website: "https://www.bangaloreuniversity.ac.in"
    },
    facilities: {
      hostel: true,
      library: true,
      laboratory: true,
      internetAccess: true,
      sportsComplex: false,
      canteen: true
    },
    admissionInfo: {
      applicationDeadline: new Date('2024-06-20'),
      entranceExam: "KCET",
      cutoffMarks: { general: 75, obc: 72, sc: 68, st: 65 }
    },
    fees: {
      tuitionFee: 10000,
      hostelFee: 20000,
      otherFees: 6000
    },
    rating: 4.0
  },
  {
    name: "IIT Delhi",
    type: "government",
    location: {
      state: "Delhi",
      district: "New Delhi",
      city: "Delhi",
      address: "Hauz Khas, New Delhi",
      coordinates: { latitude: 28.5450, longitude: 77.1932 }
    },
    contact: {
      phone: "+91-11-26591785",
      email: "info@iitd.ac.in",
      website: "https://www.iitd.ac.in"
    },
    facilities: {
      hostel: true,
      library: true,
      laboratory: true,
      internetAccess: true,
      sportsComplex: true,
      canteen: true
    },
    admissionInfo: {
      applicationDeadline: new Date('2024-05-31'),
      entranceExam: "JEE Advanced",
      cutoffMarks: { general: 95, obc: 92, sc: 88, st: 85 }
    },
    fees: {
      tuitionFee: 200000,
      hostelFee: 50000,
      otherFees: 25000
    },
    rating: 4.8
  },
  {
    name: "Loyola College Chennai",
    type: "private",
    location: {
      state: "Tamil Nadu",
      district: "Chennai",
      city: "Chennai",
      address: "Sterling Road, Nungambakkam, Chennai",
      coordinates: { latitude: 13.0827, longitude: 80.2707 }
    },
    contact: {
      phone: "+91-44-28178200",
      email: "info@loyolacollege.edu",
      website: "https://www.loyolacollege.edu"
    },
    facilities: {
      hostel: true,
      library: true,
      laboratory: true,
      internetAccess: true,
      sportsComplex: true,
      canteen: true
    },
    admissionInfo: {
      applicationDeadline: new Date('2024-06-15'),
      entranceExam: "Merit Based",
      cutoffMarks: { general: 88, obc: 85, sc: 80, st: 78 }
    },
    fees: {
      tuitionFee: 45000,
      hostelFee: 35000,
      otherFees: 10000
    },
    rating: 4.3
  }
];

async function seedColleges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing colleges
    await College.deleteMany({});
    console.log('Cleared existing colleges');

    // Insert sample colleges
    const insertedColleges = await College.insertMany(sampleColleges);
    console.log(`Inserted ${insertedColleges.length} colleges successfully`);

    console.log('College seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding colleges:', error);
    process.exit(1);
  }
}

seedColleges();