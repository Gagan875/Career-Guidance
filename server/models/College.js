const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['government', 'private', 'aided'],
    default: 'government'
  },
  location: {
    state: String,
    district: String,
    city: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  facilities: {
    hostel: Boolean,
    library: Boolean,
    laboratory: Boolean,
    internetAccess: Boolean,
    sportsComplex: Boolean,
    canteen: Boolean
  },
  admissionInfo: {
    applicationDeadline: Date,
    entranceExam: String,
    cutoffMarks: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number
    }
  },
  fees: {
    tuitionFee: Number,
    hostelFee: Number,
    otherFees: Number
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('College', collegeSchema);