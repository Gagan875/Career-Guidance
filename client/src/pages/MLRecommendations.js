import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/animations.css';

const MLRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('degrees');
  const [locationPermission, setLocationPermission] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  // State to track loaded assessment data
  const [loadedQuizResults, setLoadedQuizResults] = useState(null);
  const [loadedFieldQuizResults, setLoadedFieldQuizResults] = useState(null);
  const [loadedPsychometricResults, setLoadedPsychometricResults] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get quiz and psychometric results from previous page
  const { quizResults, fieldQuizResults, psychometricResults } = location.state || {};

  // Helper function to check if user has completed assessments
  const checkForSavedAssessments = () => {
    try {
      console.log('🔍 Checking localStorage for saved assessments...');
      
      const savedQuizResults = localStorage.getItem('lastQuizResults');
      const savedPsychometricResults = localStorage.getItem('lastPsychometricResults');
      
      console.log('📊 Saved quiz results:', savedQuizResults ? 'Found' : 'Not found');
      console.log('🧠 Saved psychometric results:', savedPsychometricResults ? 'Found' : 'Not found');
      
      if (savedQuizResults && savedPsychometricResults) {
        const parsedQuizResults = JSON.parse(savedQuizResults);
        const parsedPsychometricResults = JSON.parse(savedPsychometricResults);
        
        console.log('✅ Successfully parsed saved data:', {
          quizResults: parsedQuizResults.quizResults ? 'Present' : 'Missing',
          fieldQuizResults: parsedQuizResults.fieldQuizResults ? 'Present' : 'Missing',
          psychometricResults: parsedPsychometricResults ? 'Present' : 'Missing'
        });
        
        return {
          quizResults: parsedQuizResults.quizResults,
          fieldQuizResults: parsedQuizResults.fieldQuizResults,
          psychometricResults: parsedPsychometricResults
        };
      }
    } catch (error) {
      console.error('❌ Error parsing saved results:', error);
    }
    
    console.log('❌ No valid saved assessments found');
    return null;
  };

  useEffect(() => {
    console.log('🚀 MLRecommendations component mounted');
    console.log('� Useir:', user ? 'Logged in' : 'Not logged in');
    console.log('📍 Navigation state:', { quizResults: !!quizResults, fieldQuizResults: !!fieldQuizResults, psychometricResults: !!psychometricResults });
    
    // First check if we have data from navigation state
    if (psychometricResults) {
      console.log('✅ Found psychometric results in navigation state');
      setLoadedQuizResults(quizResults);
      setLoadedFieldQuizResults(fieldQuizResults);
      setLoadedPsychometricResults(psychometricResults);
      
      // Request location permission
      requestLocationPermission();
      return;
    }

    console.log('🔍 No navigation state data, checking localStorage...');
    // If no state data, try to get from localStorage (for recent quiz results)
    const savedData = checkForSavedAssessments();
    
    if (savedData) {
      console.log('✅ Found saved data in localStorage, loading...');
      setLoadedQuizResults(savedData.quizResults);
      setLoadedFieldQuizResults(savedData.fieldQuizResults);
      setLoadedPsychometricResults(savedData.psychometricResults);
      
      // Request location permission
      requestLocationPermission();
      return;
    }

    // If still no data, show error
    console.log('❌ No assessment data found, showing error');
    setError('Please complete the career assessments first to access ML recommendations.');
    setLoading(false);
  }, []);

  // Separate useEffect to generate recommendations when data is loaded
  useEffect(() => {
    if (loadedPsychometricResults) {
      console.log('🎯 Psychometric results loaded, generating recommendations...');
      generateRecommendations();
    }
  }, [loadedPsychometricResults, userLocation]);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracy: position.coords.accuracy
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.log('Location permission denied:', error);
          setLocationPermission('denied');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLocationPermission('unavailable');
    }
  };

  const testServerConnection = async () => {
    try {
      console.log('🔍 Testing server connection...');
      
      // Test general server
      const serverTest = await fetch('/api/test');
      console.log('🌐 General server test:', serverTest.status);
      
      // Test recommendations routes
      const recommendationsTest = await fetch('/api/recommendations/test');
      console.log('🎯 Recommendations routes test:', recommendationsTest.status);
      
      if (recommendationsTest.ok) {
        const data = await recommendationsTest.json();
        console.log('✅ Recommendations routes response:', data);
      }
      
    } catch (error) {
      console.error('❌ Server connection failed:', error);
    }
  };

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      
      // Test server connection first
      await testServerConnection();
      
      console.log('🤖 Generating ML recommendations with data:', {
        streamPercentages: loadedQuizResults?.streamPercentages,
        fieldPercentages: loadedFieldQuizResults?.fieldPercentages,
        psychometricResults: !!loadedPsychometricResults,
        userLocation: !!userLocation
      });
      
      const token = localStorage.getItem('token');
      console.log('🔑 Auth token:', token ? 'Present' : 'Missing');
      console.log('👤 User context:', user ? 'Present' : 'Missing');
      
      const requestBody = {
        streamPercentages: loadedQuizResults?.streamPercentages,
        fieldPercentages: loadedFieldQuizResults?.fieldPercentages,
        psychometricResults: loadedPsychometricResults,
        academicData: user?.academicInfo,
        location: userLocation,
        preferences: {
          maxDistance: 500,
          collegeType: 'all'
        }
      };
      
      // First try the test endpoint to verify data flow
      console.log('🧪 Testing comprehensive endpoint without auth...');
      try {
        const testResponse = await fetch('/api/recommendations/comprehensive-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log('🧪 Test response status:', testResponse.status);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('✅ Test endpoint success:', testData);
        } else {
          const testError = await testResponse.text();
          console.log('❌ Test endpoint error:', testError);
        }
      } catch (testError) {
        console.error('❌ Test endpoint failed:', testError);
      }
      
      // Now try the real endpoint
      console.log('📤 Sending request to /api/recommendations/comprehensive');
      console.log('📋 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('/api/recommendations/comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        // If user is not authenticated, show a different error
        if (response.status === 401) {
          throw new Error('Please log in to access ML recommendations');
        }
        
        throw new Error(`Failed to generate recommendations: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Recommendations generated successfully:', data);
      setRecommendations(data.report);
      
    } catch (error) {
      console.error('❌ Error generating recommendations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange) return 'Not specified';
    const { min, max } = salaryRange;
    return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
  };

  const getMatchColor = (match) => {
    if (match >= 85) return 'text-green-600 dark:text-green-400';
    if (match >= 70) return 'text-blue-600 dark:text-blue-400';
    if (match >= 55) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchBgColor = (match) => {
    if (match >= 85) return 'bg-green-100 dark:bg-green-900';
    if (match >= 70) return 'bg-blue-100 dark:bg-blue-900';
    if (match >= 55) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Generating AI Recommendations</h2>
          <p className="text-gray-600 dark:text-gray-300">Analyzing your profile and preferences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Assessment Required</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{error}</p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              To access AI-powered recommendations, please complete:
            </p>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => navigate('/quiz')}
                className="btn-animate px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Start Stream Quiz
              </button>
              
              <button 
                onClick={() => navigate('/field-quiz')}
                className="btn-animate px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
                Start Field Quiz
              </button>
              
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-6">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                  Or try a demo with sample data:
                </p>
                <button 
                  onClick={() => {
                    // Create demo data for testing
                    console.log('🧪 Creating demo data for ML recommendations test...');
                    const demoData = {
                      quizResults: {
                        streamPercentages: { science: 85, commerce: 45, arts: 30, diploma: 25 }
                      },
                      psychometricResults: {
                        personalityTraits: {
                          analytical: 85, creativity: 70, leadership: 65, social: 55,
                          communication: 72, detail_oriented: 80, risk_tolerance: 60,
                          openness: 75, extraversion: 50, conscientiousness: 78
                        }
                      }
                    };
                    
                    // Save to localStorage for testing
                    try {
                      localStorage.setItem('lastPsychometricResults', JSON.stringify(demoData.psychometricResults));
                      localStorage.setItem('lastQuizResults', JSON.stringify({
                        quizResults: demoData.quizResults,
                        fieldQuizResults: null
                      }));
                      console.log('✅ Demo data saved to localStorage');
                    } catch (error) {
                      console.error('❌ Error saving demo data:', error);
                    }
                    
                    navigate('/ml-recommendations', { state: demoData });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Test ML Recommendations
                </button>
              </div>
              
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI-Powered Career Recommendations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Machine Learning based personalized guidance for your future</p>
        </div>

        {/* Student Profile Summary */}
        <div className="glass dark:glass-dark rounded-2xl p-8 mb-8 shadow-2xl animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Profile Analysis</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Dominant Traits</h3>
              <div className="space-y-2">
                {recommendations.studentProfile.dominantTraits.map((trait, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{trait.trait}</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{trait.score}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Academic Strength</h3>
              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {recommendations.studentProfile.academicStrength.score}%
                </div>
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  {recommendations.studentProfile.academicStrength.strength}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Analysis Type</h3>
              <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  {recommendations.studentProfile.recommendationBasis}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg">
            <div className="flex space-x-2">
              {[
                { id: 'degrees', label: 'Degree Programs', icon: '🎓' },
                { id: 'colleges', label: 'Colleges', icon: '🏛️' },
                { id: 'careers', label: 'Career Paths', icon: '💼' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'degrees' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                🎯 Recommended Degree Programs
              </h2>
              <div className="grid gap-6">
                {recommendations.degreeRecommendations.map((degree, index) => (
                  <div key={index} className="card-hover bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mr-6 shadow-lg ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                          index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white' :
                          'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{degree.degree}</h3>
                          <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">{degree.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold mb-1 ${getMatchColor(degree.match)}`}>
                          {Math.round(degree.match)}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ML Match</div>
                        <div className={`w-20 h-2 rounded-full mt-2 ${getMatchBgColor(degree.match)}`}>
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                            style={{ width: `${degree.match}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{degree.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Duration & Eligibility:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2"><strong>Duration:</strong> {degree.duration}</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Eligibility:</strong> {degree.eligibility}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          Career Prospects:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2"><strong>Salary:</strong> {formatSalary(degree.avgSalary)}</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Growth:</strong> {degree.growth}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Career Outcomes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {degree.careerOutcomes.map((career, idx) => (
                          <span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium shadow-sm">
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colleges' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  🏛️ Recommended Colleges
                </h2>
                {locationPermission === 'granted' && (
                  <p className="text-green-600 dark:text-green-400 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location-based recommendations enabled
                  </p>
                )}
              </div>
              
              <div className="grid gap-6">
                {recommendations.collegeRecommendations.map((college, index) => (
                  <div key={index} className="card-hover bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{college.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {college.location?.city}, {college.location?.state}
                          </span>
                          {college.distance && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              {college.distanceText || `${college.distance} km away`}
                              {college.durationText && (
                                <span className="ml-1 text-xs text-gray-500">
                                  ({college.durationText})
                                </span>
                              )}
                              {college.travelMode === 'driving' && (
                                <span className="ml-1 text-xs text-green-600" title="Real driving distance">
                                  🚗
                                </span>
                              )}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            college.type === 'government' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            college.type === 'private' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {college.type.charAt(0).toUpperCase() + college.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {college.ranking && (
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            Rank #{college.ranking}
                          </div>
                        )}
                        {college.locationScore && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Score: {Math.round(college.locationScore)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Available Courses:</h4>
                        <div className="flex flex-wrap gap-1">
                          {college.courses && Array.isArray(college.courses) && college.courses.length > 0 ? 
                            college.courses.slice(0, 3).map((course, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                                {course.name || course}
                              </span>
                            ))
                            :
                            <span className="text-gray-500 text-xs">No courses listed</span>
                          }
                          {college.courses && Array.isArray(college.courses) && college.courses.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                              +{college.courses.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Facilities:</h4>
                        <div className="flex flex-wrap gap-1">
                          {college.facilities && typeof college.facilities === 'object' ? 
                            Object.entries(college.facilities)
                              .filter(([key, value]) => value === true)
                              .map(([facility, value], idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                                  {facility.charAt(0).toUpperCase() + facility.slice(1).replace(/([A-Z])/g, ' $1')}
                                </span>
                              ))
                            : 
                            Array.isArray(college.facilities) ? 
                              college.facilities.map((facility, idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                                  {facility}
                                </span>
                              ))
                            :
                            <span className="text-gray-500 text-xs">No facilities listed</span>
                          }
                        </div>
                      </div>
                    </div>
                    
                    {(college.fees || college.fees?.tuitionFee) && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Annual Fees:</span>
                          <span className="text-gray-700 dark:text-gray-300 ml-2">
                            {typeof college.fees === 'number' 
                              ? `₹${college.fees.toLocaleString()}`
                              : college.fees?.tuitionFee 
                                ? `₹${college.fees.tuitionFee.toLocaleString()}`
                                : 'Contact college for fees'
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'careers' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                💼 Career Pathways
              </h2>
              <div className="grid gap-6">
                {recommendations.careerPathways.map((pathway, index) => (
                  <div key={index} className="card-hover bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{pathway.career}</h3>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">{pathway.pathway}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold mb-1 ${getMatchColor(pathway.matchScore)}`}>
                          {Math.round(pathway.matchScore)}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Match</div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Time to Career:</span>
                        <div className="text-gray-700 dark:text-gray-300">{pathway.timeToCareer}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Salary Range:</span>
                        <div className="text-green-700 dark:text-green-300 font-bold">{formatSalary(pathway.salaryRange)}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Growth:</span>
                        <div className="text-purple-700 dark:text-purple-300 font-medium">{pathway.growth}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12">
          <div className="flex justify-center space-x-6 flex-wrap gap-4">
            <button 
              onClick={() => navigate('/colleges')} 
              className="btn-animate px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
              </svg>
              Explore Colleges
            </button>
            
            <button 
              onClick={() => navigate('/courses')} 
              className="btn-animate px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Courses
            </button>
            
            <button 
              onClick={() => navigate('/profile')} 
              className="btn-animate px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLRecommendations;