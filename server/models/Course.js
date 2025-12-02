const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  stream: {
    type: String,
    enum: ['science', 'commerce', 'arts', 'diploma', 'engineering', 'medical'],
    required: true
  },
  degree: {
    type: String,
    enum: ['bachelor', 'master', 'diploma', 'certificate'],
    required: true
  },
  duration: {
    years: Number,
    months: Number
  },
  description: String,
  eligibility: {
    minimumMarks: Number,
    requiredSubjects: [String],
    entranceExam: String
  },
  careerPaths: [{
    jobTitle: String,
    industry: String,
    averageSalary: {
      min: Number,
      max: Number
    },
    description: String
  }],
  higherEducationOptions: [{
    courseName: String,
    degree: String,
    description: String
  }],
  governmentExams: [{
    examName: String,
    description: String,
    eligibility: String
  }],
  skills: [String],
  subjects: [String],
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);