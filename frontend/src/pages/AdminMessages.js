import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  MessageSquare, 
  Send, 
  Search,
  Filter,
  User,
  Clock,
  Eye,
  Reply,
  Check,
  AlertCircle,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminMessages = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const queryClient = useQueryClient();

  // Fetch admin messages
  const { data: messagesData, isLoading } = useQuery(
    ['admin-messages', statusFilter],
    () => axios.get(`/api/messages?status=${statusFilter}`).then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Mark as read mutation
  const markAsReadMutation = useMutation(
    ({ messageId, status }) => axios.put(`/api/messages/${messageId}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-messages');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update message status');
      }
    }
  );

  // Reply to message mutation
  const replyMutation = useMutation(
    ({ messageId, content }) => axios.post(`/api/messages/${messageId}/reply`, { content }),
    {
      onSuccess: () => {
        toast.success('Reply sent successfully!');
        setReplyContent('');
        setSelectedMessage(null);
        queryClient.invalidateQueries('admin-messages');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send reply');
      }
    }
  );

  const messages = messagesData?.messages || [];
  const unreadCount = messagesData?.unreadCount || 0;

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsRead = (messageId) => {
    markAsReadMutation.mutate({ messageId, status: 'read' });
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    markAsReadMutation.mutate({ messageId: message._id, status: 'read' });
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedMessage) return;
    
    replyMutation.mutate({
      messageId: selectedMessage._id,
      content: replyContent.trim()
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-700';
      case 'read':
        return 'bg-blue-100 text-blue-700';
      case 'replied':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
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
        title="Client Messages - Admin - EpicEdge Creative"
        description="Manage client messages and communications"
        url="/admin-messages"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Messages</h1>
            <p className="text-gray-600">
              Manage communications from clients
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 bg-white font-medium placeholder-gray-500 shadow-sm hover:shadow-md transition-all w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-900 bg-white focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer min-w-[140px]"
                    style={{ backgroundImage: 'none' }}
                  >
                    <option value="all" className="text-gray-900 bg-white">All Messages</option>
                    <option value="unread" className="text-gray-900 bg-white">Unread</option>
                    <option value="read" className="text-gray-900 bg-white">Read</option>
                    <option value="replied" className="text-gray-900 bg-white">Replied</option>
                </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div
                  key={message._id}
                  className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(message.priority)} ${
                    message.status === 'unread' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {message.from?.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {message.subject}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                          {message.priority !== 'medium' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                              {message.priority}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{message.from?.name}</span>
                            {message.from?.company && (
                              <>
                                <span>•</span>
                                <span>{message.from?.company}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(message.createdAt)}</span>
                          </div>
                          {message.projectId && (
                            <div className="flex items-center space-x-2">
                              <span className="text-amber-600">Project: {message.projectId.title}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {message.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(message._id)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Read</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleReply(message)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-700">No messages</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No messages match your current filters.' 
                    : 'Client messages will appear here.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reply Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reply to {selectedMessage.from?.name}
                  </h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Re: {selectedMessage.subject}
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Original message:</strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedMessage.content}
                  </p>
                </div>
                
                <form onSubmit={handleSendReply}>
                  <div className="mb-4">
                    <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      id="reply"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply..."
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMessage(null)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyContent.trim() || replyMutation.isLoading}
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {replyMutation.isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminMessages;
