const express = require('express');
const { body, validationResult } = require('express-validator');
const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/invoices
// @desc    Get invoices for authenticated user (client sees their invoices, admin sees all)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'client') {
      query.client = req.user._id;
    }
    // Admin can see all invoices (no filter)

    const { status, search } = req.query;

    if (status && status !== 'all') {
      query.status = status;
    }

    const invoices = await Invoice.find(query)
      .populate('client', 'name email')
      .populate('project', 'title category')
      .sort({ issueDate: -1 });

    // Filter by search term if provided
    let filteredInvoices = invoices;
    if (search) {
      filteredInvoices = invoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        invoice.project?.title?.toLowerCase().includes(search.toLowerCase()) ||
        invoice.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: {
        invoices: filteredInvoices,
        total: filteredInvoices.length
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/invoices/summary
// @desc    Get billing summary for authenticated user
// @access  Private
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'client') {
      query.client = req.user._id;
    }

    const invoices = await Invoice.find(query);

    const summary = {
      totalValue: invoices.reduce((sum, inv) => sum + inv.total, 0),
      paidValue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
      pendingValue: invoices.filter(inv => ['sent', 'draft'].includes(inv.status)).reduce((sum, inv) => sum + inv.total, 0),
      overdueValue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
      pendingInvoices: invoices.filter(inv => ['sent', 'draft'].includes(inv.status)).length,
      overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length
    };

    res.json({ success: true, data: { summary } });
  } catch (error) {
    console.error('Get invoice summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get single invoice
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role === 'client') {
      query.client = req.user._id;
    }

    const invoice = await Invoice.findOne(query)
      .populate('client', 'name email')
      .populate('project', 'title category description');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: { invoice } });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/invoices/summary
// @desc    Get invoices summary (Admin only)
// @access  Private (Admin)
router.get('/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const summary = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$total' },
          paidValue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$total', 0]
            }
          },
          pendingValue: {
            $sum: {
              $cond: [{ $in: ['$status', ['sent', 'draft']] }, '$total', 0]
            }
          },
          overdueValue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'overdue'] }, '$total', 0]
            }
          }
        }
      }
    ]);

    const summaryData = summary[0] || {
      totalValue: 0,
      paidValue: 0,
      pendingValue: 0,
      overdueValue: 0
    };

    res.json({
      success: true,
      data: { summary: summaryData }
    });
  } catch (error) {
    console.error('Get invoices summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/invoices
// @desc    Create new invoice (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, [
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
  }

  try {
    const { projectId, amount, dueDate, description, items, taxRate, notes } = req.body;

    const project = await Project.findById(projectId).populate('client');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Generate invoice number
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, '0')}`;

    // Calculate values
    const taxRateValue = taxRate || 0;
    const subtotal = amount;
    const taxAmount = subtotal * (taxRateValue / 100);
    const total = subtotal + taxAmount;

    const invoice = new Invoice({
      invoiceNumber: invoiceNumber,
      client: project.client._id,
      project: projectId,
      amount,
      dueDate,
      description,
      items: items || [{
        description: description,
        quantity: 1,
        rate: amount,
        amount: amount
      }],
      taxRate: taxRateValue,
      taxAmount: taxAmount,
      subtotal: subtotal,
      total: total,
      notes
    });

    await invoice.save();
    await invoice.populate('client', 'name email');
    await invoice.populate('project', 'title category');

    // Send email notification to client
    try {
      const nodemailer = require('nodemailer');

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Email content
      const emailSubject = `New Invoice #${invoice.invoiceNumber} - EpicEdge Creative`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Invoice</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">EpicEdge Creative</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${invoice.client.name}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              We've generated a new invoice for your project. Please review the details below:
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Invoice Details:</h3>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Invoice Number:</strong> #${invoice.invoiceNumber}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Project:</strong> ${invoice.project.title}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Amount:</strong> $${invoice.total.toLocaleString()}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Description:</strong> ${invoice.description}</p>
            </div>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
              <h3 style="color: #047857; margin-top: 0;">Payment Information:</h3>
              <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                <li>Log into your dashboard to view the full invoice</li>
                <li>Download the PDF invoice for your records</li>
                <li>Multiple payment methods available</li>
                <li>Contact us if you have any questions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://epicedgecreative.amutsa.com/billing" style="background: linear-gradient(135deg, #f59e0b, #eab308); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Invoice
              </a>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; margin: 0;">Need help or have questions?</p>
              <p style="color: #6b7280; margin: 5px 0;">Contact us directly:</p>
              <p style="color: #f59e0b; margin: 0;">
                <strong>📧 epicedgecreative@gmail.com</strong><br>
                <strong>📞 +254787205456</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
            <p>This is an automated invoice notification from EpicEdge Creative</p>
            <p>Nairobi, Kenya | Software Engineering Excellence</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"EpicEdge Creative" <${process.env.EMAIL_USER}>`,
        to: invoice.client.email,
        subject: emailSubject,
        html: emailBody
      };

      await transporter.sendMail(mailOptions);
      console.log(`Invoice notification email sent to: ${invoice.client.email}`);

    } catch (emailError) {
      console.error('Error sending invoice notification email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    // Send admin notification email
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

      const adminEmailSubject = `New Invoice Created - #${invoice.invoiceNumber}`;
      const adminEmailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #f59e0b, #eab308); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💰 New Invoice Created</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Admin Notification</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Invoice Details:</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #6b7280; margin: 5px 0;"><strong>Invoice Number:</strong> #${invoice.invoiceNumber}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Client:</strong> ${invoice.client.name} (${invoice.client.email})</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Project:</strong> ${invoice.project?.title || 'N/A'}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Amount:</strong> $${invoice.total.toLocaleString()}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Status:</strong> Draft</p>
            </div>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
              <h3 style="color: #047857; margin-top: 0;">Next Steps:</h3>
              <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                <li>Review the invoice in the admin dashboard</li>
                <li>Send the invoice to the client when ready</li>
                <li>Client notification email has been sent automatically</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://epicedgecreative.amutsa.com/admin/billing" style="background: linear-gradient(135deg, #f59e0b, #eab308); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Manage Invoice
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
            <p>This is an admin notification from EpicEdge Creative</p>
          </div>
        </div>
      `;

      const adminMailOptions = {
        from: `"EpicEdge Creative System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to admin email
        subject: adminEmailSubject,
        html: adminEmailBody
      };

      await transporter.sendMail(adminMailOptions);
      console.log(`Admin notification sent for invoice creation: ${invoice.invoiceNumber}`);
    } catch (adminEmailError) {
      console.error('Error sending admin notification email:', adminEmailError);
    }

    // Create in-system notification for client
    try {
      const Notification = require('../models/Notification');

      await Notification.createNotification({
        recipient: invoice.client._id,
        sender: req.user._id, // Admin who created the invoice
        title: 'New Invoice Created',
        message: `New invoice #${invoice.invoiceNumber} has been created for your project "${invoice.project.title}" - Amount: $${invoice.total.toLocaleString()}`,
        type: 'payment',
        priority: 'medium',
        relatedInvoice: invoice._id,
        relatedProject: invoice.project._id,
        actionUrl: '/billing',
        actionText: 'View Invoice',
        metadata: {
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.total,
          dueDate: invoice.dueDate,
          projectTitle: invoice.project.title
        }
      });

      console.log(`In-system notification created for client: ${invoice.client.name} (Invoice: ${invoice.invoiceNumber})`);
    } catch (notificationError) {
      console.error('Error creating invoice notification for client:', notificationError);
      // Don't fail the request if notification creation fails
    }

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully and notification sent!',
      data: { invoice }
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/invoices/:id/status
// @desc    Update invoice status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
  }

  try {
    const { status, paymentMethod } = req.body;

    const updateData = { status };
    if (status === 'paid') {
      updateData.paymentDate = new Date();
      if (paymentMethod) {
        updateData.paymentMethod = paymentMethod;
      }
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('client', 'name email').populate('project', 'title category');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Send email notification when invoice is sent
    if (status === 'sent') {
      try {
        const nodemailer = require('nodemailer');

        // Create transporter
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Email content
        const emailSubject = `Invoice #${invoice.invoiceNumber} Sent - Payment Required`;
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Payment Required</h1>
              <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 16px;">EpicEdge Creative</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${invoice.client.name}!</h2>
              
              <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                Your invoice has been finalized and sent. Please review the payment details below:
              </p>
              
              <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">⚡ Payment Due:</h3>
                <p style="color: #92400e; margin: 5px 0; font-size: 18px;"><strong>Amount: $${invoice.total.toLocaleString()}</strong></p>
                <p style="color: #92400e; margin: 5px 0;"><strong>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</strong></p>
                <p style="color: #92400e; margin: 5px 0;"><strong>Invoice: #${invoice.invoiceNumber}</strong></p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Project Details:</h3>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Project:</strong> ${invoice.project.title}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Category:</strong> ${invoice.project.category}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Description:</strong> ${invoice.description}</p>
              </div>
              
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                <h3 style="color: #047857; margin-top: 0;">How to Pay:</h3>
                <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                  <li>Log into your dashboard and visit the Billing section</li>
                  <li>Click "View" on invoice #${invoice.invoiceNumber}</li>
                  <li>Choose your preferred payment method</li>
                  <li>Download your receipt after payment</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://epicedgecreative.amutsa.com/billing" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 0 10px;">
                  💳 Pay Now
                </a>
                <a href="https://epicedgecreative.amutsa.com/billing" style="background: linear-gradient(135deg, #f59e0b, #eab308); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 0 10px;">
                  📄 View Invoice
                </a>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0;">Questions about this invoice?</p>
                <p style="color: #6b7280; margin: 5px 0;">Contact us directly:</p>
                <p style="color: #f59e0b; margin: 0;">
                  <strong>📧 epicedgecreative@gmail.com</strong><br>
                  <strong>📞 +254787205456</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
              <p>This is an automated invoice notification from EpicEdge Creative</p>
              <p>Nairobi, Kenya | Software Engineering Excellence</p>
            </div>
          </div>
        `;

        const mailOptions = {
          from: `"EpicEdge Creative" <${process.env.EMAIL_USER}>`,
          to: invoice.client.email,
          subject: emailSubject,
          html: emailBody
        };

        await transporter.sendMail(mailOptions);
        console.log(`Invoice sent notification email sent to: ${invoice.client.email}`);

      } catch (emailError) {
        console.error('Error sending invoice sent notification email:', emailError);
        // Don't fail the request if email fails, just log it
      }

      // Send admin notification for invoice sent
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

        const adminEmailSubject = `Invoice Sent - #${invoice.invoiceNumber}`;
        const adminEmailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">📧 Invoice Sent</h1>
              <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 16px;">Admin Notification</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Invoice Sent to Client:</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #6b7280; margin: 5px 0;"><strong>Invoice Number:</strong> #${invoice.invoiceNumber}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Client:</strong> ${invoice.client.name} (${invoice.client.email})</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Project:</strong> ${invoice.project?.title || 'N/A'}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Amount:</strong> $${invoice.total.toLocaleString()}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Status:</strong> Sent (Payment Required)</p>
              </div>
              
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1e3a8a; margin-top: 0;">Status Update:</h3>
                <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                  <li>Invoice status changed from Draft to Sent</li>
                  <li>Payment required email sent to client</li>
                  <li>Client can now view and pay the invoice</li>
                  <li>Monitor for payment confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        `;

        const adminMailOptions = {
          from: `"EpicEdge Creative System" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: adminEmailSubject,
          html: adminEmailBody
        };

        await transporter.sendMail(adminMailOptions);
        console.log(`Admin notification sent for invoice sent: ${invoice.invoiceNumber}`);
      } catch (adminEmailError) {
        console.error('Error sending admin invoice sent notification:', adminEmailError);
      }
    }

    // Send payment confirmation email when invoice is marked as paid
    if (status === 'paid') {
      try {
        const nodemailer = require('nodemailer');

        // Create transporter
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Email content
        const emailSubject = `Payment Confirmed - Invoice #${invoice.invoiceNumber}`;
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✅ Payment Received!</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">EpicEdge Creative</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${invoice.client.name}!</h2>
              
              <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                Thank you! We've successfully received your payment for invoice #${invoice.invoiceNumber}.
              </p>
              
              <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #047857; margin-top: 0;">💚 Payment Details:</h3>
                <p style="color: #047857; margin: 5px 0;"><strong>Amount Paid: $${invoice.total.toLocaleString()}</strong></p>
                <p style="color: #047857; margin: 5px 0;"><strong>Payment Date: ${new Date(invoice.paymentDate || new Date()).toLocaleDateString()}</strong></p>
                <p style="color: #047857; margin: 5px 0;"><strong>Invoice: #${invoice.invoiceNumber}</strong></p>
                ${paymentMethod ? `<p style="color: #047857; margin: 5px 0;"><strong>Payment Method: ${paymentMethod}</strong></p>` : ''}
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Project Details:</h3>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Project:</strong> ${invoice.project.title}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Description:</strong> ${invoice.description}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://epicedgecreative.amutsa.com/billing" style="background: linear-gradient(135deg, #f59e0b, #eab308); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  📄 View Receipt
                </a>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0;">Thank you for your business!</p>
                <p style="color: #6b7280; margin: 5px 0;">Questions? Contact us:</p>
                <p style="color: #f59e0b; margin: 0;">
                  <strong>📧 epicedgecreative@gmail.com</strong><br>
                  <strong>📞 +254787205456</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
              <p>This is an automated payment confirmation from EpicEdge Creative</p>
              <p>Nairobi, Kenya | Software Engineering Excellence</p>
            </div>
          </div>
        `;

        const mailOptions = {
          from: `"EpicEdge Creative" <${process.env.EMAIL_USER}>`,
          to: invoice.client.email,
          subject: emailSubject,
          html: emailBody
        };

        await transporter.sendMail(mailOptions);
        console.log(`Payment confirmation email sent to: ${invoice.client.email}`);

      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
        // Don't fail the request if email fails, just log it
      }

      // Send admin notification for payment received
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

        const adminEmailSubject = `Payment Received - Invoice #${invoice.invoiceNumber}`;
        const adminEmailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">💰 Payment Received!</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Admin Notification</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Payment Confirmed:</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #6b7280; margin: 5px 0;"><strong>Invoice Number:</strong> #${invoice.invoiceNumber}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Client:</strong> ${invoice.client.name} (${invoice.client.email})</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Project:</strong> ${invoice.project?.title || 'N/A'}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Amount Received:</strong> $${invoice.total.toLocaleString()}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Payment Date:</strong> ${new Date(invoice.paymentDate).toLocaleDateString()}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Payment Method:</strong> ${invoice.paymentMethod ? invoice.paymentMethod.replace('_', ' ').toUpperCase() : 'Not specified'}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Status:</strong> Paid ✅</p>
              </div>
              
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                <h3 style="color: #047857; margin-top: 0;">Payment Summary:</h3>
                <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                  <li>Payment successfully recorded in the system</li>
                  <li>Payment confirmation email sent to client</li>
                  <li>Invoice status updated to "Paid"</li>
                  <li>Project revenue has been updated</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://epicedgecreative.amutsa.com/admin/billing" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  View Billing Dashboard
                </a>
              </div>
            </div>
          </div>
        `;

        const adminMailOptions = {
          from: `"EpicEdge Creative System" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: adminEmailSubject,
          html: adminEmailBody
        };

        await transporter.sendMail(adminMailOptions);
        console.log(`Admin payment notification sent for invoice: ${invoice.invoiceNumber}`);
      } catch (adminEmailError) {
        console.error('Error sending admin payment notification:', adminEmailError);
      }
    }

    const statusMessage = status === 'sent' ? 'Invoice status updated and notification sent!' :
      status === 'paid' ? 'Invoice marked as paid and confirmation sent!' :
        'Invoice status updated successfully';

    res.json({
      success: true,
      message: statusMessage,
      data: { invoice }
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/invoices/:id/report-payment
// @desc    Client reports payment made (Client only)
// @access  Private (Client)
router.post('/:id/report-payment', authenticateToken, [
  body('paymentMethod').optional({ checkFalsy: true }).isIn(['bank_transfer', 'credit_card', 'paypal', 'mobile_money', 'cash', 'check', 'other']).withMessage('Invalid payment method'),
  body('transactionId').optional({ checkFalsy: true }).trim(),
  body('paymentDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid payment date is required'),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Notes must be 500 characters or less')
], async (req, res) => {
  console.log('Payment report request received:', {
    invoiceId: req.params.id,
    body: req.body,
    userId: req.user._id,
    userRole: req.user.role
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
  }

  try {
    const { paymentMethod, transactionId, paymentDate, notes } = req.body;

    const invoice = await Invoice.findById(req.params.id).populate('client', 'name email').populate('project', 'title category');

    console.log('Invoice found:', {
      invoiceId: invoice?._id,
      status: invoice?.status,
      clientId: invoice?.client?._id,
      requestingUserId: req.user._id
    });

    if (!invoice) {
      console.log('Invoice not found for ID:', req.params.id);
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Check if client owns this invoice
    if (invoice.client._id.toString() !== req.user._id.toString()) {
      console.log('Access denied - client mismatch:', {
        invoiceClientId: invoice.client._id.toString(),
        requestingUserId: req.user._id.toString()
      });
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if invoice can receive payment reports
    if (!['sent', 'overdue'].includes(invoice.status)) {
      console.log('Invalid invoice status for payment report:', {
        currentStatus: invoice.status,
        allowedStatuses: ['sent', 'overdue']
      });
      return res.status(400).json({ success: false, message: 'Payment can only be reported for sent or overdue invoices' });
    }

    // Send admin notification email about payment report
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

      const adminEmailSubject = `Payment Reported by Client - Invoice #${invoice.invoiceNumber}`;
      const adminEmailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💳 Payment Reported</h1>
            <p style="color: #e9d5ff; margin: 10px 0 0 0; font-size: 16px;">Client Payment Report</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Client Has Reported Payment:</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #6b7280; margin: 5px 0;"><strong>Invoice Number:</strong> #${invoice.invoiceNumber}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Client:</strong> ${invoice.client.name} (${invoice.client.email})</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Project:</strong> ${invoice.project?.title || 'N/A'}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Invoice Amount:</strong> $${invoice.total.toLocaleString()}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">Payment Details Reported:</h3>
              <ul style="color: #78350f; margin: 0; padding-left: 20px;">
                ${paymentMethod ? `<li><strong>Payment Method:</strong> ${paymentMethod.replace('_', ' ').toUpperCase()}</li>` : ''}
                ${transactionId ? `<li><strong>Transaction ID:</strong> ${transactionId}</li>` : ''}
                ${paymentDate ? `<li><strong>Payment Date:</strong> ${new Date(paymentDate).toLocaleDateString()}</li>` : `<li><strong>Payment Date:</strong> ${new Date().toLocaleDateString()} (Today)</li>`}
                ${notes ? `<li><strong>Client Notes:</strong> ${notes}</li>` : ''}
              </ul>
            </div>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
              <h3 style="color: #047857; margin-top: 0;">Action Required:</h3>
              <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                <li>Verify payment in your bank account or payment system</li>
                <li>If payment is confirmed, mark invoice as "Paid" in admin dashboard</li>
                <li>Client will receive automatic payment confirmation email</li>
                <li>If payment not found, contact client for clarification</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://epicedgecreative.amutsa.com/admin/billing" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Verify & Update Invoice
              </a>
            </div>
            
            <div style="text-align: center; margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                <strong>Quick Actions:</strong><br>
                📧 <strong>epicedgecreative@gmail.com</strong> | 📞 <strong>+254787205456</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
            <p>This is an automated payment report from EpicEdge Creative</p>
          </div>
        </div>
      `;

      const adminMailOptions = {
        from: `"EpicEdge Creative Client System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: adminEmailSubject,
        html: adminEmailBody
      };

      await transporter.sendMail(adminMailOptions);
      console.log(`Payment report notification sent to admin for invoice: ${invoice.invoiceNumber}`);

    } catch (emailError) {
      console.error('Error sending payment report email to admin:', emailError);
      // Don't fail the request if email fails
    }

    // Create in-system notification for admin
    try {
      const Notification = require('../models/Notification');
      const User = require('../models/User');

      // Find admin user (assuming there's only one admin or we want to notify all admins)
      const adminUsers = await User.find({ isAdmin: true });

      for (const admin of adminUsers) {
        await Notification.createNotification({
          recipient: admin._id,
          sender: req.user._id,
          title: 'Payment Reported',
          message: `${req.user.name} has reported payment for invoice #${invoice.invoiceNumber} (${paymentMethod ? paymentMethod.replace('_', ' ').toUpperCase() : 'Payment method not specified'} - $${invoice.total.toLocaleString()})`,
          type: 'payment',
          priority: 'high',
          relatedInvoice: invoice._id,
          relatedProject: invoice.project._id,
          actionUrl: '/admin-billing',
          actionText: 'Verify Payment',
          metadata: {
            paymentMethod: paymentMethod,
            transactionId: transactionId,
            paymentDate: paymentDate || new Date(),
            reportedAmount: invoice.total,
            notes: notes
          }
        });
      }

      console.log(`In-system notification created for payment report: ${invoice.invoiceNumber}`);
    } catch (notificationError) {
      console.error('Error creating payment report notification:', notificationError);
      // Don't fail the request if notification creation fails
    }

    res.json({
      success: true,
      message: 'Payment report submitted successfully! Admin has been notified and will verify the payment.',
      data: {
        invoice: {
          invoiceNumber: invoice.invoiceNumber,
          status: invoice.status,
          total: invoice.total
        }
      }
    });
  } catch (error) {
    console.error('Report payment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

