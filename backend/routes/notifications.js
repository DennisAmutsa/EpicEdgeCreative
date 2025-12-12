const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendPushNotificationToMultiple, createNotificationPayload } = require('../services/pushNotification');
const PushSubscription = require('../models/PushSubscription');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for authenticated user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false, type } = req.query;

    let query = { recipient: req.user._id };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    // Don't show expired notifications
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ];

    const notifications = await Notification.find(query)
      .populate('sender', 'name email')
      .populate('relatedProject', 'title')
      .populate('relatedInvoice', 'invoiceNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // For regular users, only allow marking their own notifications
    // For admins, allow marking any notification they can see
    if (req.user.role !== 'admin') {
      query.recipient = req.user._id;
    } else {
      // For admins, ensure they can only mark notifications that are addressed to them
      query.recipient = req.user._id;
    }

    const notification = await Notification.findOne(query);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Update the notification directly since markAsRead might not exist
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read for user
// @access  Private
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/notifications
// @desc    Send notification (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, [
  body('recipients').isArray().withMessage('Recipients must be an array'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error', 'project_update', 'payment', 'message', 'system']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
  }

  try {
    const {
      recipients,
      title,
      message,
      type = 'info',
      priority = 'medium',
      actionUrl,
      actionText,
      expiresAt,
      relatedProject,
      relatedInvoice
    } = req.body;

    // Validate recipients exist
    const validRecipients = await User.find({
      _id: { $in: recipients },
      role: 'client' // Only send to clients
    }).select('_id');

    if (validRecipients.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid recipients found' });
    }

    const notificationData = {
      sender: req.user._id,
      title,
      message,
      type,
      priority,
      actionUrl,
      actionText,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      relatedProject,
      relatedInvoice
    };

    const notifications = await Notification.sendBulkNotification(
      validRecipients.map(user => user._id),
      notificationData
    );

    // Automatically send push notifications to all recipients
    try {
      const recipientIds = validRecipients.map(user => user._id);
      const pushSubscriptions = await PushSubscription.find({
        userId: { $in: recipientIds },
        isActive: true
      });

      if (pushSubscriptions.length > 0) {
        const payload = createNotificationPayload(title, message, {
          url: actionUrl || '/notifications',
          type,
          priority
        });

        const pushResults = await sendPushNotificationToMultiple(pushSubscriptions, payload);
        console.log(`Push notifications sent: ${pushResults.filter(r => r.success).length}/${pushResults.length} successful`);
      }
    } catch (pushError) {
      console.error('Error sending push notifications:', pushError);
      // Don't fail the main request if push notifications fail
    }

    // Send emails to recipients
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Get recipient emails
      const users = await User.find({ _id: { $in: recipients } }).select('email name');

      // Send email to each recipient
      const emailPromises = users.map(user => {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">New Notification</h1>
              <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">EpicEdge Creative</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${user.name},</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">${title}</h3>
                <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                  ${message}
                </p>
                ${actionUrl ? `
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="https://epicedgecreative.amutsa.com${actionUrl}" style="background: linear-gradient(135deg, #f59e0b, #eab308); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                      ${actionText || 'View Details'}
                    </a>
                  </div>
                ` : ''}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://epicedgecreative.amutsa.com/notifications" style="color: #f59e0b; text-decoration: none; font-weight: bold;">
                  View all notifications
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
              <p>This is an automated notification from EpicEdge Creative</p>
            </div>
          </div>
        `;

        return transporter.sendMail({
          from: `"EpicEdge Creative" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `Notification: ${title}`,
          html: emailContent
        });
      });

      Promise.allSettled(emailPromises).then(results => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        console.log(`Emails sent: ${successful}/${users.length} successful`);
      });

    } catch (emailError) {
      console.error('Error sending notification emails:', emailError);
    }

    res.status(201).json({
      success: true,
      message: `Notification sent to ${notifications.length} recipient(s)`,
      data: { sentCount: notifications.length }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/notifications/callback
// @desc    Send callback request notification to admin (Public)
// @access  Public
router.post('/callback', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('type').optional().isIn(['callback']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  console.log('Callback request payload:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
      received: req.body
    });
  }

  try {
    const {
      title,
      message,
      type = 'callback',
      priority = 'high'
    } = req.body;

    // Get all admin users
    console.log('Looking for admin users...');
    const admins = await User.find({
      role: 'admin'
    }).select('_id name role');

    console.log('Found admins:', admins.length);

    if (admins.length === 0) {
      console.log('No admins found, returning error');
      return res.status(400).json({ success: false, message: 'No active admins found.' });
    }

    // Create notifications for all admins
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      sender: null, // No sender for public callback requests
      title,
      message,
      type,
      priority
    }));

    console.log('Creating callback notifications:', notifications.length);

    await Notification.insertMany(notifications);

    // Automatically send push notifications to all admins
    try {
      const adminIds = admins.map(admin => admin._id);
      const pushSubscriptions = await PushSubscription.find({
        userId: { $in: adminIds },
        isActive: true
      });

      if (pushSubscriptions.length > 0) {
        const payload = createNotificationPayload(title, message, {
          url: '/notifications',
          type: 'callback',
          priority: 'high'
        });

        const pushResults = await sendPushNotificationToMultiple(pushSubscriptions, payload);
        console.log(`Callback push notifications sent to admins: ${pushResults.filter(r => r.success).length} / ${pushResults.length} successful`);
      }
    } catch (pushError) {
      console.error('Error sending callback push notifications:', pushError);
      // Don't fail the main request if push notifications fail
    }

    console.log('Callback notifications created successfully');

    res.json({
      success: true,
      message: `Callback request notification sent to ${admins.length} admin(s) successfully`,
      data: {
        recipientCount: admins.length,
        type,
        priority
      }
    });

  } catch (error) {
    console.error('Error sending callback notification:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/notifications/request
// @desc    Send request to admin from client
// @access  Private (Client)
router.post('/request', authenticateToken, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error', 'project_update', 'payment', 'message', 'system', 'meeting', 'callback']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  console.log('Client request payload:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
      received: req.body
    });
  }

  try {
    const {
      title,
      message,
      type = 'message',
      priority = 'medium',
      actionUrl,
      actionText,
      relatedProject,
      relatedInvoice,
      email // For meeting confirmation emails
    } = req.body;

    // Get all admin users
    console.log('Looking for admin users...');
    const admins = await User.find({
      role: 'admin'
    }).select('_id name role');

    console.log('Found admins:', admins.length);
    console.log('Admin details:', admins);

    if (admins.length === 0) {
      console.log('No admins found, returning error');
      return res.status(400).json({ success: false, message: 'No active admins found. Please ensure at least one admin user exists in the system.' });
    }

    // Create notifications for all admins
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      sender: req.user._id,
      title,
      message,
      type,
      priority,
      actionUrl,
      actionText,
      relatedProject,
      relatedInvoice
    }));

    console.log('Creating notifications:', notifications.length);
    console.log('Sample notification:', notifications[0]);

    await Notification.insertMany(notifications);

    console.log('Notifications created successfully');

    // Send automatic confirmation email for meeting requests
    if (type === 'meeting' && email) {
      try {
        const nodemailer = require('nodemailer');

        // Create transporter (UPDATED FOR YOUR DOMAIN)
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Get user name for personalization
        const userName = req.user?.name || 'there';


        // Email content
        const emailSubject = 'Meeting Request Confirmation - EpicEdge Creative';
        const emailBody = `
        < div style = "font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;" >
            <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Meeting Request Received</h1>
              <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">EpicEdge Creative</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName}!</h2>
              
              <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                Thank you for your meeting request! We have successfully received your request and notified our team. Here's what happens next:
              </p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Your Meeting Request Details:</h3>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Request Type:</strong> ${title}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Priority:</strong> ${priority.charAt(0).toUpperCase() + priority.slice(1)}</p>
                ${message ? `<p style="color: #6b7280; margin: 5px 0;"><strong>Message:</strong> ${message.replace(/ðŸ“…\s*/, '')}</p>` : ''}
                <p style="color: #6b7280; margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                <h3 style="color: #047857; margin-top: 0;">Next Steps:</h3>
                <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                  <li>Our team will review your request within 24 hours</li>
                  <li>We'll contact you to confirm meeting details</li>
                  <li>You'll receive a calendar invitation once scheduled</li>
                  <li>We offer video calls, phone consultations, and screen sharing</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0;">Need to make changes to your request?</p>
                <p style="color: #6b7280; margin: 5px 0;">Contact us directly:</p>
                <p style="color: #f59e0b; margin: 0;">
                  <strong>ðŸ“§ epicedgecreative@gmail.com</strong><br>
                  <strong>ðŸ“ž +254787205456</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
              <p>This is an automated confirmation email from EpicEdge Creative</p>
              <p>Nairobi, Kenya | Software Engineering Excellence</p>
            </div>
          </div >
        `;

        const mailOptions = {
          from: `"EpicEdge Creative" < ${process.env.EMAIL_USER}> `,
          to: email,
          subject: emailSubject,
          html: emailBody
        };

        await transporter.sendMail(mailOptions);
        console.log(`Meeting confirmation email sent to: ${email} `);

      } catch (emailError) {
        console.error('Error sending meeting confirmation email:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    res.json({
      success: true,
      message: `Request sent to ${admins.length} admin(s) successfully${type === 'meeting' && email ? '. Confirmation email sent!' : ''} `,
      data: {
        recipientCount: admins.length,
        type,
        priority,
        emailSent: type === 'meeting' && email ? true : false
      }
    });

  } catch (error) {
    console.error('Error sending client request:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/notifications/broadcast
// @desc    Send notification to all clients (Admin only)
// @access  Private (Admin)
router.post('/broadcast', authenticateToken, requireAdmin, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('type').optional().isIn(['info', 'success', 'warning', 'error', 'project_update', 'payment', 'message', 'system']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
  }

  try {
    const {
      title,
      message,
      type = 'info',
      priority = 'medium',
      actionUrl,
      actionText,
      expiresAt
    } = req.body;

    // Get all active clients
    const clients = await User.find({
      role: 'client',
      isActive: { $ne: false }
    }).select('_id');

    if (clients.length === 0) {
      return res.status(400).json({ success: false, message: 'No active clients found' });
    }

    const notificationData = {
      sender: req.user._id,
      title,
      message,
      type,
      priority,
      actionUrl,
      actionText,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    };

    const notifications = await Notification.sendBulkNotification(
      clients.map(client => client._id),
      notificationData
    );

    // Automatically send push notifications to all clients
    try {
      const clientIds = clients.map(client => client._id);
      const pushSubscriptions = await PushSubscription.find({
        userId: { $in: clientIds },
        isActive: true
      });

      if (pushSubscriptions.length > 0) {
        const payload = createNotificationPayload(title, message, {
          url: actionUrl || '/notifications',
          type,
          priority
        });

        const pushResults = await sendPushNotificationToMultiple(pushSubscriptions, payload);
        console.log(`Broadcast push notifications sent: ${pushResults.filter(r => r.success).length}/${pushResults.length} successful`);
      }
    } catch (pushError) {
      console.error('Error sending broadcast push notifications:', pushError);
      // Don't fail the main request if push notifications fail
    }

    // Send emails to all clients
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Get client emails with names
      const emailRecipients = await User.find({
        role: 'client',
        isActive: { $ne: false }
      }).select('email name');

      // Send email to each client
      const emailPromises = emailRecipients.map(user => {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">New Announcement</h1>
              <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">EpicEdge Creative</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${user.name},</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">${title}</h3>
                <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                  ${message}
                </p>
                ${actionUrl ? `
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="https://epicedgecreative.amutsa.com${actionUrl}" style="background: linear-gradient(135deg, #f59e0b, #eab308); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                      ${actionText || 'View Details'}
                    </a>
                  </div>
                ` : ''}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://epicedgecreative.amutsa.com/notifications" style="color: #f59e0b; text-decoration: none; font-weight: bold;">
                  View all notifications
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
              <p>This is an automated notification from EpicEdge Creative</p>
            </div>
          </div>
        `;

        return transporter.sendMail({
          from: `"EpicEdge Creative" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `Announcement: ${title}`,
          html: emailContent
        });
      });

      Promise.allSettled(emailPromises).then(results => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        console.log(`Broadcast emails sent: ${successful}/${emailRecipients.length} successful`);
      });

    } catch (emailError) {
      console.error('Error sending broadcast emails:', emailError);
    }

    res.status(201).json({
      success: true,
      message: `Broadcast notification sent to ${notifications.length} client(s)`,
      data: { sentCount: notifications.length }
    });
  } catch (error) {
    console.error('Send broadcast notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (User can delete their own)
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: req.params.id };

    // Users can only delete their own notifications, admins can delete any
    if (req.user.role !== 'admin') {
      query.recipient = req.user._id;
    }

    const notification = await Notification.findOneAndDelete(query);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/notifications/sent
// @desc    Get sent notifications (Admin only)
// @access  Private (Admin)
router.get('/sent', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    let query = { sender: req.user._id };

    if (type && type !== 'all') {
      query.type = type;
    }

    const sentNotifications = await Notification.find(query)
      .populate('recipient', 'name email')
      .populate('relatedProject', 'title')
      .populate('relatedInvoice', 'invoiceNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Group notifications by title and creation time to show consolidated view
    const groupedNotifications = {};
    sentNotifications.forEach(notification => {
      const key = `${notification.title}_${notification.createdAt.getTime()}`;
      if (!groupedNotifications[key]) {
        groupedNotifications[key] = {
          _id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          expiresAt: notification.expiresAt,
          relatedProject: notification.relatedProject,
          createdAt: notification.createdAt,
          recipients: [],
          readBy: []
        };
      }

      groupedNotifications[key].recipients.push({
        _id: notification.recipient._id,
        name: notification.recipient.name,
        email: notification.recipient.email
      });

      if (notification.isRead) {
        groupedNotifications[key].readBy.push({
          _id: notification.recipient._id,
          name: notification.recipient.name,
          readAt: notification.readAt
        });
      }
    });

    const consolidatedNotifications = Object.values(groupedNotifications);

    const total = await Notification.countDocuments({ sender: req.user._id });

    res.json({
      success: true,
      data: consolidatedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sent notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics (Admin only)
// @access  Private (Admin)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ isRead: false });
    const notificationsByType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const notificationsByPriority = await Notification.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalNotifications,
        unread: unreadNotifications,
        byType: notificationsByType,
        byPriority: notificationsByPriority
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
