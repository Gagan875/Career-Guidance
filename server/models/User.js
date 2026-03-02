const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    class: {
      type: String,
      enum: ['10', '11', '12', 'graduate', 'postgraduate']
    },
    location: {
      state: String,
      district: String,
      city: String
    },
    interests: [String],
    academicBackground: {
      stream: {
        type: String,
        enum: ['science', 'commerce', 'arts', 'diploma']
      },
      subjects: [String],
      percentage: Number
    }
  },
  quizResults: [{
    quizType: String,
    score: Number,
    recommendations: [String],
    questionsUsed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }],
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  questionHistory: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    quizNumber: Number
  }],
  savedColleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  }],
  savedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);