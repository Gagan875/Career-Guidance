import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Sample college data (since we don't have real data yet)
  const sampleColleges = [
    {
      _id: '1',
      name: 'Government Degree College, Delhi',
      type: 'government',
      location: {
        state: 'Delhi',
        district: 'Central Delhi',
        city: 'New Delhi',
        address: 'Connaught Place, New Delhi'
      },
      contact: {
        phone: '+91-11-23456789',
        email: 'info@gdcdelhi.edu.in',
        website: 'www.gdcdelhi.edu.in'
      },
      courses: [
        { name: 'Bachelor of Arts', code: 'BA', stream: 'arts' },
        { name: 'Bachelor of Commerce', code: 'B.Com', stream: 'commerce' },
        { name: 'Bachelor of Science', code: 'B.Sc', stream: 'science' }
      ],
      facilities: {
        hostel: true,
        library: true,
        laboratory: true,
        internetAccess: true,
        sportsComplex: true,
        canteen: true
      },
      fees: {
        tuitionFee: 15000,
        hostelFee: 25000,
        otherFees: 5000
      },
      rating: 4.2
    },
    {
      _id: '2',
      name: 'Government College of Arts & Science, Mumbai',
      type: 'government',
      location: {
        state: 'Maharashtra',
        district: 'Mumbai',
        city: 'Mumbai',
        address: 'Dadar, Mumbai'
      },
      contact: {
        phone: '+91-22-24567890',
        email: 'info@gcasmumbai.edu.in',
        website: 'www.gcasmumbai.edu.in'
      },
      courses: [
        { name: 'Bachelor of Arts', code: 'BA', stream: 'arts' },
        { name: 'Bachelor of Science', code: 'B.Sc', stream: 'science' },
        { name: 'Bachelor of Computer Applications', code: 'BCA', stream: 'diploma' }
      ],
      facilities: {
        hostel: false,
        library: true,
        laboratory: true,
        internetAccess: true,
        sportsComplex: false,
        canteen: true
      },
      fees: {
        tuitionFee: 12000,
        hostelFee: 0,
        otherFees: 3000
      },
      rating: 3.8
    },
    {
      _id: '3',
      name: 'Government Degree College, Bangalore',
      type: 'government',
      location: {
        state: 'Karnataka',
        district: 'Bangalore Urban',
        city: 'Bangalore',
        address: 'MG Road, Bangalore'
      },
      contact: {
        phone: '+91-80-25678901',
        email: 'info@gdcbangalore.edu.in',
        website: 'www.gdcbangalore.edu.in'
      },
      courses: [
        { name: 'Bachelor of Commerce', code: 'B.Com', stream: 'commerce' },
        { name: 'Bachelor of Business Administration', code: 'BBA', stream: 'commerce' },
        { name: 'Bachelor of Science', code: 'B.Sc', stream: 'science' }
      ],
      facilities: {
        hostel: true,
        library: true,
        laboratory: true,
        internetAccess: true,
        sportsComplex: true,
        canteen: true
      },
      fees: {
        tuitionFee: 18000,
        hostelFee: 30000,
        otherFees: 7000
      },
      rating: 4.5
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setColleges(sampleColleges);
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Government Colleges Directory</h1>
        <p className="text-gray-600">
          Discover government colleges near you with detailed information about courses and facilities.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search colleges or cities..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              className="input-field"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            >
              <option value="">All States</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select
              className="input-field"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            >
              <option value="">All Districts</option>
              <option value="Central Delhi">Central Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore Urban">Bangalore Urban</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              className="input-field"
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

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredColleges.length} colleges
        </p>
      </div>

      {/* College Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredColleges.map(college => (
          <div key={college._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{college.name}</h3>
                <p className="text-gray-600 text-sm">
                  {college.location.address}, {college.location.city}, {college.location.state}
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium ml-1">{college.rating}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Available Courses</h4>
              <div className="flex flex-wrap gap-2">
                {college.courses.slice(0, 3).map((course, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    {course.code}
                  </span>
                ))}
                {college.courses.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    +{college.courses.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Facilities</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {college.facilities.hostel && <span className="text-green-600">✓ Hostel</span>}
                {college.facilities.library && <span className="text-green-600">✓ Library</span>}
                {college.facilities.laboratory && <span className="text-green-600">✓ Lab</span>}
                {college.facilities.internetAccess && <span className="text-green-600">✓ Internet</span>}
                {college.facilities.sportsComplex && <span className="text-green-600">✓ Sports</span>}
                {college.facilities.canteen && <span className="text-green-600">✓ Canteen</span>}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <span className="text-sm text-gray-600">Annual Fees</span>
                <div className="font-semibold">₹{college.fees.tuitionFee.toLocaleString()}</div>
              </div>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">View Details</button>
                <button className="btn-primary text-sm">Save College</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredColleges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default Colleges;