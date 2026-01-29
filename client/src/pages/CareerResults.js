import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/animations.css';

const CareerResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get both quiz and psychometric results (either stream quiz or field quiz)
  const { quizResults, fieldQuizResults, psychometricResults } = location.state || {};

  if ((!quizResults && !fieldQuizResults) || !psychometricResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass dark:glass-dark rounded-2xl p-8 text-center animate-fadeIn shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Assessment Required</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Please complete both assessments to view your comprehensive career analysis.</p>
            <div className="flex justify-center space-x-4 flex-wrap gap-4">
              <button 
                onClick={() => navigate('/quiz')} 
                className="btn-animate px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Stream Quiz
              </button>
              <button 
                onClick={() => navigate('/field-quiz')} 
                className="btn-animate px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Field Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine which type of quiz was taken
  const isFieldQuiz = !!fieldQuizResults;
  const quizData = isFieldQuiz ? fieldQuizResults : quizResults;

  // Enhanced career matching algorithm
  const generateCareerRecommendations = () => {
    const recommendations = [];
    const { streamPercentages } = quizResults || {};
    const traits = psychometricResults.personalityTraits;

    // Only generate stream-based recommendations if we have stream quiz results
    if (!streamPercentages) {
      return [];
    }

    // Science-based careers
    if (streamPercentages.science > 25) {
      if (traits.analytical > 75 && traits.detail_oriented > 70) {
        recommendations.push({
          career: "Research Scientist",
          match: Math.min(95, streamPercentages.science + traits.analytical * 0.3),
          category: "Research & Development",
          description: "Conduct scientific research, analyze data, and develop new theories or technologies",
          skills: ["Analytical Thinking", "Problem Solving", "Research Methods", "Data Analysis"],
          education: "PhD in relevant science field",
          salary: "$75,000 - $150,000+",
          growth: "High demand in biotechnology, environmental science, and AI research"
        });
      }
      
      if (traits.creativity > 65 && traits.openness > 70) {
        recommendations.push({
          career: "Biomedical Engineer",
          match: Math.min(92, streamPercentages.science + traits.creativity * 0.25),
          category: "Engineering & Innovation",
          description: "Design medical devices, prosthetics, and healthcare technologies",
          skills: ["Creative Problem Solving", "Technical Design", "Biology", "Engineering"],
          education: "Bachelor's in Biomedical Engineering",
          salary: "$70,000 - $120,000",
          growth: "Excellent growth due to aging population and medical advances"
        });
      }

      if (traits.social > 70 && traits.communication > 65) {
        recommendations.push({
          career: "Science Teacher/Professor",
          match: Math.min(88, streamPercentages.science + traits.communication * 0.2),
          category: "Education & Training",
          description: "Educate students in scientific principles and inspire future scientists",
          skills: ["Communication", "Teaching", "Subject Expertise", "Patience"],
          education: "Bachelor's + Teaching Certification (Master's for college level)",
          salary: "$45,000 - $90,000",
          growth: "Stable demand, especially in STEM education"
        });
      }
    }

    // Commerce-based careers
    if (streamPercentages.commerce > 25) {
      if (traits.leadership > 75 && traits.risk_tolerance > 65) {
        recommendations.push({
          career: "Business Executive/CEO",
          match: Math.min(96, streamPercentages.commerce + traits.leadership * 0.3),
          category: "Leadership & Management",
          description: "Lead organizations, make strategic decisions, and drive business growth",
          skills: ["Leadership", "Strategic Thinking", "Decision Making", "Communication"],
          education: "Bachelor's in Business (MBA preferred)",
          salary: "$100,000 - $500,000+",
          growth: "Always in demand for skilled leaders"
        });
      }

      if (traits.analytical > 70 && traits.detail_oriented > 75) {
        recommendations.push({
          career: "Financial Analyst",
          match: Math.min(93, streamPercentages.commerce + traits.analytical * 0.25),
          category: "Finance & Investment",
          description: "Analyze financial data, assess investment opportunities, and provide recommendations",
          skills: ["Financial Analysis", "Excel/Modeling", "Market Research", "Risk Assessment"],
          education: "Bachelor's in Finance/Economics (CFA certification valuable)",
          salary: "$60,000 - $130,000",
          growth: "Strong growth in investment and corporate finance"
        });
      }

      if (traits.extraversion > 70 && traits.communication > 70) {
        recommendations.push({
          career: "Marketing Director",
          match: Math.min(90, streamPercentages.commerce + traits.extraversion * 0.2),
          category: "Marketing & Sales",
          description: "Develop marketing strategies, manage campaigns, and build brand awareness",
          skills: ["Marketing Strategy", "Communication", "Creativity", "Data Analysis"],
          education: "Bachelor's in Marketing/Business",
          salary: "$70,000 - $140,000",
          growth: "High demand in digital marketing and e-commerce"
        });
      }
    }

    // Arts-based careers
    if (streamPercentages.arts > 25) {
      if (traits.creativity > 80 && traits.openness > 75) {
        recommendations.push({
          career: "Creative Director",
          match: Math.min(95, streamPercentages.arts + traits.creativity * 0.3),
          category: "Creative & Design",
          description: "Lead creative teams, develop visual concepts, and oversee artistic projects",
          skills: ["Creative Vision", "Leadership", "Design Software", "Project Management"],
          education: "Bachelor's in Fine Arts/Design",
          salary: "$65,000 - $150,000",
          growth: "Growing demand in digital media and advertising"
        });
      }

      if (traits.social > 75 && traits.communication > 70) {
        recommendations.push({
          career: "Clinical Psychologist",
          match: Math.min(92, streamPercentages.arts + traits.social * 0.25),
          category: "Healthcare & Counseling",
          description: "Provide therapy, conduct psychological assessments, and help people overcome challenges",
          skills: ["Empathy", "Active Listening", "Psychology", "Communication"],
          education: "Doctoral degree in Psychology + Licensure",
          salary: "$80,000 - $130,000",
          growth: "High demand due to increased mental health awareness"
        });
      }

      if (traits.communication > 80 && traits.creativity > 60) {
        recommendations.push({
          career: "Content Strategist",
          match: Math.min(88, streamPercentages.arts + traits.communication * 0.2),
          category: "Media & Communications",
          description: "Create compelling content strategies for digital platforms and brands",
          skills: ["Writing", "Content Strategy", "SEO", "Social Media"],
          education: "Bachelor's in Communications/English/Marketing",
          salary: "$50,000 - $100,000",
          growth: "Excellent growth in digital marketing sector"
        });
      }
    }

    // Technical/Diploma careers
    if (streamPercentages.diploma > 25) {
      if (traits.detail_oriented > 75 && traits.conscientiousness > 70) {
        recommendations.push({
          career: "Software Developer",
          match: Math.min(94, streamPercentages.diploma + traits.detail_oriented * 0.25),
          category: "Technology & Programming",
          description: "Design, develop, and maintain software applications and systems",
          skills: ["Programming", "Problem Solving", "Debugging", "Software Design"],
          education: "Bachelor's in Computer Science or Coding Bootcamp",
          salary: "$70,000 - $150,000+",
          growth: "Excellent growth across all industries"
        });
      }

      if (traits.creativity > 65 && traits.analytical > 60) {
        recommendations.push({
          career: "UX/UI Designer",
          match: Math.min(91, streamPercentages.diploma + traits.creativity * 0.2),
          category: "Design & Technology",
          description: "Design user interfaces and experiences for digital products",
          skills: ["Design Thinking", "Prototyping", "User Research", "Design Tools"],
          education: "Bachelor's in Design or relevant certification",
          salary: "$60,000 - $120,000",
          growth: "High demand as companies focus on user experience"
        });
      }
    }

    // Sort by match percentage and return top 6
    return recommendations
      .sort((a, b) => b.match - a.match)
      .slice(0, 6);
  };

  // Generate field-based career recommendations
  const generateFieldCareerRecommendations = () => {
    const recommendations = [];
    const { fieldPercentages } = fieldQuizResults;
    const traits = psychometricResults.personalityTraits;

    // Get top 3 fields
    const topFields = Object.entries(fieldPercentages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    topFields.forEach(([field, percentage]) => {
      // Engineering careers
      if (field === 'engineering' && percentage > 40) {
        if (traits.analytical > 70) {
          recommendations.push({
            career: "Software Engineer",
            match: Math.min(95, percentage + traits.analytical * 0.2),
            category: "Engineering",
            description: "Design and develop software applications and systems",
            skills: ["Programming", "Problem Solving", "System Design", "Algorithms"],
            education: "Bachelor's in Computer Science/Engineering",
            salary: "$80,000 - $160,000+",
            growth: "Excellent growth in tech industry"
          });
        }
        if (traits.creativity > 65) {
          recommendations.push({
            career: "Mechanical Engineer",
            match: Math.min(92, percentage + traits.creativity * 0.15),
            category: "Engineering",
            description: "Design mechanical systems and solve engineering problems",
            skills: ["CAD", "Thermodynamics", "Materials Science", "Design"],
            education: "Bachelor's in Mechanical Engineering",
            salary: "$70,000 - $130,000",
            growth: "Stable demand in manufacturing and automotive"
          });
        }
      }

      // Medical careers
      if (field === 'medical' && percentage > 40) {
        if (traits.social > 70 && traits.detail_oriented > 65) {
          recommendations.push({
            career: "Medical Doctor",
            match: Math.min(96, percentage + traits.social * 0.2),
            category: "Healthcare",
            description: "Diagnose and treat patients, provide medical care",
            skills: ["Medical Knowledge", "Empathy", "Decision Making", "Communication"],
            education: "MBBS + Specialization",
            salary: "$150,000 - $400,000+",
            growth: "Always in high demand"
          });
        }
        if (traits.analytical > 70) {
          recommendations.push({
            career: "Medical Researcher",
            match: Math.min(93, percentage + traits.analytical * 0.18),
            category: "Healthcare Research",
            description: "Conduct medical research to advance healthcare",
            skills: ["Research Methods", "Data Analysis", "Medical Science", "Critical Thinking"],
            education: "MD/PhD in Medical Sciences",
            salary: "$80,000 - $150,000",
            growth: "Growing field with biotech advances"
          });
        }
      }

      // Computer Science careers
      if (field === 'computer-science' && percentage > 40) {
        if (traits.analytical > 75) {
          recommendations.push({
            career: "Data Scientist",
            match: Math.min(94, percentage + traits.analytical * 0.2),
            category: "Technology",
            description: "Analyze complex data to drive business decisions",
            skills: ["Python", "Machine Learning", "Statistics", "Data Visualization"],
            education: "Bachelor's/Master's in Computer Science/Statistics",
            salary: "$90,000 - $170,000",
            growth: "Extremely high demand"
          });
        }
        if (traits.creativity > 65) {
          recommendations.push({
            career: "Full Stack Developer",
            match: Math.min(91, percentage + traits.creativity * 0.15),
            category: "Technology",
            description: "Build complete web applications from front to back",
            skills: ["JavaScript", "React", "Node.js", "Databases"],
            education: "Bachelor's in CS or Bootcamp",
            salary: "$75,000 - $150,000",
            growth: "Very high demand"
          });
        }
      }

      // Management careers
      if (field === 'management' && percentage > 40) {
        if (traits.leadership > 75) {
          recommendations.push({
            career: "Business Manager",
            match: Math.min(95, percentage + traits.leadership * 0.2),
            category: "Management",
            description: "Lead teams and drive business success",
            skills: ["Leadership", "Strategy", "Communication", "Decision Making"],
            education: "Bachelor's in Business (MBA preferred)",
            salary: "$70,000 - $180,000+",
            growth: "Always in demand"
          });
        }
      }

      // Law careers
      if (field === 'law' && percentage > 40) {
        if (traits.communication > 75 && traits.analytical > 70) {
          recommendations.push({
            career: "Corporate Lawyer",
            match: Math.min(94, percentage + traits.communication * 0.18),
            category: "Legal",
            description: "Provide legal counsel to businesses",
            skills: ["Legal Research", "Negotiation", "Communication", "Analysis"],
            education: "LLB + Bar Exam",
            salary: "$80,000 - $200,000+",
            growth: "Stable high demand"
          });
        }
      }

      // Design careers
      if (field === 'design' && percentage > 40) {
        if (traits.creativity > 80) {
          recommendations.push({
            career: "UX/UI Designer",
            match: Math.min(93, percentage + traits.creativity * 0.2),
            category: "Design",
            description: "Create user-friendly digital experiences",
            skills: ["Design Thinking", "Figma", "User Research", "Prototyping"],
            education: "Bachelor's in Design",
            salary: "$65,000 - $130,000",
            growth: "High demand in tech"
          });
        }
      }

      // Psychology careers
      if (field === 'psychology' && percentage > 40) {
        if (traits.social > 75) {
          recommendations.push({
            career: "Clinical Psychologist",
            match: Math.min(92, percentage + traits.social * 0.2),
            category: "Healthcare",
            description: "Provide therapy and mental health support",
            skills: ["Empathy", "Active Listening", "Psychology", "Counseling"],
            education: "Master's/PhD in Psychology",
            salary: "$70,000 - $120,000",
            growth: "Growing mental health awareness"
          });
        }
      }
    });

    // Sort by match and return top 6
    return recommendations
      .sort((a, b) => b.match - a.match)
      .slice(0, 6);
  };

  const careerRecommendations = isFieldQuiz 
    ? generateFieldCareerRecommendations() 
    : generateCareerRecommendations();
  
  // Get top personality strengths
  const topStrengths = Object.entries(psychometricResults.personalityTraits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([trait, score]) => ({
      trait: trait.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score,
      description: getTraitDescription(trait)
    }));

  function getTraitDescription(trait) {
    const descriptions = {
      openness: "You're curious and open to new experiences",
      conscientiousness: "You're organized and reliable",
      extraversion: "You're energetic and sociable",
      analytical: "You excel at logical problem-solving",
      leadership: "You naturally guide and inspire others",
      creativity: "You think outside the box and generate innovative ideas",
      social: "You're empathetic and enjoy helping others",
      risk_tolerance: "You're comfortable with uncertainty and calculated risks",
      detail_oriented: "You pay attention to accuracy and precision",
      communication: "You express ideas clearly and effectively"
    };
    return descriptions[trait] || "A valuable professional strength";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass dark:glass-dark rounded-2xl p-8 mb-8 shadow-2xl animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Your Complete Career Analysis
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Based on your academic aptitude and personality assessment</p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-full">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">AI-Powered Career Matching</span>
            </div>
          </div>

          {/* Career Recommendations */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              🎯 Top Career Matches
            </h2>
            <div className="grid gap-8">
              {careerRecommendations.map((career, index) => (
                <div key={index} className="card-hover bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
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
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{career.career}</h3>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">{career.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        {Math.round(career.match)}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Match Score</div>
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${career.match}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{career.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Key Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, idx) => (
                          <span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Education:
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{career.education}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Salary Range:</span>
                        <div className="text-green-700 dark:text-green-300 font-bold">{career.salary}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Job Outlook:</span>
                        <div className="text-purple-700 dark:text-purple-300 font-medium">{career.growth}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Personality Strengths */}
            <div className="glass dark:glass-dark p-8 rounded-2xl shadow-lg animate-scaleIn">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Your Top Strengths
              </h3>
              <div className="space-y-6">
                {topStrengths.map(({ trait, score, description }, index) => (
                  <div key={trait} className="animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{trait}</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Aptitude - Show either stream or field results */}
            {isFieldQuiz ? (
              // Show all 15 fields in a full-width section for field quiz
              <div className="col-span-2 glass dark:glass-dark p-8 rounded-2xl shadow-lg animate-scaleIn">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                  <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8h2m-2 0V3m0 2v2m0 0h2m-2 0H9m4 0v2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3" />
                  </svg>
                  Field Selection Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(fieldQuizResults.fieldPercentages)
                    .sort((a, b) => b[1] - a[1])
                    .map(([field, percentage], index) => {
                      const getFieldDisplayName = (field) => {
                        const fieldNames = {
                          'engineering': 'Engineering',
                          'medical': 'Medical',
                          'computer-science': 'Computer Science',
                          'data-science': 'Data Science',
                          'management': 'Management',
                          'law': 'Law',
                          'design': 'Design',
                          'architecture': 'Architecture',
                          'agriculture': 'Agriculture',
                          'pharmacy': 'Pharmacy',
                          'biotechnology': 'Biotechnology',
                          'psychology': 'Psychology',
                          'mass-communication': 'Mass Communication',
                          'hospitality': 'Hospitality',
                          'aviation': 'Aviation'
                        };
                        return fieldNames[field] || field;
                      };

                      const getPerformanceColor = (percentage) => {
                        if (percentage >= 80) return 'text-green-600 dark:text-green-400';
                        if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
                        if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
                        return 'text-red-600 dark:text-red-400';
                      };

                      const getBarColor = (percentage) => {
                        if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500';
                        if (percentage >= 60) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
                        if (percentage >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
                        return 'bg-gradient-to-r from-red-500 to-pink-500';
                      };

                      return (
                        <div key={field} className="animate-slideIn" style={{animationDelay: `${index * 0.05}s`}}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                              {getFieldDisplayName(field)}
                            </span>
                            <span className={`text-lg font-bold ${getPerformanceColor(percentage)}`}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className={`${getBarColor(percentage)} h-3 rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {quizData.accuracy && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="font-bold text-blue-800 dark:text-blue-200 text-lg">Quiz Performance:</span>
                        <div className="text-blue-700 dark:text-blue-300 font-semibold">
                          {quizData.correctAnswers}/{quizData.totalQuestions} correct ({quizData.accuracy}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Show stream results for stream quiz
              <div className="glass dark:glass-dark p-8 rounded-2xl shadow-lg animate-scaleIn">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                  <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Academic Stream Analysis
                </h3>
                <div className="space-y-6">
                  {Object.entries(quizResults.streamPercentages).map(([stream, percentage], index) => (
                    <div key={stream} className="animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg capitalize">{stream}</span>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {quizData.accuracy && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="font-bold text-blue-800 dark:text-blue-200 text-lg">Quiz Performance:</span>
                        <div className="text-blue-700 dark:text-blue-300 font-semibold">
                          {quizData.correctAnswers}/{quizData.totalQuestions} correct ({quizData.accuracy}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex justify-center space-x-6 flex-wrap gap-4">
              <button 
                onClick={() => navigate('/quiz')} 
                className="btn-animate px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake Assessment
              </button>
              {user ? (
                <button 
                  onClick={() => navigate('/profile')} 
                  className="btn-animate px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/register')} 
                  className="btn-animate px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Save Results - Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerResults;