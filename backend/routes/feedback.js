const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const Project = require('../models/Project');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback (clients only)
// @access  Private (Client)
router.post('/', [
  authenticateToken,
  body('projectId').optional().custom(value => {
    if (value !== null && !value.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid project ID format');
    }
    return true;
  }),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3-100 characters'),
  body('content').trim().isLength({ min: 5, max: 1000 }).withMessage('Content must be between 5-1000 characters'),
  body('serviceCategory').isIn([
    'web-development', 
    'mobile-development', 
    'database-integration', 
    'virtual-assistance', 
    'educational-support', 
    'digital-solutions'
  ]).withMessage('Invalid service category'),
  body('displayName').optional().trim().isLength({ max: 50 }).withMessage('Display name too long'),
  body('companyName').optional().trim().isLength({ max: 100 }).withMessage('Company name too long')
], async (req, res) => {
  try {
    console.log('Received feedback data:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { projectId, rating, title, content, serviceCategory, displayName, companyName } = req.body;

    let project = null;
    
    // If projectId is provided, verify the project belongs to the client and is completed
    if (projectId) {
      project = await Project.findOne({ 
        _id: projectId, 
        client: req.user._id,
        status: 'completed'
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found or not completed yet'
        });
      }
    }

    // Check if feedback already exists for this project (only if projectId exists)
    if (projectId) {
      const existingFeedback = await Feedback.findOne({
        client: req.user._id,
        project: projectId
      });

      if (existingFeedback) {
        return res.status(400).json({
          success: false,
          message: 'Feedback already submitted for this project'
        });
      }
    }

    const feedback = new Feedback({
      client: req.user._id,
      project: projectId, // Can be null for service-based feedback
      rating,
      title,
      content,
      serviceCategory,
      displayName: displayName || req.user.name,
      companyName: companyName || req.user.company
    });

    await feedback.save();
    await feedback.populate([
      { path: 'client', select: 'name email company' },
      { path: 'project', select: 'title category' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! It will be reviewed before being published.',
      data: {
        feedback
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/feedback/my-feedback
// @desc    Get client's own feedback
// @access  Private (Client)
router.get('/my-feedback', authenticateToken, async (req, res) => {
  try {
    const feedback = await Feedback.find({ client: req.user._id })
      .populate('project', 'title category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        feedback
      }
    });
  } catch (error) {
    console.error('Get my feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/feedback/public
// @desc    Get approved public feedback (for website display)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { limit = 10, category, rating } = req.query;

    let query = { status: 'approved', isPublic: true };
    
    if (category) query.serviceCategory = category;
    if (rating) query.rating = { $gte: parseInt(rating) };

    const feedback = await Feedback.find(query)
      .populate('project', 'title category')
      .sort({ approvedAt: -1 })
      .limit(parseInt(limit))
      .select('-client'); // Don't expose client details publicly

    const avgRating = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    const totalCount = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: {
        feedback,
        stats: {
          totalFeedback: totalCount,
          averageRating: avgRating[0]?.averageRating || 0
        }
      }
    });
  } catch (error) {
    console.error('Get public feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/feedback/admin
// @desc    Get all feedback for admin review
// @access  Private (Admin)
router.get('/admin', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const feedback = await Feedback.find(query)
      .populate('client', 'name email company')
      .populate('project', 'title category')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);
    const pendingCount = await Feedback.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: feedback.length,
          totalFeedback: total
        },
        pendingCount
      }
    });
  } catch (error) {
    console.error('Get admin feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/feedback/:id/approve
// @desc    Approve feedback
// @access  Private (Admin)
router.put('/:id/approve', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        isPublic: true,
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate([
      { path: 'client', select: 'name email company' },
      { path: 'project', select: 'title category' },
      { path: 'approvedBy', select: 'name' }
    ]);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback approved and published',
      data: {
        feedback
      }
    });
  } catch (error) {
    console.error('Approve feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/feedback/:id/reject
// @desc    Reject feedback
// @access  Private (Admin)
router.put('/:id/reject', [
  authenticateToken,
  requireAdmin,
  body('reason').trim().notEmpty().withMessage('Rejection reason is required')
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

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        isPublic: false,
        rejectionReason: req.body.reason,
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate([
      { path: 'client', select: 'name email company' },
      { path: 'project', select: 'title category' },
      { path: 'approvedBy', select: 'name' }
    ]);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback rejected',
      data: {
        feedback
      }
    });
  } catch (error) {
    console.error('Reject feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
// @access  Private (Admin)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;