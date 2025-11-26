const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['aptitude', 'interest', 'personality'],
    required: true
  },
  description: String,
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      text: String,
      value: String,
      points: {
        science: { type: Number, default: 0 },
        commerce: { type: Number, default: 0 },
        arts: { type: Number, default: 0 },
        diploma: { type: Number, default: 0 }
      }
    }],
    category: String
  }],
  scoringRules: {
    science: {
      minScore: Number,
      maxScore: Number,
      description: String
    },
    commerce: {
      minScore: Number,
      maxScore: Number,
      description: String
    },
    arts: {
      minScore: Number,
      maxScore: Number,
      description: String
    },
    diploma: {
      minScore: Number,
      maxScore: Number,
      description: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);