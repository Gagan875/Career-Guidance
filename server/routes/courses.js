const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// Get all courses with filters
router.get('/', async (req, res) => {
  try {
    const { stream, degree, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (stream) filter.stream = stream;
    if (degree) filter.degree = degree;

    const courses = await Course.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ popularity: -1 });

    const total = await Course.countDocuments(filter);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search courses by name
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const courses = await Course.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { code: new RegExp(query, 'i') }
      ]
    }).limit(20);

    res.json(courses);
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended courses based on stream
router.get('/recommendations/:stream', async (req, res) => {
  try {
    const { stream } = req.params;
    const courses = await Course.find({ stream })
      .sort({ popularity: -1 })
      .limit(10);

    res.json(courses);
  } catch (error) {
    console.error('Get course recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;