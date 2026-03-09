import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import '../styles/animations.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    stream: searchParams.get('stream') || '',
    degree: ''
  });
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.stream) queryParams.append('stream', filters.stream);
      if (filters.degree) queryParams.append('degree', filters.degree);
      queryParams.append('limit', '50'); // Get more courses

      const response = await axios.get(`${API_BASE_URL}/api/courses?${queryParams}`);
      setCourses(response.data.courses);
      
      // Extract unique streams for filters
      const uniqueStreams = [...new Set(response.data.courses.map(course => course.stream))];
      setStreams(uniqueStreams.sort());
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesStream = !filters.stream || course.stream === filters.stream;
    const matchesDegree = !filters.degree || course.degree === filters.degree;
    return matchesStream && matchesDegree;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-custom">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Courses</h3>
          <p className="text-gray-600 dark:text-gray-400">Discovering academic programs and career paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-white dark:via-purple-400 dark:to-blue-400 mb-6">
            Course Directory
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore different degree programs and their career prospects to make informed decisions about your academic future.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20 sticky top-4 animate-fadeIn">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
                <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filters
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Stream</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200"
                    value={filters.stream}
                    onChange={(e) => handleFilterChange('stream', e.target.value)}
                  >
                    <option value="">All Streams</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream} className="capitalize">{stream}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Degree Level</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200"
                    value={filters.degree}
                    onChange={(e) => handleFilterChange('degree', e.target.value)}
                  >
                    <option value="">All Degrees</option>
                    <option value="bachelor">Bachelor's</option>
                    <option value="master">Master's</option>
                    <option value="diploma">Diploma</option>
                    <option value="certificate">Certificate</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Course List */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            <div className="mb-8 animate-fadeIn">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{filteredCourses.length}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {filteredCourses.length === 1 ? 'Course Found' : 'Courses Found'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Matching your criteria
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Academic Programs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Career Paths</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {filteredCourses.map((course, index) => (
                <div key={course._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn card-hover" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{course.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full border border-purple-200 font-medium capitalize">
                            {course.stream}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration?.years || 0} years {course.duration?.months ? `${course.duration.months} months` : ''}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Min. {course.eligibility?.minimumMarks || 'N/A'}% required
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(selectedCourse === course._id ? null : course._id)}
                      className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                        selectedCourse === course._id
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      } hover:scale-105 transform`}
                    >
                      {selectedCourse === course._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">{course.description}</p>

                  {selectedCourse === course._id && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 space-y-8 animate-fadeIn">
                      {/* Career Paths */}
                      {course.careerPaths && course.careerPaths.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Career Opportunities
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            {course.careerPaths.map((career, idx) => (
                              <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-700/50">
                                <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{career.jobTitle}</h5>
                                <p className="text-sm text-green-600 dark:text-green-400 mb-3 font-medium">{career.industry}</p>
                                {career.averageSalary && (
                                  <p className="text-sm text-green-700 dark:text-green-300 font-bold mb-3 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full inline-block">
                                    ₹{(career.averageSalary.min / 100000).toFixed(1)}L - ₹{(career.averageSalary.max / 100000).toFixed(1)}L per year
                                  </p>
                                )}
                                <p className="text-gray-700 dark:text-gray-300">{career.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Higher Education */}
                      {course.higherEducationOptions && course.higherEducationOptions.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            Higher Education Options
                          </h4>
                          <div className="space-y-4">
                            {course.higherEducationOptions.map((option, idx) => (
                              <div key={idx} className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                                <div>
                                  <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{option.courseName}</h5>
                                  <p className="text-gray-700 dark:text-gray-300">{option.description}</p>
                                </div>
                                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full font-semibold capitalize">
                                  {option.degree}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Government Exams */}
                      {course.governmentExams && course.governmentExams.length > 0 && (
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Relevant Government Exams
                          </h4>
                          <div className="space-y-4">
                            {course.governmentExams.map((exam, idx) => (
                              <div key={idx} className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50">
                                <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{exam.examName}</h5>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">{exam.description}</p>
                                <p className="text-yellow-700 dark:text-yellow-300 font-medium bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full inline-block">
                                  Eligibility: {exam.eligibility}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills & Subjects */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {course.skills && course.skills.length > 0 && (
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                              <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              Key Skills Developed
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {course.skills.map((skill, idx) => (
                                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-medium border border-purple-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {course.subjects && course.subjects.length > 0 && (
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                              <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              Core Subjects
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {course.subjects.map((subject, idx) => (
                                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full font-medium border border-indigo-200">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Eligibility Requirements */}
                      {course.eligibility && (
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Eligibility Requirements
                          </h4>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                            <div className="grid md:grid-cols-3 gap-6">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Minimum Marks</span>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{course.eligibility.minimumMarks || 'N/A'}%</p>
                              </div>
                              <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Entrance Exam</span>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{course.eligibility.entranceExam || 'Merit Based'}</p>
                              </div>
                              <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Required Subjects</span>
                                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                  {course.eligibility.requiredSubjects && course.eligibility.requiredSubjects.length > 0 
                                    ? course.eligibility.requiredSubjects.join(', ') 
                                    : 'Any stream'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Enhanced No Results Section */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16 animate-fadeIn">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse-custom">
                  <svg className="w-12 h-12 text-purple-400 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Courses Found</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  We couldn't find any courses matching your criteria. Try adjusting your filters to see more options.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setFilters({ stream: '', degree: '' })}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                  <button 
                    onClick={() => window.location.href = '/colleges'}
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                  >
                    Browse Colleges Instead
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;