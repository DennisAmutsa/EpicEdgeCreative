const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'review', 'completed', 'on-hold', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: [true, 'Project deadline is required']
  },
  completedDate: {
    type: Date
  },
  budget: {
    type: Number,
    min: 0
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  category: {
    type: String,
    enum: ['web-development', 'mobile-app', 'design', 'branding', 'consultation', 'virtual-assistance', 'educational-support'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  notes: [{
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  // Portfolio-specific fields
  technologies: [{
    type: String,
    trim: true
  }],
  link: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  users: {
    type: String,
    default: '10+'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.8
  },
  completionYear: {
    type: String,
    default: function() { return new Date().getFullYear().toString(); }
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('Project', projectSchema);
