import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Star,
  Send,
  CheckCircle,
  Clock,
  Eye,
  X,
  MessageSquare,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Feedback = () => {
  const { user } = useAuth();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.company || '');
  const queryClient = useQueryClient();

  // Available services that clients can provide feedback for
  const availableServices = [
    { id: 'web-development', name: 'Web Development', icon: '🌐' },
    { id: 'mobile-development', name: 'Mobile Development', icon: '📱' },
    { id: 'database-integration', name: 'Database Integration', icon: '🗄️' },
    { id: 'virtual-assistance', name: 'Virtual Assistance', icon: '🎯' },
    { id: 'educational-support', name: 'Educational Support', icon: '🎓' },
    { id: 'digital-solutions', name: 'Digital Solutions', icon: '💻' },
    { id: 'consultation', name: 'Consultation & Planning', icon: '💡' },
    { id: 'other', name: 'Other Services', icon: '⚡' }
  ];

  // Fetch client's feedback history
  const { data: myFeedback, isLoading: feedbackLoading } = useQuery(
    'my-feedback',
    () => axios.get('/api/feedback/my-feedback').then(res => res.data.data.feedback),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation(
    (feedbackData) => axios.post('/api/feedback', feedbackData),
    {
      onSuccess: () => {
        toast.success('Feedback submitted successfully! It will be reviewed before being published.');
        setShowFeedbackForm(false);
        resetForm();
        queryClient.invalidateQueries('my-feedback');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit feedback');
      }
    }
  );

  const resetForm = () => {
    setSelectedProject('');
    setRating(0);
    setTitle('');
    setContent('');
    setDisplayName(user?.name || '');
    setCompanyName(user?.company || '');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!selectedProject || !rating || !title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedService = availableServices.find(s => s.id === selectedProject);
    
    const feedbackData = {
      projectId: null, // No specific project, service-based feedback
      rating,
      title: title.trim(),
      content: content.trim(),
      serviceCategory: selectedProject,
      displayName: displayName.trim() || user?.name,
      companyName: companyName.trim() || user?.company
    };

    submitFeedbackMutation.mutate(feedbackData);
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

  const renderStars = (count, interactive = false, onHover = null, onClick = null) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          index < (interactive ? (hoverRating || rating) : count)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
        onMouseEnter={() => interactive && onHover && onHover(index + 1)}
        onMouseLeave={() => interactive && onHover && onHover(0)}
        onClick={() => interactive && onClick && onClick(index + 1)}
      />
    ));
  };

  if (feedbackLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const feedbackHistory = myFeedback || [];
  const servicesWithFeedback = feedbackHistory.map(f => f.serviceCategory);
  const availableServicesForFeedback = availableServices.filter(
    service => !servicesWithFeedback.includes(service.id)
  );

  return (
    <>
      <SEOHead
        title="Feedback & Reviews - EpicEdge Creative"
        description="Share your experience and help us improve our services."
        url="/feedback"
      />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Share Your Experience
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your feedback helps us improve and showcases our work to future clients. 
              Share your thoughts on our completed projects.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Reviews</h3>
                <p className="text-2xl font-bold text-blue-600">{feedbackHistory.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Services Available</h3>
                <p className="text-2xl font-bold text-green-600">{availableServicesForFeedback.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Avg Rating</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {feedbackHistory.length > 0 
                    ? (feedbackHistory.reduce((sum, f) => sum + f.rating, 0) / feedbackHistory.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Write Review Button - Always Visible */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Share Your Experience?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {availableServicesForFeedback.length > 0 
                ? `You can review ${availableServicesForFeedback.length} of our services that you haven't reviewed yet!`
                : 'Have you used any of our services? Share your experience with other clients!'
              }
            </p>
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
            >
              <Star className="w-6 h-6 mr-2 fill-current" />
              Write a Review
            </button>
          </div>
        </div>

        {/* Available Services to Review */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Our Services</h2>
            <p className="text-gray-600 text-sm mt-1">
              Select a service you've used to share your experience
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableServices.map((service) => {
                const hasReviewed = servicesWithFeedback.includes(service.id);
                return (
                  <div 
                    key={service.id}
                    className={`border rounded-lg p-4 transition-all ${
                      hasReviewed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:shadow-md hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{service.icon}</span>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      {hasReviewed ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✅ Reviewed
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedProject(service.id);
                          setShowFeedbackForm(true);
                        }}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                          hasReviewed
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                        }`}
                      >
                        {hasReviewed ? 'Review Again' : 'Write Review'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Feedback History</h2>
            <p className="text-gray-600 text-sm mt-1">
              Track the status of your submitted reviews
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {feedbackHistory.length > 0 ? (
              feedbackHistory.map((feedback) => (
                <div key={feedback._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{feedback.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(feedback.status)}`}>
                          {feedback.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                          {feedback.status === 'approved' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {feedback.status === 'rejected' && <X className="w-3 h-3 inline mr-1" />}
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {renderStars(feedback.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          • Service: {availableServices.find(s => s.id === feedback.serviceCategory)?.name || feedback.serviceCategory}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{feedback.content}</p>
                      
                      {feedback.status === 'rejected' && feedback.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-700">
                            <strong>Rejection reason:</strong> {feedback.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-700">No reviews yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Use any of our services and share your experience with other clients.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Write Your Review</h2>
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmitFeedback} className="p-6 space-y-6">
                {/* Service Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Received *
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full p-3 pr-10 border-2 border-amber-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: 'none' }}
                    required
                  >
                    <option value="" className="text-gray-500">Select the service you received...</option>
                    {availableServices.map((service) => (
                      <option key={service.id} value={service.id} className="text-gray-900 bg-white">
                        {service.icon} {service.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-1">
                    {renderStars(rating, true, setHoverRating, setRating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {rating > 0 ? `${rating}/5` : 'Click to rate'}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience..."
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your detailed experience with our services..."
                    rows={6}
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all resize-y"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{content.length}/1000 characters</p>
                </div>

                {/* Display Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="How should your name appear?"
                      className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Optional company name"
                      className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your feedback will be reviewed by our team before being published. 
                    We may contact you if we need clarification.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitFeedbackMutation.isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {submitFeedbackMutation.isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Review</span>
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

export default Feedback;
