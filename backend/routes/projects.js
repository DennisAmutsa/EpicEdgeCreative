const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { authenticateToken, requireAdmin, requireClientOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects/public/portfolio
// @desc    Get public portfolio projects (completed projects only, no auth required)
// @access  Public
router.get('/public/portfolio', async (req, res) => {
  try {
    const { category, featured, limit = 50 } = req.query;
    
    let query = { 
      status: 'completed' // Only show completed projects in public portfolio
    };

    // Apply filters
    if (category && category !== 'All') {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Debug: Also check what projects exist regardless of filters
    const allProjects = await Project.find({});
    console.log('All projects in database:', allProjects.map(p => ({ 
      title: p.title, 
      featured: p.featured, 
      status: p.status, 
      isPublic: p.isPublic 
    })));

    console.log('Portfolio query:', query);
    console.log('Featured parameter:', featured);
    console.log('All query params:', req.query);
    
    const projects = await Project.find(query)
      .select('title description category technologies link github featured stats rating users completionYear status isPublic createdAt')
      .sort({ featured: -1, createdAt: -1 }) // Featured projects first, then by newest
      .limit(parseInt(limit));

    console.log('Found projects:', projects.length);
    console.log('Projects:', projects.map(p => ({ title: p.title, featured: p.featured, status: p.status, isPublic: p.isPublic })));

    // Format projects for public display
    const formattedProjects = projects.map(project => ({
      id: project._id,
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: project.technologies || [],
      link: project.link,
      github: project.github,
      featured: project.featured || false,
      stats: {
        users: project.users || project.stats?.users || '10+',
        rating: project.rating || project.stats?.rating || 4.8,
        completion: project.completionYear || project.stats?.completion || new Date().getFullYear().toString()
      }
    }));

    res.json({
      success: true,
      data: {
        projects: formattedProjects,
        total: formattedProjects.length
      }
    });
  } catch (error) {
    console.error('Get public portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects/portfolio
// @desc    Create new portfolio project
// @access  Private (Admin only)
router.post('/portfolio', [
  authenticateToken,
  requireAdmin,
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Project description is required'),
  body('category').isIn(['web-development', 'mobile-app', 'design', 'branding', 'consultation', 'virtual-assistance', 'educational-support']).withMessage('Invalid category'),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean')
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

    // Create a dummy client for portfolio projects - use first admin as client
    const User = require('../models/User');
    const dummyClient = await User.findOne({ role: 'admin' });
    if (!dummyClient) {
      return res.status(400).json({
        success: false,
        message: 'No admin user found to assign as client'
      });
    }

    const projectData = {
      ...req.body,
      client: dummyClient._id,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'completed', // Portfolio projects are completed
      isPublic: true // Portfolio projects are public by default
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Portfolio project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create portfolio project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/projects/portfolio/:id
// @desc    Update portfolio project
// @access  Private (Admin only)
router.put('/portfolio/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().trim().notEmpty().withMessage('Project title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Project description cannot be empty'),
  body('category').optional().isIn(['web-development', 'mobile-app', 'design', 'marketing', 'branding', 'consultation']).withMessage('Invalid category'),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean')
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

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio project updated successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Update portfolio project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/portfolio/:id
// @desc    Delete portfolio project
// @access  Private (Admin only)
router.delete('/portfolio/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio project deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects
// @desc    Get all projects (admin) or user's projects (client)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // If user is client, only show their projects
    if (req.user.role === 'client') {
      query.client = req.user._id;
    }

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const projects = await Project.find(query)
      .populate('client', 'name email company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: projects.length,
          totalProjects: total
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email company phone')
      .populate('notes.author', 'name');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access to this project
    if (req.user.role === 'client' && project.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Project description is required'),
  body('client').isMongoId().withMessage('Valid client ID is required'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('category').isIn(['web-development', 'mobile-app', 'design', 'branding', 'consultation', 'virtual-assistance', 'educational-support']).withMessage('Invalid category'),
  body('budget').optional().isNumeric().withMessage('Budget must be a number'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
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

    const projectData = {
      ...req.body,
      deadline: new Date(req.body.deadline)
    };

    const project = new Project(projectData);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('client', 'name email company');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project: populatedProject
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('title').optional().trim().notEmpty().withMessage('Project title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Project description cannot be empty'),
  body('deadline').optional().isISO8601().withMessage('Valid deadline date is required'),
  body('category').optional().isIn(['web-development', 'mobile-app', 'design', 'marketing', 'branding', 'consultation']).withMessage('Invalid category'),
  body('status').optional().isIn(['planning', 'in-progress', 'review', 'completed', 'on-hold', 'cancelled']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
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

    const updateData = { ...req.body };
    
    // Set completed date if status is completed
    if (updateData.status === 'completed' && updateData.progress === 100) {
      updateData.completedDate = new Date();
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name email company');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects/:id/notes
// @desc    Add note to project
// @access  Private
router.post('/:id/notes', authenticateToken, [
  body('content').trim().notEmpty().withMessage('Note content is required'),
  body('isPrivate').optional().isBoolean().withMessage('isPrivate must be boolean')
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

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access to this project
    if (req.user.role === 'client' && project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const note = {
      content: req.body.content,
      author: req.user._id,
      isPrivate: req.body.isPrivate || false
    };

    project.notes.push(note);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('notes.author', 'name');

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: {
        project: updatedProject
      }
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// @route   GET /api/projects/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    let matchQuery = {};
    
    // If user is client, only show their projects
    if (req.user.role === 'client') {
      matchQuery.client = req.user._id;
    }

    const stats = await Project.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgressProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          planningProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'planning'] }, 1, 0] }
          },
          totalBudget: { $sum: '$budget' },
          averageProgress: { $avg: '$progress' }
        }
      }
    ]);

    const statusBreakdown = await Project.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryBreakdown = await Project.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProjects: 0,
          completedProjects: 0,
          inProgressProjects: 0,
          planningProjects: 0,
          totalBudget: 0,
          averageProgress: 0
        },
        statusBreakdown,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
