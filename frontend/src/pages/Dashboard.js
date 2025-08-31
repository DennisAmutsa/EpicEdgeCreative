import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  Download,
  DollarSign,
  FileText,
  Bell,
  Eye,
  ExternalLink,
  Video,
  Upload,
  Zap,
  Send,
  RefreshCw,
  X,
  BookOpen,
  Phone,
  ClipboardList,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import BreadcrumbNavigation from '../components/common/BreadcrumbNavigation';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  
  // Debug logging
  console.log('Dashboard Debug:', { user: user?.role, isAdmin, loading });
  
  const queryClient = useQueryClient();
  const [showUpdateRequestModal, setShowUpdateRequestModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch dashboard statistics (role-specific)
  const { data: stats, isLoading: statsLoading } = useQuery(
    isAdmin ? 'admin-dashboard-stats' : 'client-dashboard-stats',
    () => axios.get(isAdmin ? '/api/admin/stats' : '/api/projects/stats/dashboard').then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 1 * 60 * 1000,  // 1 minute
    }
  );

  // Fetch recent projects (clients only)
  const { data: projects, isLoading: projectsLoading } = useQuery(
    'recent-projects',
    () => axios.get('/api/projects?limit=5').then(res => res.data.data.projects),
    {
      refetchOnWindowFocus: false,
      enabled: !isAdmin, // Only fetch for clients
    }
  );

  // Fetch recent notifications for activity feed
  const { data: notifications } = useQuery(
    'recent-notifications',
    () => axios.get('/api/notifications?limit=5').then(res => res.data.data.notifications),
    {
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: !isAdmin, // Only fetch for clients
    }
  );

  // Send project update request
  const sendUpdateRequestMutation = useMutation(
    (data) => {
      const payload = {
        title: 'Project Update Request',
        message: data.message && data.message.trim() ? `📋 ${data.message}` : '📋 Project update requested',
        type: 'project_update',
        priority: data.urgent ? 'high' : 'medium',
        relatedProject: data.projectId,
        actionText: 'View Project'
      };
      console.log('Sending to server:', payload);
      return axios.post('/api/notifications/request', payload);
    },
    {
      onSuccess: () => {
        toast.success('Update request sent successfully!');
        setShowUpdateRequestModal(false);
        setSelectedProject(null);
      },
      onError: (error) => {
        console.error('Update request error:', error.response?.data || error);
        const errorMsg = error.response?.data?.message || 'Failed to send update request';
        toast.error(`Error: ${errorMsg}`);
        
        // Show more detailed error in console
        if (error.response?.data?.errors) {
          console.error('Validation errors:', error.response.data.errors);
        }
      }
    }
  );

  // Send meeting request
  const sendMeetingRequestMutation = useMutation(
    (data) => {
      const payload = {
        title: 'Meeting Request',
        message: data.message && data.message.trim() ? `📅 ${data.message}` : '📅 Meeting requested',
        type: 'meeting',
        priority: 'medium',
        relatedProject: data.projectId,
        actionText: 'Schedule Meeting',
        email: data.email // For automatic confirmation email
      };
      console.log('Sending meeting request:', payload);
      return axios.post('/api/notifications/request', payload);
    },
    {
      onSuccess: (response) => {
        const message = response?.data?.emailSent ? 
          'Meeting request sent! Check your email for confirmation.' : 
          'Meeting request sent successfully!';
        toast.success(message);
        setShowMeetingModal(false);
        setSelectedProject(null);
      },
      onError: (error) => {
        console.error('Meeting request error:', error.response?.data || error);
        const errorMsg = error.response?.data?.message || 'Failed to send meeting request';
        toast.error(errorMsg);
      }
    }
  );

  // Show loading spinner if auth is still loading
  if (loading) {
    return <LoadingSpinner />;
  }

  const handleUpdateRequest = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const requestData = {
      projectId: selectedProject?._id,
      message: formData.get('message'),
      urgent: formData.get('urgent') === 'on'
    };
    console.log('Sending update request:', requestData);
    sendUpdateRequestMutation.mutate(requestData);
  };

  const handleMeetingRequest = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    sendMeetingRequestMutation.mutate({
      projectId: selectedProject?._id,
      message: formData.get('message'),
      email: formData.get('email')
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = "status-badge";
    switch (status) {
      case 'planning':
        return `${baseClasses} status-planning`;
      case 'in-progress':
        return `${baseClasses} status-in-progress`;
      case 'review':
        return `${baseClasses} status-review`;
      case 'completed':
        return `${baseClasses} status-completed`;
      case 'on-hold':
        return `${baseClasses} status-on-hold`;
      case 'cancelled':
        return `${baseClasses} status-cancelled`;
      default:
        return `${baseClasses} status-planning`;
    }
  };

  if (statsLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const overview = isAdmin ? stats || {} : stats?.overview || {};

  const dashboardStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EpicEdge Creative Dashboard",
    "description": "Project management dashboard for creative professionals and agencies",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SEOHead
        title="Dashboard - EpicEdge Creative | Project Management Overview"
        description="Access your EpicEdge Creative dashboard to view project progress, manage tasks, and collaborate with your team. Real-time project tracking and analytics."
        keywords="dashboard, project management, creative agency dashboard, project tracking, team collaboration, project analytics"
        url="/dashboard"
        structuredData={dashboardStructuredData}
      />
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{isAdmin ? (overview.activeProjects || 0) : (overview.inProgressProjects || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{overview.completedProjects || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(isAdmin ? (overview.avgProgress || 0) : (overview.averageProgress || 0))}%</p>
              </div>
            </div>
          </div>
                </div>

        {/* Quick Actions - Only for Clients */}
        {!isAdmin && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <Zap className="w-5 sm:w-6 h-5 sm:h-6 mr-2 text-amber-600" />
                  Quick Actions
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Get instant help and updates on your projects</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 mt-2 sm:mt-0">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => setShowUpdateRequestModal(true)}
                className="group bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Request Update</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Get latest project status</p>
                </div>
              </button>

              <button
                onClick={() => setShowMeetingModal(true)}
                className="group bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <Video className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Schedule Meeting</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Book a video call</p>
                </div>
              </button>

              <Link
                to="/messages"
                className="group bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <Send className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
          </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Send Message</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Direct team communication</p>
        </div>
              </Link>

              <Link
                to="/billing"
                className="group bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">View Billing</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Check invoices & payments</p>
                </div>
              </Link>
            </div>
              
            <div className="mt-6 p-4 bg-white/50 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Need immediate assistance?</p>
                    <p className="text-xs text-gray-600">Our team typically responds within 2 hours</p>
                  </div>
                </div>
                <Link
                  to="/messages"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors"
                >
                  Contact Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Section - Only for Clients with Completed Projects */}
        {!isAdmin && projects && projects.filter(p => p.status === 'completed').length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <Star className="w-5 sm:w-6 h-5 sm:h-6 mr-2 text-green-600 fill-current" />
                  Share Your Experience
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Help others by reviewing your completed projects</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 mt-2 sm:mt-0">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {projects.filter(p => p.status === 'completed').length} Project{projects.filter(p => p.status === 'completed').length !== 1 ? 's' : ''} Ready for Review
                    </h3>
                    <p className="text-sm text-gray-600">Your feedback helps us improve and showcases our work</p>
                  </div>
                </div>
                <Link
                  to="/feedback"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                >
                  Write Reviews
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isAdmin ? (
          /* Admin Dashboard Content */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Total Clients</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{stats?.totalClients || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Active Projects</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{stats?.activeProjects || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Pending Messages</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">{stats?.pendingMessages || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Pending Feedback</span>
                    </div>
                    <span className="text-lg font-bold text-amber-600">{stats?.pendingFeedback || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Admin Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/admin-projects"
                    className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <FolderOpen className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-blue-900">Manage Projects</span>
                  </Link>
                  
                  <Link
                    to="/admin-users"
                    className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Users className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-green-900">Manage Clients</span>
                  </Link>
                  
                  <Link
                    to="/admin-messages"
                    className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-purple-900">View Messages</span>
                  </Link>
                  
                  <Link
                    to="/admin-feedback"
                    className="flex items-center p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <Star className="w-5 h-5 text-amber-600 mr-3" />
                    <span className="text-sm font-medium text-amber-900">Manage Feedback</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Client Dashboard Content */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                <Link to="/projects" className="text-sm text-amber-600 hover:text-amber-500 font-medium">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project._id} className="flex items-center justify-between">
                      <div className="flex-1">
                      <Link
                        to={`/projects/${project._id}`}
                          className="text-sm font-medium text-gray-900 hover:text-amber-600"
                      >
                        {project.title}
                      </Link>
                        <div className="flex items-center mt-1 space-x-2">
                        <span className={getStatusBadge(project.status)}>
                          {project.status}
                        </span>
                    </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                            className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No projects yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Link to="/notifications" className="text-sm text-amber-600 hover:text-amber-500 font-medium">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {/* Recent notifications from admin */}
                  {notifications?.slice(0, 2).map((notification, index) => {
                    const timeAgo = new Date(notification.createdAt);
                    const now = new Date();
                    const diffHours = Math.floor((now - timeAgo) / (1000 * 60 * 60));
                    const timeString = diffHours < 24 ? `${diffHours}h ago` : `${Math.floor(diffHours / 24)}d ago`;
                    
                    return (
                      <div key={notification._id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Admin</span> sent a notification
                          </p>
                          <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded-md">
                            "{notification.message}"
                          </p>
                          <p className="text-xs text-gray-500 mt-2">{notification.title} • {timeString}</p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Recent project updates */}
                  {projects.flatMap(project => 
                    project.notes?.filter(note => !note.isPrivate).slice(0, 1).map((note, index) => {
                      const timeAgo = new Date(note.createdAt);
                      const now = new Date();
                      const diffHours = Math.floor((now - timeAgo) / (1000 * 60 * 60));
                      const timeString = diffHours < 24 ? `${diffHours}h ago` : `${Math.floor(diffHours / 24)}d ago`;
                      
                      return (
                        <div key={`${project._id}-${index}`} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{note.author?.name || 'Team'}</span> posted an update
                            </p>
                            <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded-md">
                              "{note.content}"
                            </p>
                            <p className="text-xs text-gray-500 mt-2">{project.title} • {timeString}</p>
                          </div>
                        </div>
                      );
                    })
                  ).slice(0, 3)}

                  {/* Deadline alerts */}
                  {projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    const now = new Date();
                    const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
                  }).slice(0, 2).map((project) => {
                    const deadline = new Date(project.deadline);
                    const now = new Date();
                    const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={`deadline-${project._id}`} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{project.title}</span> due in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{deadline.toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Update Request Modal - Only for Clients */}
        {!isAdmin && showUpdateRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <RefreshCw className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-blue-600" />
                  Request Project Update
                </h3>
                <button 
                  onClick={() => setShowUpdateRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
            </div>
              
              <form onSubmit={handleUpdateRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project (Optional)
                  </label>
                  <select
                    onChange={(e) => setSelectedProject(projects?.find(p => p._id === e.target.value) || null)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm hover:shadow-md transition-all"
                  >
                    <option value="">All Projects</option>
                    {projects?.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What would you like to know?
                  </label>
                  <textarea
                    name="message"
                    placeholder="Please provide an update on my project status, timeline, or any specific questions you have..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium placeholder-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm hover:shadow-md transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="urgent"
                    id="urgent"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                    This is urgent
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateRequestModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendUpdateRequestMutation.isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {sendUpdateRequestMutation.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Send Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Meeting Request Modal - Only for Clients */}
        {!isAdmin && showMeetingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <Video className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-600" />
                  Schedule Meeting
                </h3>
                <button 
                  onClick={() => setShowMeetingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
                    </div>

              <form onSubmit={handleMeetingRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project (Optional)
                  </label>
                  <select
                    onChange={(e) => setSelectedProject(projects?.find(p => p._id === e.target.value) || null)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:ring-4 focus:ring-green-500/20 focus:border-green-500 shadow-sm hover:shadow-md transition-all"
                  >
                    <option value="">General Discussion</option>
                    {projects?.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email for Meeting Confirmation
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user?.email || ''}
                    placeholder="Enter email to receive meeting confirmation"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 shadow-sm hover:shadow-md transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You'll receive an automatic confirmation email at this address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Purpose & Preferred Time
                  </label>
                  <textarea
                    name="message"
                    placeholder="I would like to schedule a meeting to discuss... 

My preferred times are:
- [Day/Date] at [Time]
- [Alternative time]

Meeting type preference: Video call / Phone call"
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium placeholder-gray-500 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 shadow-sm hover:shadow-md transition-all resize-none"
                    required
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-green-700">
                      <p className="font-medium">Meeting Options Available:</p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Video calls (Google Meet, Zoom)</li>
                        <li>• Phone consultations</li>
                        <li>• Screen sharing sessions</li>
                        <li>• Project review meetings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMeetingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendMeetingRequestMutation.isLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {sendMeetingRequestMutation.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Request Meeting'
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

export default Dashboard;