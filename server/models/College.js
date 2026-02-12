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
    },
    // GeoJSON format for MongoDB geospatial queries
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
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
  ranking: {
    type: Number,
    min: 1,
    max: 1000
  },
  accreditation: {
    naac: {
      grade: String,
      score: Number
    },
    nba: Boolean,
    ugc: Boolean
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

// Create geospatial index for location-based queries
collegeSchema.index({ "location.geometry": "2dsphere" });

// Pre-save middleware to create GeoJSON from coordinates
collegeSchema.pre('save', function(next) {
  if (this.location && this.location.coordinates && this.location.coordinates.latitude && this.location.coordinates.longitude) {
    this.location.geometry = {
      type: 'Point',
      coordinates: [this.location.coordinates.longitude, this.location.coordinates.latitude]
    };
  }
  next();
});

module.exports = mongoose.model('College', collegeSchema);