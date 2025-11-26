import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../utils/quizUtils.js'; // Import utilities for console access

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
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
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: questions[currentQuestion]._id,
      selectedOptionId: optionValue
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz(newAnswers);
    }
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

    const streamScores = {
      science: 0,
      commerce: 0,
      arts: 0,
      diploma: 0
    };

    let correctAnswers = 0;

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
            // Correct answer: strong indication of aptitude in this stream
            streamScores[question.stream] += 3;
            correctAnswers += 1;
            console.log(`Added 3 points to ${question.stream} (correct answer)`);
          } else {
            // Incorrect answer: still shows some engagement with the subject
            streamScores[question.stream] += 1;
            console.log(`Added 1 point to ${question.stream} (incorrect answer)`);
          }
        } else {
          console.log('No matching option found for:', answer.selectedOptionId);
        }
      } else {
        console.log('No matching question found for ID:', answer.questionId);
      }
    });

    const totalScore = Object.values(streamScores).reduce((sum, score) => sum + score, 0);
    const streamPercentages = {};

    console.log('Stream scores after calculation:', streamScores);
    console.log('Total score:', totalScore);
    console.log('Correct answers:', correctAnswers, 'out of', finalAnswers.length);

    for (const [stream, score] of Object.entries(streamScores)) {
      streamPercentages[stream] = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
    }

    console.log('Stream percentages:', streamPercentages);

    const sortedStreams = Object.entries(streamPercentages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const recommendations = sortedStreams.map(([stream, percentage]) => ({
      stream,
      percentage,
      score: streamScores[stream]
    }));

    setResults({
      totalQuestions: questions.length,
      correctAnswers,
      accuracy: Math.round((correctAnswers / questions.length) * 100),
      streamScores,
      streamPercentages,
      recommendations
    });
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
    fetchQuestions(); // Fetch new random questions
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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
          <h1 className="text-3xl font-bold mb-6">Your Career Assessment Results</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Stream Analysis</h2>
              <div className="space-y-3">
                {Object.entries(results.streamPercentages || results.streamScores).map(([stream, value]) => (
                  <div key={stream} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="capitalize font-medium">{stream}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${results.streamPercentages ? value : (value / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {results.streamPercentages ? `${value}%` : `${value}/5`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recommended Streams</h2>
              <div className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <div key={rec.stream} className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-600">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <h3 className="font-semibold capitalize">{rec.stream} Stream</h3>
                        <p className="text-sm text-gray-600">
                          {rec.percentage ? `${rec.percentage}% match` : `${rec.score} questions answered`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {rec.stream === 'science' && 'Perfect for analytical minds interested in research and innovation'}
                          {rec.stream === 'commerce' && 'Ideal for business-minded individuals interested in finance and management'}
                          {rec.stream === 'arts' && 'Great for creative thinkers interested in humanities and social sciences'}
                          {rec.stream === 'diploma' && 'Excellent for hands-on learners interested in practical skills'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {results.accuracy && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Quiz Performance</h3>
              <p className="text-blue-700">
                You answered {results.correctAnswers} out of {results.totalQuestions} questions
                ({results.accuracy}% completion rate)
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Questions covered: 5 from each stream (Science, Commerce, Arts, Diploma)
              </p>
            </div>
          )}

          {!user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800">Debug Info (Anonymous User)</h3>
              <p className="text-sm text-gray-600">
                Questions used so far: {JSON.parse(localStorage.getItem('usedQuestions') || '[]').length}
              </p>
              <p className="text-sm text-gray-600">
                Quizzes taken: ~{Math.floor(JSON.parse(localStorage.getItem('usedQuestions') || '[]').length / 20)}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <button onClick={restartQuiz} className="btn-secondary">
              Retake Quiz
            </button>
            {!user && (
              <>
                <button
                  onClick={() => {
                    localStorage.removeItem('usedQuestions');
                    console.log('Cleared localStorage for testing');
                    alert('Question history cleared! Next quiz will be fresh.');
                  }}
                  className="btn-secondary bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Clear History (Test)
                </button>
                <button
                  onClick={async () => {
                    const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
                    if (usedQuestions.length === 0) {
                      alert('No question history to test');
                      return;
                    }

                    try {
                      const url = `http://localhost:5000/api/stream-quiz/test-exclusion?excludeIds=${encodeURIComponent(JSON.stringify(usedQuestions))}`;
                      const response = await fetch(url);
                      const data = await response.json();
                      console.log('Exclusion test result:', data);
                      alert(`Exclusion test: ${data.exclusionWorking ? 'WORKING' : 'NOT WORKING'}\nExcluded: ${data.excludeCount}\nScience available: ${data.scienceAvailable}/${data.scienceTotal}`);
                    } catch (error) {
                      console.error('Test failed:', error);
                      alert('Test failed - check console');
                    }
                  }}
                  className="btn-secondary bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Test Exclusion
                </button>
              </>
            )}
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                View Dashboard
              </button>
            ) : (
              <button onClick={() => navigate('/register')} className="btn-primary">
                Sign Up to Save Results
              </button>
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
            {currentQ.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswerSelect(option.value)}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.text}
                </div>
              </button>
            ))}
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