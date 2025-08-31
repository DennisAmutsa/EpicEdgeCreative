import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Star,
  Check,
  X,
  Eye,
  Clock,
  MessageSquare,
  Filter,
  Search,
  User,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminFeedback = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const queryClient = useQueryClient();

  // Fetch feedback for admin review
  const { data: feedbackData, isLoading } = useQuery(
    ['admin-feedback', statusFilter],
    () => axios.get(`/api/feedback/admin?status=${statusFilter}`).then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Approve feedback mutation
  const approveMutation = useMutation(
    (feedbackId) => axios.put(`/api/feedback/${feedbackId}/approve`),
    {
      onSuccess: () => {
        toast.success('Feedback approved and published!');
        queryClient.invalidateQueries('admin-feedback');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to approve feedback');
      }
    }
  );

  // Reject feedback mutation
  const rejectMutation = useMutation(
    ({ feedbackId, reason }) => axios.put(`/api/feedback/${feedbackId}/reject`, { reason }),
    {
      onSuccess: () => {
        toast.success('Feedback rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedFeedback(null);
        queryClient.invalidateQueries('admin-feedback');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to reject feedback');
      }
    }
  );

  const feedback = feedbackData?.feedback || [];
  const pendingCount = feedbackData?.pendingCount || 0;

  const filteredFeedback = feedback.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serviceCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (feedbackId) => {
    approveMutation.mutate(feedbackId);
  };

  const handleReject = (feedback) => {
    setSelectedFeedback(feedback);
    setShowRejectModal(true);
  };

  const handleSubmitRejection = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({
      feedbackId: selectedFeedback._id,
      reason: rejectionReason.trim()
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: feedback.length,
    pending: feedback.filter(f => f.status === 'pending').length,
    approved: feedback.filter(f => f.status === 'approved').length,
    rejected: feedback.filter(f => f.status === 'rejected').length,
    avgRating: feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : '0.0'
  };

  return (
    <>
      <SEOHead
        title="Feedback Management - Admin - EpicEdge Creative"
        description="Manage client feedback and testimonials"
        url="/admin-feedback"
      />
      
      <div className="space-y-6">
        {/* Header & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback Management</h1>
            <p className="text-gray-600">
              Review and approve client testimonials
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {pendingCount} pending
                </span>
              )}
            </p>
          </div>
          
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-blue-600">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-xl font-bold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-xl font-bold text-amber-600">{stats.avgRating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-white appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="all" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">All Feedback</option>
                  <option value="pending" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">Pending Review</option>
                  <option value="approved" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">Approved</option>
                  <option value="rejected" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((item) => (
                <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                          {item.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                          {item.status === 'approved' && <Check className="w-3 h-3 inline mr-1" />}
                          {item.status === 'rejected' && <X className="w-3 h-3 inline mr-1" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(item.rating)}
                          <span className="ml-1 font-medium">{item.rating}/5</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{item.client.name}</span>
                          {item.client.company && (
                            <>
                              <span>•</span>
                              <span>{item.client.company}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-3">{item.content}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-amber-600">
                          {item.project ? `Project: ${item.project.title}` : `Service: ${item.serviceCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                        </span>
                        <span className="text-gray-500">
                          Category: {item.serviceCategory}
                        </span>
                        {item.displayName && (
                          <span className="text-gray-500">
                            Display: {item.displayName}
                          </span>
                        )}
                      </div>
                      
                      {item.status === 'rejected' && item.rejectionReason && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-700">
                            <strong>Rejection reason:</strong> {item.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(item._id)}
                            disabled={approveMutation.isLoading}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          
                          <button
                            onClick={() => handleReject(item)}
                            disabled={rejectMutation.isLoading}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      
                      {item.status === 'approved' && (
                        <div className="flex items-center space-x-1 text-green-600 text-sm">
                          <Eye className="w-4 h-4" />
                          <span>Public</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-700">No feedback found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No feedback matches your current filters.' 
                    : 'Client feedback will appear here when submitted.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rejection Modal */}
        {showRejectModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Reject Feedback
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Please provide a reason for rejecting this feedback
                </p>
              </div>
              
              <form onSubmit={handleSubmitRejection} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this feedback cannot be approved..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                      setSelectedFeedback(null);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!rejectionReason.trim() || rejectMutation.isLoading}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {rejectMutation.isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Rejecting...</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span>Reject Feedback</span>
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

export default AdminFeedback;