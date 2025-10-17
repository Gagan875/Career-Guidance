import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // All quiz questions (expanded with 10 more logical questions)
  const allQuestions = [
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
    },
    // 10 Additional Logical Questions
    {
      question: "When working on a group project, what role do you naturally take?",
      options: [
        { text: "The researcher who gathers data and facts", value: "researcher", points: { science: 3, commerce: 1, arts: 2, vocational: 1 } },
        { text: "The leader who organizes and delegates tasks", value: "leader", points: { science: 1, commerce: 3, arts: 1, vocational: 2 } },
        { text: "The creative mind who generates innovative ideas", value: "creative", points: { science: 1, commerce: 1, arts: 3, vocational: 2 } },
        { text: "The implementer who executes the plan", value: "implementer", points: { science: 2, commerce: 2, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "Which type of problem-solving approach do you prefer?",
      options: [
        { text: "Breaking down complex problems into smaller parts", value: "analytical", points: { science: 3, commerce: 2, arts: 1, vocational: 2 } },
        { text: "Finding patterns and connections between ideas", value: "pattern", points: { science: 2, commerce: 1, arts: 3, vocational: 1 } },
        { text: "Using data and statistics to make decisions", value: "data", points: { science: 2, commerce: 3, arts: 0, vocational: 1 } },
        { text: "Learning by doing and trial-and-error", value: "hands-on", points: { science: 1, commerce: 1, arts: 2, vocational: 3 } }
      ]
    },
    {
      question: "What type of learning environment helps you focus best?",
      options: [
        { text: "Quiet library with access to research materials", value: "library", points: { science: 3, commerce: 1, arts: 2, vocational: 1 } },
        { text: "Dynamic classroom with discussions and presentations", value: "classroom", points: { science: 1, commerce: 3, arts: 2, vocational: 1 } },
        { text: "Art studio or creative space with freedom to explore", value: "studio", points: { science: 0, commerce: 1, arts: 3, vocational: 2 } },
        { text: "Workshop or lab with tools and equipment", value: "workshop", points: { science: 2, commerce: 1, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "When faced with a difficult decision, you tend to:",
      options: [
        { text: "Research all available options thoroughly", value: "research", points: { science: 3, commerce: 2, arts: 1, vocational: 1 } },
        { text: "Consider the financial implications first", value: "financial", points: { science: 1, commerce: 3, arts: 0, vocational: 2 } },
        { text: "Trust your intuition and gut feeling", value: "intuition", points: { science: 0, commerce: 1, arts: 3, vocational: 2 } },
        { text: "Ask for advice from experienced people", value: "advice", points: { science: 1, commerce: 2, arts: 2, vocational: 3 } }
      ]
    },
    {
      question: "Which activity would you choose for a weekend hobby?",
      options: [
        { text: "Conducting science experiments or coding", value: "experiments", points: { science: 3, commerce: 0, arts: 1, vocational: 2 } },
        { text: "Reading business magazines or investment books", value: "business", points: { science: 0, commerce: 3, arts: 1, vocational: 1 } },
        { text: "Writing, painting, or playing musical instruments", value: "arts", points: { science: 0, commerce: 0, arts: 3, vocational: 1 } },
        { text: "Building, repairing, or crafting things", value: "building", points: { science: 1, commerce: 1, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "What type of achievement gives you the most satisfaction?",
      options: [
        { text: "Discovering something new or solving a complex puzzle", value: "discovery", points: { science: 3, commerce: 1, arts: 2, vocational: 1 } },
        { text: "Successfully managing a profitable project", value: "profit", points: { science: 1, commerce: 3, arts: 0, vocational: 2 } },
        { text: "Creating something beautiful or meaningful", value: "creation", points: { science: 0, commerce: 1, arts: 3, vocational: 2 } },
        { text: "Mastering a practical skill or technique", value: "mastery", points: { science: 2, commerce: 1, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "How do you prefer to communicate your ideas?",
      options: [
        { text: "Through detailed reports with facts and figures", value: "reports", points: { science: 3, commerce: 2, arts: 1, vocational: 1 } },
        { text: "Via presentations with charts and business proposals", value: "presentations", points: { science: 1, commerce: 3, arts: 1, vocational: 1 } },
        { text: "Through storytelling, art, or creative expression", value: "storytelling", points: { science: 0, commerce: 1, arts: 3, vocational: 1 } },
        { text: "By demonstrating or showing practical examples", value: "demonstration", points: { science: 2, commerce: 1, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "What type of challenge excites you most?",
      options: [
        { text: "Solving theoretical problems that require deep thinking", value: "theoretical", points: { science: 3, commerce: 1, arts: 2, vocational: 0 } },
        { text: "Competing in business competitions or negotiations", value: "competition", points: { science: 1, commerce: 3, arts: 1, vocational: 1 } },
        { text: "Participating in creative contests or artistic projects", value: "creative-contest", points: { science: 0, commerce: 1, arts: 3, vocational: 2 } },
        { text: "Building or fixing something with your hands", value: "building-challenge", points: { science: 1, commerce: 1, arts: 1, vocational: 3 } }
      ]
    },
    {
      question: "When reading about career success stories, which inspires you most?",
      options: [
        { text: "Scientists making breakthrough discoveries", value: "scientists", points: { science: 3, commerce: 0, arts: 1, vocational: 1 } },
        { text: "Entrepreneurs building successful businesses", value: "entrepreneurs", points: { science: 1, commerce: 3, arts: 1, vocational: 2 } },
        { text: "Artists and writers gaining recognition for their work", value: "artists", points: { science: 0, commerce: 1, arts: 3, vocational: 1 } },
        { text: "Skilled craftspeople mastering their trade", value: "craftspeople", points: { science: 1, commerce: 1, arts: 2, vocational: 3 } }
      ]
    },
    {
      question: "What aspect of technology interests you most?",
      options: [
        { text: "Understanding how algorithms and systems work", value: "algorithms", points: { science: 3, commerce: 1, arts: 1, vocational: 2 } },
        { text: "Using technology to improve business efficiency", value: "business-tech", points: { science: 1, commerce: 3, arts: 0, vocational: 2 } },
        { text: "Creating digital art, content, or user experiences", value: "digital-art", points: { science: 1, commerce: 1, arts: 3, vocational: 2 } },
        { text: "Building, maintaining, or repairing technical equipment", value: "technical", points: { science: 2, commerce: 1, arts: 0, vocational: 3 } }
      ]
    }
  ];

  // Shuffle function to randomize questions
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled questions on component mount
  useEffect(() => {
    setShuffledQuestions(shuffleArray(allQuestions));
  }, []);

  // Use shuffled questions instead of static questions
  const questions = shuffledQuestions;

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
    // Reshuffle questions for a new quiz experience
    setShuffledQuestions(shuffleArray(allQuestions));
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
                          style={{ width: `${(score / 45) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{score}/45</span>
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

  // Show loading while questions are being shuffled
  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your personalized quiz...</p>
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
              Question {currentQuestion + 1} of {questions.length} (Randomized)
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