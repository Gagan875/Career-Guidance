import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/animations.css';

const PsychometricTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes = 600 seconds
  const [timerActive, setTimerActive] = useState(true); // Start timer immediately
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get quiz results from previous page (either stream quiz or field quiz)
  const quizResults = location.state?.quizResults;
  const fieldQuizResults = location.state?.fieldQuizResults;

  // Psychometric test questions based on Big Five personality traits + career interests
  const questions = [
    // Openness to Experience
    {
      id: 1,
      question: "I enjoy exploring new ideas and concepts, even if they seem unconventional.",
      trait: "openness",
      scale: "agree"
    },
    {
      id: 2,
      question: "I prefer practical, proven methods over experimental approaches.",
      trait: "openness",
      scale: "disagree"
    },
    // Conscientiousness
    {
      id: 3,
      question: "I always complete my assignments on time and follow through on commitments.",
      trait: "conscientiousness",
      scale: "agree"
    },
    {
      id: 4,
      question: "I often procrastinate and struggle with time management.",
      trait: "conscientiousness",
      scale: "disagree"
    },
    // Extraversion
    {
      id: 5,
      question: "I feel energized when working in groups and collaborating with others.",
      trait: "extraversion",
      scale: "agree"
    },
    {
      id: 6,
      question: "I prefer working alone and find large groups draining.",
      trait: "extraversion",
      scale: "disagree"
    },
    // Analytical Thinking
    {
      id: 7,
      question: "I enjoy solving complex mathematical or logical problems.",
      trait: "analytical",
      scale: "agree"
    },
    {
      id: 8,
      question: "I prefer creative tasks over analytical problem-solving.",
      trait: "analytical",
      scale: "disagree"
    },
    // Leadership
    {
      id: 9,
      question: "I naturally take charge in group situations and enjoy leading others.",
      trait: "leadership",
      scale: "agree"
    },
    {
      id: 10,
      question: "I prefer to follow others' lead rather than take responsibility for decisions.",
      trait: "leadership",
      scale: "disagree"
    },
    // Creativity
    {
      id: 11,
      question: "I often come up with original ideas and enjoy artistic expression.",
      trait: "creativity",
      scale: "agree"
    },
    {
      id: 12,
      question: "I prefer structured tasks with clear guidelines over open-ended creative work.",
      trait: "creativity",
      scale: "disagree"
    },
    // Social Interest
    {
      id: 13,
      question: "I am passionate about helping others and making a positive social impact.",
      trait: "social",
      scale: "agree"
    },
    {
      id: 14,
      question: "I am more interested in technical achievements than helping people.",
      trait: "social",
      scale: "disagree"
    },
    // Risk Tolerance
    {
      id: 15,
      question: "I am comfortable taking calculated risks for potential rewards.",
      trait: "risk_tolerance",
      scale: "agree"
    },
    {
      id: 16,
      question: "I prefer safe, predictable choices over uncertain opportunities.",
      trait: "risk_tolerance",
      scale: "disagree"
    },
    // Detail Orientation
    {
      id: 17,
      question: "I pay close attention to details and rarely make careless mistakes.",
      trait: "detail_oriented",
      scale: "agree"
    },
    {
      id: 18,
      question: "I focus on the big picture and sometimes overlook small details.",
      trait: "detail_oriented",
      scale: "disagree"
    },
    // Communication
    {
      id: 19,
      question: "I excel at explaining complex ideas clearly to others.",
      trait: "communication",
      scale: "agree"
    },
    {
      id: 20,
      question: "I find it challenging to express my thoughts verbally or in writing.",
      trait: "communication",
      scale: "disagree"
    }
  ];

  const options = [
    { value: 1, text: "Strongly Disagree" },
    { value: 2, text: "Disagree" },
    { value: 3, text: "Neutral" },
    { value: 4, text: "Agree" },
    { value: 5, text: "Strongly Agree" }
  ];

  // Timer effect - starts immediately when component loads
  React.useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-submit when time runs out
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timerActive, timeRemaining]);

  const handleTimeUp = () => {
    console.log('Time is up! Auto-submitting psychometric test...');
    setTimerActive(false);
    
    // Submit with current answers (even if incomplete)
    if (answers.length > 0) {
      calculateResults(answers);
    } else {
      // If no answers at all, redirect back
      alert('Time is up! Please try again.');
      navigate(-1);
    }
  };

  const handleAnswerSelect = (value) => {
    setSelectedOption(value);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion].id,
      trait: questions[currentQuestion].trait,
      scale: questions[currentQuestion].scale,
      value: value
    };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null); // Reset selection for next question
      } else {
        calculateResults(newAnswers);
      }
    }, 500);
  };

  const calculateResults = (finalAnswers) => {
    setTimerActive(false); // Stop the timer when submitting
    
    // Calculate trait scores
    const traitScores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      analytical: 0,
      leadership: 0,
      creativity: 0,
      social: 0,
      risk_tolerance: 0,
      detail_oriented: 0,
      communication: 0
    };

    // Calculate raw scores
    finalAnswers.forEach(answer => {
      let score = answer.value;
      // Reverse score for "disagree" scale questions
      if (answer.scale === "disagree") {
        score = 6 - score;
      }
      traitScores[answer.trait] += score;
    });

    // Enhanced scoring system to prevent ties and provide more differentiation
    const enhancedScores = {};

    // Convert to percentages with micro-adjustments based on answer patterns
    Object.keys(traitScores).forEach((trait, index) => {
      let baseScore = (traitScores[trait] / 10) * 100;

      // Add micro-variations based on specific answer patterns to prevent ties
      const traitAnswers = finalAnswers.filter(answer => answer.trait === trait);
      let microAdjustment = 0;

      // Factor 1: Response consistency (how decisive the answers were)
      const avgResponse = traitAnswers.reduce((sum, ans) => sum + ans.value, 0) / traitAnswers.length;
      const consistency = Math.abs(avgResponse - 3); // Distance from neutral (3)
      microAdjustment += consistency * 0.8; // Up to 1.6 points for very decisive answers

      // Factor 2: Response pattern (extreme vs moderate responses)
      const hasExtremeResponse = traitAnswers.some(ans => ans.value === 1 || ans.value === 5);
      if (hasExtremeResponse) {
        microAdjustment += 1.2;
      }

      // Factor 3: Trait-specific weighting to ensure natural differentiation
      const traitWeights = {
        openness: 0.3,
        conscientiousness: 0.6,
        extraversion: 0.9,
        analytical: 1.2,
        leadership: 1.5,
        creativity: 1.8,
        social: 2.1,
        risk_tolerance: 2.4,
        detail_oriented: 2.7,
        communication: 3.0
      };
      microAdjustment += traitWeights[trait];

      // Factor 4: Question order influence (slight variation based on position)
      microAdjustment += index * 0.1;

      // Apply the micro-adjustment
      let finalScore = baseScore + microAdjustment;

      // Ensure score stays within reasonable bounds (10-100)
      finalScore = Math.max(10, Math.min(100, finalScore));

      // Round to 1 decimal place for precision, then convert to integer for display
      enhancedScores[trait] = Math.round(finalScore);
    });

    // Final tie-breaking: If any scores are still identical, add small increments
    const scoreValues = Object.values(enhancedScores);
    const duplicates = scoreValues.filter((score, index) => scoreValues.indexOf(score) !== index);

    if (duplicates.length > 0) {
      let adjustment = 1;
      Object.keys(enhancedScores).forEach(trait => {
        const currentScore = enhancedScores[trait];
        const duplicateCount = scoreValues.filter(s => s === currentScore).length;

        if (duplicateCount > 1) {
          enhancedScores[trait] = Math.min(100, currentScore + adjustment);
          adjustment += 1;
        }
      });
    }

    // Navigate to combined results page
    navigate('/career-results', {
      state: {
        quizResults,
        fieldQuizResults,
        psychometricResults: {
          personalityTraits: enhancedScores,
          answers: finalAnswers,
          rawScores: traitScores // Keep original scores for reference
        }
      }
    });
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null); // Reset selection when going back
    }
  };

  if (!quizResults && !fieldQuizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass dark:glass-dark rounded-2xl p-8 text-center animate-fadeIn shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Access Denied</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Please complete a career quiz first to access the psychometric assessment.</p>
            <div className="flex justify-center space-x-4 flex-wrap gap-4">
              <button 
                onClick={() => navigate('/quiz')} 
                className="btn-animate px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Stream Selection Quiz
              </button>
              <button 
                onClick={() => navigate('/field-quiz')} 
                className="btn-animate px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Field Selection Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 300) return 'text-green-600 dark:text-green-400'; // > 5 min
    if (timeRemaining > 120) return 'text-yellow-600 dark:text-yellow-400'; // > 2 min
    return 'text-red-600 dark:text-red-400'; // < 2 min
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass dark:glass-dark rounded-2xl p-8 shadow-2xl animate-fadeIn">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Psychometric Assessment</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">Discover your personality traits and career preferences</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold mb-2 ${getTimerColor()} animate-pulse-custom`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Personality & Career Traits
                </div>
              </div>
            </div>

            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </div>
          </div>

          <div className="mb-10">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-4">
              {options.map((option, index) => {
                const isSelected = selectedOption === option.value;
                const previouslyAnswered = answers[currentQuestion]?.value === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerSelect(option.value)}
                    disabled={selectedOption !== null}
                    className={`w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 hover-lift ${
                      isSelected
                        ? 'border-indigo-600 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 shadow-xl transform scale-[1.02] animate-glow'
                        : previouslyAnswered
                        ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-800 dark:to-purple-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900 dark:hover:to-purple-900'
                    } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center">
                      <span className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-4 transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : previouslyAnswered
                          ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {option.value}
                      </span>
                      <span className={`text-lg ${
                        isSelected 
                          ? 'font-semibold text-indigo-800 dark:text-indigo-200' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
              className={`btn-animate px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Question
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Personality Assessment
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Career Matching Algorithm
              </div>
            </div>

            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychometricTest;