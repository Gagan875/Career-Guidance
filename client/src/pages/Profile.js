import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import QuizSelectionModal from '../components/QuizSelectionModal';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    class: '',
    location: {
      state: '',
      district: '',
      city: ''
    },
    interests: [],
    academicBackground: {
      stream: '',
      subjects: [],
      percentage: ''
    }
  });
  const [savedItems, setSavedItems] = useState({
    colleges: [],
    courses: [],
    careers: []
  });
  const [recommendations, setRecommendations] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const interestOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English Literature', 'History', 'Geography', 'Economics', 'Business Studies',
    'Arts & Crafts', 'Music', 'Sports', 'Social Work', 'Research'
  ];

  const subjectOptions = {
    science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
    commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
    arts: ['English', 'History', 'Geography', 'Political Science', 'Psychology', 'Sociology'],
    diploma: ['Computer Applications', 'Multimedia', 'Tourism', 'Fashion Design', 'Agriculture']
  };

  useEffect(() => {
    fetchProfile();
    fetchSavedItems();
    fetchUserData();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, using default profile');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success && response.data.profile) {
        const profileData = response.data.profile;
        
        // Map new profile structure to legacy format for compatibility
        const fetchedProfile = {
          age: profileData.personalInfo?.age || '',
          gender: profileData.personalInfo?.gender || '',
          class: profileData.academicInfo?.currentClass || '',
          location: {
            state: profileData.location?.state || '',
            district: profileData.location?.district || '',
            city: profileData.location?.city || ''
          },
          interests: profileData.careerPreferences?.interests?.map(interest => interest.name) || [],
          academicBackground: {
            stream: profileData.academicInfo?.stream || '',
            subjects: profileData.academicInfo?.subjects?.map(subject => subject.name) || [],
            percentage: profileData.academicInfo?.currentPercentage || ''
          }
        };
        setProfile(fetchedProfile);
        console.log('Profile loaded successfully:', fetchedProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Keep the default profile state if fetch fails
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}), // Handle undefined parent objects
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleInterestChange = (interest) => {
    setProfile(prev => {
      const currentInterests = prev.interests || [];
      return {
        ...prev,
        interests: currentInterests.includes(interest)
          ? currentInterests.filter(i => i !== interest)
          : [...currentInterests, interest]
      };
    });
  };

  const handleSubjectChange = (subject) => {
    setProfile(prev => {
      const currentAcademicBackground = prev.academicBackground || {};
      const currentSubjects = currentAcademicBackground.subjects || [];
      
      return {
        ...prev,
        academicBackground: {
          ...currentAcademicBackground,
          subjects: currentSubjects.includes(subject)
            ? currentSubjects.filter(s => s !== subject)
            : [...currentSubjects, subject]
        }
      };
    });
  };

  const fetchSavedItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/users/saved-items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        setSavedItems(response.data.savedItems);
      }
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.user;
      
      if (userData.quizResults && userData.quizResults.length > 0) {
        const latestQuiz = userData.quizResults[userData.quizResults.length - 1];
        setRecommendations(latestQuiz.recommendations || []);
        setRecentQuizzes(userData.quizResults.slice(-3));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const openQuizModal = () => setIsQuizModalOpen(true);
  const closeQuizModal = () => setIsQuizModalOpen(false);

  const handleRemoveSavedCollege = async (collegeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/save-college/${collegeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setSavedItems(prev => ({
        ...prev,
        colleges: prev.colleges.filter(item => 
          (item.collegeId._id || item.collegeId) !== collegeId
        )
      }));
      
      setMessage('College removed from saved items');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error removing saved college:', error);
      setMessage('Error removing college');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      // Map legacy format to new profile structure
      const profileData = {
        personalInfo: {
          age: profile.age,
          gender: profile.gender
        },
        academicInfo: {
          currentClass: profile.class,
          stream: profile.academicBackground.stream,
          currentPercentage: profile.academicBackground.percentage,
          subjects: profile.academicBackground.subjects.map(subject => ({
            name: subject,
            grade: '',
            marks: 0,
            maxMarks: 100
          }))
        },
        location: {
          state: profile.location.state,
          district: profile.location.district,
          city: profile.location.city
        },
        careerPreferences: {
          interests: profile.interests.map(interest => ({
            category: 'general',
            name: interest,
            level: 'medium'
          }))
        }
      };

      const response = await axios.put('http://localhost:5000/api/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false); // Close the edit section after successful update
      } else {
        setMessage('Error updating profile. Please try again.');
      }
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with gradient and animation */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Your Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your personal information and track your career guidance journey with our enhanced dashboard
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced User Information Card */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                    <p className="text-blue-100 opacity-90">Your profile details and contact information</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 transform font-medium"
                  >
                    {isEditing ? (
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Profile</span>
                      </span>
                    )}
                  </button>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Enhanced profile fields with icons */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Full Name</span>
                    </label>
                    <div className="text-xl font-bold text-gray-900 bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                      {user?.name || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email Address</span>
                    </label>
                    <div className="text-xl text-gray-900 bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                      {user?.email || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L16 7" />
                      </svg>
                      <span>Age</span>
                    </label>
                    <div className="text-xl text-gray-900 bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                      {profile.age || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Gender</span>
                    </label>
                    <div className="text-xl text-gray-900 capitalize bg-gray-50 rounded-lg p-4 border-l-4 border-pink-500">
                      {profile.gender || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Current Class</span>
                    </label>
                    <div className="text-xl text-gray-900 bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                      {profile.class ? `Class ${profile.class}` : 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                      </svg>
                      <span>Academic Stream</span>
                    </label>
                    <div className="text-xl text-gray-900 capitalize bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                      {profile.academicBackground?.stream || 'Not provided'}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Address Section */}
                <div className="mt-8">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-4">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Address</span>
                  </label>
                  <div className="text-xl text-gray-900 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
                    {profile.location?.city || profile.location?.district || profile.location?.state ? 
                      `${profile.location?.city || ''}, ${profile.location?.district || ''}, ${profile.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') 
                      : 'Not provided'
                    }
                  </div>
                </div>
                
                {/* Enhanced Interests Section */}
                {profile.interests && profile.interests.length > 0 && (
                  <div className="mt-8">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-4">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Interests & Hobbies</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {profile.interests.map((interest, index) => (
                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow duration-200">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Edit Profile Form */}
            {isEditing && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 animate-fadeIn">
                <div className="px-8 py-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Edit Profile Information</h2>
                    <p className="text-gray-200 opacity-90">Update your personal details and preferences</p>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
                </div>

                {message && (
                  <div className={`px-8 py-4 border-l-4 ${message.includes('Error') ? 'bg-red-50 text-red-700 border-red-400' : 'bg-green-50 text-green-700 border-green-400'} animate-slideIn`}>
                    <div className="flex items-center space-x-2">
                      {message.includes('Error') ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className="font-medium">{message}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {/* Enhanced Basic Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Basic Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Age</label>
                        <input
                          type="number"
                          value={profile.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                          placeholder="Enter your age"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                        <select
                          value={profile.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Class</label>
                        <select
                          value={profile.class}
                          onChange={(e) => handleInputChange('class', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        >
                          <option value="">Select Class</option>
                          <option value="10">Class 10</option>
                          <option value="11">Class 11</option>
                          <option value="12">Class 12</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Location Information */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Address Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
                        <input
                          type="text"
                          value={profile.location?.state || ''}
                          onChange={(e) => handleInputChange('location.state', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                          placeholder="Enter your state"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">District</label>
                        <input
                          type="text"
                          value={profile.location?.district || ''}
                          onChange={(e) => handleInputChange('location.district', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                          placeholder="Enter your district"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
                        <input
                          type="text"
                          value={profile.location?.city || ''}
                          onChange={(e) => handleInputChange('location.city', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Interests */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Interests & Hobbies</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {interestOptions.map((interest) => (
                        <label key={interest} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors duration-200 group">
                          <input
                            type="checkbox"
                            checked={profile.interests?.includes(interest) || false}
                            onChange={() => handleInterestChange(interest)}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Previous Class Percentage */}
                  {profile.class && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Previous Academic Performance</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.class === '10' && (
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Class 9th Percentage</label>
                            <input
                              type="number"
                              step="0.01"
                              max="100"
                              value={profile.academicBackground?.percentage || ''}
                              onChange={(e) => handleInputChange('academicBackground.percentage', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                              placeholder="Enter your 9th class percentage"
                            />
                          </div>
                        )}
                        {profile.class === '11' && (
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Class 10th Percentage</label>
                            <input
                              type="number"
                              step="0.01"
                              max="100"
                              value={profile.academicBackground?.percentage || ''}
                              onChange={(e) => handleInputChange('academicBackground.percentage', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                              placeholder="Enter your 10th class percentage"
                            />
                          </div>
                        )}
                        {profile.class === '12' && (
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Class 11th Percentage</label>
                            <input
                              type="number"
                              step="0.01"
                              max="100"
                              value={profile.academicBackground?.percentage || ''}
                              onChange={(e) => handleInputChange('academicBackground.percentage', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                              placeholder="Enter your 11th class percentage"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Academic Background */}
                  {(profile.class === '11' || profile.class === '12') && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Current Academic Background</span>
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Academic Stream</label>
                            <select
                              value={profile.academicBackground?.stream || ''}
                              onChange={(e) => handleInputChange('academicBackground.stream', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                            >
                              <option value="">Select Stream</option>
                              <option value="science">Science</option>
                              <option value="commerce">Commerce</option>
                              <option value="arts">Arts</option>
                              <option value="diploma">Diploma</option>
                            </select>
                          </div>
                        </div>

                        {profile.academicBackground?.stream && (
                          <div className="animate-fadeIn">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Subjects</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {subjectOptions[profile.academicBackground?.stream]?.map((subject) => (
                                <label key={subject} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors duration-200 group">
                                  <input
                                    type="checkbox"
                                    checked={profile.academicBackground?.subjects?.includes(subject) || false}
                                    onChange={() => handleSubjectChange(subject)}
                                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                                  />
                                  <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{subject}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Submit Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:scale-105 transform border border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <span className="flex items-center space-x-2">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Update Profile</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Enhanced Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="px-8 py-6 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Your Recommendations</h2>
                    <p className="text-purple-100 opacity-90">Personalized career paths based on your quiz results</p>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {recommendations.map((stream, index) => (
                      <div key={index} className="group flex items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-100 hover:shadow-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg capitalize text-gray-900 mb-1">{stream} Stream</h3>
                          <p className="text-sm text-gray-600">Recommended based on your interests and aptitude</p>
                        </div>
                        <Link 
                          to={`/courses?stream=${stream}`}
                          className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
                        >
                          <span className="flex items-center space-x-2">
                            <span>View Courses</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Recent Quiz Results */}
            {recentQuizzes.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Recent Quiz Results</h2>
                    <p className="text-indigo-100 opacity-90">Your latest assessment scores and achievements</p>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz, index) => (
                      <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg capitalize text-gray-900">{quiz.quizType} Assessment</h3>
                            <p className="text-sm text-gray-600">
                              Score: <span className="font-semibold text-indigo-600">{quiz.score}</span> | {new Date(quiz.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Recommendations:</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {quiz.recommendations.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Quick Links */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold">Quick Actions</h3>
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <button 
                    onClick={openQuizModal}
                    className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-300 border border-blue-100 hover:shadow-lg group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Take Career Quiz</div>
                        <div className="text-sm text-gray-600">Discover your ideal career path</div>
                      </div>
                    </div>
                  </button>
                  
                  <Link to="/colleges" className="block p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-300 border border-green-100 hover:shadow-lg group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">Explore Colleges</div>
                        <div className="text-sm text-gray-600">Find nearby government colleges</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/courses" className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-300 border border-purple-100 hover:shadow-lg group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Browse Courses</div>
                        <div className="text-sm text-gray-600">Explore available courses</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Saved Colleges Section */}
        {savedItems.colleges && savedItems.colleges.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="px-8 py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Saved Colleges ({savedItems.colleges.length})</h2>
                <p className="text-green-100 opacity-90">Colleges you've bookmarked for future reference</p>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
            </div>
            
            <div className="p-8">
              <div className="grid gap-6">
                {savedItems.colleges.map((item, index) => {
                  const college = item.collegeId;
                  return (
                    <div key={index} className="group border-2 border-gray-100 hover:border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-green-50/30">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                                {college.name || 'College Name Not Available'}
                              </h3>
                              {college.location && (
                                <p className="text-gray-600 text-sm mb-3 flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>{college.location.city}, {college.location.state}</span>
                                </p>
                              )}
                              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                                <span className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L16 7" />
                                  </svg>
                                  <span>Saved: {new Date(item.savedAt).toLocaleDateString()}</span>
                                </span>
                                {item.priority && (
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    item.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    'bg-green-100 text-green-800 border border-green-200'
                                  }`}>
                                    {item.priority} priority
                                  </span>
                                )}
                              </div>
                              {item.notes && (
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                                  <p className="text-gray-700 text-sm italic">
                                    <span className="font-semibold text-blue-700">Notes:</span> {item.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3 ml-6">
                          <button
                            onClick={() => handleRemoveSavedCollege(college._id || college)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-200 hover:scale-105 transform font-medium border border-red-200 hover:border-red-300"
                          >
                            <span className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Remove</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Selection Modal */}
        <QuizSelectionModal isOpen={isQuizModalOpen} onClose={closeQuizModal} />
      </div>
    </div>
  );
};

export default Profile;