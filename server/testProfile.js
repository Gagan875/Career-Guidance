const mongoose = require('mongoose');
require('dotenv').config();

const Profile = require('./models/Profile');
const User = require('./models/User');

async function testProfileSchema() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a test user (you can replace this with an actual user ID)
    const testUser = await User.findOne();
    if (!testUser) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log('Testing with user:', testUser.email);

    // Create a test profile
    const testProfile = new Profile({
      userId: testUser._id,
      personalInfo: {
        age: 18,
        gender: 'male',
        phoneNumber: '9876543210'
      },
      academicInfo: {
        currentClass: '12',
        stream: 'science',
        currentPercentage: 85,
        subjects: [
          { name: 'Physics', grade: 'A', marks: 90, maxMarks: 100 },
          { name: 'Chemistry', grade: 'B+', marks: 85, maxMarks: 100 },
          { name: 'Mathematics', grade: 'A+', marks: 95, maxMarks: 100 }
        ]
      },
      location: {
        state: 'Maharashtra',
        district: 'Mumbai',
        city: 'Mumbai',
        pincode: '400001'
      },
      careerPreferences: {
        interests: [
          { category: 'subject', name: 'Physics', level: 'high' },
          { category: 'field', name: 'Engineering', level: 'very-high' }
        ],
        careerGoals: {
          shortTerm: 'Complete engineering degree',
          longTerm: 'Become a software engineer'
        },
        workPreferences: {
          environment: 'office',
          teamSize: 'small-team',
          travelWillingness: 'occasional'
        }
      },
      skills: {
        technical: [
          { name: 'Programming', proficiency: 'intermediate' },
          { name: 'Mathematics', proficiency: 'advanced' }
        ],
        soft: [
          { name: 'Communication', level: 'competent' },
          { name: 'Leadership', level: 'developing' }
        ],
        languages: [
          { name: 'English', proficiency: 'fluent' },
          { name: 'Hindi', proficiency: 'native' }
        ]
      }
    });

    // Save the profile
    await testProfile.save();
    console.log('✅ Profile created successfully!');
    console.log('Profile ID:', testProfile._id);
    console.log('Completion percentage:', testProfile.profileStatus.completionPercentage + '%');
    console.log('Completion details:', testProfile.completionDetails);

    // Test updating the profile
    testProfile.personalInfo.age = 19;
    testProfile.academicInfo.currentPercentage = 87;
    await testProfile.save();
    console.log('✅ Profile updated successfully!');
    console.log('New completion percentage:', testProfile.profileStatus.completionPercentage + '%');

    // Test adding quiz results
    testProfile.assessmentResults.quizResults.push({
      quizType: 'career-assessment',
      results: {
        streamPercentages: {
          science: 80,
          commerce: 40,
          arts: 20,
          diploma: 30
        },
        recommendations: ['Engineering', 'Research'],
        accuracy: 75,
        totalQuestions: 20,
        correctAnswers: 15
      }
    });

    await testProfile.save();
    console.log('✅ Quiz results added successfully!');

    // Test finding the profile
    const foundProfile = await Profile.findOne({ userId: testUser._id });
    console.log('✅ Profile found:', foundProfile ? 'Yes' : 'No');
    
    if (foundProfile) {
      console.log('Profile completion:', foundProfile.completionDetails);
      console.log('Quiz results count:', foundProfile.assessmentResults.quizResults.length);
    }

    console.log('\n🎉 All tests passed! Profile schema is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testProfileSchema();