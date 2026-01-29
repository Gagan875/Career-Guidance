const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');

const router = express.Router();

// Get user basic info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Legacy profile routes - redirect to new profile API
router.get('/profile', auth, async (req, res) => {
  try {
    // Redirect to new profile API
    res.status(301).json({
      success: false,
      message: 'This endpoint has been moved. Please use /api/profile instead.',
      redirectTo: '/api/profile'
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Legacy profile update - redirect to new profile API
router.put('/profile', auth, async (req, res) => {
  try {
    // For backward compatibility, we'll still handle basic profile updates
    // but recommend using the new profile API
    const Profile = require('../models/Profile');
    
    let profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      profile = new Profile({
        userId: req.user.id,
        personalInfo: {
          age: req.body.age,
          gender: req.body.gender
        },
        academicInfo: {
          currentClass: req.body.class,
          stream: req.body.academicBackground?.stream,
          currentPercentage: req.body.academicBackground?.percentage
        },
        location: {
          state: req.body.location?.state,
          district: req.body.location?.district,
          city: req.body.location?.city
        },
        careerPreferences: {
          interests: req.body.interests?.map(interest => ({
            category: 'general',
            name: interest,
            level: 'medium'
          })) || []
        }
      });
    } else {
      // Update existing profile with legacy format
      if (req.body.age) profile.personalInfo.age = req.body.age;
      if (req.body.gender) profile.personalInfo.gender = req.body.gender;
      if (req.body.class) profile.academicInfo.currentClass = req.body.class;
      if (req.body.location) {
        profile.location = { ...profile.location, ...req.body.location };
      }
      if (req.body.interests) {
        profile.careerPreferences.interests = req.body.interests.map(interest => ({
          category: 'general',
          name: interest,
          level: 'medium'
        }));
      }
      if (req.body.academicBackground) {
        profile.academicInfo.stream = req.body.academicBackground.stream;
        profile.academicInfo.currentPercentage = req.body.academicBackground.percentage;
        if (req.body.academicBackground.subjects) {
          profile.academicInfo.subjects = req.body.academicBackground.subjects.map(subject => ({
            name: subject,
            grade: '',
            marks: 0,
            maxMarks: 100
          }));
        }
      }
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully. Consider using /api/profile for full features.',
      profile: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get user's saved items summary
router.get('/saved-items', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id })
      .populate('savedItems.colleges.collegeId')
      .populate('savedItems.courses.courseId');

    if (!profile) {
      return res.json({
        success: true,
        savedItems: {
          colleges: [],
          courses: [],
          careers: []
        }
      });
    }

    res.json({
      success: true,
      savedItems: profile.savedItems
    });
  } catch (error) {
    console.error('Get saved items error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Save a college
router.post('/save-college', auth, async (req, res) => {
  try {
    console.log('Save college request received');
    console.log('User ID:', req.user.id);
    console.log('Request body:', req.body);
    
    const { collegeId, notes, priority } = req.body;

    if (!collegeId) {
      console.log('Missing college ID');
      return res.status(400).json({
        success: false,
        message: 'College ID is required'
      });
    }

    // Check if college exists
    const College = require('../models/College');
    const college = await College.findById(collegeId);
    if (!college) {
      console.log('College not found:', collegeId);
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    console.log('College found:', college.name);

    // Find or create profile
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      console.log('Creating new profile for user');
      profile = new Profile({
        userId: req.user.id,
        location: { state: '', city: '' }, // Required fields
        savedItems: { colleges: [], courses: [], careers: [] }
      });
    }

    // Check if college is already saved
    const existingCollege = profile.savedItems.colleges.find(
      item => item.collegeId.toString() === collegeId
    );

    if (existingCollege) {
      console.log('College already saved');
      return res.status(400).json({
        success: false,
        message: 'College is already saved'
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
    console.log('College saved successfully');

    res.json({
      success: true,
      message: 'College saved successfully',
      savedCollege: {
        collegeId,
        collegeName: college.name,
        notes: notes || '',
        priority: priority || 'medium'
      }
    });
  } catch (error) {
    console.error('Save college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Remove a saved college
router.delete('/save-college/:collegeId', auth, async (req, res) => {
  try {
    const { collegeId } = req.params;

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Remove college from saved items
    profile.savedItems.colleges = profile.savedItems.colleges.filter(
      item => item.collegeId.toString() !== collegeId
    );

    await profile.save();

    res.json({
      success: true,
      message: 'College removed from saved items'
    });
  } catch (error) {
    console.error('Remove saved college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;