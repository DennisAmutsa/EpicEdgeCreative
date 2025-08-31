const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/messages
// @desc    Send message from client to admin
// @access  Private (Client or Admin)
router.post('/', [
  authenticateToken,
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('subject').optional().trim(),
  body('projectId').optional().isMongoId().withMessage('Invalid project ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { content, subject, projectId } = req.body;

    const message = new Message({
      from: req.user._id,
      content,
      subject: subject || 'New message from client',
      projectId: projectId || null,
      fromRole: req.user.role,
      toRole: 'admin'
    });

    await message.save();
    await message.populate('from', 'name email company');
    await message.populate('projectId', 'title');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/messages
// @desc    Get messages (admin sees all, clients see their own)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.user.role === 'admin') {
      // Admins see all messages sent to them
      query.toRole = 'admin';
      if (status !== 'all') {
        query.status = status;
      }
    } else {
      // Clients see only their own messages
      query.from = req.user._id;
    }

    const messages = await Message.find(query)
      .populate('from', 'name email company')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({
      ...query,
      status: 'unread'
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: messages.length,
          totalMessages: total
        },
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/messages/:id/status
// @desc    Update message status (admin only)
// @access  Private (Admin)
router.put('/:id/status', [
  authenticateToken,
  requireAdmin,
  body('status').isIn(['unread', 'read', 'replied']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        readAt: req.body.status === 'read' ? new Date() : undefined
      },
      { new: true }
    ).populate('from', 'name email company')
     .populate('projectId', 'title');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message status updated',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/messages/:id/reply
// @desc    Reply to client message (admin only)
// @access  Private (Admin)
router.post('/:id/reply', [
  authenticateToken,
  requireAdmin,
  body('content').trim().notEmpty().withMessage('Reply content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const originalMessage = await Message.findById(req.params.id);
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: 'Original message not found'
      });
    }

    // Create reply message
    const reply = new Message({
      from: req.user._id,
      to: originalMessage.from,
      content: req.body.content,
      subject: `Re: ${originalMessage.subject}`,
      projectId: originalMessage.projectId,
      fromRole: 'admin',
      toRole: 'client',
      replyTo: originalMessage._id
    });

    await reply.save();
    await reply.populate('from', 'name email');

    // Update original message status
    originalMessage.status = 'replied';
    await originalMessage.save();

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        reply
      }
    });
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message (admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

