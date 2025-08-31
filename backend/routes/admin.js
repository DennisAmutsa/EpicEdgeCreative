const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Message = require('../models/Message');
const Feedback = require('../models/Feedback');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/stats', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    // Get total clients (users with role 'client')
    const totalClients = await User.countDocuments({ role: 'client' });

    // Get active projects (in progress, not completed/cancelled)
    const activeProjects = await Project.countDocuments({ 
      status: { $in: ['planning', 'in-progress', 'review'] }
    });

    // Get pending messages (unread messages)
    const pendingMessages = await Message.countDocuments({ status: 'unread' });

    // Get pending feedback (feedback waiting for approval)
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });

    // Get completed projects count
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    // Get total projects count
    const totalProjects = await Project.countDocuments();

    // Calculate average project completion rate if there are projects
    let avgProgress = 0;
    if (totalProjects > 0) {
      const projects = await Project.find({}, 'progress');
      const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0);
      avgProgress = Math.round(totalProgress / totalProjects);
    }

    res.json({
      success: true,
      data: {
        totalClients,
        activeProjects,
        pendingMessages,
        pendingFeedback,
        completedProjects,
        totalProjects,
        avgProgress
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error.message
    });
  }
});

// @route   GET /api/admin/clients
// @desc    Get all clients for admin management
// @access  Private (Admin only)
router.get('/clients', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: clients
    });

  } catch (error) {
    console.error('Admin clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients',
      error: error.message
    });
  }
});

// @route   GET /api/admin/projects
// @desc    Get all projects for admin management
// @access  Private (Admin only)
router.get('/projects', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name email company')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error('Admin projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// @route   GET /api/admin/messages
// @desc    Get all messages for admin management
// @access  Private (Admin only)
router.get('/messages', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('client', 'name email company')
      .populate('relatedProject', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Admin messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

module.exports = router;
