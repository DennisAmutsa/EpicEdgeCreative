import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  User, 
  DollarSign, 
  Clock, 
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  FileText,
  Users,
  Target,
  TrendingUp,
  Zap,
  Timer,
  Star,
  Award,
  BarChart3,
  Activity,
  Send,
  Upload,
  Paperclip,
  ExternalLink,
  RefreshCw,
  Flag,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Edit,
  Plus,
  Layers,
  Globe,
  Shield,
  X
} from 'lucide-react';
import { format, differenceInDays, isAfter } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({ progress: '', notes: '' });

  const { data: project, isLoading, error } = useQuery(
    ['project', id],
    () => axios.get(`/api/projects/${id}`).then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
    }
  );

  // Timeline feature disabled until implemented
  // const { data: timeline } = useQuery(
  //   ['project-timeline', id],
  //   () => axios.get(`/api/projects/${id}/timeline`).then(res => res.data.data),
  //   {
  //     refetchOnWindowFocus: false,
  //     enabled: !!id,
  //   }
  // );

  // Update project progress (Admin only)
  const updateProjectMutation = useMutation(
    (updateData) => axios.put(`/api/projects/${id}`, {
      progress: parseInt(updateData.progress),
      notes: project.notes ? [...project.notes, {
        content: updateData.notes,
        author: user._id,
        isPrivate: false,
        createdAt: new Date()
      }] : [{
        content: updateData.notes,
        author: user._id,
        isPrivate: false,
        createdAt: new Date()
      }]
    }),
    {
      onSuccess: () => {
        toast.success('Project updated successfully!');
        queryClient.invalidateQueries(['project', id]);
        setShowUpdateModal(false);
        setUpdateData({ progress: '', notes: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update project');
      }
    }
  );

  // Send project message
  const sendMessageMutation = useMutation(
    (messageData) => axios.post('/api/notifications/request', {
      title: `Project Message: ${project?.title}`,
      message: `📨 ${messageData.message}`,
      type: 'message',
      priority: 'medium',
      relatedProject: id
    }),
    {
      onSuccess: () => {
        toast.success('Message sent to team!');
        setShowMessageModal(false);
      },
      onError: () => {
        toast.error('Failed to send message');
      }
    }
  );

  // Helper functions
  const getStatusBadge = (status) => {
    const styles = {
      'planning': 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-amber-100 text-amber-800 border-amber-200',
      'review': 'bg-purple-100 text-purple-800 border-purple-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'on-hold': 'bg-gray-100 text-gray-800 border-gray-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles['planning']}`;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'low': 'bg-green-100 text-green-800 border-green-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'urgent': 'bg-red-100 text-red-800 border-red-200'
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[priority] || styles['medium']}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning': return <Clock className="w-4 h-4 mr-2" />;
      case 'in-progress': return <Zap className="w-4 h-4 mr-2" />;
      case 'review': return <Eye className="w-4 h-4 mr-2" />;
      case 'completed': return <CheckCircle className="w-4 h-4 mr-2" />;
      case 'on-hold': return <Timer className="w-4 h-4 mr-2" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 mr-2" />;
      default: return <Clock className="w-4 h-4 mr-2" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'from-green-500 to-emerald-600';
    if (progress >= 70) return 'from-blue-500 to-cyan-600';
    if (progress >= 50) return 'from-amber-500 to-yellow-600';
    if (progress >= 25) return 'from-orange-500 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

  const getDaysUntilDeadline = (deadline) => {
    return differenceInDays(new Date(deadline), new Date());
  };

  const isOverdue = (deadline) => {
    return isAfter(new Date(), new Date(deadline));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    sendMessageMutation.mutate({
      message: formData.get('message')
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    console.error('Project loading error:', error); // Debug log
    const backLink = isAdmin ? '/admin-projects' : '/projects';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
              <p className="text-gray-600 mb-4">
                {error?.response?.status === 403 
                  ? "You don't have permission to view this project."
                  : error?.response?.status === 404 
                  ? "This project doesn't exist or has been deleted."
                  : "There was an error loading the project details."
                }
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Project ID: {id}
              </p>
              <Link 
                to={backLink} 
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
            </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${project.title} - Project Details`}
        description={project.description}
        url={`/projects/${id}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-4 sm:py-5 lg:py-6">
            {/* Back Button */}
            <Link
              to={isAdmin ? "/admin-projects" : "/dashboard"}
              className="inline-flex items-center text-white/90 hover:text-white mb-2 sm:mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{project.title}</h1>
                <p className="text-sm sm:text-base text-white/90 mb-3">{project.description}</p>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <span className={getStatusBadge(project.status)}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </span>
                  <span className={getPriorityBadge(project.priority)}>
                    <Flag className="w-3 h-3 mr-1" />
                    {project.priority} priority
                  </span>
                  <div className="text-white/90 text-xs sm:text-sm flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Client: {project.client?.name || 'Unassigned'}
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30 max-w-xs sm:max-w-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/90 font-medium text-sm">Overall Progress</span>
                    <span className="text-white font-bold text-base">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                    <div
                      className={`h-2 sm:h-3 rounded-full bg-gradient-to-r ${getProgressColor(project.progress)} transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-1 text-white/80 text-xs">
                    <span>
                      {isOverdue(project.deadline) && project.status !== 'completed' ? (
                        <span className="text-red-200 font-medium">Overdue</span>
                      ) : (
                        <>Due: {format(new Date(project.deadline), 'MMM d')}</>
                      )}
                    </span>
                    {getDaysUntilDeadline(project.deadline) > 0 && project.status !== 'completed' && (
                      <span className="text-amber-200 font-medium">{getDaysUntilDeadline(project.deadline)} days left</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[160px]">
                {!isAdmin && (
                  <>
                <button
                  onClick={() => setShowMessageModal(true)}
                      className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/30 flex items-center text-xs sm:text-sm"
                >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Send Message</span>
                      <span className="sm:hidden">Message</span>
                </button>
                <button
                  onClick={() => queryClient.invalidateQueries(['project', id])}
                      className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/30 flex items-center text-xs sm:text-sm"
                >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Refresh</span>
                      <span className="sm:hidden">Sync</span>
                </button>
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <Link
                      to={`/edit-project/${project._id}`}
                      className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/30 flex items-center text-xs sm:text-sm"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Edit Project</span>
                      <span className="sm:hidden">Edit</span>
                    </Link>
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/30 flex items-center text-xs sm:text-sm"
                    >
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Update Progress</span>
                      <span className="sm:hidden">Update</span>
                    </button>
                    <button
                      onClick={() => queryClient.invalidateQueries(['project', id])}
                      className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/30 flex items-center text-xs sm:text-sm"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Refresh</span>
                      <span className="sm:hidden">Sync</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 -mt-3 lg:-mt-4 relative z-10">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-4 sm:mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
                {[
                  { id: 'overview', name: 'Overview', icon: BarChart3 },
                  { id: 'timeline', name: 'Timeline', icon: Activity },
                  { id: 'files', name: 'Files', icon: FileText },
                  { id: 'communication', name: 'Communication', icon: MessageSquare }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-sm sm:text-base flex items-center min-w-0`}
                  >
                    <tab.icon className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.charAt(0)}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">Progress</p>
                            <p className="text-2xl font-bold text-blue-900">{project.progress}%</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">Status</p>
                            <p className="text-lg font-bold text-green-900 capitalize">{project.status}</p>
                          </div>
                          {getStatusIcon(project.status)}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-amber-600 text-sm font-medium">Days Left</p>
                            <p className="text-2xl font-bold text-amber-900">
                              {project.status === 'completed' 
                                ? 'Done' 
                                : getDaysUntilDeadline(project.deadline) > 0 
                                ? getDaysUntilDeadline(project.deadline)
                                : 'Overdue'
                              }
                            </p>
                          </div>
                          <Target className="w-8 h-8 text-amber-600" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 text-sm font-medium">Priority</p>
                            <p className="text-lg font-bold text-purple-900 capitalize">{project.priority}</p>
                          </div>
                          <Flag className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracking Guide */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-amber-600" />
                        How to Track Your Project
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Real-time Progress</h4>
                            <p className="text-sm text-gray-600">Track completion percentage and see updates instantly</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Activity className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Status Updates</h4>
                            <p className="text-sm text-gray-600">Monitor project phases and milestones</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Direct Communication</h4>
                            <p className="text-sm text-gray-600">Send messages and receive updates from your team</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Timeline Tracking</h4>
                            <p className="text-sm text-gray-600">Stay informed about deadlines and delivery dates</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Milestones */}
                    {project.milestones && project.milestones.length > 0 && (
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-amber-600" />
                          Project Milestones
                        </h3>
                        <div className="space-y-4">
                          {project.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-start space-x-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                                milestone.completed 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {milestone.completed ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Clock className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium ${
                                  milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                  {milestone.title}
                                </h4>
                                {milestone.description && (
                                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                )}
                                {milestone.dueDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Project Details */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Client</p>
                          <p className="font-medium text-gray-900">{project.client?.name || 'Not assigned'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Deadline</p>
                          <p className={`font-medium ${
                            isOverdue(project.deadline) && project.status !== 'completed'
                              ? 'text-red-600'
                              : 'text-gray-900'
                          }`}>
                            {format(new Date(project.deadline), 'MMMM d, yyyy')}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-medium text-gray-900">
                            ${project.budget?.toLocaleString() || 'Not set'}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="font-medium text-gray-900">
                            {format(new Date(project.createdAt), 'MMMM d, yyyy')}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Last Updated</p>
                          <p className="font-medium text-gray-900">
                            {format(new Date(project.updatedAt), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        {!isAdmin && (
                          <>
                        <button
                          onClick={() => setShowMessageModal(true)}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-colors font-medium flex items-center justify-center"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Message to Team
                        </button>
                        
                        <Link
                          to="/messages"
                          className="w-full bg-blue-50 text-blue-700 py-3 px-4 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center justify-center border border-blue-200"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View All Messages
                        </Link>
                          </>
                        )}
                        
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setShowUpdateModal(true)}
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-colors font-medium flex items-center justify-center"
                            >
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Update Progress
                            </button>
                            
                            <Link
                              to="/admin-messages"
                              className="w-full bg-blue-50 text-blue-700 py-3 px-4 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center justify-center border border-blue-200"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              View Client Messages
                            </Link>
                            
                            <Link
                              to={`/edit-project/${project._id}`}
                              className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center border border-green-200"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Project Details
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => queryClient.invalidateQueries(['project', id])}
                          className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors font-medium flex items-center justify-center border border-gray-200"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
                    <span className="text-sm text-gray-500">
                      Last updated: {project.updatedAt ? format(new Date(project.updatedAt), 'MMM d, yyyy \'at\' h:mm a') : 'Unknown'}
                    </span>
                  </div>



                  {/* Timeline Items */}
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {/* Project Created */}
                      <li>
                        <div className="relative pb-8">
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <Plus className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-900">
                                  Project <span className="font-medium">{project.title}</span> was created
                                </p>
                                <p className="text-sm text-gray-500">Status: {project.status}</p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time>{project.createdAt ? format(new Date(project.createdAt), 'MMM d, yyyy') : 'Recently'}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* Progress Update */}
                      {project.progress > 0 && (
                        <li>
                          <div className="relative pb-8">
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center ring-8 ring-white">
                                  <TrendingUp className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    Progress updated to <span className="font-medium">{project.progress}%</span>
                                  </p>
                                  <p className="text-sm text-gray-500">Status: {project.status}</p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  <time>{project.updatedAt ? format(new Date(project.updatedAt), 'MMM d, yyyy') : 'Recently'}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {/* Deadline */}
                      <li>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full ${
                                project.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                              } flex items-center justify-center ring-8 ring-white`}>
                                {project.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : (
                                  <Clock className="h-4 w-4 text-white" />
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-900">
                                  {project.status === 'completed' ? (
                                    <>Project <span className="font-medium text-green-600">completed</span></>
                                  ) : (
                                    <>Target deadline: <span className="font-medium">{project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'Not set'}</span></>
                                  )}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {project.status === 'completed' ? 'All deliverables finalized' : 'In progress'}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time>{project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'TBD'}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Timeline Summary */}
                  <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {project.createdAt ? Math.max(1, differenceInDays(new Date(), new Date(project.createdAt))) : 1}
                        </p>
                        <p className="text-sm text-gray-500">Days Active</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-600">{project.progress || 0}%</p>
                        <p className="text-sm text-gray-500">Complete</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {(project.notes?.length || 0) + (project.attachments?.length || 0) + (project.progress > 0 ? 1 : 0)}
                        </p>
                        <p className="text-sm text-gray-500">Updates</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {project.deadline ? (
                            project.status === 'completed' ? '✓' : 
                            isAfter(new Date(project.deadline), new Date()) ? 
                            Math.max(0, differenceInDays(new Date(project.deadline), new Date())) : 'Overdue'
                          ) : 'TBD'}
                        </p>
                        <p className="text-sm text-gray-500">Days Left</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Project Files</h3>
                    <button 
                      onClick={() => setShowFileModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isAdmin ? 'Share Files' : 'Upload Files'}
                    </button>
                  </div>

                  {/* Files List */}
                  <div className="space-y-3">
                    {project.attachments && project.attachments.length > 0 ? (
                      project.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center">
                            <FileText className="w-8 h-8 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">{file.originalName}</p>
                              <p className="text-sm text-gray-500">
                                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'} • 
                                {file.uploadedAt ? format(new Date(file.uploadedAt), 'MMM d, yyyy') : 'Unknown date'}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => window.open(file.path, '_blank')}
                              className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => window.open(file.path, '_blank')}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                              title="View"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No files uploaded yet</h3>
                        <p className="mt-2 text-gray-500">
                          {isAdmin 
                            ? "Share project files, documents, and deliverables with your client."
                            : "Upload files, documents, or share resources with your project team."
                          }
                        </p>
                        <button 
                          onClick={() => setShowFileModal(true)}
                          className="mt-4 inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isAdmin ? 'Share First File' : 'Upload First File'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'communication' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                                         <h3 className="text-lg font-semibold text-gray-900">Project Communication</h3>
                     <button 
                       onClick={() => setShowMessageModal(true)}
                       className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                     >
                       <Send className="w-4 h-4 mr-2" />
                       {isAdmin ? 'Message Client' : 'Send Message'}
                     </button>
                  </div>

                  {/* Project Notes/Comments */}
                  <div className="space-y-4">
                    {project.notes && project.notes.length > 0 ? (
                      project.notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{note.author?.name || 'Team Member'}</p>
                                <p className="text-sm text-gray-500">
                                  {note.createdAt ? format(new Date(note.createdAt), 'MMM d, yyyy \'at\' h:mm a') : 'Just now'}
                                </p>
                              </div>
                            </div>
                            {note.isPrivate && (
                              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                <Shield className="w-3 h-3 mr-1" />
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{note.content}</p>
                        </div>
                      ))
                    ) : (
                <div className="text-center py-12">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
                        <p className="mt-2 text-gray-500">
                          {isAdmin 
                            ? "Start the conversation with your client about this project."
                            : "Start the conversation by sending a message about this project."
                          }
                        </p>
                        <button 
                          onClick={() => setShowMessageModal(true)}
                          className="mt-4 inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isAdmin ? 'Send Message to Client' : 'Send First Message'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {!isAdmin && (
                        <>
                          <button 
                            onClick={() => setShowMessageModal(true)}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Request Update
                          </button>
                          <button 
                            onClick={() => setShowMessageModal(true)}
                            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Meeting
                          </button>
                          <button 
                            onClick={() => setShowFileModal(true)}
                            className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                          >
                            <Paperclip className="w-4 h-4 mr-2" />
                            Upload File
                          </button>
                        </>
                      )}
                      
                      {isAdmin && (
                        <>
                          <button 
                            onClick={() => setShowMessageModal(true)}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Update
                          </button>
                          <button 
                            onClick={() => setShowUpdateModal(true)}
                            className="inline-flex items-center px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Update Progress
                          </button>
                          <button 
                            onClick={() => setShowFileModal(true)}
                            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Share Files
                          </button>
                          <Link
                            to={`/edit-project/${project._id}`}
                            className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Project
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Send className="w-5 h-5 mr-2 text-amber-600" />
                  Send Project Message
                </h3>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isAdmin ? 'Message to Client' : 'Message to Team'}
                  </label>
                  <textarea
                    name="message"
                    placeholder={isAdmin ? "Send an update or message to your client..." : "Type your message about this project..."}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 resize-none bg-white text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendMessageMutation.isLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {sendMessageMutation.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feedback Call-to-Action for Completed Projects */}
        {!isAdmin && project?.status === 'completed' && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Project Complete! 🎉
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We'd love to hear about your experience! Your feedback helps us improve and showcases our work to future clients.
              </p>
              <Link
                to="/feedback"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                <Star className="w-5 h-5 mr-2 fill-current" />
                Write a Review
              </Link>
            </div>
          </div>
        )}

        {/* File Upload Modal */}
        {showFileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Upload Project File</h3>
                <button
                  onClick={() => setShowFileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <button className="text-amber-600 hover:text-amber-500">Click to upload</button> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFileModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.info('File upload feature coming soon!');
                    setShowFileModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Progress Modal (Admin Only) */}
        {isAdmin && showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Update Project Progress</h3>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={updateData.progress}
                    onChange={(e) => setUpdateData({...updateData, progress: e.target.value})}
                    placeholder={`Current: ${project?.progress || 0}%`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress Notes
                  </label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                    placeholder="Describe the progress made, milestones reached, or any updates..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateProjectMutation.mutate(updateData)}
                  disabled={!updateData.progress || !updateData.notes || updateProjectMutation.isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {updateProjectMutation.isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Update Progress'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetails;