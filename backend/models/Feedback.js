const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false // Allow null for service-based feedback
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Feedback title is required'],
    trim: true,
    maxLength: 100
  },
  content: {
    type: String,
    required: [true, 'Feedback content is required'],
    trim: true,
    maxLength: 1000
  },
  serviceCategory: {
    type: String,
    enum: [
      'web-development', 
      'mobile-development', 
      'database-integration', 
      'virtual-assistance', 
      'educational-support', 
      'digital-solutions'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isPublic: {
    type: Boolean,
    default: false // Only becomes true when approved
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  displayName: {
    type: String,
    trim: true // Optional: client can choose how their name appears
  },
  companyName: {
    type: String,
    trim: true // Optional: company name for the testimonial
  }
}, {
  timestamps: true
});

// Index for better query performance
feedbackSchema.index({ status: 1, isPublic: 1 });
feedbackSchema.index({ client: 1 });
feedbackSchema.index({ project: 1 });
feedbackSchema.index({ rating: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);