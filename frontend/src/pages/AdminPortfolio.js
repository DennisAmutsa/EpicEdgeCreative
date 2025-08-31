import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Github,
  Globe,
  Smartphone,
  Database,
  Code,
  Award,
  Star,
  Users,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Headphones,
  GraduationCap
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminPortfolio = () => {
  const queryClient = useQueryClient();
  
  // Fetch portfolio projects from backend
  const { data: portfolioData, isLoading, error } = useQuery(
    'admin-portfolio-projects',
    () => axios.get('/api/projects/public/portfolio?limit=100').then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  // All React hooks must be called before any conditional logic
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web-development',
    technologies: '',
    link: '',
    github: '',
    featured: false,
    users: '',
    rating: '',
    completion: new Date().getFullYear().toString()
  });

  // Create project mutation
  const createProjectMutation = useMutation(
    (projectData) => axios.post('/api/projects/portfolio', projectData),
    {
      onSuccess: () => {
        toast.success('Project created successfully!');
        queryClient.invalidateQueries('admin-portfolio-projects');
        setShowForm(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create project');
      }
    }
  );

  // Update project mutation
  const updateProjectMutation = useMutation(
    ({ id, projectData }) => axios.put(`/api/projects/portfolio/${id}`, projectData),
    {
      onSuccess: () => {
        toast.success('Project updated successfully!');
        queryClient.invalidateQueries('admin-portfolio-projects');
        setShowForm(false);
        setEditingProject(null);
        resetForm();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update project');
      }
    }
  );

  // Delete project mutation
  const deleteProjectMutation = useMutation(
    (projectId) => axios.delete(`/api/projects/portfolio/${projectId}`),
    {
      onSuccess: () => {
        toast.success('Project deleted successfully!');
        queryClient.invalidateQueries('admin-portfolio-projects');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete project');
      }
    }
  );

  // Derived state and helper functions
  const projects = portfolioData?.projects || [];
  const categories = ['All', 'web-development', 'mobile-app', 'design', 'branding', 'consultation', 'virtual-assistance', 'educational-support'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'web-development': return Globe;
      case 'mobile-app': return Smartphone;
      case 'design': return Code;
      case 'branding': return Award;
      case 'consultation': return Users;
      case 'virtual-assistance': return Headphones;
      case 'educational-support': return GraduationCap;
      default: return Code;
    }
  };

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'web-development': return 'Web Development';
      case 'mobile-app': return 'Mobile Development';
      case 'design': return 'Design';
      case 'branding': return 'Branding';
      case 'consultation': return 'Consultation';
      case 'virtual-assistance': return 'Virtual Assistance';
      case 'educational-support': return 'Educational Support';
      default: return category;
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'web-development',
      technologies: '',
      link: '',
      github: '',
      featured: false,
      users: '',
      rating: '',
      completion: new Date().getFullYear().toString()
    });
  };

  // Loading state check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const projectData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      link: formData.link,
      github: formData.github,
      featured: formData.featured,
      users: formData.users,
      rating: parseFloat(formData.rating) || 4.8,
      completionYear: formData.completion,
      status: 'completed', // Portfolio projects should be completed
      isPublic: true // Make portfolio projects public by default
    };

    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, projectData });
    } else {
      createProjectMutation.mutate(projectData);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: project.technologies.join(', '),
      link: project.link,
      github: project.github,
      featured: project.featured,
      users: project.stats.users,
      rating: project.stats.rating.toString(),
      completion: project.stats.completion
    });
    setShowForm(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <>
      <SEOHead 
        title="Admin Portfolio Management | EpicEdge Creative"
        description="Manage portfolio projects and showcase our work to potential clients."
        canonicalUrl="https://epicedgecreative.com/admin-portfolio"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">Portfolio Management</h1>
                <p className="text-gray-600">Manage and showcase your projects</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl mt-4 lg:mt-0"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Project
              </button>
            </div>

            {/* Enhanced Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="w-5 h-5 text-amber-500" />
                  </div>
                <input
                  type="text"
                    placeholder="Search projects by title, description, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 bg-white font-medium placeholder-gray-500 shadow-sm hover:shadow-md transition-all"
                />
              </div>

                {/* Filter Dropdown */}
              <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Filter className="w-5 h-5 text-amber-500" />
                  </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-12 pr-8 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer min-w-[180px]"
                    style={{ backgroundImage: 'none' }}
                >
                  {categories.map(category => (
                      <option key={category} value={category} className="text-gray-900 bg-white">
                        {category === 'All' ? '📋 All Categories' : `🔹 ${category}`}
                      </option>
                  ))}
                </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(searchTerm || filterCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategory('All');
                    }}
                    className="px-4 py-3 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors font-medium whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Search Results Info */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Total: <span className="font-bold text-amber-600">{projects.length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Showing: <span className="font-bold text-blue-600">{filteredProjects.length}</span>
                  </span>
                </div>
                {filterCategory !== 'All' && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Category: <span className="font-bold text-green-600">{filterCategory}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-blue-600">Total Projects</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{projects.filter(p => p.featured).length}</div>
                <div className="text-sm text-green-600">Featured</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
                <div className="text-sm text-purple-600">Categories</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">
                  {projects.length > 0 ? (projects.reduce((sum, p) => sum + p.stats.rating, 0) / projects.length).toFixed(1) : '0'}
                </div>
                <div className="text-sm text-amber-600">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                      placeholder="Enter project title..."
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-10 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 font-medium shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
                      style={{ backgroundImage: 'none' }}
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category} className="text-gray-900 bg-white">
                          {getCategoryDisplayName(category)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-7">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all resize-y"
                    placeholder="Describe your project in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, MongoDB, Express.js"
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                      placeholder="https://project-demo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Link</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Users</label>
                    <input
                      type="text"
                      name="users"
                      value={formData.users}
                      onChange={handleInputChange}
                      placeholder="500+"
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                      placeholder="4.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Completion Year</label>
                    <input
                      type="text"
                      name="completion"
                      value={formData.completion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm hover:shadow-md transition-all"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="flex items-center p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-amber-600 bg-white border-2 border-amber-300 rounded focus:ring-4 focus:ring-amber-500/20 cursor-pointer"
                  />
                  <label className="ml-3 text-sm font-semibold text-amber-700 cursor-pointer" onClick={() => setFormData(prev => ({...prev, featured: !prev.featured}))}>
                    ⭐ Featured Project
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading}
                    className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {(createProjectMutation.isLoading || updateProjectMutation.isLoading) ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{editingProject ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <span>{editingProject ? '✏️ Update Project' : '✨ Add Project'}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProject(null);
                      setFormData({
                        title: '',
                        description: '',
        category: 'web-development',
                        technologies: '',
                        link: '',
                        github: '',
                        featured: false,
                        users: '',
                        rating: '',
                        completion: new Date().getFullYear().toString()
                      });
                    }}
                    className="flex-1 sm:flex-none px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-300 border-2 border-gray-300 hover:border-gray-400"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const CategoryIcon = getCategoryIcon(project.category);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                      <CategoryIcon className="w-16 h-16 text-amber-600" />
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-medium rounded-full">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg transition-colors duration-200"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-amber-600 font-medium">{project.category}</span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-amber-500 mr-1" />
                        {project.stats.rating}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.stats.users}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.stats.completion}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
                          >
                            <Github className="w-4 h-4 text-gray-600" />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-amber-100 hover:bg-amber-200 rounded transition-colors duration-200"
                          >
                            <ExternalLink className="w-4 h-4 text-amber-600" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPortfolio;
