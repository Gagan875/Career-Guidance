import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
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
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubjectChange = (subject) => {
    setProfile(prev => ({
      ...prev,
      academicBackground: {
        ...prev.academicBackground,
        subjects: prev.academicBackground.subjects.includes(subject)
          ? prev.academicBackground.subjects.filter(s => s !== subject)
          : [...prev.academicBackground.subjects, subject]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold">Student Profile</h1>
            <p className="text-blue-100">Complete your profile to get personalized guidance</p>
          </div>

          {message && (
            <div className={`px-6 py-3 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={profile.class}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Post Graduate</option>
                </select>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={profile.location.state}
                    onChange={(e) => handleInputChange('location.state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <input
                    type="text"
                    value={profile.location.district}
                    onChange={(e) => handleInputChange('location.district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your district"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profile.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interests</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {interestOptions.map((interest) => (
                  <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Academic Background */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Background</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stream</label>
                    <select
                      value={profile.academicBackground.stream}
                      onChange={(e) => handleInputChange('academicBackground.stream', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Stream</option>
                      <option value="science">Science</option>
                      <option value="commerce">Commerce</option>
                      <option value="arts">Arts</option>
                      <option value="diploma">diploma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Percentage</label>
                    <input
                      type="number"
                      step="0.01"
                      max="100"
                      value={profile.academicBackground.percentage}
                      onChange={(e) => handleInputChange('academicBackground.percentage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your percentage"
                    />
                  </div>
                </div>

                {profile.academicBackground.stream && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {subjectOptions[profile.academicBackground.stream]?.map((subject) => (
                        <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.academicBackground.subjects.includes(subject)}
                            onChange={() => handleSubjectChange(subject)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;