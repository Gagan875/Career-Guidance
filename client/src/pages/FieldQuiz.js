import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';
import '../styles/animations.css';

const FieldQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes = 1800 seconds
  const [timerActive, setTimerActive] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Timer effect - starts when questions are loaded
  useEffect(() => {
    if (timerActive && timeRemaining > 0 && !showResults) {
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
  }, [timerActive, timeRemaining, showResults]);

  // Fetch random questions from database (5 from each of 15 fields = 75 total)
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      let url = `${API_BASE_URL}/api/field-quiz/random`;

      if (user && user._id) {
        url += `?userId=${user._id}`;
        console.log('Fetching field questions for logged-in user:', user._id);
      } else {
        const usedQuestions = JSON.parse(localStorage.getItem('usedFieldQuestions') || '[]');
        console.log('Parsed usedFieldQuestions:', usedQuestions);

        if (usedQuestions.length > 0) {
          // Keep only last 225 questions (3 quizzes * 75 questions) to avoid URL length issues
          const recentQuestions = usedQuestions.slice(-225);
          localStorage.setItem('usedFieldQuestions', JSON.stringify(recentQuestions));

          const excludeParam = encodeURIComponent(JSON.stringify(recentQuestions));
          url += `?excludeIds=${excludeParam}`;
          console.log('Fetching field questions for anonymous user, excluding', recentQuestions.length, 'previously used questions');
        } else {
          console.log('Fetching field questions for new anonymous user');
        }
      }

      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Data received:', data);
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions received from server');
      }
      
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
      setTimerActive(true); // Start the timer when questions are loaded
    } catch (error) {
      console.error('Error fetching field questions:', error);
      console.error('Error details:', error.message);
      setError(`Failed to load quiz questions: ${error.message}. Please try again.`);
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    console.log('Time is up! Auto-submitting field quiz...');
    setTimerActive(false);
    
    // Submit with current answers (even if incomplete)
    if (answers.length > 0) {
      submitQuiz(answers);
    } else {
      // If no answers at all, show error
      setError('Time is up! Please try again.');
      setShowResults(true);
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
      setTimerActive(false); // Stop the timer when submitting
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
          const response = await fetch(`${API_BASE_URL}/api/field-quiz/submit`, {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse-custom shadow-2xl">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Field Selection Quiz</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Selecting 5 questions from each of 15 fields</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">No question repeats for 72 quizzes</span>
            </div>
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-500 font-medium">Progress saved to account</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Progress saved locally</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Unavailable</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{error}</p>
            <button 
              onClick={fetchQuestions} 
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl p-12 border border-white/20 text-center animate-fadeIn">
            <div className="mb-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-custom shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">Quiz Completed!</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                Great job! You've completed the field selection quiz.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-500">
                To get your personalized career recommendations, please take our psychometric test.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-2xl mb-12 border border-green-200/50 dark:border-green-700/50">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">What's Next?</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                Our psychometric assessment will analyze your personality traits, work preferences, 
                and combine them with your quiz results to provide accurate career recommendations.
              </p>
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 space-x-8">
                <span className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">75 Questions</span>
                </span>
                <span className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Personalized Results</span>
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-6 flex-wrap gap-4 mb-8">
              <button 
                onClick={() => navigate('/psychometric-test', { state: { fieldQuizResults: results } })}
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Take Psychometric Test
              </button>
              <button 
                onClick={() => navigate('/field-quiz')} 
                className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
              >
                Retake Quiz
              </button>
              {user && (
                <button 
                  onClick={() => navigate('/profile')} 
                  className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  View Quiz History
                </button>
              )}
            </div>

            <div className="text-sm">
              {user ? (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    {results?.saveMessage || "Your quiz results are permanently saved to your account"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Your quiz results are saved locally. Sign up to save permanently!</p>
              )}
            </div>
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

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 900) return 'text-green-600 dark:text-green-400'; // > 15 min
    if (timeRemaining > 300) return 'text-yellow-600 dark:text-yellow-400'; // > 5 min
    return 'text-red-600 dark:text-red-400'; // < 5 min
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20 animate-fadeIn">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Field Selection Quiz</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Discover your ideal career field</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold mb-2 ${getTimerColor()}`}>
                  {formatTime(timeRemaining)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 block">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 capitalize mt-1">
                  {getFieldDisplayName(currentQ.field)} • {currentQ.difficulty} • {currentQ.category}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-700/50 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedOption === option.value;
                const previouslyAnswered = answers[currentQuestion]?.selectedOptionId === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerSelect(option.value)}
                    disabled={selectedOption !== null}
                    className={`w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? 'border-green-500 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 shadow-lg transform scale-[1.02]'
                        : previouslyAnswered
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-400 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/10 dark:hover:to-blue-900/10'
                    } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    <div className="flex items-center">
                      <span className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-4 transition-colors ${
                        isSelected
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                          : previouslyAnswered
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={`text-lg ${isSelected ? 'font-semibold text-green-800 dark:text-green-200' : 'text-gray-900 dark:text-gray-100'}`}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                currentQuestion === 0 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-500' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Previous Question
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <div>5 questions per field • 15 fields</div>
                <div className="flex items-center justify-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400">No repeats (72 quizzes)</span>
                  </span>
                  {user ? (
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-500">Account sync</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-500 dark:text-gray-400">Local storage</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-32"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldQuiz;
