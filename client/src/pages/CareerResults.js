import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CareerResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get both quiz and psychometric results (either stream quiz or field quiz)
  const { quizResults, fieldQuizResults, psychometricResults } = location.state || {};

  if ((!quizResults && !fieldQuizResults) || !psychometricResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Assessment Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please complete both assessments to view your results.</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => navigate('/quiz')} className="btn-primary">
              Stream Quiz
            </button>
            <button onClick={() => navigate('/field-quiz')} className="btn-secondary">
              Field Quiz
            </button>
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="card mb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Complete Career Analysis</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Based on your academic aptitude and personality assessment</p>
        </div>

        {/* Career Recommendations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Top Career Matches</h2>
          <div className="grid gap-6">
            {careerRecommendations.map((career, index) => (
              <div key={index} className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 p-6 rounded-xl border border-primary-200 dark:border-primary-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary-800 dark:text-primary-100">{career.career}</h3>
                      <p className="text-primary-600 dark:text-primary-300 font-medium">{career.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-300">{Math.round(career.match)}%</div>
                    <div className="text-sm text-primary-500 dark:text-primary-400">Match</div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{career.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Key Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-200 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Education:</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{career.education}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Salary Range:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">{career.salary}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Job Outlook:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">{career.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Personality Strengths */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Top Strengths</h3>
            <div className="space-y-4">
              {topStrengths.map(({ trait, score, description }) => (
                <div key={trait}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{trait}</span>
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Aptitude - Show either stream or field results */}
          {isFieldQuiz ? (
            // Show all 15 fields in a full-width section for field quiz
            <div className="col-span-2 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Field Selection Analysis</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(fieldQuizResults.fieldPercentages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([field, percentage]) => {
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
                      if (percentage >= 80) return 'bg-green-600 dark:bg-green-500';
                      if (percentage >= 60) return 'bg-blue-600 dark:bg-blue-500';
                      if (percentage >= 40) return 'bg-yellow-600 dark:bg-yellow-500';
                      return 'bg-red-600 dark:bg-red-500';
                    };

                    return (
                      <div key={field}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {getFieldDisplayName(field)}
                          </span>
                          <span className={`text-sm font-bold ${getPerformanceColor(percentage)}`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`${getBarColor(percentage)} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {quizData.accuracy && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="text-sm">
                    <span className="font-semibold text-blue-800 dark:text-blue-200">Quiz Performance:</span>
                    <span className="text-blue-700 dark:text-blue-300 ml-1">
                      {quizData.correctAnswers}/{quizData.totalQuestions} correct ({quizData.accuracy}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show stream results for stream quiz
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Academic Stream Analysis</h3>
              <div className="space-y-4">
                {Object.entries(quizResults.streamPercentages).map(([stream, percentage]) => (
                  <div key={stream}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{stream}</span>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {quizData.accuracy && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="text-sm">
                    <span className="font-semibold text-blue-800 dark:text-blue-200">Quiz Performance:</span>
                    <span className="text-blue-700 dark:text-blue-300 ml-1">
                      {quizData.correctAnswers}/{quizData.totalQuestions} correct ({quizData.accuracy}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <button onClick={() => navigate('/quiz')} className="btn-secondary">
              Retake Assessment
            </button>
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                View Dashboard
              </button>
            ) : (
              <button onClick={() => navigate('/register')} className="btn-secondary">
                Save Results - Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerResults;