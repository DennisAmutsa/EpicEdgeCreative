const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Email configuration (using nodemailer with Gmail)
const nodemailer = require('nodemailer');

// Create transporter for email sending
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'epicedgecreative@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password' // Use App Password for Gmail
    }
  });
};

// Function to send automatic confirmation email for callback requests
const sendCallbackConfirmation = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    // Extract information from callback request message
    const nameMatch = contactData.message.match(/Name:\s*([^\n]+)/);
    const emailMatch = contactData.message.match(/Email:\s*([^\s\n]+@[^\s\n]+)/);
    const phoneMatch = contactData.message.match(/Phone:\s*([^\n]+)/);
    const dateMatch = contactData.message.match(/Preferred Date:\s*([^\n]+)/);
    const timeMatch = contactData.message.match(/Preferred Time:\s*([^\n]+)/);
    
    const customerName = nameMatch ? nameMatch[1].trim() : contactData.firstName;
    const customerEmail = emailMatch ? emailMatch[1].trim() : contactData.email;
    const customerPhone = phoneMatch ? phoneMatch[1].trim() : '';
    const preferredDate = dateMatch ? dateMatch[1].trim() : '';
    const preferredTime = timeMatch ? timeMatch[1].trim() : '';
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'epicedgecreative@gmail.com',
      to: customerEmail,
      subject: `Callback Request Confirmed - EpicEdge Creative`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; color: #6b7280; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📞 Callback Request Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Hello ${customerName},</h2>
              
              <p>Thank you for requesting a callback from <strong>EpicEdge Creative</strong>! We've received your request and are excited to discuss your project with you.</p>
              
              <div class="highlight">
                <h3>📋 Your Callback Details:</h3>
                <p><strong>Name:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ''}
                ${preferredDate ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>` : ''}
                ${preferredTime ? `<p><strong>Preferred Time:</strong> ${preferredTime}</p>` : ''}
              </div>
              
              <h3>🚀 What happens next?</h3>
              <ol>
                <li><strong>Confirmation:</strong> You'll receive this confirmation email (that's this one!)</li>
                <li><strong>Preparation:</strong> Our team will review your request and prepare for the call</li>
                <li><strong>Contact:</strong> We'll call you at your preferred time to discuss your project</li>
                <li><strong>Follow-up:</strong> After the call, we'll send you a detailed proposal if needed</li>
              </ol>
              
              <p>If you have any questions before our call or need to reschedule, please don't hesitate to reach out to us.</p>
              
              <p>We're looking forward to speaking with you and helping bring your vision to life!</p>
              
              <p>Best regards,<br>
              <strong>EpicEdge Creative Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>📧 Email:</strong> epicedgecreative@gmail.com</p>
              <p><strong>📱 Phone:</strong> +254 787 205 456</p>
              <p><strong>🌐 Website:</strong> www.epicedgecreative.com</p>
              <p style="margin-top: 20px; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Callback confirmation email sent successfully to:', customerEmail);
    return true;
  } catch (error) {
    console.error('Error sending callback confirmation email:', error);
    return false;
  }
};

// Function to send admin notification email about new callback requests
const sendAdminNotification = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'epicedgecreative@gmail.com';
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'epicedgecreative@gmail.com',
      to: adminEmail,
      subject: `🔔 New Callback Request - ${contactData.firstName} ${contactData.lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; color: #6b7280; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Callback Request!</h1>
            </div>
            <div class="content">
              <h2>Hello Admin,</h2>
              
              <p>A new callback request has been submitted through your website!</p>
              
              <div class="highlight">
                <h3>📋 Callback Request Details:</h3>
                <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
                <p><strong>Email:</strong> ${contactData.email}</p>
                <p><strong>Company:</strong> ${contactData.company || 'Not specified'}</p>
                <p><strong>Subject:</strong> ${contactData.subject}</p>
                <p><strong>Message:</strong> ${contactData.message}</p>
                <p><strong>Submitted:</strong> ${new Date(contactData.createdAt).toLocaleString()}</p>
              </div>
              
              <h3>🚀 Action Required:</h3>
              <ol>
                <li><strong>Review:</strong> Check the request details above</li>
                <li><strong>Prepare:</strong> Gather any necessary information for the call</li>
                <li><strong>Call:</strong> Contact the client at their preferred time</li>
                <li><strong>Update:</strong> Mark as 'replied' in your admin panel</li>
              </ol>
              
              <p><strong>Client Contact:</strong> ${contactData.email} | ${contactData.phone || 'Phone not provided'}</p>
              
              <p>Best regards,<br>
              <strong>EpicEdge Creative System</strong></p>
            </div>
            <div class="footer">
              <p style="margin-top: 20px; font-size: 12px;">
                This is an automated notification from your website contact form.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully to:', adminEmail);
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
};

// Function to send admin notification email about new callback requests
const sendAdminNotification = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'epicedgecreative@gmail.com';
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'epicedgecreative@gmail.com',
      to: adminEmail,
      subject: `🔔 New Callback Request - ${contactData.firstName} ${contactData.lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; color: #6b7280; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Callback Request!</h1>
            </div>
            <div class="content">
              <h2>Hello Admin,</h2>
              
              <p>A new callback request has been submitted through your website!</p>
              
              <div class="highlight">
                <h3>📋 Callback Request Details:</h3>
                <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
                <p><strong>Email:</strong> ${contactData.email}</p>
                <p><strong>Company:</strong> ${contactData.company || 'Not specified'}</p>
                <p><strong>Subject:</strong> ${contactData.subject}</p>
                <p><strong>Message:</strong> ${contactData.message}</p>
                <p><strong>Submitted:</strong> ${new Date(contactData.createdAt).toLocaleString()}</p>
              </div>
              
              <h3>🚀 Action Required:</h3>
              <ol>
                <li><strong>Review:</strong> Check the request details above</li>
                <li><strong>Prepare:</strong> Gather any necessary information for the call</li>
                <li><strong>Call:</strong> Contact the client at their preferred time</li>
                <li><strong>Update:</strong> Mark as 'replied' in your admin panel</li>
              </ol>
              
              <p><strong>Client Contact:</strong> ${contactData.email}</p>
              
              <p>Best regards,<br>
              <strong>EpicEdge Creative System</strong></p>
            </div>
            <div class="footer">
              <p style="margin-top: 20px; font-size: 12px;">
                This is an automated notification from your website contact form.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully to:', adminEmail);
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
};

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, company, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Create new contact message
    const contact = new Contact({
      firstName,
      lastName,
      email,
      company: company || '',
      subject,
      message,
      status: 'unread'
    });

    await contact.save();

    // Send automatic confirmation email for callback requests
    let emailSent = false;
    let adminNotified = false;
    
    if (subject === 'callback-request') {
      try {
        // Send confirmation to customer
        emailSent = await sendCallbackConfirmation(contact);
        
        // Send notification to admin
        adminNotified = await sendAdminNotification(contact);
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: subject === 'callback-request' 
        ? (emailSent 
          ? 'Your callback request has been submitted! A confirmation email has been sent to you with details.'
          : 'Your callback request has been submitted! We\'ll get back to you within 24 hours.')
        : 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
      data: {
        id: contact._id,
        submittedAt: contact.createdAt,
        emailSent: emailSent
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build filter
    const filter = {};
    if (status && ['unread', 'read', 'replied'].includes(status)) {
      filter.status = status;
    }

    // Get total count
    const total = await Contact.countDocuments(filter);

    // Get messages with pagination
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      success: true,
      data: {
        contacts,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact message status
// @access  Private (Admin)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
});

module.exports = router;
