const express = require('express');
const College = require('../models/College');

const router = express.Router();

// Get all colleges with filters
router.get('/', async (req, res) => {
  try {
    const { state, district, city, type, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (district) filter['location.district'] = new RegExp(district, 'i');
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (type) filter.type = type;

    const colleges = await College.find(filter)
      .populate('courses', 'name code stream degree')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await College.countDocuments(filter);

    res.json({
      colleges,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get college by ID
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('courses')
      .populate('reviews.user', 'name');
    
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json(college);
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search colleges by name
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const colleges = await College.find({
      name: new RegExp(query, 'i')
    }).populate('courses', 'name code stream degree').limit(20);

    res.json(colleges);
  } catch (error) {
    console.error('Search colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;