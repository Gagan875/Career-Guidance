import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import QuizSelectionModal from '../components/QuizSelectionModal';
import '../styles/animations.css';

const Home = () => {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const { user } = useAuth();

  const openQuizModal = () => setIsQuizModalOpen(true);
  const closeQuizModal = () => setIsQuizModalOpen(false);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 dark:from-gray-800 dark:via-gray-900 dark:to-black text-white py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-pulse-custom"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              {user ? (
                <span>
                  Welcome back, <br />
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {user.name}!
                  </span>
                </span>
              ) : (
                <span>
                  Your <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Personalized</span><br />
                  Career & Education Advisor
                </span>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
              {user 
                ? 'Continue your journey to discover the right career path, explore courses, and find the perfect colleges for your future.'
                : 'Discover the right career path, find suitable courses, and explore government colleges near you with our AI-powered guidance platform.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={openQuizModal}
                className="group px-10 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 transform shadow-2xl hover:shadow-3xl"
              >
                <span className="flex items-center space-x-3">
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Take Career Quiz</span>
                </span>
              </button>
              
              {!user && (
                <Link 
                  to="/register" 
                  className="group px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 hover:scale-105 transform shadow-2xl hover:shadow-3xl"
                >
                  <span className="flex items-center space-x-3">
                    <span>Get Started</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 animate-fadeIn">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to make informed decisions about your career and education
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 card-hover">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Aptitude Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Take personalized quizzes powered by advanced algorithms to discover your interests, strengths, and ideal career paths tailored just for you.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 card-hover">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                Course Mapping
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Explore comprehensive career paths for different degree programs with detailed job prospects, salary ranges, and growth opportunities.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 card-hover">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                College Directory
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Find government colleges near you with detailed information about courses, facilities, admission criteria, and placement records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-32 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Students Nationwide</h2>
            <p className="text-xl opacity-90">Join thousands of students who have found their perfect career path</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-lg text-gray-300 font-medium">Government Colleges</div>
              <div className="text-sm text-gray-400 mt-2">Across India</div>
            </div>
            
            <div className="group">
              <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                100+
              </div>
              <div className="text-lg text-gray-300 font-medium">Course Options</div>
              <div className="text-sm text-gray-400 mt-2">Multiple Streams</div>
            </div>
            
            <div className="group">
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-lg text-gray-300 font-medium">Students Guided</div>
              <div className="text-sm text-gray-400 mt-2">Success Stories</div>
            </div>
            
            <div className="group">
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                95%
              </div>
              <div className="text-lg text-gray-300 font-medium">Satisfaction Rate</div>
              <div className="text-sm text-gray-400 mt-2">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Ready to Shape Your Future?
          </h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed">
            Join thousands of students who have discovered their perfect career path with our comprehensive guidance platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!user ? (
              <>
                <Link 
                  to="/register" 
                  className="group px-12 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform shadow-2xl"
                >
                  <span className="flex items-center space-x-3">
                    <span>Start Your Journey</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <button 
                  onClick={openQuizModal}
                  className="group px-12 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 transform"
                >
                  <span className="flex items-center space-x-3">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Try Free Quiz</span>
                  </span>
                </button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={openQuizModal}
                  className="group px-12 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform shadow-2xl"
                >
                  <span className="flex items-center space-x-3">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Take Career Quiz</span>
                  </span>
                </button>
                
                <Link 
                  to="/profile" 
                  className="group px-12 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 transform"
                >
                  <span className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>View Profile</span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quiz Selection Modal */}
      <QuizSelectionModal isOpen={isQuizModalOpen} onClose={closeQuizModal} />
    </div>
  );
};

export default Home;