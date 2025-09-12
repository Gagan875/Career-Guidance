import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sample quiz questions
  const questions = [
    {
      question: "What type of activities do you enjoy most?",
      options: [
        { text: "Solving mathematical problems", value: "math", points: { science: 3, commerce: 1, arts: 0, vocational: 1 } },
        { text: "Reading and writing", value: "reading", points: { science: 0, commerce: 1, arts: 3, vocational: 1 } },
        { text: "Working with numbers and finances", value: "finance", points: { science: 1, commerce: 3, arts: 0, vocational: 1 } },
        { text: "Hands-on practical work", value: "practical", points: { science: 1, commerce: 1, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "Which subject interests you the most?",
      options: [
        { text: "Physics and Chemistry", value: "science", points: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
        { text: "History and Literature", value: "humanities", points: { science: 0, commerce: 0, arts: 3, vocational: 1 } },
        { text: "Economics and Business", value: "business", points: { science: 0, commerce: 3, arts: 1, vocational: 1 } },
        { text: "Computer Applications", value: "computer", points: { science: 2, commerce: 2, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "What kind of career environment appeals to you?",
      options: [
        { text: "Research laboratories", value: "lab", points: { science: 3, commerce: 0, arts: 1, vocational: 1 } },
        { text: "Corporate offices", value: "office", points: { science: 1, commerce: 3, arts: 1, vocational: 1 } },
        { text: "Creative studios", value: "creative", points: { science: 0, commerce: 1, arts: 3, vocational: 2 } },
        { text: "Technical workshops", value: "workshop", points: { science: 2, commerce: 1, arts: 0, vocational: 3 } }
      ]
    },
    {
      question: "How do you prefer to solve problems?",
      options: [
        { text: "Using logical analysis", value: "logical", points: { science: 3, commerce: 2, arts: 1, vocational: 1 } },
        { text: "Through creative thinking", value: "creative", points: { science: 1, commerce: 1, arts: 3, vocational: 2 } },
        { text: "By following established procedures", value: "systematic", points: { science: 2, commerce: 3, arts: 1, vocational: 2 } },
        { text: "With practical experimentation", value: "practical", points: { science: 2, commerce: 1, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "What motivates you most in your studies?",
      options: [
        { text: "Understanding how things work", value: "understanding", points: { science: 3, commerce: 1, arts: 2, vocational: 2 } },
        { text: "Expressing ideas and creativity", value: "expression", points: { science: 0, commerce: 1, arts: 3, vocational: 1 } },
        { text: "Building wealth and success", value: "success", points: { science: 1, commerce: 3, arts: 1, vocational: 2 } },
        { text: "Learning practical skills", value: "skills", points: { science: 1, commerce: 2, arts: 1, vocational: 3 } }
      ]
    }
  ];

  const handleAnswerSelect = (optionValue) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionValue;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const scores = { science: 0, commerce: 0, arts: 0, vocational: 0 };

    finalAnswers.forEach((answer, index) => {
      const question = questions[index];
      const selectedOption = question.options.find(opt => opt.value === answer);
      
      if (selectedOption) {
        scores.science += selectedOption.points.science || 0;
        scores.commerce += selectedOption.points.commerce || 0;
        scores.arts += selectedOption.points.arts || 0;
        scores.vocational += selectedOption.points.vocational || 0;
      }
    });

    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const recommendations = sortedScores.slice(0, 2).map(([stream]) => stream);

    setResults({ scores, recommendations });
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <h1 className="text-3xl font-bold mb-6">Your Career Assessment Results</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Scores</h2>
              <div className="space-y-3">
                {Object.entries(results.scores).map(([stream, score]) => (
                  <div key={stream} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="capitalize font-medium">{stream}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(score / 15) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{score}/15</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recommended Streams</h2>
              <div className="space-y-3">
                {results.recommendations.map((stream, index) => (
                  <div key={stream} className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-600">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <h3 className="font-semibold capitalize">{stream} Stream</h3>
                        <p className="text-sm text-gray-600">
                          {stream === 'science' && 'Perfect for analytical minds interested in research and innovation'}
                          {stream === 'commerce' && 'Ideal for business-minded individuals interested in finance and management'}
                          {stream === 'arts' && 'Great for creative thinkers interested in humanities and social sciences'}
                          {stream === 'vocational' && 'Excellent for hands-on learners interested in practical skills'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button onClick={restartQuiz} className="btn-secondary">
              Retake Quiz
            </button>
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Career Assessment Quiz</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
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
            {questions[currentQuestion].question}
          </h2>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
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

        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="btn-secondary"
          >
            Previous Question
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;