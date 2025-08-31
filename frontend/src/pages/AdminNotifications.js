import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Bell, 
  Send, 
  Users,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  DollarSign,
  FolderOpen,
  Settings,
  Radio,
  Target,
  Clock,
  Eye,
  Trash2,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendType, setSendType] = useState('specific'); // 'specific' or 'broadcast'
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notificationFilter, setNotificationFilter] = useState('all'); // 'all', 'unread', 'read'
  const settingsRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch clients for sending notifications
  const { data: clientsData } = useQuery(
    'clients-for-notifications',
    () => axios.get('/api/users?role=client').then(res => res.data.data.users),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch projects for linking notifications
  const { data: projectsData } = useQuery(
    'projects-for-notifications',
    () => axios.get('/api/projects').then(res => res.data.data.projects),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch notification stats
  const { data: statsData } = useQuery(
    'notification-stats',
    () => axios.get('/api/notifications/stats').then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 60000, // Refresh every minute
    }
  );

  // Fetch incoming client requests/notifications
  const { data: incomingNotifications, isLoading: loadingIncoming } = useQuery(
    'incoming-notifications',
    () => axios.get('/api/notifications').then(res => res.data.data.notifications),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Fetch sent notifications history
  const { data: sentNotifications, isLoading: loadingSent } = useQuery(
    'sent-notifications',
    () => axios.get('/api/notifications/sent').then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  const clients = clientsData || [];
  const projects = projectsData || [];
  const stats = statsData || { total: 0, unread: 0, byType: [], byPriority: [] };
  const allIncoming = incomingNotifications || [];
  
  // Filter notifications based on settings
  const incoming = allIncoming.filter(notification => {
    if (notificationFilter === 'unread') return !notification.isRead;
    if (notificationFilter === 'read') return notification.isRead;
    return true; // 'all'
  });

  // Mark notification as read
  const markAsReadMutation = useMutation(
    (notificationId) => axios.put(`/api/notifications/${notificationId}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('incoming-notifications');
        toast.success('Marked as read');
      },
      onError: (error) => {
        console.error('Mark as read error:', error);
        toast.error('Failed to mark as read');
      }
    }
  );

  // Delete notification
  const deleteNotificationMutation = useMutation(
    (notificationId) => axios.delete(`/api/notifications/${notificationId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('incoming-notifications');
        toast.success('Request deleted');
      },
      onError: () => {
        toast.error('Failed to delete request');
      }
    }
  );

  // Send notification mutation
  const sendNotificationMutation = useMutation(
    (data) => {
      if (sendType === 'broadcast') {
        return axios.post('/api/notifications/broadcast', data);
      } else {
        return axios.post('/api/notifications', data);
      }
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('notification-stats');
        toast.success(response.data.message);
        setShowSendModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send notification');
      }
    }
  );

  const handleSendNotification = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const notificationData = {
      title: formData.get('title'),
      message: formData.get('message'),
      type: formData.get('type'),
      priority: formData.get('priority'),
      actionUrl: formData.get('actionUrl') || undefined,
      actionText: formData.get('actionText') || undefined,
      expiresAt: formData.get('expiresAt') || undefined,
      relatedProject: formData.get('relatedProject') || undefined,
    };

    if (sendType === 'specific') {
      const selectedRecipients = Array.from(formData.getAll('recipients'));
      if (selectedRecipients.length === 0) {
        toast.error('Please select at least one recipient');
        return;
      }
      notificationData.recipients = selectedRecipients;
    }

    sendNotificationMutation.mutate(notificationData);
  };

  const typeOptions = [
    { value: 'info', label: '📋 Information', icon: Info },
    { value: 'success', label: '✅ Success', icon: CheckCircle },
    { value: 'warning', label: '⚠️ Warning', icon: AlertCircle },
    { value: 'error', label: '❌ Error', icon: AlertCircle },
    { value: 'project_update', label: '📁 Project Update', icon: FolderOpen },
    { value: 'payment', label: '💰 Payment/Billing', icon: DollarSign },
    { value: 'message', label: '💬 Message', icon: MessageSquare },
    { value: 'system', label: '⚙️ System', icon: Settings }
  ];

  const priorityOptions = [
    { value: 'low', label: '🟢 Low', color: 'text-green-600' },
    { value: 'medium', label: '🟡 Medium', color: 'text-amber-600' },
    { value: 'high', label: '🟠 High', color: 'text-orange-600' },
    { value: 'urgent', label: '🔴 Urgent', color: 'text-red-600' }
  ];

  return (
    <>
      <SEOHead
        title="Admin Notifications - EpicEdge Creative"
        description="Send and manage notifications to clients."
        url="/admin-notifications"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-amber-600" />
              Notification Center
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Send notifications and updates to your clients</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => {
                setSendType('specific');
                setShowSendModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Send to Specific Clients</span>
              <span className="sm:hidden">Send to Specific</span>
            </button>
            <button
              onClick={() => {
                setSendType('broadcast');
                setShowSendModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors"
            >
              <Radio className="w-4 h-4" />
              <span className="hidden sm:inline">Broadcast to All</span>
              <span className="sm:hidden">Broadcast</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Sent</dt>
                  <dd className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Read</dt>
                  <dd className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total - stats.unread}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Unread</dt>
                  <dd className="text-xl sm:text-2xl font-bold text-gray-900">{stats.unread}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Clients</dt>
                  <dd className="text-xl sm:text-2xl font-bold text-gray-900">{clients.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Types Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Notifications by Type</h3>
            <div className="space-y-3">
              {stats.byType.map((item) => {
                const typeOption = typeOptions.find(t => t.value === item._id);
                return (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      {typeOption?.icon && <typeOption.icon className="w-4 h-4 mr-2" />}
                      {typeOption?.label || item._id}
                    </span>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Notifications by Priority</h3>
            <div className="space-y-3">
              {stats.byPriority.map((item) => {
                const priorityOption = priorityOptions.find(p => p.value === item._id);
                return (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${priorityOption?.color || 'text-gray-600'}`}>
                      {priorityOption?.label || item._id}
                    </span>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Incoming Client Requests */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" />
                  Client Requests & Messages
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Incoming requests from your clients</p>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {allIncoming.filter(n => !n.isRead).length} New
                </span>
                <div className="relative" ref={settingsRef}>
                <button
                    onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                    title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                  
                  {/* Settings Dropdown */}
                  {showSettingsDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Notification Settings</h4>
                        
                        {/* Auto Refresh Toggle */}
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm text-gray-700">Auto Refresh</label>
                          <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                autoRefresh ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        {/* Filter Options */}
                        <div className="mb-3">
                          <label className="text-sm text-gray-700 mb-2 block">Show Notifications</label>
                          <select
                            value={notificationFilter}
                            onChange={(e) => setNotificationFilter(e.target.value)}
                            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="all">All Notifications</option>
                            <option value="unread">Unread Only</option>
                            <option value="read">Read Only</option>
                          </select>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          <button
                            onClick={() => {
                              queryClient.invalidateQueries('incoming-notifications');
                              setShowSettingsDropdown(false);
                            }}
                            className="w-full text-left px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            🔄 Refresh Now
                          </button>
                          
                          <button
                            onClick={() => {
                              // Mark all as read
                              incoming.filter(n => !n.isRead).forEach(notification => {
                                markAsReadMutation.mutate(notification._id);
                              });
                              setShowSettingsDropdown(false);
                            }}
                            className="w-full text-left px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            ✅ Mark All as Read
                          </button>
                          
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete all read notifications?')) {
                                incoming.filter(n => n.isRead).forEach(notification => {
                                  deleteNotificationMutation.mutate(notification._id);
                                });
                              }
                              setShowSettingsDropdown(false);
                            }}
                            className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            🗑️ Delete All Read
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loadingIncoming ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner className="w-6 h-6" />
                <span className="ml-2 text-gray-600">Loading requests...</span>
              </div>
            ) : incoming.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No requests yet</h3>
                <p className="mt-1 text-sm text-gray-500">Client requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incoming.map((notification) => (
                  <div
                    key={notification._id}
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all hover:shadow-md ${
                      notification.isRead 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'project_update' 
                              ? 'bg-blue-100 text-blue-600' 
                              : notification.type === 'meeting'
                              ? 'bg-green-100 text-green-600'
                              : notification.type === 'callback'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            {notification.type === 'project_update' ? (
                              <FolderOpen className="w-4 h-4" />
                            ) : notification.type === 'meeting' ? (
                              <Calendar className="w-4 h-4" />
                            ) : notification.type === 'callback' ? (
                              <Phone className="w-4 h-4" />
                            ) : (
                              <MessageSquare className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{notification.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              From: {notification.sender?.name || 'Client'}
                              <span className="block sm:inline sm:ml-1">
                                <span className="hidden sm:inline"> • </span>
                                {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        
                        {notification.relatedProject && (
                          <div className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full mb-3">
                            <FolderOpen className="w-3 h-3 mr-1" />
                            Project: {notification.relatedProject?.title || 'Related Project'}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            notification.priority === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : notification.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {notification.priority === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {notification.priority} priority
                          </span>
                          
                          {!notification.isRead && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3 mr-1" />
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2 sm:ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsReadMutation.mutate(notification._id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotificationMutation.mutate(notification._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Delete request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sent Notifications History */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-600" />
                  Sent Notifications History
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">All notifications you've sent to clients</p>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {sentNotifications?.length || 0} Total
                </span>
                <button
                  onClick={() => queryClient.invalidateQueries('sent-notifications')}
                  className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                  title="Refresh"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loadingSent ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner className="w-6 h-6" />
                <span className="ml-2 text-gray-600">Loading sent notifications...</span>
              </div>
            ) : !sentNotifications || sentNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Send className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications sent yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start sending notifications to your clients</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-all bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            notification.type === 'project_update' 
                              ? 'bg-blue-100 text-blue-600' 
                              : notification.type === 'payment'
                              ? 'bg-green-100 text-green-600'
                              : notification.type === 'warning'
                              ? 'bg-orange-100 text-orange-600'
                              : notification.type === 'error'
                              ? 'bg-red-100 text-red-600'
                              : notification.type === 'success'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            {notification.type === 'project_update' ? (
                              <FolderOpen className="w-5 h-5" />
                            ) : notification.type === 'payment' ? (
                              <DollarSign className="w-5 h-5" />
                            ) : notification.type === 'warning' ? (
                              <AlertCircle className="w-5 h-5" />
                            ) : notification.type === 'error' ? (
                              <AlertCircle className="w-5 h-5" />
                            ) : notification.type === 'success' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Bell className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{notification.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                Sent: {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </span>
                              <span>•</span>
                              <span>
                                Recipients: {notification.recipients?.length || 'All clients'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{notification.message}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            notification.type === 'success' 
                              ? 'bg-green-100 text-green-800'
                              : notification.type === 'warning'
                              ? 'bg-orange-100 text-orange-800'
                              : notification.type === 'error'
                              ? 'bg-red-100 text-red-800'
                              : notification.type === 'project_update'
                              ? 'bg-blue-100 text-blue-800'
                              : notification.type === 'payment'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.type.replace('_', ' ').toUpperCase()}
                          </span>
                          
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            notification.priority === 'urgent' 
                              ? 'bg-red-100 text-red-800'
                              : notification.priority === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : notification.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {notification.priority?.toUpperCase()} PRIORITY
                          </span>

                          {notification.relatedProject && (
                            <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                              <FolderOpen className="w-3 h-3 mr-1" />
                              Project: {notification.relatedProject?.title || 'Related Project'}
                            </span>
                          )}

                          {notification.expiresAt && (
                            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              <Clock className="w-3 h-3 mr-1" />
                              Expires: {new Date(notification.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Recipient Details */}
                        {notification.recipients && notification.recipients.length > 0 && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                              <Users className="w-4 h-4 mr-2 text-gray-600" />
                              Sent to {notification.recipients.length} client{notification.recipients.length !== 1 ? 's' : ''}:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {notification.recipients.map((recipient) => (
                                <span 
                                  key={recipient._id} 
                                  className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
                                >
                                  {recipient.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {notification.actionUrl && notification.actionText && (
                          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-800">
                              <strong>Action Button:</strong> "{notification.actionText}" → {notification.actionUrl}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-6">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {notification.readBy ? notification.readBy.length : 0} Read
                          </div>
                          <div className="text-xs text-gray-500">
                            {((notification.recipients?.length || 0) - (notification.readBy?.length || 0))} Unread
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Send Notification Modal */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg sm:rounded-2xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                  {sendType === 'broadcast' ? <Radio className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-600" /> : <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-600" />}
                  <span className="hidden sm:inline">{sendType === 'broadcast' ? 'Broadcast Notification' : 'Send Notification'}</span>
                  <span className="sm:hidden">{sendType === 'broadcast' ? 'Broadcast' : 'Send'}</span>
                </h3>
                <button 
                  onClick={() => setShowSendModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-6">
                {sendType === 'specific' && (
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <Users className="w-4 h-4 mr-2 text-amber-600" />
                      Recipients *
                    </label>
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                      {clients.map((client) => (
                        <label key={client._id} className="flex items-center space-x-3 mb-2">
                          <input
                            type="checkbox"
                            name="recipients"
                            value={client._id}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{client.name} ({client.email})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <MessageSquare className="w-4 h-4 mr-2 text-amber-600" />
                      Notification Type *
                    </label>
                    <select
                      name="type"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                      required
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />
                      Priority *
                    </label>
                    <select
                      name="priority"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                      required
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                    <Bell className="w-4 h-4 mr-2 text-amber-600" />
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Notification title"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                    <MessageSquare className="w-4 h-4 mr-2 text-amber-600" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    placeholder="Type your notification message here..."
                    rows={4}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <FolderOpen className="w-4 h-4 mr-2 text-amber-600" />
                      Related Project
                    </label>
                    <select
                      name="relatedProject"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                    >
                      <option value="">No project</option>
                      {projects.map(project => (
                        <option key={project._id} value={project._id}>{project.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                      <Clock className="w-4 h-4 mr-2 text-amber-600" />
                      Expires At
                    </label>
                    <input
                      type="datetime-local"
                      name="expiresAt"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Action URL
                    </label>
                    <input
                      type="url"
                      name="actionUrl"
                      placeholder="https://example.com/action"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Action Button Text
                    </label>
                    <input
                      type="text"
                      name="actionText"
                      placeholder="View Details"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 font-medium bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowSendModal(false)}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendNotificationMutation.isLoading}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-colors font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center space-x-2"
                  >
                    {sendNotificationMutation.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{sendType === 'broadcast' ? 'Broadcast' : 'Send'} Notification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminNotifications;
