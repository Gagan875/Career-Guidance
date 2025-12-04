import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FieldQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Fetch random questions from database (5 from each of 15 fields = 75 total)
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      let url = 'http://localhost:5000/api/field-quiz/random';

      if (user && user._id) {
        url += `?userId=${user._id}`;
        console.log('Fetching field questions for logged-in user:', user._id);
      } else {
        const usedQuestions = JSON.parse(localStorage.getItem('usedFieldQuestions') || '[]');
        console.log('Parsed usedFieldQuestions:', usedQuestions);

        if (usedQuestions.length > 0) {
          const recentQuestions = usedQuestions.slice(-5400); // Keep last 72 quizzes * 75 questions
          localStorage.setItem('usedFieldQuestions', JSON.stringify(recentQuestions));

          const excludeParam = encodeURIComponent(JSON.stringify(recentQuestions));
          url += `?excludeIds=${excludeParam}`;
          console.log('Fetching field questions for anonymous user, excluding', recentQuestions.length, 'previously used questions');
        } else {
          console.log('Fetching field questions for new anonymous user');
        }
      }

      console.log('Fetching from URL:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch field questions');
      }

      const data = await response.json();
      setQuestions(data.questions);

      console.log('Field quiz data received:', {
        totalQuestions: data.totalQuestions,
        excludedCount: data.excludedCount,
        isUniqueSet: data.isUniqueSet
      });

      if (data.excludedCount > 0) {
        console.log(`Loaded ${data.totalQuestions} field questions (${data.excludedCount} previously used questions excluded)`);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching field questions:', error);
      setError('Failed to load quiz questions. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionValue) => {
    setSelectedOption(optionValue);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion]._id,
      selectedOptionId: optionValue
    };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        submitQuiz(newAnswers);
      }
    }, 500);
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      console.log('Submitting field quiz with answers:', finalAnswers);
      console.log('User token available:', !!token);

      const localResults = calculateResults(finalAnswers);

      // Save to server if user is logged in
      if (token) {
        console.log('Submitting to server for permanent storage...');
        
        const submissionData = {
          answers: finalAnswers,
          results: localResults,
          completedAt: new Date().toISOString(),
          quizType: 'field-selection'
        };

        try {
          const response = await fetch('http://localhost:5000/api/field-quiz/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(submissionData)
          });

          if (response.ok) {
            const serverResponse = await response.json();
            console.log('Field quiz results saved to server:', serverResponse);
            localResults.savedToServer = true;
            localResults.saveMessage = "Results saved to your account!";
          }
        } catch (err) {
          console.warn('Server submission failed, continuing anyway:', err);
        }
      }

      // Show completion screen with button to take psychometric test
      setResults(localResults);
      setShowResults(true);
      
    } catch (error) {
      console.error('Error submitting field quiz:', error);
      const localResults = calculateResults(finalAnswers);
      setResults(localResults);
      setShowResults(true);
    }
  };

  const calculateResults = (finalAnswers) => {
    console.log('=== calculateResults called ===');
    console.log('finalAnswers:', finalAnswers);
    console.log('questions available:', questions.length);

    // Save question IDs to localStorage for anonymous users
    if (!user) {
      const questionIds = finalAnswers.map(answer => answer.questionId);
      console.log('Saving question IDs for anonymous user:', questionIds);

      const usedQuestions = JSON.parse(localStorage.getItem('usedFieldQuestions') || '[]');
      console.log('Current localStorage before save:', usedQuestions.length, 'questions');

      usedQuestions.push(...questionIds);
      const recentQuestions = usedQuestions.slice(-5400);
      localStorage.setItem('usedFieldQuestions', JSON.stringify(recentQuestions));

      console.log('Saved', questionIds.length, 'question IDs to localStorage. Total saved:', recentQuestions.length);
    }

    // Track correct answers per field (out of 5 questions each)
    const fieldCorrectAnswers = {
      engineering: 0,
      medical: 0,
      'computer-science': 0,
      'data-science': 0,
      management: 0,
      law: 0,
      design: 0,
      architecture: 0,
      agriculture: 0,
      pharmacy: 0,
      biotechnology: 0,
      psychology: 0,
      'mass-communication': 0,
      hospitality: 0,
      aviation: 0
    };

    let totalCorrectAnswers = 0;

    finalAnswers.forEach((answer, index) => {
      console.log(`Processing answer ${index + 1}:`, answer);
      const question = questions.find(q => q._id === answer.questionId);

      if (question) {
        console.log(`Found question for ${question.field}:`, question.question.substring(0, 50) + '...');

        const selectedOption = question.options.find(opt => opt.value === answer.selectedOptionId);

        if (selectedOption) {
          console.log(`Selected option: "${selectedOption.text}" - Correct: ${selectedOption.isCorrect}`);

          if (selectedOption.isCorrect) {
            fieldCorrectAnswers[question.field] += 1;
            totalCorrectAnswers += 1;
            console.log(`Correct answer in ${question.field} (${fieldCorrectAnswers[question.field]}/5)`);
          } else {
            console.log(`Incorrect answer in ${question.field}`);
          }
        } else {
          console.log('No matching option found for:', answer.selectedOptionId);
        }
      } else {
        console.log('No matching question found for ID:', answer.questionId);
      }
    });

    // Calculate percentage of correct answers per field (out of 5 questions each)
    const fieldPercentages = {};
    
    console.log('Field correct answers:', fieldCorrectAnswers);
    console.log('Total correct answers:', totalCorrectAnswers, 'out of', finalAnswers.length);

    for (const [field, correctCount] of Object.entries(fieldCorrectAnswers)) {
      fieldPercentages[field] = Math.round((correctCount / 5) * 100);
      console.log(`${field}: ${correctCount}/5 = ${fieldPercentages[field]}%`);
    }

    console.log('Field percentages:', fieldPercentages);

    const sortedFields = Object.entries(fieldPercentages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 recommendations

    const recommendations = sortedFields.map(([field, percentage]) => ({
      field,
      percentage,
      correctCount: fieldCorrectAnswers[field],
      totalQuestions: 5
    }));

    return {
      totalQuestions: questions.length,
      correctAnswers: totalCorrectAnswers,
      accuracy: Math.round((totalCorrectAnswers / questions.length) * 100),
      fieldCorrectAnswers,
      fieldPercentages,
      recommendations,
      userId: user?._id,
      completedAt: new Date().toISOString()
    };
  };



  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const getFieldDisplayName = (field) => {
    const fieldNames = {
      'engineering': 'Engineering',
      'medical': 'Medical',
      'computer-science': 'Computer Science',
      'data-science': 'Data Science',
      'management': 'Management',
      'law': 'Law',
      'design': 'Design',
      'architecture': 'Architecture',
      'agriculture': 'Agriculture',
      'pharmacy': 'Pharmacy',
      'biotechnology': 'Biotechnology',
      'psychology': 'Psychology',
      'mass-communication': 'Mass Communication',
      'hospitality': 'Hospitality',
      'aviation': 'Aviation'
    };
    return fieldNames[field] || field;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your field selection quiz...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Selecting 5 questions from each of 15 fields</p>
          <p className="text-xs text-green-600 mt-2">✓ No question repeats for 72 quizzes</p>
          {user ? (
            <p className="text-xs text-blue-500 mt-1">Logged in - Progress saved to account</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Anonymous - Progress saved locally</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Quiz Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={fetchQuestions} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Quiz Completed!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Great job! You've completed the field selection quiz.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              To get your personalized career recommendations, please take our psychometric test.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What's Next?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our psychometric assessment will analyze your personality traits, work preferences, 
              and combine them with your quiz results to provide accurate career recommendations.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center mr-4">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                20 Questions
              </span>
              <span className="flex items-center mr-4">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                5-7 Minutes
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Personalized Results
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <button 
              onClick={() => navigate('/psychometric-test', { state: { fieldQuizResults: results } })}
              className="btn-primary text-lg px-8 py-3"
            >
              Take Psychometric Test
            </button>
            <button onClick={() => navigate('/field-quiz')} className="btn-secondary">
              Retake Quiz
            </button>
            {user && (
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn-secondary"
              >
                View Quiz History
              </button>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {user ? (
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-600 dark:text-green-400">
                  {results?.saveMessage || "Your quiz results are permanently saved to your account"}
                </p>
              </div>
            ) : (
              <p>Your quiz results are saved locally. Sign up to save permanently!</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <p className="text-gray-600 dark:text-gray-400">No questions available. Please try again later.</p>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Field Selection Quiz</h1>
            <div className="text-right">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                {getFieldDisplayName(currentQ.field)} • {currentQ.difficulty} • {currentQ.category}
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedOption === option.value;
              const previouslyAnswered = answers[currentQuestion]?.selectedOptionId === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? 'border-primary-600 bg-primary-100 dark:bg-primary-900 shadow-md transform scale-[1.02]'
                      : previouslyAnswered
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900'
                  } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : previouslyAnswered
                        ? 'bg-primary-400 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={`${isSelected ? 'font-medium text-primary-800 dark:text-primary-200' : 'text-gray-900 dark:text-gray-100'}`}>
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

          <div className="text-sm text-gray-500 dark:text-gray-400">
            5 questions per field • 15 fields
            <span className="text-green-600 ml-2">• No repeats (72 quizzes)</span>
            {user ? (
              <span className="text-blue-500 ml-2">• Account sync</span>
            ) : (
              <span className="text-gray-500 ml-2">• Local storage</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldQuiz;
