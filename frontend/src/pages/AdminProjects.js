import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch all projects
  const { data: projects, isLoading } = useQuery(
    'admin-projects',
    () => axios.get('/api/admin/projects').then(res => res.data.data),
    {
      refetchOnWindowFocus: false
    }
  );

  // Fetch all clients
  const { data: clients } = useQuery(
    'admin-clients',
    () => axios.get('/api/admin/clients').then(res => res.data.data),
    {
      refetchOnWindowFocus: false
    }
  );

  // Delete project mutation
  const deleteProjectMutation = useMutation(
    (projectId) => axios.delete(`/api/projects/${projectId}`),
    {
      onSuccess: () => {
        toast.success('Project deleted successfully');
        queryClient.invalidateQueries('admin-projects');
        setShowDeleteModal(false);
        setSelectedProject(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete project');
      }
    }
  );

  // Filter projects based on search and filters
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesClient = !clientFilter || project.client?._id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  }) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <TrendingUp className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'on-hold': return <Pause className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'planning':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in-progress':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'review':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'on-hold':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      deleteProjectMutation.mutate(selectedProject._id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setClientFilter('');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEOHead 
        title="All Projects - Admin"
        description="Manage all client projects from the admin dashboard"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
                <p className="mt-2 text-gray-600">
                  Manage and monitor all client projects
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/create-project'}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projects?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects?.filter(p => ['planning', 'in-progress', 'review'].includes(p.status)).length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects?.filter(p => p.status === 'completed').length || 0}
                  </p>
                </div>
              </div>
        </div>
        
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(projects?.map(p => p.client?._id).filter(Boolean)).size || 0}
            </p>
          </div>
        </div>
      </div>
    </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search projects, clients, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Filter className="w-5 h-5 mr-2 text-gray-500" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 bg-white font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                        style={{ backgroundImage: 'none' }}
                      >
                        <option value="" className="text-gray-900 bg-white">All Statuses</option>
                        <option value="planning" className="text-gray-900 bg-white">Planning</option>
                        <option value="in-progress" className="text-gray-900 bg-white">In Progress</option>
                        <option value="review" className="text-gray-900 bg-white">Review</option>
                        <option value="completed" className="text-gray-900 bg-white">Completed</option>
                        <option value="on-hold" className="text-gray-900 bg-white">On Hold</option>
                        <option value="cancelled" className="text-gray-900 bg-white">Cancelled</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                    <div className="relative">
                      <select
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 bg-white font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                        style={{ backgroundImage: 'none' }}
                      >
                        <option value="" className="text-gray-900 bg-white">All Clients</option>
                        {clients?.map(client => (
                          <option key={client._id} value={client._id} className="text-gray-900 bg-white">{client.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Client: {project.client?.name || 'No client assigned'}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={getStatusBadge(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Start Date</span>
                        <span className="text-sm text-gray-900">
                          {new Date(project.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Deadline</span>
                        <span className="text-sm text-gray-900">
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline set'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.location.href = `/projects/${project._id}`}
                        className="flex-1 bg-amber-50 text-amber-700 py-2 px-4 rounded-lg hover:bg-amber-100 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => window.location.href = `/edit-project/${project._id}`}
                        className="flex-1 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-50 text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter || clientFilter 
                  ? 'Try adjusting your search criteria or filters'
                  : 'Get started by creating your first project'
                }
              </p>
              {!searchTerm && !statusFilter && !clientFilter && (
                <button
                  onClick={() => window.location.href = '/create-project'}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors flex items-center mx-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Project
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "<strong>{selectedProject.title}</strong>"? 
                This will permanently remove the project and all associated data.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProject(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={deleteProjectMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteProjectMutation.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProjects;
