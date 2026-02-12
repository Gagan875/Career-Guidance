const User = require('../models/User');
const College = require('../models/College');
const Course = require('../models/Course');

class RecommendationService {
  constructor() {
    // Career outcome mapping based on degree programs
    this.degreeCareerMapping = {
      'B.Tech': {
        careers: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Technical Lead', 'Startup Founder'],
        sectors: ['Technology', 'Engineering', 'Research', 'Consulting'],
        avgSalary: { min: 600000, max: 2500000 },
        growth: 'Excellent'
      },
      'MBBS': {
        careers: ['Doctor', 'Medical Researcher', 'Healthcare Administrator', 'Medical Consultant'],
        sectors: ['Healthcare', 'Research', 'Public Health', 'Pharmaceuticals'],
        avgSalary: { min: 800000, max: 5000000 },
        growth: 'Very High'
      },
      'B.Com': {
        careers: ['Financial Analyst', 'Accountant', 'Business Analyst', 'Banking Professional'],
        sectors: ['Finance', 'Banking', 'Consulting', 'Government'],
        avgSalary: { min: 300000, max: 1500000 },
        growth: 'Good'
      },
      'BBA': {
        careers: ['Business Manager', 'Marketing Executive', 'HR Manager', 'Operations Manager'],
        sectors: ['Management', 'Marketing', 'HR', 'Operations'],
        avgSalary: { min: 400000, max: 2000000 },
        growth: 'Good'
      },
      'B.A.': {
        careers: ['Civil Servant', 'Teacher', 'Content Writer', 'Social Worker', 'Journalist'],
        sectors: ['Government', 'Education', 'Media', 'NGO'],
        avgSalary: { min: 250000, max: 1200000 },
        growth: 'Stable'
      },
      'B.Sc': {
        careers: ['Research Scientist', 'Lab Technician', 'Quality Analyst', 'Environmental Consultant'],
        sectors: ['Research', 'Healthcare', 'Environment', 'Quality Control'],
        avgSalary: { min: 300000, max: 1800000 },
        growth: 'Good'
      },
      'Diploma': {
        careers: ['Technical Specialist', 'Supervisor', 'Technician', 'Quality Inspector'],
        sectors: ['Manufacturing', 'Technical Services', 'Quality Control'],
        avgSalary: { min: 200000, max: 800000 },
        growth: 'Stable'
      }
    };

    // Personality trait to career field mapping
    this.traitCareerMapping = {
      analytical: ['Engineering', 'Research', 'Data Science', 'Finance', 'Medicine'],
      creativity: ['Design', 'Arts', 'Marketing', 'Architecture', 'Media'],
      leadership: ['Management', 'Business', 'Politics', 'Entrepreneurship'],
      social: ['Teaching', 'Healthcare', 'Social Work', 'Psychology', 'HR'],
      communication: ['Media', 'Sales', 'Teaching', 'Law', 'Public Relations'],
      detail_oriented: ['Accounting', 'Quality Control', 'Research', 'Medicine'],
      risk_tolerance: ['Entrepreneurship', 'Finance', 'Sales', 'Consulting'],
      openness: ['Research', 'Arts', 'Innovation', 'Consulting'],
      extraversion: ['Sales', 'Management', 'Teaching', 'Public Relations'],
      conscientiousness: ['Project Management', 'Administration', 'Quality Control']
    };

    // Field to degree mapping
    this.fieldDegreeMapping = {
      'engineering': ['B.Tech', 'B.E.', 'Diploma in Engineering'],
      'medical': ['MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Pharm'],
      'computer-science': ['B.Tech CSE', 'BCA', 'B.Sc Computer Science'],
      'data-science': ['B.Tech CSE', 'B.Sc Statistics', 'B.Sc Mathematics'],
      'management': ['BBA', 'B.Com', 'BMS'],
      'law': ['LLB', 'BA LLB', 'BBA LLB'],
      'design': ['B.Des', 'BFA', 'B.Arch'],
      'architecture': ['B.Arch', 'B.Plan'],
      'agriculture': ['B.Sc Agriculture', 'B.Tech Agriculture'],
      'pharmacy': ['B.Pharm', 'D.Pharm'],
      'biotechnology': ['B.Tech Biotech', 'B.Sc Biotechnology'],
      'psychology': ['B.A. Psychology', 'B.Sc Psychology'],
      'mass-communication': ['BJMC', 'B.A. Mass Communication'],
      'hospitality': ['BHM', 'B.Sc Hospitality'],
      'aviation': ['B.Sc Aviation', 'Commercial Pilot License']
    };
  }

  // ML-based degree recommendation using weighted scoring
  generateDegreeRecommendations(studentProfile) {
    const { streamPercentages, fieldPercentages, psychometricResults, academicData } = studentProfile;
    const recommendations = [];

    // Get personality traits
    const traits = psychometricResults?.personalityTraits || {};

    // Method 1: Stream-based degree recommendations
    if (streamPercentages) {
      const streamDegrees = this.getStreamBasedDegrees(streamPercentages, traits, academicData);
      recommendations.push(...streamDegrees);
    }

    // Method 2: Field-based degree recommendations
    if (fieldPercentages) {
      const fieldDegrees = this.getFieldBasedDegrees(fieldPercentages, traits);
      recommendations.push(...fieldDegrees);
    }

    // Method 3: Personality-based degree recommendations
    const personalityDegrees = this.getPersonalityBasedDegrees(traits, academicData);
    recommendations.push(...personalityDegrees);

    // Remove duplicates and sort by match score
    const uniqueRecommendations = this.removeDuplicatesAndRank(recommendations);

    return uniqueRecommendations.slice(0, 8); // Return top 8 recommendations
  }

  getStreamBasedDegrees(streamPercentages, traits, academicData) {
    const recommendations = [];
    const { science, commerce, arts, diploma } = streamPercentages;

    // Science stream degrees
    if (science > 30) {
      if (traits.analytical > 70) {
        recommendations.push({
          degree: 'B.Tech',
          match: this.calculateMatch(science, traits.analytical, academicData?.mathsMarks || 0),
          category: 'Engineering',
          description: 'Bachelor of Technology in various engineering disciplines',
          duration: '4 years',
          eligibility: 'Class 12 with PCM, JEE Main/Advanced',
          careerOutcomes: this.degreeCareerMapping['B.Tech'].careers,
          avgSalary: this.degreeCareerMapping['B.Tech'].avgSalary,
          growth: this.degreeCareerMapping['B.Tech'].growth
        });
      }

      if (traits.social > 65) {
        recommendations.push({
          degree: 'MBBS',
          match: this.calculateMatch(science, traits.social, academicData?.biologyMarks || 0),
          category: 'Medical',
          description: 'Bachelor of Medicine and Bachelor of Surgery',
          duration: '5.5 years',
          eligibility: 'Class 12 with PCB, NEET',
          careerOutcomes: this.degreeCareerMapping['MBBS'].careers,
          avgSalary: this.degreeCareerMapping['MBBS'].avgSalary,
          growth: this.degreeCareerMapping['MBBS'].growth
        });
      }

      recommendations.push({
        degree: 'B.Sc',
        match: this.calculateMatch(science, (traits.analytical + traits.detail_oriented) / 2, academicData?.scienceMarks || 0),
        category: 'Science',
        description: 'Bachelor of Science in various specializations',
        duration: '3 years',
        eligibility: 'Class 12 with Science subjects',
        careerOutcomes: this.degreeCareerMapping['B.Sc'].careers,
        avgSalary: this.degreeCareerMapping['B.Sc'].avgSalary,
        growth: this.degreeCareerMapping['B.Sc'].growth
      });
    }

    // Commerce stream degrees
    if (commerce > 30) {
      if (traits.leadership > 65) {
        recommendations.push({
          degree: 'BBA',
          match: this.calculateMatch(commerce, traits.leadership, academicData?.commerceMarks || 0),
          category: 'Management',
          description: 'Bachelor of Business Administration',
          duration: '3 years',
          eligibility: 'Class 12 from any stream',
          careerOutcomes: this.degreeCareerMapping['BBA'].careers,
          avgSalary: this.degreeCareerMapping['BBA'].avgSalary,
          growth: this.degreeCareerMapping['BBA'].growth
        });
      }

      recommendations.push({
        degree: 'B.Com',
        match: this.calculateMatch(commerce, traits.detail_oriented, academicData?.commerceMarks || 0),
        category: 'Commerce',
        description: 'Bachelor of Commerce',
        duration: '3 years',
        eligibility: 'Class 12 with Commerce/any stream',
        careerOutcomes: this.degreeCareerMapping['B.Com'].careers,
        avgSalary: this.degreeCareerMapping['B.Com'].avgSalary,
        growth: this.degreeCareerMapping['B.Com'].growth
      });
    }

    // Arts stream degrees
    if (arts > 30) {
      recommendations.push({
        degree: 'B.A.',
        match: this.calculateMatch(arts, (traits.creativity + traits.communication) / 2, academicData?.artsMarks || 0),
        category: 'Arts',
        description: 'Bachelor of Arts in various subjects',
        duration: '3 years',
        eligibility: 'Class 12 from any stream',
        careerOutcomes: this.degreeCareerMapping['B.A.'].careers,
        avgSalary: this.degreeCareerMapping['B.A.'].avgSalary,
        growth: this.degreeCareerMapping['B.A.'].growth
      });
    }

    // Diploma recommendations
    if (diploma > 30) {
      recommendations.push({
        degree: 'Diploma',
        match: this.calculateMatch(diploma, traits.conscientiousness, academicData?.overallMarks || 0),
        category: 'Technical',
        description: 'Diploma in various technical fields',
        duration: '2-3 years',
        eligibility: 'Class 10 or Class 12',
        careerOutcomes: this.degreeCareerMapping['Diploma'].careers,
        avgSalary: this.degreeCareerMapping['Diploma'].avgSalary,
        growth: this.degreeCareerMapping['Diploma'].growth
      });
    }

    return recommendations;
  }

  getFieldBasedDegrees(fieldPercentages, traits) {
    const recommendations = [];

    // Get top 3 fields
    const topFields = Object.entries(fieldPercentages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    topFields.forEach(([field, percentage]) => {
      const degrees = this.fieldDegreeMapping[field] || [];
      
      degrees.forEach(degree => {
        const baseMatch = percentage;
        const traitBonus = this.getTraitBonusForField(field, traits);
        
        recommendations.push({
          degree: degree,
          match: Math.min(95, baseMatch + traitBonus),
          category: this.getFieldCategory(field),
          description: this.getDegreeDescription(degree),
          duration: this.getDegreeDuration(degree),
          eligibility: this.getDegreeEligibility(degree),
          careerOutcomes: this.getFieldCareers(field),
          avgSalary: this.getFieldSalary(field),
          growth: this.getFieldGrowth(field)
        });
      });
    });

    return recommendations;
  }

  getPersonalityBasedDegrees(traits, academicData) {
    const recommendations = [];

    // Get top 3 personality traits
    const topTraits = Object.entries(traits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    topTraits.forEach(([trait, score]) => {
      const fields = this.traitCareerMapping[trait] || [];
      
      fields.forEach(field => {
        const fieldKey = field.toLowerCase().replace(/\s+/g, '-');
        const degrees = this.fieldDegreeMapping[fieldKey] || [];
        
        degrees.forEach(degree => {
          recommendations.push({
            degree: degree,
            match: Math.min(90, score * 0.8 + (academicData?.overallMarks || 70) * 0.2),
            category: field,
            description: this.getDegreeDescription(degree),
            duration: this.getDegreeDuration(degree),
            eligibility: this.getDegreeEligibility(degree),
            careerOutcomes: this.getFieldCareers(fieldKey),
            avgSalary: this.getFieldSalary(fieldKey),
            growth: this.getFieldGrowth(fieldKey),
            personalityMatch: trait
          });
        });
      });
    });

    return recommendations;
  }

  calculateMatch(streamScore, traitScore, academicScore) {
    // Weighted calculation: 40% stream, 35% trait, 25% academic
    const match = (streamScore * 0.4) + (traitScore * 0.35) + (academicScore * 0.25);
    return Math.min(95, Math.max(10, match));
  }

  getTraitBonusForField(field, traits) {
    const fieldTraitMap = {
      'engineering': (traits.analytical || 0) * 0.3,
      'medical': (traits.social || 0) * 0.3,
      'computer-science': (traits.analytical || 0) * 0.25,
      'management': (traits.leadership || 0) * 0.3,
      'design': (traits.creativity || 0) * 0.3,
      'law': (traits.communication || 0) * 0.25
    };

    return fieldTraitMap[field] || 0;
  }

  removeDuplicatesAndRank(recommendations) {
    const uniqueMap = new Map();

    recommendations.forEach(rec => {
      const key = rec.degree;
      if (!uniqueMap.has(key) || uniqueMap.get(key).match < rec.match) {
        uniqueMap.set(key, rec);
      }
    });

    return Array.from(uniqueMap.values())
      .sort((a, b) => b.match - a.match);
  }

  // Location-based college recommendation
  async getLocationBasedColleges(studentLocation, preferredDegrees, maxDistance = 500) {
    try {
      console.log('🔍 Searching for colleges with:', { 
        location: !!studentLocation, 
        degrees: preferredDegrees, 
        maxDistance 
      });
      
      // If no location provided, return all colleges
      if (!studentLocation || !studentLocation.coordinates) {
        console.log('📍 No location provided, searching all colleges...');
        const colleges = await College.find({}).limit(20);
        console.log('🏛️ Found colleges without location filter:', colleges.length);
        return colleges;
      }

      const { coordinates } = studentLocation;
      console.log('📍 Searching near coordinates:', coordinates);
      
      // First, try to find colleges with geometry field
      let nearbyColleges = [];
      try {
        nearbyColleges = await College.find({
          "location.geometry": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: coordinates
              },
              $maxDistance: maxDistance * 1000 // Convert km to meters
            }
          }
        }).limit(20);
        console.log('🏛️ Found nearby colleges with geometry:', nearbyColleges.length);
      } catch (geoError) {
        console.log('❌ Geospatial query failed:', geoError.message);
      }

      // If no results with geospatial query, fall back to all colleges
      if (nearbyColleges.length === 0) {
        console.log('🔄 No colleges found with geospatial query, trying all colleges...');
        nearbyColleges = await College.find({}).limit(20);
        console.log('🏛️ Found colleges with fallback search:', nearbyColleges.length);
        
        // Add manual distance calculation for colleges that have coordinates
        const collegesWithDistance = await Promise.all(
          nearbyColleges.map(async (college) => {
            const collegeObj = college.toObject();
            
            // Check if college has location coordinates
            if (college.location && college.location.coordinates && 
                college.location.coordinates.latitude && college.location.coordinates.longitude) {
              
              const collegeCoords = [
                college.location.coordinates.longitude,
                college.location.coordinates.latitude
              ];
              
              // Use Google Maps API for real distance
              const distanceData = await this.calculateRealDistance(coordinates, collegeCoords);
              
              if (typeof distanceData === 'object') {
                // Google Maps API response
                collegeObj.distance = Math.round(distanceData.distance);
                collegeObj.duration = Math.round(distanceData.duration);
                collegeObj.distanceText = distanceData.distanceText;
                collegeObj.durationText = distanceData.durationText;
                collegeObj.travelMode = 'driving';
              } else {
                // Fallback Haversine distance
                collegeObj.distance = Math.round(distanceData);
                collegeObj.travelMode = 'straight-line';
              }
              
              collegeObj.locationScore = this.calculateLocationScore(collegeObj.distance, college.ranking || 50);
            }
            
            return collegeObj;
          })
        );
        
        nearbyColleges = collegesWithDistance;
        
        // Sort by distance if available, otherwise by ranking
        nearbyColleges.sort((a, b) => {
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return (a.ranking || 999) - (b.ranking || 999);
        });
      } else {
        // Add distance calculation for geospatial results using Google Maps
        const collegesWithRealDistance = await Promise.all(
          nearbyColleges.map(async (college) => {
            const collegeCoords = college.location.geometry.coordinates;
            const distanceData = await this.calculateRealDistance(coordinates, collegeCoords);
            
            const collegeObj = college.toObject();
            
            if (typeof distanceData === 'object') {
              // Google Maps API response
              collegeObj.distance = Math.round(distanceData.distance);
              collegeObj.duration = Math.round(distanceData.duration);
              collegeObj.distanceText = distanceData.distanceText;
              collegeObj.durationText = distanceData.durationText;
              collegeObj.travelMode = 'driving';
            } else {
              // Fallback Haversine distance
              collegeObj.distance = Math.round(distanceData);
              collegeObj.travelMode = 'straight-line';
            }
            
            collegeObj.locationScore = this.calculateLocationScore(collegeObj.distance, college.ranking || 50);
            return collegeObj;
          })
        );

        nearbyColleges = collegesWithRealDistance.sort((a, b) => b.locationScore - a.locationScore);
      }

      return nearbyColleges;
    } catch (error) {
      console.error('Error in location-based college recommendation:', error);
      // Fallback to general college search
      try {
        console.log('🔄 Trying fallback college search...');
        const colleges = await College.find({}).limit(20);
        console.log('🏛️ Fallback found colleges:', colleges.length);
        
        if (colleges.length === 0) {
          console.log('📝 No colleges in database, returning sample data...');
          return this.getSampleColleges();
        }
        
        return colleges;
      } catch (fallbackError) {
        console.error('Fallback college search also failed:', fallbackError);
        console.log('📝 Returning sample colleges as last resort...');
        return this.getSampleColleges();
      }
    }
  }

  getSampleColleges() {
    return [
      {
        name: "Indian Institute of Technology Delhi",
        location: { city: "New Delhi", state: "Delhi" },
        type: "government",
        ranking: 2,
        courses: ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Electrical"],
        facilities: ["Library", "Hostel", "Labs", "Sports Complex"],
        fees: 200000
      },
      {
        name: "Indian Institute of Technology Bombay",
        location: { city: "Mumbai", state: "Maharashtra" },
        type: "government", 
        ranking: 1,
        courses: ["B.Tech Computer Science", "B.Tech Chemical", "B.Tech Civil"],
        facilities: ["Library", "Hostel", "Research Labs", "Innovation Center"],
        fees: 210000
      },
      {
        name: "Delhi University",
        location: { city: "New Delhi", state: "Delhi" },
        type: "government",
        ranking: 15,
        courses: ["B.A. Economics", "B.Com", "B.Sc Mathematics"],
        facilities: ["Library", "Sports", "Cultural Center"],
        fees: 50000
      },
      {
        name: "Manipal Institute of Technology",
        location: { city: "Manipal", state: "Karnataka" },
        type: "private",
        ranking: 25,
        courses: ["B.Tech Computer Science", "B.Tech Electronics", "BBA"],
        facilities: ["Modern Labs", "Hostel", "Hospital", "Sports"],
        fees: 350000
      },
      {
        name: "Vellore Institute of Technology",
        location: { city: "Vellore", state: "Tamil Nadu" },
        type: "private",
        ranking: 30,
        courses: ["B.Tech CSE", "B.Tech Mechanical", "MBA"],
        facilities: ["Tech Labs", "Hostel", "Library", "Placement Cell"],
        fees: 300000
      }
    ];
  }

  // Multiple free API providers for distance calculation
  async calculateRealDistance(userCoords, collegeCoords, travelMode = 'driving-car') {
    try {
      // Try OpenRouteService first (2000 requests/day free)
      const openRouteResult = await this.tryOpenRouteService(userCoords, collegeCoords);
      if (openRouteResult) return openRouteResult;
      
      // Try MapBox as backup (100,000 requests/month free)
      const mapBoxResult = await this.tryMapBoxAPI(userCoords, collegeCoords);
      if (mapBoxResult) return mapBoxResult;
      
      // Fallback to Haversine formula
      console.log('⚠️ All APIs failed, using Haversine formula');
      return this.calculateDistance(
        userCoords[1], userCoords[0], 
        collegeCoords[1], collegeCoords[0]
      );
    } catch (error) {
      console.error('❌ Distance calculation error:', error);
      return this.calculateDistance(
        userCoords[1], userCoords[0], 
        collegeCoords[1], collegeCoords[0]
      );
    }
  }

  async tryOpenRouteService(userCoords, collegeCoords) {
    try {
      const openRouteApiKey = process.env.OPENROUTE_API_KEY;
      if (!openRouteApiKey) return null;

      const url = 'https://api.openrouteservice.org/v2/matrix/driving-car';
      
      const requestBody = {
        locations: [
          [userCoords[0], userCoords[1]], // [lng, lat] format
          [collegeCoords[0], collegeCoords[1]]
        ],
        metrics: ["distance", "duration"],
        units: "km"
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': openRouteApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.distances && data.durations) {
        const distance = data.distances[0][1];
        const duration = data.durations[0][1] / 60;
        
        return {
          distance: distance,
          duration: Math.round(duration),
          distanceText: `${distance.toFixed(1)} km`,
          durationText: `${Math.round(duration)} mins`,
          provider: 'OpenRoute'
        };
      }
    } catch (error) {
      console.log('OpenRoute API failed:', error.message);
    }
    return null;
  }

  async tryMapBoxAPI(userCoords, collegeCoords) {
    try {
      const mapBoxApiKey = process.env.MAPBOX_API_KEY;
      if (!mapBoxApiKey) return null;

      const coordinates = `${userCoords[0]},${userCoords[1]};${collegeCoords[0]},${collegeCoords[1]}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?access_token=${mapBoxApiKey}&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distance = route.distance / 1000; // Convert meters to km
        const duration = route.duration / 60; // Convert seconds to minutes
        
        return {
          distance: distance,
          duration: Math.round(duration),
          distanceText: `${distance.toFixed(1)} km`,
          durationText: `${Math.round(duration)} mins`,
          provider: 'MapBox'
        };
      }
    } catch (error) {
      console.log('MapBox API failed:', error.message);
    }
    return null;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  calculateLocationScore(distance, ranking) {
    // Higher score for closer colleges and better ranking
    const distanceScore = Math.max(0, 100 - (distance / 10)); // Decrease by 10 points per 100km
    const rankingScore = Math.max(0, 100 - ranking); // Better ranking = higher score
    return (distanceScore * 0.6) + (rankingScore * 0.4);
  }

  // Helper methods for degree information
  getDegreeDescription(degree) {
    const descriptions = {
      'B.Tech': 'Bachelor of Technology - Engineering degree with specializations',
      'MBBS': 'Bachelor of Medicine and Bachelor of Surgery',
      'B.Com': 'Bachelor of Commerce - Business and finance focused degree',
      'BBA': 'Bachelor of Business Administration - Management degree',
      'B.A.': 'Bachelor of Arts - Liberal arts and humanities degree',
      'B.Sc': 'Bachelor of Science - Science and research focused degree',
      'LLB': 'Bachelor of Laws - Legal studies degree',
      'B.Des': 'Bachelor of Design - Creative and design focused degree'
    };
    return descriptions[degree] || `${degree} - Professional degree program`;
  }

  getDegreeDuration(degree) {
    const durations = {
      'B.Tech': '4 years',
      'MBBS': '5.5 years',
      'B.Com': '3 years',
      'BBA': '3 years',
      'B.A.': '3 years',
      'B.Sc': '3 years',
      'LLB': '3 years',
      'BA LLB': '5 years',
      'Diploma': '2-3 years'
    };
    return durations[degree] || '3-4 years';
  }

  getDegreeEligibility(degree) {
    const eligibility = {
      'B.Tech': 'Class 12 with PCM, JEE Main/Advanced',
      'MBBS': 'Class 12 with PCB, NEET',
      'B.Com': 'Class 12 with Commerce (any stream accepted)',
      'BBA': 'Class 12 from any stream',
      'B.A.': 'Class 12 from any stream',
      'B.Sc': 'Class 12 with Science subjects',
      'LLB': 'Graduation in any discipline',
      'BA LLB': 'Class 12 from any stream, CLAT'
    };
    return eligibility[degree] || 'Class 12 from relevant stream';
  }

  getFieldCategory(field) {
    const categories = {
      'engineering': 'Engineering & Technology',
      'medical': 'Medical & Healthcare',
      'computer-science': 'Computer Science & IT',
      'management': 'Business & Management',
      'law': 'Legal Studies',
      'design': 'Design & Creative Arts'
    };
    return categories[field] || 'Professional Studies';
  }

  getFieldCareers(field) {
    const careers = {
      'engineering': ['Software Engineer', 'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer'],
      'medical': ['Doctor', 'Surgeon', 'Medical Researcher', 'Healthcare Administrator'],
      'computer-science': ['Software Developer', 'Data Scientist', 'System Analyst', 'IT Consultant'],
      'management': ['Business Manager', 'Project Manager', 'Operations Manager', 'Strategy Consultant'],
      'law': ['Lawyer', 'Legal Advisor', 'Judge', 'Corporate Counsel'],
      'design': ['Graphic Designer', 'UI/UX Designer', 'Product Designer', 'Creative Director']
    };
    return careers[field] || ['Professional', 'Specialist', 'Consultant', 'Manager'];
  }

  getFieldSalary(field) {
    const salaries = {
      'engineering': { min: 500000, max: 2500000 },
      'medical': { min: 800000, max: 5000000 },
      'computer-science': { min: 600000, max: 3000000 },
      'management': { min: 400000, max: 2000000 },
      'law': { min: 300000, max: 2500000 },
      'design': { min: 300000, max: 1500000 }
    };
    return salaries[field] || { min: 300000, max: 1200000 };
  }

  getFieldGrowth(field) {
    const growth = {
      'engineering': 'Excellent',
      'medical': 'Very High',
      'computer-science': 'Excellent',
      'management': 'Good',
      'law': 'Good',
      'design': 'Good'
    };
    return growth[field] || 'Stable';
  }
}

module.exports = new RecommendationService();