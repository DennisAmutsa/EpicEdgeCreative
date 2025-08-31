import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft,
  Save,
  Plus,
  Globe,
  Smartphone,
  Code,
  Database,
  Award,
  Users,
  Headphones,
  GraduationCap
} from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'planning',
    priority: 'medium',
    budget: '',
    deadline: '',
    client: '', // Client ObjectId
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clients for selection
  const { data: clientsResponse, isLoading: clientsLoading } = useQuery(
    'admin-clients',
    () => axios.get('/api/admin/clients').then(res => res.data),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000 // 5 minutes
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
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-amber-100 text-amber-800' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' }
  ];

  // Create project mutation
  const createProjectMutation = useMutation(
    (projectData) => axios.post('/api/projects', projectData),
    {
      onSuccess: () => {
        toast.success('Project created successfully!');
        queryClient.invalidateQueries('admin-projects');
        navigate('/admin-projects');
      },
      onError: (error) => {
        console.error('Create project error:', error);
        const errorMsg = error.response?.data?.message || 'Failed to create project';
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
        client: formData.client, // ObjectId reference
        requirements: formData.requirements.trim() || null
      };

      await createProjectMutation.mutateAsync(projectData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Code;
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
            <p className="text-gray-600">
              Set up a new project for your clients with all the necessary details.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100">
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
                  placeholder="Enter project title"
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
                  Select Client *
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
                {clientsData.length === 0 && !clientsLoading && (
                  <p className="text-xs text-amber-600 mt-1">
                    💡 No clients found. Clients need to register first before you can assign projects.
                  </p>
                )}
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
                  placeholder="Describe the project objectives, scope, and key deliverables..."
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
                disabled={isSubmitting || createProjectMutation.isLoading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting || createProjectMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
