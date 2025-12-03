const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Information
  personalInfo: {
    age: {
      type: Number,
      min: 10,
      max: 100
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      lowercase: true
    },
    dateOfBirth: {
      type: Date
    },
    phoneNumber: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    }
  },

  // Academic Information
  academicInfo: {
    currentClass: {
      type: String,
      enum: ['10', '11', '12', 'graduate', 'postgraduate', 'diploma', 'other']
    },
    stream: {
      type: String,
      enum: ['science', 'commerce', 'arts', 'diploma', 'other'],
      lowercase: true
    },
    subjects: [{
      name: String,
      grade: String,
      marks: Number,
      maxMarks: Number
    }],
    currentPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    previousEducation: [{
      level: String, // '10th', '12th', 'graduation', etc.
      board: String, // CBSE, ICSE, State Board, etc.
      school: String,
      year: Number,
      percentage: Number,
      grade: String
    }],
    specializations: [String], // Any special courses, certifications
    achievements: [String] // Academic achievements, awards
  },

  // Location Information
  location: {
    country: {
      type: String,
      default: 'India'
    },
    state: {
      type: String,
      required: true
    },
    district: String,
    city: String,
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    address: String
  },

  // Career Interests and Preferences
  careerPreferences: {
    interests: [{
      category: String, // 'subject', 'field', 'activity'
      name: String,
      level: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
        default: 'medium'
      }
    }],
    preferredFields: [String], // Engineering, Medicine, Arts, etc.
    careerGoals: {
      shortTerm: String, // Next 2-3 years
      longTerm: String   // 5-10 years
    },
    workPreferences: {
      environment: {
        type: String,
        enum: ['office', 'field', 'remote', 'hybrid', 'laboratory', 'outdoor']
      },
      teamSize: {
        type: String,
        enum: ['individual', 'small-team', 'large-team', 'no-preference']
      },
      travelWillingness: {
        type: String,
        enum: ['none', 'occasional', 'frequent', 'extensive']
      }
    }
  },

  // Skills and Abilities
  skills: {
    technical: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      }
    }],
    soft: [{
      name: String,
      level: {
        type: String,
        enum: ['developing', 'competent', 'proficient', 'expert']
      }
    }],
    languages: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native']
      }
    }]
  },

  // Assessment Results
  assessmentResults: {
    quizResults: [{
      quizType: {
        type: String,
        enum: ['career-assessment', 'aptitude', 'personality', 'interest']
      },
      results: {
        streamPercentages: {
          science: Number,
          commerce: Number,
          arts: Number,
          diploma: Number
        },
        recommendations: [String],
        accuracy: Number,
        totalQuestions: Number,
        correctAnswers: Number
      },
      completedAt: {
        type: Date,
        default: Date.now
      }
    }],
    psychometricResults: [{
      testType: String,
      personalityTraits: {
        openness: Number,
        conscientiousness: Number,
        extraversion: Number,
        analytical: Number,
        leadership: Number,
        creativity: Number,
        social: Number,
        risk_tolerance: Number,
        detail_oriented: Number,
        communication: Number
      },
      careerMatches: [{
        career: String,
        matchPercentage: Number,
        category: String,
        description: String
      }],
      completedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Saved Items and Preferences
  savedItems: {
    colleges: [{
      collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
      },
      notes: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      savedAt: {
        type: Date,
        default: Date.now
      }
    }],
    courses: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      notes: String,
      interest_level: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      savedAt: {
        type: Date,
        default: Date.now
      }
    }],
    careers: [{
      name: String,
      field: String,
      notes: String,
      interest_level: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      savedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Profile Completion and Status
  profileStatus: {
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDocuments: [{
      type: String, // 'academic_certificate', 'id_proof', etc.
      url: String,
      uploadedAt: Date,
      verified: Boolean
    }]
  },

  // Privacy and Preferences
  preferences: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'limited'],
      default: 'private'
    },
    emailNotifications: {
      careerUpdates: { type: Boolean, default: true },
      collegeUpdates: { type: Boolean, default: true },
      courseRecommendations: { type: Boolean, default: true },
      assessmentReminders: { type: Boolean, default: true }
    },
    dataSharing: {
      allowAnalytics: { type: Boolean, default: true },
      allowRecommendations: { type: Boolean, default: true },
      allowResearch: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for profile completion calculation
profileSchema.virtual('completionDetails').get(function() {
  let completed = 0;
  let total = 10; // Total sections to complete

  // Check each section
  if (this.personalInfo.age && this.personalInfo.gender) completed++;
  if (this.academicInfo.currentClass && this.academicInfo.stream) completed++;
  if (this.location.state && this.location.city) completed++;
  if (this.careerPreferences.interests && this.careerPreferences.interests.length > 0) completed++;
  if (this.skills.technical && this.skills.technical.length > 0) completed++;
  if (this.skills.languages && this.skills.languages.length > 0) completed++;
  if (this.academicInfo.subjects && this.academicInfo.subjects.length > 0) completed++;
  if (this.careerPreferences.careerGoals.shortTerm) completed++;
  if (this.careerPreferences.workPreferences.environment) completed++;
  if (this.personalInfo.phoneNumber) completed++;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100)
  };
});

// Update completion percentage before saving
profileSchema.pre('save', function(next) {
  this.profileStatus.completionPercentage = this.completionDetails.percentage;
  this.profileStatus.lastUpdated = new Date();
  next();
});

// Indexes for better query performance
profileSchema.index({ userId: 1 });
profileSchema.index({ 'location.state': 1, 'location.city': 1 });
profileSchema.index({ 'academicInfo.stream': 1, 'academicInfo.currentClass': 1 });
profileSchema.index({ 'profileStatus.completionPercentage': 1 });

module.exports = mongoose.model('Profile', profileSchema);