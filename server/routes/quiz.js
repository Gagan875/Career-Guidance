const express = require('express');
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

const router = express.Router();

// Get all active quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).select('-questions.options.points');
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.options.points');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate scores
    const scores = {
      science: 0,
      commerce: 0,
      arts: 0,
      diploma: 0
    };

    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const selectedOption = question.options.find(opt => opt.value === answer);
      
      if (selectedOption) {
        scores.science += selectedOption.points.science || 0;
        scores.commerce += selectedOption.points.commerce || 0;
        scores.arts += selectedOption.points.arts || 0;
        scores.diploma += selectedOption.points.diploma || 0;
      }
    });

    // Determine recommendations based on highest scores
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const recommendations = sortedScores.slice(0, 2).map(([stream]) => stream);

    // Save quiz result to user
    const user = await User.findById(req.user._id);
    user.quizResults.push({
      quizType: quiz.type,
      score: Math.max(...Object.values(scores)),
      recommendations
    });
    await user.save();

    res.json({
      scores,
      recommendations,
      message: 'Quiz submitted successfully'
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;