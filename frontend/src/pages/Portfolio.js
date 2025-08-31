import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Code,
  Smartphone,
  Globe,
  Database,
  ExternalLink,
  Github,
  Star,
  Calendar,
  Users,
  ArrowRight,
  Zap,
  Award,
  TrendingUp,
  Headphones,
  GraduationCap,
  Search
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Portfolio = () => {
  // Fetch portfolio projects from backend
  const { data: portfolioData, isLoading, error } = useQuery(
    'portfolio-projects',
    () => axios.get('/api/projects/public/portfolio').then(res => res.data.data.projects),
    {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const projects = portfolioData || [];

  // Debug logging
  console.log('Portfolio Debug:', {
    portfolioData,
    projects,
    projectsLength: projects.length,
    isLoading,
    error
  });

  const categories = ['All', 'web-development', 'mobile-app', 'design', 'branding', 'consultation', 'virtual-assistance', 'educational-support'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const projectsPerPage = 4;

  // Filter projects based on category and search term
  const filteredProjects = React.useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title?.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search) ||
        project.technologies?.some(tech => tech.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [projects, selectedCategory, searchTerm]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const featuredProjects = projects.filter(project => project.featured);

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

  if (isLoading) {
    return (
      <LoadingSpinner 
        size="xl" 
        variant="gradient" 
        text="Loading Portfolio Projects" 
        showDots={true}
        fullScreen={true}
      />
    );
  }

  if (error) {
    console.error('Portfolio loading error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Portfolio</h2>
          <p className="text-gray-600 mb-4">There was an error loading our portfolio projects.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  return (
    <>
      <SEOHead 
        title="Portfolio - Our Work | EpicEdge Creative"
        description="Explore our portfolio of successful web development, mobile apps, and digital solutions. See how we've helped businesses transform with innovative technology."
        keywords="portfolio, web development projects, mobile apps, digital solutions, software development examples"
        canonicalUrl="https://epicedgecreative.com/portfolio"
      />
      

      
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-amber-50">
        {/* Clean Hero with Integrated Controls */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our <span className="text-amber-600">Portfolio</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our latest projects and creative solutions
              </p>
            </div>
            
            {/* Integrated Search & Filter Controls */}
            {projects.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-sm"
                    />
                  </div>

                  {/* Category Filter Dropdown */}
                  <div className="relative w-full sm:w-64">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 appearance-none cursor-pointer text-sm"
                    >
                      <option value="All">All Categories</option>
                      {categories.filter(cat => cat !== 'All').map((category) => (
                        <option key={category} value={category}>
                          {getCategoryDisplayName(category)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {(selectedCategory !== 'All' || searchTerm) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchTerm('');
                      }}
                      className="px-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm whitespace-nowrap"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
            </div>
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative">
          {/* Background Decorations */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Visible geometric shapes */}
            <div className="absolute top-20 left-20 w-20 h-20 bg-amber-100 rounded-2xl rotate-12 opacity-40"></div>
            <div className="absolute top-40 right-32 w-16 h-16 bg-yellow-100 rounded-full opacity-50"></div>
            <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-orange-100 rounded-2xl rotate-45 opacity-30"></div>
            <div className="absolute top-1/2 right-20 w-12 h-12 bg-amber-200 rounded-full opacity-60"></div>
            <div className="absolute bottom-20 right-1/4 w-18 h-18 bg-yellow-200 rounded-2xl rotate-12 opacity-40"></div>
            
            {/* Larger background elements */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full opacity-30 blur-sm"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full opacity-25 blur-sm"></div>
            </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {projects.length > 0 ? (
              <>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {currentProjects.map((project) => {
                    const CategoryIcon = getCategoryIcon(project.category);
                    return (
                      <div
                        key={project.id}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 group"
                      >
                        {/* Project Header */}
                        <div className="relative">
                          <div className="h-24 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                            <CategoryIcon className="w-8 h-8 text-amber-600" />
                          </div>
                          {project.featured && (
                            <div className="absolute top-2 right-2">
                              <div className="flex items-center px-1.5 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                                <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                Featured
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Project Content */}
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              {getCategoryDisplayName(project.category)}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <Star className="w-2.5 h-2.5 text-amber-400 mr-0.5 fill-current" />
                              {project.stats.rating}
                            </div>
                          </div>
                          
                          <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-tight group-hover:text-amber-600 transition-colors duration-300">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 mb-3 text-xs leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              {project.stats.users} users
                              </span>
                            <div className="flex gap-1">
                              {project.github && (
                              <a
                                href={project.github}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                                  title="View Code"
                              >
                                  <Github className="w-3.5 h-3.5" />
                              </a>
                              )}
                              {project.link && (
                              <a
                                href={project.link}
                                  className="p-1.5 text-amber-500 hover:text-amber-600 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                                  title="View Live"
                              >
                                  <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-12 space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
                    >
                      Previous
                    </button>
                    
                    <div className="flex space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              currentPage === pageNumber
                                ? 'bg-amber-500 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Portfolio Coming Soon
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  We're currently curating our best projects to showcase here. 
                  Check back soon to see our latest work.
                </p>
                  <Link
                    to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Discuss Your Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
              </div>
            )}
          </div>
        </section>

        
      </div>
    </>
  );
};

export default Portfolio;
