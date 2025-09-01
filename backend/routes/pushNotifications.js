const express = require('express');
const router = express.Router();
const PushSubscription = require('../models/PushSubscription');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendPushNotification, createNotificationPayload } = require('../services/pushNotification');

// @route   POST /api/push/subscribe
// @desc    Subscribe user to push notifications
// @access  Private
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    const userId = req.user.id;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription data'
      });
    }

    // Check if subscription already exists
    let subscription = await PushSubscription.findOne({ endpoint });

    if (subscription) {
      // Update existing subscription
      subscription.userId = userId;
      subscription.keys = keys;
      subscription.isActive = true;
      subscription.lastUsed = Date.now();
      await subscription.save();
    } else {
      // Create new subscription
      subscription = new PushSubscription({
        userId,
        endpoint,
        keys,
        isActive: true
      });
      await subscription.save();
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to push notifications',
      data: { subscriptionId: subscription._id }
    });

  } catch (error) {
    console.error('Push subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to push notifications'
    });
  }
});

// @route   DELETE /api/push/unsubscribe
// @desc    Unsubscribe user from push notifications
// @access  Private
router.delete('/unsubscribe', authenticateToken, async (req, res) => {
  try {
    const { endpoint } = req.body;
    const userId = req.user.id;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint is required'
      });
    }

    const subscription = await PushSubscription.findOneAndDelete({
      endpoint,
      userId
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from push notifications'
    });

  } catch (error) {
    console.error('Push unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from push notifications'
    });
  }
});

// @route   POST /api/push/send
// @desc    Send push notification to specific user (Admin only)
// @access  Private (Admin)
router.post('/send', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,
        message: 'User ID, title, and body are required'
      });
    }

    // Get user's push subscriptions
    const subscriptions = await PushSubscription.find({
      userId,
      isActive: true
    });

    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User has no active push subscriptions'
      });
    }

    // Create notification payload
    const payload = createNotificationPayload(title, body, data);

    // Send notifications to all user's devices
    const results = [];
    for (const subscription of subscriptions) {
      const result = await sendPushNotification(subscription, payload);
      results.push(result);
    }

    res.json({
      success: true,
      message: 'Push notifications sent',
      data: { results }
    });

  } catch (error) {
    console.error('Send push notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send push notification'
    });
  }
});

// @route   GET /api/push/vapid-public-key
// @desc    Get VAPID public key for frontend
// @access  Public
router.get('/vapid-public-key', (req, res) => {
  const { vapidKeys } = require('../services/pushNotification');
  res.json({
    success: true,
    data: { publicKey: vapidKeys.publicKey }
  });
});

module.exports = router;
