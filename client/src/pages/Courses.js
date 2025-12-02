import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    stream: searchParams.get('stream') || '',
    degree: ''
  });

  // Sample course data
  const sampleCourses = [
    {
      _id: '1',
      name: 'Bachelor of Science in Physics',
      code: 'B.Sc Physics',
      stream: 'science',
      degree: 'bachelor',
      duration: { years: 3, months: 0 },
      description: 'A comprehensive program covering fundamental and advanced concepts in physics, preparing students for research and industry careers.',
      eligibility: {
        minimumMarks: 60,
        requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
        entranceExam: 'None'
      },
      careerPaths: [
        {
          jobTitle: 'Research Scientist',
          industry: 'Research & Development',
          averageSalary: { min: 400000, max: 800000 },
          description: 'Conduct scientific research in physics and related fields'
        },
        {
          jobTitle: 'Physics Teacher',
          industry: 'Education',
          averageSalary: { min: 300000, max: 600000 },
          description: 'Teach physics at school or college level'
        },
        {
          jobTitle: 'Data Analyst',
          industry: 'Technology',
          averageSalary: { min: 350000, max: 700000 },
          description: 'Analyze complex data using mathematical and statistical methods'
        }
      ],
      higherEducationOptions: [
        { courseName: 'Master of Science in Physics', degree: 'master', description: 'Advanced study in specialized physics areas' },
        { courseName: 'Master of Technology', degree: 'master', description: 'Applied physics and engineering' }
      ],
      governmentExams: [
        { examName: 'CSIR NET', description: 'For research fellowships and lectureship', eligibility: 'Graduate in Physics' },
        { examName: 'GATE Physics', description: 'For M.Tech admissions and PSU jobs', eligibility: 'B.Sc Physics' }
      ],
      skills: ['Analytical Thinking', 'Mathematical Skills', 'Problem Solving', 'Research Methods'],
      subjects: ['Classical Mechanics', 'Quantum Physics', 'Thermodynamics', 'Electromagnetism']
    },
    {
      _id: '2',
      name: 'Bachelor of Commerce',
      code: 'B.Com',
      stream: 'commerce',
      degree: 'bachelor',
      duration: { years: 3, months: 0 },
      description: 'A comprehensive business program covering accounting, finance, economics, and business management principles.',
      eligibility: {
        minimumMarks: 50,
        requiredSubjects: ['Mathematics', 'English'],
        entranceExam: 'None'
      },
      careerPaths: [
        {
          jobTitle: 'Chartered Accountant',
          industry: 'Finance & Accounting',
          averageSalary: { min: 600000, max: 1500000 },
          description: 'Provide accounting, auditing, and financial advisory services'
        },
        {
          jobTitle: 'Financial Analyst',
          industry: 'Banking & Finance',
          averageSalary: { min: 400000, max: 900000 },
          description: 'Analyze financial data and market trends'
        },
        {
          jobTitle: 'Business Manager',
          industry: 'Corporate',
          averageSalary: { min: 500000, max: 1200000 },
          description: 'Manage business operations and strategy'
        }
      ],
      higherEducationOptions: [
        { courseName: 'Master of Commerce', degree: 'master', description: 'Advanced commerce and business studies' },
        { courseName: 'MBA', degree: 'master', description: 'Master of Business Administration' }
      ],
      governmentExams: [
        { examName: 'CA Foundation', description: 'First level of Chartered Accountancy', eligibility: 'Class 12 passed' },
        { examName: 'Banking Exams', description: 'For banking sector jobs', eligibility: 'Graduate' }
      ],
      skills: ['Financial Analysis', 'Accounting', 'Business Communication', 'Strategic Thinking'],
      subjects: ['Financial Accounting', 'Business Economics', 'Corporate Law', 'Taxation']
    },
    {
      _id: '3',
      name: 'Bachelor of Arts in English Literature',
      code: 'BA English',
      stream: 'arts',
      degree: 'bachelor',
      duration: { years: 3, months: 0 },
      description: 'Study of English language, literature, and critical analysis of literary works from various periods and cultures.',
      eligibility: {
        minimumMarks: 45,
        requiredSubjects: ['English'],
        entranceExam: 'None'
      },
      careerPaths: [
        {
          jobTitle: 'Content Writer',
          industry: 'Media & Publishing',
          averageSalary: { min: 250000, max: 600000 },
          description: 'Create written content for various media platforms'
        },
        {
          jobTitle: 'English Teacher',
          industry: 'Education',
          averageSalary: { min: 300000, max: 700000 },
          description: 'Teach English language and literature'
        },
        {
          jobTitle: 'Journalist',
          industry: 'Media',
          averageSalary: { min: 300000, max: 800000 },
          description: 'Report news and write articles for newspapers and magazines'
        }
      ],
      higherEducationOptions: [
        { courseName: 'Master of Arts in English', degree: 'master', description: 'Advanced study of English literature' },
        { courseName: 'Master of Journalism', degree: 'master', description: 'Specialized journalism training' }
      ],
      governmentExams: [
        { examName: 'UGC NET English', description: 'For lectureship and research', eligibility: 'MA English' },
        { examName: 'Civil Services', description: 'For administrative services', eligibility: 'Graduate' }
      ],
      skills: ['Writing Skills', 'Critical Analysis', 'Communication', 'Research'],
      subjects: ['British Literature', 'American Literature', 'Indian English Literature', 'Literary Criticism']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(sampleCourses);
      setLoading(false);
    }, 1000);
  }, []);

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Directory</h1>
        <p className="text-gray-600">
          Explore different degree programs and their career prospects to make informed decisions.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stream</label>
                <select
                  className="input-field"
                  value={filters.stream}
                  onChange={(e) => handleFilterChange('stream', e.target.value)}
                >
                  <option value="">All Streams</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts</option>
                  <option value="diploma">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree Level</label>
                <select
                  className="input-field"
                  value={filters.degree}
                  onChange={(e) => handleFilterChange('degree', e.target.value)}
                >
                  <option value="">All Degrees</option>
                  <option value="bachelor">Bachelor's</option>
                  <option value="master">Master's</option>
                  <option value="diploma">Diploma</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredCourses.length} courses
            </p>
          </div>

          <div className="space-y-6">
            {filteredCourses.map(course => (
              <div key={course._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="capitalize bg-primary-100 text-primary-800 px-2 py-1 rounded">
                        {course.stream}
                      </span>
                      <span>{course.duration.years} years</span>
                      <span>Min. {course.eligibility.minimumMarks}% required</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(selectedCourse === course._id ? null : course._id)}
                    className="btn-primary text-sm"
                  >
                    {selectedCourse === course._id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                <p className="text-gray-600 mb-4">{course.description}</p>

                {selectedCourse === course._id && (
                  <div className="border-t border-gray-200 pt-4 space-y-6">
                    {/* Career Paths */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Career Opportunities</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {course.careerPaths.map((career, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <h5 className="font-medium text-gray-900">{career.jobTitle}</h5>
                            <p className="text-sm text-gray-600 mb-1">{career.industry}</p>
                            <p className="text-sm text-green-600 font-medium">
                              ₹{(career.averageSalary.min / 100000).toFixed(1)}L - ₹{(career.averageSalary.max / 100000).toFixed(1)}L per year
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{career.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Higher Education */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Higher Education Options</h4>
                      <div className="space-y-2">
                        {course.higherEducationOptions.map((option, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-900">{option.courseName}</h5>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                            <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded capitalize">
                              {option.degree}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Government Exams */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Relevant Government Exams</h4>
                      <div className="space-y-2">
                        {course.governmentExams.map((exam, index) => (
                          <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                            <h5 className="font-medium text-gray-900">{exam.examName}</h5>
                            <p className="text-sm text-gray-600">{exam.description}</p>
                            <p className="text-sm text-yellow-700 mt-1">Eligibility: {exam.eligibility}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills & Subjects */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Skills Developed</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Core Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.subjects.map((subject, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more courses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;