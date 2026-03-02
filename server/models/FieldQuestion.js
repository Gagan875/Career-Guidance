const mongoose = require('mongoose');

const fieldQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  field: {
    type: String,
    enum: [
      'engineering',
      'medical',
      'management',
      'law',
      'design',
      'architecture',
      'agriculture',
      'pharmacy',
      'computer-science',
      'data-science',
      'biotechnology',
      'psychology',
      'mass-communication',
      'hospitality',
      'aviation'
    ],
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
fieldQuestionSchema.index({ field: 1, isActive: 1 });
fieldQuestionSchema.index({ field: 1, difficulty: 1, isActive: 1 });

module.exports = mongoose.model('FieldQuestion', fieldQuestionSchema);
