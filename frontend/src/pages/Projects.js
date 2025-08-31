import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  FolderOpen, 
  Calendar, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  Search,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  FileText,
  MessageSquare,
  Download,
  Star,
  Timer,
  Award,
  Zap,
  Layers
} from 'lucide-react';
import { format, isAfter, differenceInDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Projects = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const { data, isLoading, error } = useQuery(
    'projects',
    () => axios.get('/api/projects').then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );



  const getStatusBadge = (status) => {
    const styles = {
      'planning': 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-amber-100 text-amber-800 border-amber-200',
      'review': 'bg-purple-100 text-purple-800 border-purple-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'on-hold': 'bg-gray-100 text-gray-800 border-gray-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['planning']}`;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'low': 'bg-green-100 text-green-800 border-green-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'urgent': 'bg-red-100 text-red-800 border-red-200'
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[priority] || styles['medium']}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning': return <Clock className="w-3 h-3 mr-1" />;
      case 'in-progress': return <Zap className="w-3 h-3 mr-1" />;
      case 'review': return <Eye className="w-3 h-3 mr-1" />;
      case 'completed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'on-hold': return <Timer className="w-3 h-3 mr-1" />;
      case 'cancelled': return <AlertCircle className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-amber-500';
    if (progress >= 25) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const getDaysUntilDeadline = (deadline) => {
    return differenceInDays(new Date(deadline), new Date());
  };

  const isOverdue = (deadline) => {
    return isAfter(new Date(), new Date(deadline));
  };

  // Filter and sort projects
  const filteredProjects = React.useMemo(() => {
    let filtered = data?.projects || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case 'deadline':
        filtered = filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case 'progress':
        filtered = filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        filtered = filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      default:
        break;
    }

    return filtered;
  }, [data?.projects, searchTerm, statusFilter, priorityFilter, sortBy]);

  const getProjectStats = () => {
    const projects = data?.projects || [];
    return {
      total: projects.length,
      completed: projects.filter(p => p.status === 'completed').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      overdue: projects.filter(p => isOverdue(p.deadline) && p.status !== 'completed').length,
      avgProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) || 0
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading projects. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getProjectStats();

  return (
    <>
      <SEOHead
        title="My Projects - EpicEdge Creative"
        description="Track and manage all your projects in one place."
        url="/projects"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-300/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 flex items-center justify-center flex-wrap">
                <FolderOpen className="w-8 sm:w-10 h-8 sm:h-10 mr-2 sm:mr-3" />
                My Projects
              </h1>
              <p className="text-lg sm:text-xl text-white/90 px-4">Track progress, deadlines, and collaborate on your projects</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/30">
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-white/90 text-xs sm:text-sm">Total Projects</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/30">
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.inProgress}</div>
                <div className="text-white/90 text-xs sm:text-sm">In Progress</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/30">
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.completed}</div>
                <div className="text-white/90 text-xs sm:text-sm">Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/30">
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.avgProgress}%</div>
                <div className="text-white/90 text-xs sm:text-sm">Avg Progress</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 -mt-8 relative z-10">
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between lg:space-x-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 lg:pb-0">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm hover:shadow-md transition-all min-w-36"
                  >
                    <option value="all">All Status</option>
                    <option value="planning">📋 Planning</option>
                    <option value="in-progress">⚡ In Progress</option>
                    <option value="review">👁️ Review</option>
                    <option value="completed">✅ Completed</option>
                    <option value="on-hold">⏸️ On Hold</option>
                  </select>
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm hover:shadow-md transition-all min-w-36"
                >
                  <option value="all">All Priority</option>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm hover:shadow-md transition-all min-w-36"
                >
                  <option value="recent">📅 Recent</option>
                  <option value="deadline">⏰ Deadline</option>
                  <option value="progress">📊 Progress</option>
                  <option value="priority">🎯 Priority</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: {searchTerm}
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Status: {statusFilter}
                  </span>
                )}
                {priorityFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Priority: {priorityFilter}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-lg border border-gray-200 mx-4 sm:mx-0">
              <FolderOpen className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400" />
              <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900 px-4">
                {data?.projects?.length === 0 ? 'No projects found' : 'No projects match your filters'}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500 mb-6 px-4">
                {data?.projects?.length === 0 
                  ? "You don't have any projects assigned to you yet."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              

            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project._id} 
                  className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Project Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link 
                          to={`/projects/${project._id}`}
                          className="text-xl font-bold text-gray-900 hover:text-amber-600 transition-colors group-hover:text-amber-600"
                        >
                          {project.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          Client: {project.client?.name || 'Unassigned'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={getStatusBadge(project.status)}>
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    {/* Priority and Deadline */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={getPriorityBadge(project.priority)}>
                        {project.priority} priority
                      </span>
                      <div className={`text-sm flex items-center ${
                        isOverdue(project.deadline) && project.status !== 'completed'
                          ? 'text-red-600 font-medium'
                          : getDaysUntilDeadline(project.deadline) <= 7
                          ? 'text-amber-600 font-medium'
                          : 'text-gray-600'
                      }`}>
                        <Calendar className="w-4 h-4 mr-1" />
                        {isOverdue(project.deadline) && project.status !== 'completed' ? (
                          <>Overdue: {format(new Date(project.deadline), 'MMM d, yyyy')}</>
                        ) : (
                          <>Due: {format(new Date(project.deadline), 'MMM d, yyyy')}</>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="text-gray-900 font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Updated {format(new Date(project.updatedAt), 'MMM d')}
                      </span>
                      {getDaysUntilDeadline(project.deadline) > 0 && project.status !== 'completed' && (
                        <span className="flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          {getDaysUntilDeadline(project.deadline)} days left
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/projects/${project._id}`}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-center py-2 px-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 group"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
