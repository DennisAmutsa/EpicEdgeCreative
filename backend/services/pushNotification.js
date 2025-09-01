const webpush = require('web-push');

// Configure VAPID keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:epicedgecreative@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Function to send push notification to a specific user
const sendPushNotification = async (subscription, payload) => {
  try {
    const result = await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log('Push notification sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
};

// Function to send notification to multiple users
const sendPushNotificationToMultiple = async (subscriptions, payload) => {
  const results = [];
  
  for (const subscription of subscriptions) {
    try {
      const result = await sendPushNotification(subscription, payload);
      results.push(result);
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
};

// Function to create notification payload
const createNotificationPayload = (title, body, data = {}) => {
  return {
    title,
    body,
    icon: '/logo.png', // Your app icon
    badge: '/logo.png',
    data,
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
};

module.exports = {
  sendPushNotification,
  sendPushNotificationToMultiple,
  createNotificationPayload,
  vapidKeys
};
