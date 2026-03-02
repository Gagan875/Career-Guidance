import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [savedColleges, setSavedColleges] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile');
      const userData = response.data;
      
      if (userData.quizResults && userData.quizResults.length > 0) {
        const latestQuiz = userData.quizResults[userData.quizResults.length - 1];
        setRecommendations(latestQuiz.recommendations || []);
        setRecentQuizzes(userData.quizResults.slice(-3));
      }
      
      setSavedColleges(userData.savedColleges || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's your personalized career guidance dashboard
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/quiz" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Take Career Quiz</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Discover your ideal career path</p>
                </div>
              </Link>

              <Link to="/colleges" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Explore Colleges</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Find nearby government colleges</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Recommendations</h2>
              <div className="space-y-3">
                {recommendations.map((stream, index) => (
                  <div key={index} className="flex items-center p-3 bg-primary-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium capitalize">{stream} Stream</h3>
                      <p className="text-sm text-gray-600">Based on your quiz results</p>
                    </div>
                    <Link 
                      to={`/courses?stream=${stream}`}
                      className="ml-auto text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Courses →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Quiz Results */}
          {recentQuizzes.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Quiz Results</h2>
              <div className="space-y-3">
                {recentQuizzes.map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium capitalize">{quiz.quizType} Assessment</h3>
                      <p className="text-sm text-gray-600">
                        Score: {quiz.score} | {new Date(quiz.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Recommendations:</div>
                      <div className="text-sm font-medium">
                        {quiz.recommendations.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Profile Completion</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Basic Info</span>
                <span className="text-sm text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Academic Background</span>
                <Link to="/profile" className="text-sm text-primary-600 hover:text-primary-700">
                  Complete →
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Career Assessment</span>
                <Link to="/quiz" className="text-sm text-primary-600 hover:text-primary-700">
                  Take Quiz →
                </Link>
              </div>
            </div>
          </div>

          {/* Saved Items */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Saved Items</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Colleges</span>
                <span className="text-sm text-gray-600">{savedColleges.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Courses</span>
                <span className="text-sm text-gray-600">0</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Upcoming Deadlines</h3>
            <div className="text-sm text-gray-600">
              No upcoming deadlines. Check back later for admission dates and scholarship applications.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;