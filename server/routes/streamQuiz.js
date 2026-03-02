const express = require('express');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const User = require('../models/User');

const router = express.Router();

// Get random quiz questions (5 from each stream) with no-repeat logic
router.get('/random', async (req, res) => {
  try {
    const { userId, excludeIds } = req.query; // userId for logged-in users, excludeIds for anonymous users
    const streams = ['science', 'commerce', 'arts', 'diploma'];
    const questionsPerStream = 5;
    const allQuestions = [];
    const maxQuizHistory = 90; // Track last 90 quizzes

    let excludeQuestionIds = [];

    // Handle logged-in users
    console.log('Received userId:', userId);
    if (userId) {
      try {
        const user = await User.findById(userId);
        console.log('Found user:', user ? 'Yes' : 'No');
        if (user && user.questionHistory) {
          console.log('User has question history:', user.questionHistory.length, 'entries');
          // Get questions used in last 90 quizzes
          const recentHistory = user.questionHistory
            .sort((a, b) => b.usedAt - a.usedAt)
            .slice(0, maxQuizHistory * 20); // 20 questions per quiz * 90 quizzes
          
          excludeQuestionIds = recentHistory.map(h => h.questionId);
          console.log('Excluding', excludeQuestionIds.length, 'previously used questions');
        } else {
          console.log('User has no question history');
        }
      } catch (userError) {
        console.log('User not found or error fetching history:', userError.message);
      }
    } 
    // Handle anonymous users with localStorage tracking
    else if (excludeIds) {
      try {
        console.log('Received excludeIds parameter:', excludeIds.substring(0, 100) + '...');
        const parsedIds = JSON.parse(decodeURIComponent(excludeIds));
        
        // Convert string IDs to ObjectIds for MongoDB query
        const mongoose = require('mongoose');
        excludeQuestionIds = parsedIds.map(id => {
          try {
            return new mongoose.Types.ObjectId(id);
          } catch (err) {
            console.log('Invalid ObjectId:', id);
            return null;
          }
        }).filter(id => id !== null);
        
        console.log('Anonymous user - excluding', excludeQuestionIds.length, 'previously used questions');
        console.log('Sample excluded IDs:', excludeQuestionIds.slice(0, 3));
      } catch (parseError) {
        console.log('Error parsing excludeIds:', parseError.message);
        console.log('Raw excludeIds that failed:', excludeIds);
        excludeQuestionIds = [];
      }
    } else {
      console.log('No userId or excludeIds provided, using random questions');
    }

    for (const stream of streams) {
      // Build match query to exclude recently used questions
      const matchQuery = { 
        stream: stream, 
        isActive: true 
      };
      
      if (excludeQuestionIds.length > 0) {
        matchQuery._id = { $nin: excludeQuestionIds };
      }

      console.log(`Processing ${stream} stream:`, {
        excludeCount: excludeQuestionIds.length,
        hasExclusions: excludeQuestionIds.length > 0
      });

      // Get available questions count
      const totalStreamQuestions = await Question.countDocuments({ stream: stream, isActive: true });
      const availableCount = await Question.countDocuments(matchQuery);
      
      console.log(`${stream}: Total=${totalStreamQuestions}, Available after exclusions=${availableCount}`);
      
      // If not enough unique questions available, include some recent ones
      let questionsToFetch = questionsPerStream;
      if (availableCount < questionsPerStream) {
        console.log(`Not enough unique ${stream} questions. Available: ${availableCount}, Needed: ${questionsPerStream}`);
        // Fallback to all available questions for this stream
        matchQuery._id = undefined;
        questionsToFetch = Math.min(questionsPerStream, totalStreamQuestions);
      }

      // Get random questions for each stream
      const questions = await Question.aggregate([
        { $match: matchQuery },
        { $sample: { size: questionsToFetch } },
        { $project: { 
          _id: 1,
          question: 1,
          options: { $map: {
            input: "$options",
            as: "option",
            in: {
              text: "$$option.text",
              value: { $toString: "$$option._id" },
              isCorrect: "$$option.isCorrect"
            }
          }},
          stream: 1,
          category: 1,
          difficulty: 1
        }}
      ]);

      console.log(`Selected ${questions.length} ${stream} questions:`, 
        questions.map(q => ({ id: q._id, question: q.question.substring(0, 50) + '...' }))
      );

      allQuestions.push(...questions);
    }

    // Shuffle all questions
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    console.log('Final response:', {
      totalQuestions: allQuestions.length,
      excludedCount: excludeQuestionIds.length,
      questionIds: allQuestions.map(q => q._id)
    });

    res.json({
      questions: allQuestions,
      totalQuestions: allQuestions.length,
      questionsPerStream: questionsPerStream,
      excludedCount: excludeQuestionIds.length,
      isUniqueSet: excludeQuestionIds.length > 0
    });
  } catch (error) {
    console.error('Get random quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get questions by specific stream
router.get('/stream/:streamName', async (req, res) => {
  try {
    const { streamName } = req.params;
    const { count = 10, difficulty } = req.query;

    const matchQuery = { 
      stream: streamName, 
      isActive: true 
    };

    if (difficulty) {
      matchQuery.difficulty = difficulty;
    }

    const questions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size: parseInt(count) } },
      { $project: { 
        _id: 1,
        question: 1,
        options: { $map: {
          input: "$options",
          as: "option",
          in: {
            text: "$$option.text",
            value: { $toString: "$$option._id" },
            isCorrect: "$$option.isCorrect"
          }
        }},
        stream: 1,
        category: 1,
        difficulty: 1
      }}
    ]);

    res.json({
      questions,
      stream: streamName,
      count: questions.length
    });
  } catch (error) {
    console.error('Get stream questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answers and calculate stream preference
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedOptionId }
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    const streamScores = {
      science: 0,
      commerce: 0,
      arts: 0,
      diploma: 0
    };

    let totalQuestions = 0;
    let correctAnswers = 0;

    // Calculate scores for each answer
    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      totalQuestions++;
      
      // Find the selected option
      const selectedOption = question.options.find(
        opt => opt._id.toString() === answer.selectedOptionId
      );

      if (selectedOption && selectedOption.isCorrect) {
        correctAnswers++;
        // Give points to the stream this question belongs to
        streamScores[question.stream] += 1;
      }
    }

    // Calculate percentages
    const streamPercentages = {};
    const totalScore = Object.values(streamScores).reduce((sum, score) => sum + score, 0);
    
    for (const [stream, score] of Object.entries(streamScores)) {
      streamPercentages[stream] = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
    }

    // Determine top recommendations
    const sortedStreams = Object.entries(streamPercentages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const recommendations = sortedStreams.map(([stream, percentage]) => ({
      stream,
      percentage,
      score: streamScores[stream]
    }));

    // Save quiz result to user and track question usage
    console.log('Saving quiz results for user:', req.user._id);
    const user = await User.findById(req.user._id);
    if (user) {
      user.quizResults = user.quizResults || [];
      user.questionHistory = user.questionHistory || [];
      
      // Get current quiz number
      const currentQuizNumber = user.quizResults.filter(r => r.quizType === 'stream_assessment').length + 1;
      console.log('Current quiz number:', currentQuizNumber);
      
      // Track which questions were used in this quiz
      const questionsUsed = answers.map(answer => answer.questionId);
      console.log('Questions used in this quiz:', questionsUsed);
      
      // Add to question history
      const newHistoryEntries = questionsUsed.map(questionId => ({
        questionId: questionId,
        usedAt: new Date(),
        quizNumber: currentQuizNumber
      }));
      
      console.log('Adding', newHistoryEntries.length, 'entries to question history');
      user.questionHistory.push(...newHistoryEntries);
      console.log('Total question history entries:', user.questionHistory.length);
      
      // Keep only last 90 quizzes worth of history (90 * 20 = 1800 entries max)
      if (user.questionHistory.length > 1800) {
        user.questionHistory = user.questionHistory
          .sort((a, b) => b.usedAt - a.usedAt)
          .slice(0, 1800);
        console.log('Trimmed question history to 1800 entries');
      }
      
      // Add quiz result
      user.quizResults.push({
        quizType: 'stream_assessment',
        score: Math.round((correctAnswers / totalQuestions) * 100),
        recommendations: recommendations.map(r => r.stream),
        questionsUsed: questionsUsed,
        detailedResults: {
          totalQuestions,
          correctAnswers,
          streamScores,
          streamPercentages
        },
        completedAt: new Date()
      });
      
      await user.save();
    }

    res.json({
      totalQuestions,
      correctAnswers,
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
      streamScores,
      streamPercentages,
      recommendations,
      message: 'Quiz submitted successfully'
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.quizResults) {
      return res.json({ quizzesTaken: 0, results: [] });
    }

    const streamQuizResults = user.quizResults.filter(
      result => result.quizType === 'stream_assessment'
    );

    res.json({
      quizzesTaken: streamQuizResults.length,
      results: streamQuizResults.map(result => ({
        score: result.score,
        recommendations: result.recommendations,
        completedAt: result.completedAt,
        detailedResults: result.detailedResults
      }))
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Simple test endpoint
router.get('/test', async (req, res) => {
  res.json({ message: 'Server is working', timestamp: new Date() });
});

// Test endpoint to verify exclusion logic
router.get('/test-exclusion', async (req, res) => {
  try {
    console.log('Test exclusion endpoint hit');
    const { excludeIds } = req.query;
    
    if (!excludeIds) {
      return res.json({ message: 'No excludeIds provided' });
    }

    const parsedIds = JSON.parse(decodeURIComponent(excludeIds));
    const mongoose = require('mongoose');
    const excludeQuestionIds = parsedIds.map(id => new mongoose.Types.ObjectId(id));
    
    const scienceWithExclusions = await Question.countDocuments({
      stream: 'science',
      isActive: true,
      _id: { $nin: excludeQuestionIds }
    });
    
    const scienceTotal = await Question.countDocuments({
      stream: 'science',
      isActive: true
    });

    const result = {
      excludeCount: excludeQuestionIds.length,
      scienceTotal,
      scienceAvailable: scienceWithExclusions,
      exclusionWorking: scienceWithExclusions < scienceTotal
    };
    
    console.log('Test exclusion result:', result);
    res.json(result);
  } catch (error) {
    console.error('Test exclusion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to check if auth is working
router.get('/test-auth', auth, async (req, res) => {
  try {
    res.json({
      message: 'Auth working',
      userId: req.user._id,
      userEmail: req.user.email,
      questionHistoryCount: req.user.questionHistory ? req.user.questionHistory.length : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

// Debug endpoint to check user's question history
router.get('/debug/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId: userId,
      totalQuizzes: user.quizResults ? user.quizResults.filter(r => r.quizType === 'stream_assessment').length : 0,
      questionHistoryCount: user.questionHistory ? user.questionHistory.length : 0,
      recentQuestions: user.questionHistory ? user.questionHistory.slice(-10) : [],
      lastQuizDate: user.quizResults && user.quizResults.length > 0 ? 
        user.quizResults[user.quizResults.length - 1].completedAt : null
    });
  } catch (error) {
    console.error('Debug history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available streams and question counts
router.get('/streams', async (req, res) => {
  try {
    const streamCounts = await Question.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: '$stream', 
        count: { $sum: 1 },
        categories: { $addToSet: '$category' },
        difficulties: { $addToSet: '$difficulty' }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      streams: streamCounts.map(item => ({
        name: item._id,
        questionCount: item.count,
        categories: item.categories,
        difficulties: item.difficulties
      }))
    });
  } catch (error) {
    console.error('Get streams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;