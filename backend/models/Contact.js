const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  subject: {
    type: String,
    required: true,
    enum: [
      'web-development',
      'virtual-assistance', 
      'educational-support',
      'general',
      'pricing',
      'partnership',
      'callback-request',
      'other'
    ]
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });

// Virtual for full name
ContactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
ContactSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Contact', ContactSchema);
