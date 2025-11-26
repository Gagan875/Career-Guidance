const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  stream: {
    type: String,
    enum: ['science', 'commerce', 'arts', 'diploma'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ stream: 1, isActive: 1 });
questionSchema.index({ stream: 1, difficulty: 1, isActive: 1 });

module.exports = mongoose.model('Question', questionSchema);