const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recommendationService = require('../services/recommendationService');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  console.log('🧪 Recommendations test endpoint hit');
  res.json({ 
    message: 'Recommendations routes are working!', 
    timestamp: new Date(),
    endpoints: ['/degrees', '/colleges', '/comprehensive', '/preferences']
  });
});

// Test comprehensive endpoint without auth for debugging
router.post('/comprehensive-test', async (req, res) => {
  console.log('🧪 Comprehensive test endpoint hit (no auth)');
  console.log('📋 Request body:', req.body);
  
  try {
    const { psychometricResults } = req.body;

    if (!psychometricResults) {
      console.log('❌ Missing psychometric results');
      return res.status(400).json({ 
        message: 'Psychometric test results are required for comprehensive recommendations' 
      });
    }

    console.log('✅ Test endpoint working - would process recommendations here');
    
    // Return a simple test response
    res.json({
      success: true,
      message: 'Test endpoint working! Authentication and data flow are correct.',
      receivedData: {
        hasPsychometricResults: !!psychometricResults,
        timestamp: new Date()
      }
    });
    
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({ 
      message: 'Test endpoint error',
      error: error.message 
    });
  }
});

// Get ML-based degree recommendations
router.post('/degrees', auth, async (req, res) => {
  try {
    const { streamPercentages, fieldPercentages, psychometricResults, academicData } = req.body;
    
    // Validate required data
    if (!psychometricResults) {
      return res.status(400).json({ 
        message: 'Psychometric test results are required for degree recommendations' 
      });
    }

    const studentProfile = {
      streamPercentages,
      fieldPercentages,
      psychometricResults,
      academicData
    };

    const recommendations = recommendationService.generateDegreeRecommendations(studentProfile);

    res.json({
      success: true,
      recommendations,
      totalRecommendations: recommendations.length,
      message: 'Degree recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error generating degree recommendations:', error);
    res.status(500).json({ 
      message: 'Error generating degree recommendations',
      error: error.message 
    });
  }
});

// Get location-based college recommendations
router.post('/colleges', auth, async (req, res) => {
  try {
    const { 
      location, 
      preferredDegrees, 
      maxDistance = 500,
      collegeType = 'all', // 'government', 'private', 'all'
      budget = null 
    } = req.body;

    if (!preferredDegrees || preferredDegrees.length === 0) {
      return res.status(400).json({ 
        message: 'Preferred degrees are required for college recommendations' 
      });
    }

    // Get location-based colleges
    let colleges = await recommendationService.getLocationBasedColleges(
      location, 
      preferredDegrees, 
      maxDistance
    );

    // Filter by college type if specified
    if (collegeType !== 'all') {
      colleges = colleges.filter(college => 
        college.type.toLowerCase() === collegeType.toLowerCase()
      );
    }

    // Filter by budget if specified
    if (budget) {
      colleges = colleges.filter(college => 
        !college.fees || college.fees <= budget
      );
    }

    // Add recommendation scores
    const rankedColleges = colleges.map((college, index) => ({
      ...college,
      recommendationScore: calculateCollegeScore(college, preferredDegrees, location),
      rank: index + 1
    }));

    res.json({
      success: true,
      colleges: rankedColleges,
      totalColleges: rankedColleges.length,
      searchCriteria: {
        location: location ? 'Location-based' : 'All India',
        maxDistance: location ? `${maxDistance} km` : 'N/A',
        collegeType,
        preferredDegrees
      },
      message: 'College recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error generating college recommendations:', error);
    res.status(500).json({ 
      message: 'Error generating college recommendations',
      error: error.message 
    });
  }
});

// Get comprehensive career recommendations (combines degrees + colleges + careers)
router.post('/comprehensive', auth, async (req, res) => {
  console.log('🎯 Comprehensive recommendations endpoint hit');
  console.log('📋 Request body:', req.body);
  
  try {
    const { 
      streamPercentages, 
      fieldPercentages, 
      psychometricResults, 
      academicData,
      location,
      preferences = {}
    } = req.body;

    if (!psychometricResults) {
      console.log('❌ Missing psychometric results');
      return res.status(400).json({ 
        message: 'Psychometric test results are required for comprehensive recommendations' 
      });
    }

    console.log('✅ Processing comprehensive recommendations...');

    const studentProfile = {
      streamPercentages,
      fieldPercentages,
      psychometricResults,
      academicData
    };

    // Step 1: Get degree recommendations
    const degreeRecommendations = recommendationService.generateDegreeRecommendations(studentProfile);
    
    // Step 2: Get top 3 recommended degrees for college search
    const topDegrees = degreeRecommendations.slice(0, 3).map(rec => rec.degree);
    console.log('🎓 Top degrees for college search:', topDegrees);
    
    // Step 3: Get college recommendations based on top degrees
    const collegeRecommendations = await recommendationService.getLocationBasedColleges(
      location, 
      topDegrees, 
      preferences.maxDistance || 500
    );
    
    console.log('🏛️ Found colleges:', collegeRecommendations.length);

    // Step 4: Generate career pathway mapping
    const careerPathways = generateCareerPathways(degreeRecommendations, psychometricResults);

    // Step 5: Create comprehensive recommendation report
    const comprehensiveReport = {
      studentProfile: {
        dominantTraits: getDominantTraits(psychometricResults.personalityTraits),
        academicStrength: getAcademicStrength(streamPercentages, fieldPercentages),
        recommendationBasis: getRecommendationBasis(streamPercentages, fieldPercentages)
      },
      degreeRecommendations: degreeRecommendations.slice(0, 5),
      collegeRecommendations: collegeRecommendations.slice(0, 10),
      careerPathways: careerPathways.slice(0, 8),
      nextSteps: generateNextSteps(degreeRecommendations[0], collegeRecommendations[0])
    };

    res.json({
      success: true,
      report: comprehensiveReport,
      generatedAt: new Date(),
      message: 'Comprehensive career recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error generating comprehensive recommendations:', error);
    res.status(500).json({ 
      message: 'Error generating comprehensive recommendations',
      error: error.message 
    });
  }
});

// Save user's recommendation preferences
router.post('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      preferredDegrees, 
      preferredLocations, 
      budgetRange, 
      collegeType,
      careerInterests 
    } = req.body;

    // Update user profile with preferences
    await Profile.findOneAndUpdate(
      { userId },
      {
        $set: {
          'preferences.degrees': preferredDegrees,
          'preferences.locations': preferredLocations,
          'preferences.budget': budgetRange,
          'preferences.collegeType': collegeType,
          'preferences.careerInterests': careerInterests,
          'preferences.updatedAt': new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Recommendation preferences saved successfully'
    });

  } catch (error) {
    console.error('Error saving recommendation preferences:', error);
    res.status(500).json({ 
      message: 'Error saving preferences',
      error: error.message 
    });
  }
});

// Helper methods
function calculateCollegeScore(college, preferredDegrees, location) {
  let score = 0;
  
  // Course availability score (40%)
  const availableCourses = college.courses.filter(course => 
    preferredDegrees.some(degree => course.includes(degree))
  );
  score += (availableCourses.length / preferredDegrees.length) * 40;
  
  // Ranking score (30%)
  if (college.ranking) {
    score += Math.max(0, (100 - college.ranking) / 100) * 30;
  }
  
  // Location score (20%)
  if (location && college.distance) {
    score += Math.max(0, (500 - college.distance) / 500) * 20;
  } else {
    score += 10; // Default score if no location data
  }
  
  // Facilities score (10%)
  const facilities = college.facilities || [];
  score += Math.min(facilities.length / 10, 1) * 10;
  
  return Math.round(score);
}

function generateCareerPathways(degreeRecommendations, psychometricResults) {
  const pathways = [];
  const traits = psychometricResults.personalityTraits;
  
  degreeRecommendations.slice(0, 3).forEach(degree => {
    const careers = degree.careerOutcomes || [];
    
    careers.forEach(career => {
      pathways.push({
        career,
        degree: degree.degree,
        pathway: `${degree.degree} → ${career}`,
        matchScore: degree.match,
        timeToCareer: getTimeToCareer(degree.duration),
        salaryRange: degree.avgSalary,
        growth: degree.growth,
        personalityFit: getPersonalityFit(career, traits)
      });
    });
  });
  
  return pathways.sort((a, b) => b.matchScore - a.matchScore);
}

function getDominantTraits(traits) {
  return Object.entries(traits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trait, score]) => ({
      trait: trait.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: Math.round(score)
    }));
}

function getAcademicStrength(streamPercentages, fieldPercentages) {
  if (streamPercentages) {
    const topStream = Object.entries(streamPercentages)
      .sort((a, b) => b[1] - a[1])[0];
    return {
      type: 'Stream',
      strength: topStream[0].charAt(0).toUpperCase() + topStream[0].slice(1),
      score: Math.round(topStream[1])
    };
  }
  
  if (fieldPercentages) {
    const topField = Object.entries(fieldPercentages)
      .sort((a, b) => b[1] - a[1])[0];
    return {
      type: 'Field',
      strength: topField[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: Math.round(topField[1])
    };
  }
  
  return { type: 'General', strength: 'Balanced Profile', score: 75 };
}

function getRecommendationBasis(streamPercentages, fieldPercentages) {
  if (streamPercentages && fieldPercentages) {
    return 'Hybrid Analysis (Stream + Field + Personality)';
  } else if (streamPercentages) {
    return 'Stream-based Analysis + Personality Assessment';
  } else if (fieldPercentages) {
    return 'Field-based Analysis + Personality Assessment';
  }
  return 'Personality-based Analysis';
}

function generateNextSteps(topDegree, topCollege) {
  const steps = [
    {
      step: 1,
      action: `Research ${topDegree?.degree || 'recommended degree'} programs`,
      timeline: 'Next 2 weeks',
      priority: 'High'
    },
    {
      step: 2,
      action: 'Prepare for entrance exams',
      timeline: 'Next 3-6 months',
      priority: 'High'
    },
    {
      step: 3,
      action: `Visit ${topCollege?.name || 'shortlisted colleges'}`,
      timeline: 'Next 1-2 months',
      priority: 'Medium'
    },
    {
      step: 4,
      action: 'Apply for scholarships',
      timeline: 'Next 2-4 months',
      priority: 'Medium'
    }
  ];
  
  return steps;
}

function getTimeToCareer(duration) {
  const years = parseInt(duration);
  return `${years} years (after graduation)`;
}

function getPersonalityFit(career, traits) {
  // Simple personality-career fit calculation
  const careerTraitMap = {
    'Software Engineer': ['analytical', 'detail_oriented'],
    'Doctor': ['social', 'conscientiousness'],
    'Business Manager': ['leadership', 'extraversion'],
    'Teacher': ['social', 'communication'],
    'Designer': ['creativity', 'openness']
  };
  
  const relevantTraits = careerTraitMap[career] || ['conscientiousness'];
  const avgScore = relevantTraits.reduce((sum, trait) => 
    sum + (traits[trait] || 50), 0) / relevantTraits.length;
  
  return Math.round(avgScore);
}

module.exports = router;