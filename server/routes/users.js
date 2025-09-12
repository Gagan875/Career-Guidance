const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedColleges')
      .populate('savedCourses')
      .select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profile: { ...req.user.profile, ...updates } } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save college
router.post('/save-college/:collegeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.savedColleges.includes(req.params.collegeId)) {
      user.savedColleges.push(req.params.collegeId);
      await user.save();
    }

    res.json({ message: 'College saved successfully' });
  } catch (error) {
    console.error('Save college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save course
router.post('/save-course/:courseId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.savedCourses.includes(req.params.courseId)) {
      user.savedCourses.push(req.params.courseId);
      await user.save();
    }

    res.json({ message: 'Course saved successfully' });
  } catch (error) {
    console.error('Save course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;