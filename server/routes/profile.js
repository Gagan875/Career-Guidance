const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Test route to verify profile routes are working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Profile routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    console.log('Profile GET request received for user:', req.user._id);
    let profile = await Profile.findOne({ userId: req.user._id })
      .populate('savedItems.colleges.collegeId')
      .populate('savedItems.courses.courseId');

    if (!profile) {
      // Create a new profile with default values
      profile = new Profile({
        userId: req.user._id,
        personalInfo: {},
        academicInfo: {},
        location: {},
        careerPreferences: {
          interests: [],
          workPreferences: {}
        },
        skills: {
          technical: [],
          soft: [],
          languages: []
        },
        assessmentResults: {
          quizResults: [],
          psychometricResults: []
        },
        savedItems: {
          colleges: [],
          courses: [],
          careers: []
        },
        profileStatus: {
          completionPercentage: 0,
          isVerified: false
        },
        preferences: {
          profileVisibility: 'private',
          emailNotifications: {
            careerUpdates: true,
            collegeUpdates: true,
            courseRecommendations: true,
            assessmentReminders: true
          },
          dataSharing: {
            allowAnalytics: true,
            allowRecommendations: true,
            allowResearch: false
          }
        }
      });
      await profile.save();
    }

    res.json({
      success: true,
      profile: profile,
      completionDetails: profile.completionDetails
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    console.log('Profile PUT request received for user:', req.user._id);
    console.log('Update data:', req.body);
    const updateData = req.body;
    
    let profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new Profile({
        userId: req.user._id,
        ...updateData
      });
    } else {
      // Update existing profile
      Object.keys(updateData).forEach(key => {
        if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key])) {
          // Deep merge for nested objects
          profile[key] = { ...profile[key], ...updateData[key] };
        } else {
          profile[key] = updateData[key];
        }
      });
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: profile,
      completionDetails: profile.completionDetails
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Update specific profile section
router.put('/section/:sectionName', auth, async (req, res) => {
  try {
    const { sectionName } = req.params;
    const updateData = req.body;

    const validSections = [
      'personalInfo', 
      'academicInfo', 
      'location', 
      'careerPreferences', 
      'skills', 
      'preferences'
    ];

    if (!validSections.includes(sectionName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    }

    let profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update the specific section
    profile[sectionName] = { ...profile[sectionName], ...updateData };
    await profile.save();

    res.json({
      success: true,
      message: `${sectionName} updated successfully`,
      profile: profile,
      completionDetails: profile.completionDetails
    });
  } catch (error) {
    console.error('Error updating profile section:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile section',
      error: error.message
    });
  }
});

// Save quiz results to profile
router.post('/quiz-results', auth, async (req, res) => {
  try {
    const { quizType, results } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Add quiz results to assessment results
    profile.assessmentResults.quizResults.push({
      quizType,
      results,
      completedAt: new Date()
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Quiz results saved successfully',
      profile: profile
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving quiz results',
      error: error.message
    });
  }
});

// Save psychometric test results to profile
router.post('/psychometric-results', auth, async (req, res) => {
  try {
    const { testType, personalityTraits, careerMatches } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Add psychometric results to assessment results
    profile.assessmentResults.psychometricResults.push({
      testType,
      personalityTraits,
      careerMatches,
      completedAt: new Date()
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Psychometric results saved successfully',
      profile: profile
    });
  } catch (error) {
    console.error('Error saving psychometric results:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving psychometric results',
      error: error.message
    });
  }
});

// Save college to profile
router.post('/save-college', auth, async (req, res) => {
  try {
    const { collegeId, notes, priority } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Check if college is already saved
    const existingCollege = profile.savedItems.colleges.find(
      college => college.collegeId.toString() === collegeId
    );

    if (existingCollege) {
      return res.status(400).json({
        success: false,
        message: 'College already saved'
      });
    }

    // Add college to saved items
    profile.savedItems.colleges.push({
      collegeId,
      notes: notes || '',
      priority: priority || 'medium',
      savedAt: new Date()
    });

    await profile.save();

    res.json({
      success: true,
      message: 'College saved successfully',
      profile: profile
    });
  } catch (error) {
    console.error('Error saving college:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving college',
      error: error.message
    });
  }
});

// Save course to profile
router.post('/save-course', auth, async (req, res) => {
  try {
    const { courseId, notes, interest_level } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Check if course is already saved
    const existingCourse = profile.savedItems.courses.find(
      course => course.courseId.toString() === courseId
    );

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course already saved'
      });
    }

    // Add course to saved items
    profile.savedItems.courses.push({
      courseId,
      notes: notes || '',
      interest_level: interest_level || 'medium',
      savedAt: new Date()
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Course saved successfully',
      profile: profile
    });
  } catch (error) {
    console.error('Error saving course:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving course',
      error: error.message
    });
  }
});

// Get profile completion status
router.get('/completion', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.json({
        success: true,
        completionDetails: {
          completed: 0,
          total: 10,
          percentage: 0
        }
      });
    }

    res.json({
      success: true,
      completionDetails: profile.completionDetails,
      profileStatus: profile.profileStatus
    });
  } catch (error) {
    console.error('Error fetching completion status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching completion status',
      error: error.message
    });
  }
});

// Get assessment history
router.get('/assessments', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.json({
        success: true,
        assessments: {
          quizResults: [],
          psychometricResults: []
        }
      });
    }

    res.json({
      success: true,
      assessments: profile.assessmentResults
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessments',
      error: error.message
    });
  }
});

module.exports = router;