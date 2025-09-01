import React from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Bell, BellOff, CheckCircle, XCircle } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

const TestNotifications = () => {
  const { 
    isSupported, 
    isSubscribed, 
    loading, 
    subscribeToNotifications, 
    unsubscribeFromNotifications 
  } = usePushNotifications();

  return (
    <>
      <SEOHead
        title="Test Push Notifications - EpicEdge Creative"
        description="Test and manage your push notification settings."
        url="/test-notifications"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Push Notifications Test
            </h1>
            <p className="text-lg text-gray-600">
              Test and manage your push notification settings
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Browser Support */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Browser Support</h3>
                {isSupported ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isSupported 
                  ? 'Your browser supports push notifications' 
                  : 'Your browser does not support push notifications'
                }
              </p>
            </div>

            {/* Subscription Status */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
                {isSubscribed ? (
                  <Bell className="w-6 h-6 text-blue-500" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isSubscribed 
                  ? 'You are subscribed to notifications' 
                  : 'You are not subscribed to notifications'
                }
              </p>
            </div>
          </div>

          {/* Action Section */}
          {isSupported && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Manage Notifications
              </h3>
              
              <div className="max-w-md mx-auto">
                <button
                  onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
                  disabled={loading}
                  className={`w-full px-6 py-4 rounded-lg text-lg font-medium transition-all duration-200 flex items-center justify-center space-x-3 ${
                    isSubscribed
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      {isSubscribed ? <BellOff className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                      <span>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  {isSubscribed 
                    ? 'You will receive notifications about your projects and updates'
                    : 'Click subscribe to enable push notifications'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!isSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                Browser Not Supported
              </h3>
              <p className="text-yellow-700">
                Your current browser does not support push notifications. 
                Please use a modern browser like Chrome, Firefox, or Safari.
              </p>
            </div>
          )}

          {/* How It Works */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              How Push Notifications Work
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Subscribe</h4>
                <p className="text-sm text-gray-600">
                  Click subscribe to enable push notifications in your browser
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Receive</h4>
                <p className="text-sm text-gray-600">
                  Get real-time notifications about your projects and updates
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Stay Updated</h4>
                <p className="text-sm text-gray-600">
                  Never miss important updates even when the app is closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestNotifications;
