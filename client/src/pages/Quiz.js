import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../utils/quizUtils.js'; // Import utilities for console access

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes = 600 seconds
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

  // Fetch random questions from database (5 from each stream)
  useEffect(() => {
    fetchQuestions();
    // Check for saved results if user is logged in
    if (user && token) {
      checkSavedResults();
    }
  }, [user, token]);

  const checkSavedResults = async () => {
    try {
      console.log('Checking for saved quiz results...');
      const response = await fetch('http://localhost:5000/api/stream-quiz/results', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const savedResults = await response.json();
        if (savedResults && savedResults.length > 0) {
          console.log('Found saved quiz results:', savedResults);
          // Get the most recent result
          const latestResult = savedResults[0];
          setResults(latestResult.results);
          // Optionally show a message that previous results were loaded
          console.log('Loaded previous quiz results from:', latestResult.completedAt);
        }
      }
    } catch (error) {
      console.log('No saved results found or error loading:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      // Build URL with user ID or exclude IDs
      let url = 'http://localhost:5000/api/stream-quiz/random';

      if (user && user._id) {
        // Logged-in user: use database tracking
        url += `?userId=${user._id}`;
        console.log('Fetching questions for logged-in user:', user._id);
      } else {
        // Anonymous user: use localStorage tracking
        const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
        console.log('Raw localStorage data:', localStorage.getItem('usedQuestions'));
        console.log('Parsed usedQuestions:', usedQuestions);

        if (usedQuestions.length > 0) {
          // Keep only last 1800 questions (90 quizzes * 20 questions)
          const recentQuestions = usedQuestions.slice(-1800);
          localStorage.setItem('usedQuestions', JSON.stringify(recentQuestions));

          const excludeParam = encodeURIComponent(JSON.stringify(recentQuestions));
          url += `?excludeIds=${excludeParam}`;
          console.log('Fetching questions for anonymous user, excluding', recentQuestions.length, 'previously used questions');
          console.log('Sample excluded IDs:', recentQuestions.slice(0, 5));
          console.log('Exclude parameter length:', excludeParam.length);
        } else {
          console.log('Fetching questions for new anonymous user - no localStorage data');
        }
      }

      console.log('Fetching from URL:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(data.questions);

      // Show info about question uniqueness
      console.log('Quiz data received:', {
        totalQuestions: data.totalQuestions,
        excludedCount: data.excludedCount,
        isUniqueSet: data.isUniqueSet
      });

      if (data.excludedCount > 0) {
        console.log(`Loaded ${data.totalQuestions} questions (${data.excludedCount} previously used questions excluded)`);
      }

      setLoading(false);
      setTimerActive(true); // Start the timer when questions are loaded
    } catch (error) {
      console.error('Error fetching questions:', error);
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

    // Add a small delay to show the selection before moving to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null); // Reset selection for next question
      } else {
        submitQuiz(newAnswers);
      }
    }, 500);
  };

  const handleTimeUp = () => {
    console.log('Time is up! Auto-submitting quiz...');
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

  const submitQuiz = async (finalAnswers) => {
    try {
      setTimerActive(false); // Stop the timer when submitting
      console.log('Submitting quiz with answers:', finalAnswers);
      console.log('User token available:', !!token);
      console.log('User info:', user);

      // Calculate results locally first
      const localResults = calculateResults(finalAnswers);

      if (!token) {
        console.log('No token - showing local results only');
        setResults(localResults);
        setShowResults(true);
        return;
      }

      console.log('Submitting to server for permanent storage...');
      
      // Prepare data for server submission
      const submissionData = {
        answers: finalAnswers,
        results: localResults,
        completedAt: new Date().toISOString(),
        quizType: 'career-assessment'
      };

      const response = await fetch('http://localhost:5000/api/stream-quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        console.warn('Server submission failed, using local results');
        // Still show results even if server save fails
        setResults(localResults);
        setShowResults(true);
        return;
      }

      const serverResponse = await response.json();
      console.log('Quiz results saved to server:', serverResponse);
      
      // Add success message to results
      localResults.savedToServer = true;
      localResults.saveMessage = "Results saved to your account!";
      
      // Use local results for display (more reliable)
      setResults(localResults);
      setShowResults(true);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Always fallback to local calculation and display
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

      const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
      console.log('Current localStorage before save:', usedQuestions.length, 'questions');

      usedQuestions.push(...questionIds);

      // Keep only last 1800 questions (90 quizzes * 20 questions)
      const recentQuestions = usedQuestions.slice(-1800);
      localStorage.setItem('usedQuestions', JSON.stringify(recentQuestions));

      console.log('Saved', questionIds.length, 'question IDs to localStorage. Total saved:', recentQuestions.length);
      console.log('localStorage after save:', localStorage.getItem('usedQuestions').substring(0, 100) + '...');
    }

    // Track correct answers per stream (out of 5 questions each)
    const streamCorrectAnswers = {
      science: 0,
      commerce: 0,
      arts: 0,
      diploma: 0
    };

    let totalCorrectAnswers = 0;

    finalAnswers.forEach((answer, index) => {
      console.log(`Processing answer ${index + 1}:`, answer);
      const question = questions.find(q => q._id === answer.questionId);

      if (question) {
        console.log(`Found question for ${question.stream}:`, question.question.substring(0, 50) + '...');

        // Find the selected option
        const selectedOption = question.options.find(opt => opt.value === answer.selectedOptionId);

        if (selectedOption) {
          console.log(`Selected option: "${selectedOption.text}" - Correct: ${selectedOption.isCorrect}`);

          if (selectedOption.isCorrect) {
            // Count correct answers per stream
            streamCorrectAnswers[question.stream] += 1;
            totalCorrectAnswers += 1;
            console.log(`Correct answer in ${question.stream} (${streamCorrectAnswers[question.stream]}/5)`);
          } else {
            console.log(`Incorrect answer in ${question.stream}`);
          }
        } else {
          console.log('No matching option found for:', answer.selectedOptionId);
        }
      } else {
        console.log('No matching question found for ID:', answer.questionId);
      }
    });

    // Calculate percentage of correct answers per stream (out of 5 questions each)
    const streamPercentages = {};
    
    console.log('Stream correct answers:', streamCorrectAnswers);
    console.log('Total correct answers:', totalCorrectAnswers, 'out of', finalAnswers.length);

    for (const [stream, correctCount] of Object.entries(streamCorrectAnswers)) {
      // Each stream has 5 questions, so percentage = (correct/5) * 100
      streamPercentages[stream] = Math.round((correctCount / 5) * 100);
      console.log(`${stream}: ${correctCount}/5 = ${streamPercentages[stream]}%`);
    }

    console.log('Stream percentages:', streamPercentages);

    const sortedStreams = Object.entries(streamPercentages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const recommendations = sortedStreams.map(([stream, percentage]) => ({
      stream,
      percentage,
      correctCount: streamCorrectAnswers[stream],
      totalQuestions: 5
    }));

    return {
      totalQuestions: questions.length,
      correctAnswers: totalCorrectAnswers,
      accuracy: Math.round((totalCorrectAnswers / questions.length) * 100),
      streamCorrectAnswers,
      streamPercentages,
      recommendations,
      userId: user?._id,
      completedAt: new Date().toISOString()
    };
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResults(false);
    setResults(null);
    setTimeRemaining(600); // Reset timer to 10 minutes
    setTimerActive(false); // Will be reactivated when questions load
    fetchQuestions(); // Fetch new random questions
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null); // Reset selection when going back
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse-custom shadow-2xl">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Your Career Assessment</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Selecting 5 questions from each stream</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">No question repeats for 90 quizzes</span>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
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
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
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
                Great job! You've completed the career assessment quiz.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-500">
                To get your personalized career recommendations, please take our psychometric test.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl mb-12 border border-blue-200/50 dark:border-blue-700/50">
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
                  <span className="font-medium">20 Questions</span>
                </span>
                <span className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Personalized Results</span>
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-6 flex-wrap gap-4 mb-8">
              <button 
                onClick={() => navigate('/psychometric-test', { state: { quizResults: results } })}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Take Psychometric Test
              </button>
              <button 
                onClick={restartQuiz} 
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
          <p className="text-gray-600">No questions available. Please try again later.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20 animate-fadeIn">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Career Assessment Quiz</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Discover your ideal academic stream</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold mb-2 ${getTimerColor()}`}>
                  {formatTime(timeRemaining)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 block">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 capitalize mt-1">
                  {currentQ.stream} Stream • {currentQ.difficulty} • {currentQ.category}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 mb-8">
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
                        ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg transform scale-[1.02]'
                        : previouslyAnswered
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10'
                    } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    <div className="flex items-center">
                      <span className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-4 transition-colors ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : previouslyAnswered
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={`text-lg ${isSelected ? 'font-semibold text-blue-800 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100'}`}>
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
                <div>5 questions per stream • Database powered</div>
                <div className="flex items-center justify-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400">No repeats (90 quizzes)</span>
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

export default Quiz;