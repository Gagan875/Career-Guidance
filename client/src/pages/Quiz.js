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
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Fetch random questions from database (5 from each stream)
  useEffect(() => {
    fetchQuestions();
  }, []);

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

  const submitQuiz = async (finalAnswers) => {
    try {
      console.log('Submitting quiz with answers:', finalAnswers);
      console.log('User token available:', !!token);
      console.log('User info:', user);

      if (!token) {
        console.log('No token - using local calculation');
        console.log('Calling calculateLocalResults with:', finalAnswers);
        // For non-authenticated users, calculate basic results
        calculateLocalResults(finalAnswers);
        return;
      }

      console.log('Submitting to server...');
      const response = await fetch('http://localhost:5000/api/stream-quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: finalAnswers })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      console.log('Server response:', data);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Fallback to local calculation
      calculateLocalResults(finalAnswers);
    }
  };

  const calculateLocalResults = (finalAnswers) => {
    console.log('=== calculateLocalResults called ===');
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

    setResults({
      totalQuestions: questions.length,
      correctAnswers: totalCorrectAnswers,
      accuracy: Math.round((totalCorrectAnswers / questions.length) * 100),
      streamCorrectAnswers,
      streamPercentages,
      recommendations
    });
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResults(false);
    setResults(null);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your career assessment quiz...</p>
          <p className="text-sm text-gray-500 mt-2">Selecting 5 questions from each stream</p>
          <p className="text-xs text-green-600 mt-2">✓ No question repeats for 90 quizzes</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Great job! You've completed the career assessment quiz.
            </p>
            <p className="text-gray-500">
              To get your personalized career recommendations, please take our psychometric test.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-3">What's Next?</h2>
            <p className="text-gray-700 mb-4">
              Our psychometric assessment will analyze your personality traits, work preferences, 
              and combine them with your quiz results to provide accurate career recommendations.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-600">
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
              onClick={() => navigate('/psychometric-test', { state: { quizResults: results } })}
              className="btn-primary text-lg px-8 py-3"
            >
              Take Psychometric Test
            </button>
            <button onClick={restartQuiz} className="btn-secondary">
              Retake Quiz
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Your quiz results are saved and will be combined with the psychometric assessment</p>
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Career Assessment Quiz</h1>
            <div className="text-right">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="text-xs text-gray-500 capitalize">
                {currentQ.stream} Stream • {currentQ.difficulty} • {currentQ.category}
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
                      ? 'border-primary-600 bg-primary-100 shadow-md transform scale-[1.02]'
                      : previouslyAnswered
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                  } ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : previouslyAnswered
                        ? 'bg-primary-400 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + index)}
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
            5 questions per stream • Database powered
            <span className="text-green-600 ml-2">• No repeats (90 quizzes)</span>
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

export default Quiz;