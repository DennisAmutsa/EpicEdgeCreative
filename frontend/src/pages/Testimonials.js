import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Star,
  Quote,
  Filter,
  TrendingUp,
  Users,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Testimonials = () => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch public feedback
  const { data: testimonialData, isLoading } = useQuery(
    ['public-testimonials', categoryFilter, ratingFilter],
    () => {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (ratingFilter) params.append('rating', ratingFilter);
      params.append('limit', '100'); // Get more for client-side pagination
      
      return axios.get(`/api/feedback/public?${params.toString()}`).then(res => res.data.data);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const testimonials = testimonialData?.feedback || [];
  const stats = testimonialData?.stats || { totalFeedback: 0, averageRating: 0 };

  // Client-side pagination
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

  const categories = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-app', label: 'Mobile Apps' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'branding', label: 'Branding' },
    { value: 'consultation', label: 'Consultation' }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Client Testimonials - EpicEdge Creative"
        description="Read what our clients say about our web development, design, and digital marketing services. Real reviews from satisfied customers."
        url="/testimonials"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Quote className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Don't just take our word for it. Here's what real clients have to say about their experience working with EpicEdge Creative.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">100+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">4.9</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Filter Testimonials</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="min-w-0 flex-1 sm:flex-initial">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-48 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium bg-white shadow-sm hover:border-gray-400 transition-colors appearance-none cursor-pointer text-gray-900"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 12px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">All Services</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value} className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="min-w-0 flex-1 sm:flex-initial">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={ratingFilter}
                  onChange={(e) => {
                    setRatingFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-48 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium bg-white shadow-sm hover:border-gray-400 transition-colors appearance-none cursor-pointer text-gray-900"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 12px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">All Ratings</option>
                  <option value="5" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">⭐⭐⭐⭐ 4+ Stars</option>
                  <option value="3" className="py-2 px-4 text-gray-900 bg-white hover:bg-gray-50">⭐⭐⭐ 3+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {paginatedTestimonials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedTestimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {testimonial.title}
                  </h3>
                  
                  {/* Content */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author & Project */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.displayName}
                        </div>
                        {testimonial.companyName && (
                          <div className="text-sm text-gray-600">
                            {testimonial.companyName}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(testimonial.approvedAt)}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full inline-block">
                      {categories.find(c => c.value === testimonial.serviceCategory)?.label || testimonial.serviceCategory}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === index + 1
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Quote className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No testimonials found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {categoryFilter || ratingFilter 
                ? 'No testimonials match your current filters. Try adjusting your selection.' 
                : 'Client testimonials will appear here once approved.'}
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Our Happy Clients?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Let's create something amazing together. Start your project today and see why clients love working with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your Project
            </a>
            <a
              href="/portfolio"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-600 transition-colors"
            >
              View Our Work
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
