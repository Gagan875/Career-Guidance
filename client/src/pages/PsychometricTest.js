import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PsychometricTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please complete a career quiz first.</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => navigate('/quiz')} className="btn-primary">
              Stream Selection Quiz
            </button>
            <button onClick={() => navigate('/field-quiz')} className="btn-secondary">
              Field Selection Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Psychometric Assessment</h1>
            <div className="text-right">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="text-xs text-gray-500">
                Personality & Career Traits
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {options.map((option, index) => {
              const isSelected = selectedOption === option.value;
              const previouslyAnswered = answers[currentQuestion]?.value === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-300 ${isSelected
                    ? 'border-primary-600 bg-primary-100 shadow-md transform scale-[1.02]'
                    : previouslyAnswered
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                    } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 transition-colors ${isSelected
                      ? 'bg-primary-600 text-white'
                      : previouslyAnswered
                        ? 'bg-primary-400 text-white'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {option.value}
                    </span>
                    <span className={isSelected ? 'font-medium text-primary-800' : ''}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className={`btn-secondary ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous Question
          </button>

          <div className="text-sm text-gray-500">
            Personality Assessment • Career Matching
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychometricTest;