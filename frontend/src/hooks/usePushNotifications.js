import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    
    // Check if already subscribed
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!isSupported) return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const subscribeToNotifications = async () => {
    if (!isSupported) {
      alert('Push notifications are not supported in this browser');
      return;
    }

    setLoading(true);
    
    try {
      // Get VAPID public key from backend
      const { data } = await axios.get('/api/push/vapid-public-key');
      const vapidPublicKey = data.data.publicKey;

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      // Send subscription to backend
      await axios.post('/api/push/subscribe', {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('auth'))))
        }
      });

      setSubscription(pushSubscription);
      setIsSubscribed(true);
      
      alert('Successfully subscribed to push notifications!');
      
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      alert('Failed to subscribe to notifications');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (!subscription) return;
    
    setLoading(true);
    
    try {
      // Unsubscribe from push manager
      await subscription.unsubscribe();
      
      // Remove from backend
      await axios.delete('/api/push/unsubscribe', {
        data: { endpoint: subscription.endpoint }
      });

      setSubscription(null);
      setIsSubscribed(false);
      
      alert('Successfully unsubscribed from notifications');
      
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Failed to unsubscribe');
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    loading,
    subscribeToNotifications,
    unsubscribeFromNotifications
  };
};
