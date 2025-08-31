const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Message subject is required'],
    trim: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  fromRole: {
    type: String,
    enum: ['client', 'admin'],
    required: true
  },
  toRole: {
    type: String,
    enum: ['client', 'admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  readAt: {
    type: Date
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
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
  }]
}, {
  timestamps: true
});

// Index for better query performance
messageSchema.index({ from: 1, createdAt: -1 });
messageSchema.index({ toRole: 1, status: 1, createdAt: -1 });
messageSchema.index({ projectId: 1 });

module.exports = mongoose.model('Message', messageSchema);

