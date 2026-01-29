import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/animations.css';

const Colleges = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [savedColleges, setSavedColleges] = useState(new Set());
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchColleges();
    if (user) {
      console.log('User is authenticated:', user);
      fetchSavedColleges();
    } else {
      console.log('User is not authenticated');
    }
  }, [filters, user]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.district) queryParams.append('district', filters.district);
      if (filters.type) queryParams.append('type', filters.type);
      queryParams.append('limit', '50');

      const response = await axios.get(`http://localhost:5000/api/colleges?${queryParams}`);
      setColleges(response.data.colleges);
      
      const uniqueStates = [...new Set(response.data.colleges.map(college => college.location.state))];
      const uniqueDistricts = [...new Set(response.data.colleges.map(college => college.location.district))];
      setStates(uniqueStates.sort());
      setDistricts(uniqueDistricts.sort());
      
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !filters.state || college.location.state === filters.state;
    const matchesDistrict = !filters.district || college.location.district === filters.district;
    const matchesType = !filters.type || college.type === filters.type;

    return matchesSearch && matchesState && matchesDistrict && matchesType;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleViewDetails = async (collegeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/colleges/${collegeId}`);
      setSelectedCollege(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching college details:', error);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/saved-items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const savedCollegeIds = new Set(
        response.data.savedItems.colleges.map(item => item.collegeId._id || item.collegeId)
      );
      setSavedColleges(savedCollegeIds);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    }
  };

  const handleSaveCollege = async (collegeId, collegeName) => {
    if (!user) {
      setShowAuthMessage(true);
      setTimeout(() => setShowAuthMessage(false), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (savedColleges.has(collegeId)) {
        await axios.delete(`http://localhost:5000/api/users/save-college/${collegeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedColleges(prev => {
          const newSet = new Set(prev);
          newSet.delete(collegeId);
          return newSet;
        });
        alert('College removed from saved items');
      } else {
        await axios.post('http://localhost:5000/api/users/save-college', {
          collegeId,
          priority: 'medium'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedColleges(prev => new Set([...prev, collegeId]));
        alert(`${collegeName} saved successfully!`);
      }
    } catch (error) {
      console.error('Error saving college:', error);
      alert(error.response?.data?.message || 'Error saving college');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCollege(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-custom">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Colleges</h3>
          <p className="text-gray-600 dark:text-gray-400">Discovering the best educational institutions for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-600 bg-clip-text text-transparent dark:from-white dark:via-green-400 dark:to-blue-400 mb-6">
            College Directory
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover government and government aided colleges near you with detailed information about courses, facilities, and admission requirements.
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-12 border border-white/20 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Your Perfect College
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Search Colleges</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search colleges or cities..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">State</label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200"
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">District</label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200"
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">College Type</label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="government">Government</option>
                <option value="aided">Government Aided</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{filteredColleges.length}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {filteredColleges.length === 1 ? 'College Found' : 'Colleges Found'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Matching your search criteria
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Government</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Government Aided</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced College Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredColleges.map((college, index) => (
            <div key={college._id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn card-hover" style={{animationDelay: `${index * 0.1}s`}}>
              {/* College Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {college.name}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{college.location.city}, {college.location.state}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          college.type === 'government' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : college.type === 'aided' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {college.type === 'government' ? 'Government' : 
                           college.type === 'aided' ? 'Government Aided' : 
                           college.type}
                        </span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{college.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Courses */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Available Courses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {college.courses && college.courses.length > 0 ? (
                    <>
                      {college.courses.slice(0, 3).map((course, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm rounded-full border border-purple-200 font-medium">
                          {course.code || course.name}
                        </span>
                      ))}
                      {college.courses.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full border border-gray-200 dark:border-gray-600 font-medium">
                          +{college.courses.length - 3} more
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full border border-gray-200 dark:border-gray-600">
                      Courses available
                    </span>
                  )}
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                  </svg>
                  Facilities
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {college.facilities.hostel && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Hostel</span>
                    </div>
                  )}
                  {college.facilities.library && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Library</span>
                    </div>
                  )}
                  {college.facilities.laboratory && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Lab</span>
                    </div>
                  )}
                  {college.facilities.internetAccess && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Internet</span>
                    </div>
                  )}
                  {college.facilities.sportsComplex && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Sports</span>
                    </div>
                  )}
                  {college.facilities.canteen && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Canteen</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Fee and Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Annual Fees</span>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">₹{college.fees.tuitionFee.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                    onClick={() => handleViewDetails(college._id)}
                  >
                    View Details
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                      savedColleges.has(college._id)
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    } hover:scale-105 transform`}
                    onClick={() => handleSaveCollege(college._id, college.name)}
                  >
                    {savedColleges.has(college._id) ? (
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Saved</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Save</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced No Results Section */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse-custom">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Colleges Found</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't find any colleges matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ state: '', district: '', type: '' });
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear All Filters
              </button>
              <button 
                onClick={() => navigate('/courses')}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Browse Courses Instead
              </button>
            </div>
          </div>
        )}

        {/* Enhanced College Details Modal */}
        {showModal && selectedCollege && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scaleIn">
              <div className="p-8">
                {/* Enhanced Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{selectedCollege.name}</h2>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-lg">{selectedCollege.location.address}, {selectedCollege.location.city}, {selectedCollege.location.state}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{selectedCollege.rating}</span>
                      </div>
                      <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                        selectedCollege.type === 'government' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : selectedCollege.type === 'aided' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {selectedCollege.type === 'government' ? 'Government' : 
                         selectedCollege.type === 'aided' ? 'Government Aided' : 
                         selectedCollege.type}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedCollege.contact.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedCollege.contact.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Website:</span>
                        <p className="font-medium text-blue-600 dark:text-blue-400">{selectedCollege.contact.website}</p>
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-700/50">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Facilities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`flex items-center ${selectedCollege.facilities.hostel ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        <span className="mr-2">{selectedCollege.facilities.hostel ? '✓' : '✗'}</span>
                        Hostel
                      </div>
                      <div className={`flex items-center ${selectedCollege.facilities.library ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        <span className="mr-2">{selectedCollege.facilities.library ? '✓' : '✗'}</span>
                        Library
                      </div>
                      <div className={`flex items-center ${selectedCollege.facilities.laboratory ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        <span className="mr-2">{selectedCollege.facilities.laboratory ? '✓' : '✗'}</span>
                        Laboratory
                      </div>
                      <div className={`flex items-center ${selectedCollege.facilities.internetAccess ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        <span className="mr-2">{selectedCollege.facilities.internetAccess ? '✓' : '✗'}</span>
                        Internet
                      </div>
                      <div className={`flex items-center ${selectedCollege.facilities.sportsComplex ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        <span className="mr-2">{selectedCollege.facilities.sportsComplex ? '✓' : '✗'}</span>
                        Sports Complex
                      </div>
                      <div className={`flex items-center ${selectedCollege.facilities.canteen ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        <span className="mr-2">{selectedCollege.facilities.canteen ? '✓' : '✗'}</span>
                        Canteen
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    Close
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                      savedColleges.has(selectedCollege._id)
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    } hover:scale-105 transform`}
                    onClick={() => handleSaveCollege(selectedCollege._id, selectedCollege.name)}
                  >
                    {savedColleges.has(selectedCollege._id) ? 'Saved ✓' : 'Save College'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Message Modal */}
        {showAuthMessage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl max-w-md w-full p-8 mx-4 shadow-2xl border border-white/20 dark:border-gray-700/50 animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-6">
                  <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Sign Up Required
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  You need to create an account to save colleges and access personalized features.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/register"
                    className="inline-flex justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign Up Now
                  </a>
                  <a
                    href="/login"
                    className="inline-flex justify-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Already have an account? Login
                  </a>
                </div>
                
                <button
                  onClick={() => setShowAuthMessage(false)}
                  className="mt-6 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Colleges;