import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MessageSquare,
  Eye,
  Trash2,
  Settings,
  Filter,
  ExternalLink,
  CheckCheck,
  Zap,
  DollarSign,
  FolderOpen,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Notifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Fetch notifications from API
  const { data: notificationsData, isLoading } = useQuery(
    ['notifications', filter],
    () => axios.get('/api/notifications', {
      params: {
        type: filter !== 'all' && filter !== 'unread' && filter !== 'high' ? filter : undefined,
        unreadOnly: filter === 'unread' ? 'true' : undefined
      }
    }).then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'high') return notification.priority === 'high' || notification.priority === 'urgent';
    return notification.type === filter;
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation(
    (notificationId) => axios.put(`/api/notifications/${notificationId}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        toast.success('Notification marked as read');
      },
      onError: () => {
        toast.error('Failed to mark notification as read');
      }
    }
  );

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation(
    () => axios.put('/api/notifications/read-all'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        toast.success('All notifications marked as read');
        setSelectedNotifications([]);
      },
      onError: () => {
        toast.error('Failed to mark all notifications as read');
      }
    }
  );

  // Delete notification mutation
  const deleteNotificationMutation = useMutation(
    (notificationId) => axios.delete(`/api/notifications/${notificationId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        toast.success('Notification deleted');
      },
      onError: () => {
        toast.error('Failed to delete notification');
      }
    }
  );

  const getNotificationIcon = (type, priority) => {
    const isUrgent = priority === 'urgent' || priority === 'high';
    
    switch (type) {
      case 'project_update':
        return <FolderOpen className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`} />;
      case 'payment':
        return <DollarSign className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-green-600'}`} />;
      case 'message':
        return <MessageSquare className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-indigo-600'}`} />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-amber-600'}`} />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'system':
        return <Settings className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-gray-600'}`} />;
      case 'info':
      default:
        return <Info className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-600 bg-red-50';
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    const config = {
      urgent: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚨', label: 'URGENT' },
      high: { bg: 'bg-red-100', text: 'text-red-700', icon: '⚠️', label: 'High' },
      medium: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '📌', label: 'Medium' },
      low: { bg: 'bg-green-100', text: 'text-green-700', icon: '💬', label: 'Low' }
    };
    
    const style = config[priority] || config.medium;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <span className="mr-1">{style.icon}</span>
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleMarkAsRead = (notificationIds) => {
    if (Array.isArray(notificationIds)) {
      // Mark multiple as read
      notificationIds.forEach(id => markAsReadMutation.mutate(id));
    } else {
      // Mark single as read
      markAsReadMutation.mutate(notificationIds);
    }
    setSelectedNotifications([]);
  };

  const handleDeleteNotifications = (notificationIds) => {
    if (Array.isArray(notificationIds)) {
      notificationIds.forEach(id => deleteNotificationMutation.mutate(id));
    } else {
      deleteNotificationMutation.mutate(notificationIds);
    }
    setSelectedNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
    
    // Navigate to action URL if available
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Notifications - EpicEdge Creative"
        description="Stay updated with project notifications, deadlines, and important updates."
        url="/notifications"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-7 h-7 mr-3 text-amber-600" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {unreadCount} unread
                </span>
              )}
            </h1>
            <p className="text-gray-600">Stay updated with your project activities and important updates</p>
          </div>
          <div className="flex items-center space-x-3">
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={() => handleMarkAsRead(selectedNotifications)}
                  disabled={markAsReadMutation.isLoading}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  Mark Read ({selectedNotifications.length})
                </button>
                <button
                  onClick={() => handleDeleteNotifications(selectedNotifications)}
                  disabled={deleteNotificationMutation.isLoading}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-amber-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'high', label: 'High Priority', count: notifications.filter(n => ['high', 'urgent'].includes(n.priority)).length },
                { key: 'project_update', label: 'Projects', count: notifications.filter(n => n.type === 'project_update').length },
                { key: 'payment', label: 'Billing', count: notifications.filter(n => n.type === 'payment').length },
                { key: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 border-l-4 ${getPriorityColor(notification.priority)} ${
                    notification.isRead ? 'opacity-75' : ''
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectNotification(notification._id);
                      }}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <p className="text-lg font-semibold text-gray-900">
                              {notification.title}
                            </p>
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{notification.message}</p>
                          
                          <div className="mt-4 flex items-center space-x-4">
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDate(notification.createdAt)}
                            </span>
                            
                            {notification.sender && (
                              <span className="text-sm text-gray-500">
                                From: {notification.sender.name}
                              </span>
                            )}
                            
                            {notification.relatedProject && (
                              <span className="text-sm text-amber-600 font-medium flex items-center">
                                <FolderOpen className="w-4 h-4 mr-1" />
                                {notification.relatedProject.title}
                              </span>
                            )}
                          </div>
                          
                          {notification.actionUrl && notification.actionText && (
                            <div className="mt-3">
                              <button className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                {notification.actionText}
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotifications(notification._id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Bell className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-700">No notifications</h3>
                <p className="mt-2 text-gray-500">
                  {filter === 'all' 
                    ? "You're all caught up! New notifications will appear here."
                    : `No ${filter} notifications found.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Priority</dt>
                  <dd className="text-xl font-bold text-gray-900">
                    {notifications.filter(n => ['high', 'urgent'].includes(n.priority)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Project Updates</dt>
                  <dd className="text-xl font-bold text-gray-900">
                    {notifications.filter(n => n.type === 'project_update').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Messages</dt>
                  <dd className="text-xl font-bold text-gray-900">
                    {notifications.filter(n => n.type === 'message').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Billing</dt>
                  <dd className="text-xl font-bold text-gray-900">
                    {notifications.filter(n => n.type === 'payment').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;