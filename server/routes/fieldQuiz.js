const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FieldQuestion = require('../models/FieldQuestion');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get random field questions (5 from each of 15 fields = 75 total)
router.get('/random', async (req, res) => {
  try {
    const { userId, excludeIds } = req.query;
    
    let excludedQuestionIds = [];
    
    if (userId) {
      // For logged-in users: get previously used questions from database
      const user = await User.findById(userId);
      if (user && user.usedFieldQuestions) {
        excludedQuestionIds = user.usedFieldQuestions;
      }
    } else if (excludeIds) {
      // For anonymous users: get excluded IDs from query parameter
      try {
        excludedQuestionIds = JSON.parse(decodeURIComponent(excludeIds));
      } catch (e) {
        console.log('Error parsing excludeIds:', e);
      }
    }

    const fields = [
      'engineering', 'medical', 'computer-science', 'data-science', 
      'management', 'law', 'design', 'architecture', 
      'agriculture', 'pharmacy', 'biotechnology', 'psychology', 
      'mass-communication', 'hospitality', 'aviation'
    ];

    let allQuestions = [];
    
    // Get 5 random questions from each field
    for (const field of fields) {
      let questions = [];
      
      // First try to get questions excluding used ones
      if (excludedQuestionIds.length > 0) {
        try {
          const matchQuery = {
            field: field,
            isActive: true,
            _id: { 
              $nin: excludedQuestionIds.map(id => new mongoose.Types.ObjectId(id)) 
            }
          };
          
          questions = await FieldQuestion.aggregate([
            { $match: matchQuery },
            { $sample: { size: 5 } }
          ]);
        } catch (err) {
          console.log('Error with exclusion, fetching without exclusion:', err);
        }
      }
      
      // If we didn't get 5 questions (not enough unused questions), get any 5 questions
      if (questions.length < 5) {
        console.log(`Field ${field}: Only got ${questions.length} unused questions, fetching more...`);
        const additionalNeeded = 5 - questions.length;
        
        const additionalQuestions = await FieldQuestion.aggregate([
          { 
            $match: { 
              field: field, 
              isActive: true,
              // Exclude questions we already selected
              _id: { $nin: questions.map(q => q._id) }
            } 
          },
          { $sample: { size: additionalNeeded } }
        ]);
        
        questions = questions.concat(additionalQuestions);
      }
      
      allQuestions = allQuestions.concat(questions);
    }

    // Shuffle all questions
    allQuestions = allQuestions.sort(() => Math.random() - 0.5);

    res.json({
      questions: allQuestions,
      totalQuestions: allQuestions.length,
      excludedCount: excludedQuestionIds.length,
      isUniqueSet: excludedQuestionIds.length > 0
    });
  } catch (error) {
    console.error('Error fetching field questions:', error);
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});

// Submit field quiz results
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers, results, completedAt, quizType } = req.body;
    const userId = req.user.id;

    // Save used question IDs to prevent repeats
    const questionIds = answers.map(answer => answer.questionId);
    
    await User.findByIdAndUpdate(userId, {
      $push: {
        usedFieldQuestions: { $each: questionIds },
        fieldQuizResults: {
          answers,
          results,
          completedAt,
          quizType: quizType || 'field-selection'
        }
      }
    });

    res.json({
      message: 'Field quiz results saved successfully',
      results
    });
  } catch (error) {
    console.error('Error saving field quiz results:', error);
    res.status(500).json({ message: 'Error saving results', error: error.message });
  }
});

// Get user's field quiz results
router.get('/results', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('fieldQuizResults');
    
    if (!user || !user.fieldQuizResults || user.fieldQuizResults.length === 0) {
      return res.json([]);
    }

    res.json(user.fieldQuizResults);
  } catch (error) {
    console.error('Error fetching field quiz results:', error);
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
});

module.exports = router;
