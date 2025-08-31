import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft,
  Save,
  Trash2,
  Globe,
  Smartphone,
  Code,
  Database,
  Award,
  Users,
  Headphones,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: '',
    priority: '',
    budget: '',
    deadline: '',
    client: '',
    progress: '',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch project data
  const { data: project, isLoading: projectLoading, error: projectError } = useQuery(
    ['project', id],
    () => axios.get(`/api/projects/${id}`).then(res => res.data.data),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // Populate form with project data
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          status: data.status || '',
          priority: data.priority || '',
          budget: data.budget ? data.budget.toString() : '',
          deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
          client: data.client?._id || data.client || '',
          progress: data.progress ? data.progress.toString() : '0',
          requirements: data.requirements || ''
        });
      }
    }
  );

  // Populate form when project data changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        status: project.status || '',
        priority: project.priority || '',
        budget: project.budget ? project.budget.toString() : '',
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
        client: project.client?._id || project.client || '',
        progress: project.progress ? project.progress.toString() : '0',
        requirements: project.requirements || ''
      });
    }
  }, [project]);

  // Fetch clients for selection
  const { data: clientsResponse, isLoading: clientsLoading } = useQuery(
    'admin-clients',
    () => axios.get('/api/admin/clients').then(res => res.data),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000
    }
  );

  const clientsData = clientsResponse?.data || [];

  const categories = [
    { id: 'web-development', name: 'Web Development', icon: Globe },
    { id: 'mobile-app', name: 'Mobile App', icon: Smartphone },
    { id: 'design', name: 'Design', icon: Code },
    { id: 'branding', name: 'Branding', icon: Award },
    { id: 'consultation', name: 'Consultation', icon: Users },
    { id: 'virtual-assistance', name: 'Virtual Assistance', icon: Headphones },
    { id: 'educational-support', name: 'Educational Support', icon: GraduationCap }
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning', color: 'bg-blue-100 text-blue-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-amber-100 text-amber-800' },
    { value: 'review', label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-gray-100 text-gray-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-amber-100 text-amber-800' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-200 text-red-900' }
  ];

  // Update project mutation
  const updateProjectMutation = useMutation(
    (projectData) => axios.put(`/api/projects/${id}`, projectData),
    {
      onSuccess: () => {
        toast.success('Project updated successfully!');
        queryClient.invalidateQueries(['project', id]);
        queryClient.invalidateQueries('admin-projects');
        queryClient.invalidateQueries('projects');
        navigate('/admin-projects');
      },
      onError: (error) => {
        console.error('Update project error:', error);
        const errorMsg = error.response?.data?.message || 'Failed to update project';
        toast.error(errorMsg);
      }
    }
  );

  // Delete project mutation
  const deleteProjectMutation = useMutation(
    () => axios.delete(`/api/projects/${id}`),
    {
      onSuccess: () => {
        toast.success('Project deleted successfully!');
        queryClient.invalidateQueries('admin-projects');
        queryClient.invalidateQueries('projects');
        navigate('/admin-projects');
      },
      onError: (error) => {
        console.error('Delete project error:', error);
        const errorMsg = error.response?.data?.message || 'Failed to delete project';
        toast.error(errorMsg);
      }
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.title.trim()) {
        toast.error('Project title is required');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Project description is required');
        return;
      }
      if (!formData.category) {
        toast.error('Please select a category');
        return;
      }
      if (!formData.client) {
        toast.error('Please select a client');
        return;
      }
      if (!formData.deadline) {
        toast.error('Project deadline is required');
        return;
      }

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: formData.status,
        priority: formData.priority,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        deadline: formData.deadline,
        client: formData.client,
        progress: formData.progress ? parseInt(formData.progress) : 0,
        requirements: formData.requirements.trim() || null
      };

      await updateProjectMutation.mutateAsync(projectData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (projectLoading || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100 max-w-md w-full mx-4">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2">Loading Project</h2>
            <p className="text-gray-600">
              Fetching project details for editing...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-200 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">
              The project you're looking for doesn't exist or you don't have permission to edit it.
            </p>
            <button
              onClick={() => navigate('/admin-projects')}
              className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin-projects')}
            className="inline-flex items-center px-4 py-2 text-amber-600 hover:text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
                <p className="text-gray-600">
                  Update project details and settings for "{project?.title}".
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100">
          {/* Helper Notice */}
          <div className="bg-amber-50 border-b border-amber-100 p-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 text-sm font-bold">i</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-amber-900">Editing Project</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Update any fields below and save your changes.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={project?.title || "Enter project title"}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: 'none' }}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress (%)
                </label>
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleInputChange}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all"
                  required
                />
              </div>

              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <div className="relative">
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: 'none' }}
                    required
                    disabled={clientsLoading}
                  >
                    <option value="">
                      {clientsLoading ? 'Loading clients...' : 'Select a client'}
                    </option>
                    {clientsData.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name} ({client.email})
                        {client.company ? ` - ${client.company}` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={project?.description || "Describe the project objectives, scope, and key deliverables..."}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all resize-none"
                  required
                />
              </div>

              {/* Requirements */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Any specific requirements, constraints, or notes..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin-projects')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || updateProjectMutation.isLoading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting || updateProjectMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Project...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Project</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{project?.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteProjectMutation.isLoading}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleteProjectMutation.isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProject;
