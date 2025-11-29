import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Rocket, 
  CheckCircle, 
  Users, 
  Zap, 
  ArrowRight,
  BarChart3,
  Shield,
  Clock,
  Code,
  Smartphone,
  Globe,
  Database,
  Palette,
  Search,
  ExternalLink,
  Headphones,
  GraduationCap,
  Server,
  Star,
  Quote,
  Briefcase,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import OnlineStatusBar from '../components/common/OnlineStatusBar';

const Home = () => {
  const { isAuthenticated } = useAuth();

  // Fetch featured portfolio projects
  const { data: featuredProjects = [], isLoading: portfolioLoading } = useQuery(
    'homepage-featured-projects',
    () => axios.get('/api/projects/public/portfolio?featured=true').then(res => res.data.data.projects),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Full-stack web applications using React, Node.js, Python, and modern frameworks. From simple websites to complex enterprise solutions.',
      technologies: ['React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL']
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile apps for iOS and Android using React Native and Flutter for all business needs.',
      technologies: ['React Native', 'Flutter', 'iOS', 'Android']
    },
    {
      icon: Server,
      title: 'Database Integration',
      description: 'Database design, integration, migration, and optimization. We connect your systems with secure, scalable database solutions.',
      technologies: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'Redis']
    },
    {
      icon: Headphones,
      title: 'Virtual Assistance',
      description: 'Professional virtual assistance services including administrative support, data entry, research, and digital task management.',
      technologies: ['Admin Support', 'Data Entry', 'Research', 'Task Management']
    },
    {
      icon: GraduationCap,
      title: 'Educational Support',
      description: 'Learning-focused mentorship and guidance for students. We provide tutoring, concept explanation, code review feedback, and help students understand programming fundamentals.',
      technologies: ['Programming Tutoring', 'Code Review', 'Concept Teaching', 'Study Guidance']
    },
    {
      icon: Code,
      title: 'Digital Solutions',
      description: 'Complete digital transformation services including custom software, automation tools, and system integrations for modern businesses.',
      technologies: ['Custom Software', 'Automation', 'System Integration', 'Digital Strategy']
    }
  ];

  // Helper function to get category display name
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'web-development': 'Web Development',
      'mobile-app': 'Mobile Development', 
      'design': 'Design',
      'branding': 'Branding',
      'consultation': 'Consultation',
      'virtual-assistance': 'Virtual Assistance',
      'educational-support': 'Educational Support'
    };
    return categoryMap[category] || category;
  };

  const testimonials = [
    {
      name: "Sarah Wanjiku",
      company: "TechStart Solutions",
      role: "CEO",
      rating: 5,
      text: "EpicEdge Creative transformed our business with an incredible web application. Their attention to detail and technical expertise exceeded our expectations. The project was delivered on time and the support has been outstanding.",
      project: "E-commerce Platform Development"
    },
    {
      name: "Michael Mwangi",
      company: "HealthCare Plus",
      role: "CTO", 
      rating: 5,
      text: "Working with EpicEdge Creative was a game-changer for our healthcare management system. They understood our complex requirements and delivered a secure, scalable solution that our staff loves using.",
      project: "Healthcare Management System"
    },
    {
      name: "David Ochieng",
      company: "Smart Retail Kenya",
      role: "Operations Manager",
      rating: 5,
      text: "The mobile app they developed for our retail business has increased our sales by 40%. Their virtual assistance services also helped streamline our operations. Highly professional team!",
      project: "Mobile App & Virtual Assistance"
    },
    {
      name: "Grace Nyokabi",
      company: "University of Nairobi",
      role: "IT Director",
      rating: 5,
      text: "EpicEdge Creative provides excellent programming tutoring and mentorship to our students. They help students understand concepts better and develop their coding skills through guided learning.",
      project: "Educational Tutoring & Mentorship"
    },
    {
      name: "Robert Kimani",
      company: "AgriTech Solutions",
      role: "Founder",
      rating: 5,
      text: "They integrated our farming database systems seamlessly and created a beautiful UI for our farmers. The database integration was complex but they handled it professionally.",
      project: "Database Integration & UI Design"
    },
    {
      name: "Mercy Akinyi",
      company: "Creative Media House",
      role: "Project Manager",
      rating: 5,
      text: "From web development to SEO optimization, EpicEdge Creative delivered everything we needed. Our website traffic increased by 300% after their SEO work. Amazing results!",
      project: "Full Website Development & SEO"
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Project Tracking',
      description: 'Monitor project progress in real-time with detailed analytics and milestone tracking.'
    },
    {
      icon: Users,
      title: 'Client Collaboration',
      description: 'Seamless communication between clients and team members throughout the project lifecycle.'
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Role-based authentication ensures clients see only their projects while admins have full control.'
    },
    {
      icon: Clock,
      title: 'Timeline Management',
      description: 'Keep projects on schedule with deadline tracking and automated progress updates.'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Built with modern technology stack for optimal performance and reliability.'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Comprehensive project review system to ensure deliverables meet the highest standards.'
    }
  ];

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EpicEdge Creative",
    "description": "Empowering your brand with design, code, and care. Professional project management system for creative agencies.",
    "url": "https://epicedgecreative.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://epicedgecreative.com/projects?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EpicEdge Creative",
      "logo": "https://epicedgecreative.com/logo.png"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="EpicEdge Creative - Project Management for Creative Agencies | Design, Code & Care"
        description="Transform your creative agency with EpicEdge Creative's powerful project management system. Track progress, collaborate with clients, and deliver exceptional results. Empowering your brand with design, code, and care."
        keywords="project management, creative agency, design, web development, client collaboration, project tracking, creative services, digital agency, brand empowerment, Nairobi, Kenya, creative project management, agency tools, client portal"
        url="/"
        structuredData={homeStructuredData}
      />
      
      {/* Online Status Bar */}
      <OnlineStatusBar />
      
      {/* Hero Section - Responsive across all platforms */}
      <div className="relative overflow-hidden h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[45vh] xl:h-[50vh]">
        {/* Full-width background image covering entire hero section */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/logo.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        {/* Optional subtle overlay for better logo visibility on smaller screens */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent sm:hidden"></div>
      </div>

      {/* Services Section - Enhanced Styling */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 relative overflow-hidden" aria-labelledby="services-heading">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-100/30 to-yellow-100/30 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-100/30 to-yellow-100/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-8 shadow-xl">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h2 id="services-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Software Company & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">Digital Solutions</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are a comprehensive software engineering company offering web development, mobile apps, 
              database integration, virtual assistance, educational support, and complete digital solutions 
              using cutting-edge technologies and industry best practices.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group relative h-full">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-98 group-hover:scale-100"></div>
                  
                  <div className="relative bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-amber-200 h-full flex flex-col transform group-hover:-translate-y-1">
                    {/* Compact icon */}
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Compact title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    {/* Compact description */}
                    <p className="text-gray-600 mb-3 leading-relaxed flex-grow text-sm">
                      {service.description}
                    </p>
                    
                    {/* Compact technology badges */}
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium border border-amber-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section - Enhanced Styling */}
      <section className="py-20 bg-gradient-to-br from-white via-amber-50/50 to-gray-50 relative overflow-hidden" aria-labelledby="portfolio-heading">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-3xl -translate-x-36"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-tl from-yellow-200/20 to-amber-200/20 rounded-full blur-3xl translate-x-36"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-8 shadow-xl">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h2 id="portfolio-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Our Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">Portfolio</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              See examples of our software engineering projects and the innovative 
              solutions we've built for businesses across various industries.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"></div>
            </div>
          </div>

          {portfolioLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              {/* Modern loading spinner with multiple rings */}
              <div className="relative">
                {/* Outer ring */}
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                {/* Inner ring with gradient */}
                <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-amber-500 border-r-amber-400"></div>
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Loading text with animation */}
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Featured Projects</h3>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 4).map((project, index) => (
              <div key={index} className="group relative h-full">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100"></div>
                
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-amber-200 h-full flex flex-col transform group-hover:-translate-y-2">
                  {/* Compact project header */}
                  <div className="h-32 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 relative overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-8 h-8 bg-amber-300 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute top-8 right-8 w-6 h-6 bg-yellow-400 rounded-full group-hover:scale-125 transition-transform duration-500 delay-100"></div>
                      <div className="absolute bottom-6 left-12 w-4 h-4 bg-amber-400 rounded-full group-hover:scale-110 transition-transform duration-600 delay-200"></div>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <span className="bg-white/90 backdrop-blur-sm text-amber-700 font-medium px-3 py-1 rounded-full text-xs border border-amber-200 shadow-md">
                          {getCategoryDisplayName(project.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed flex-grow text-sm">
                      {project.description}
                    </p>
                    
                                        {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                            className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-medium group-hover:from-amber-100 group-hover:to-yellow-100 group-hover:text-amber-800 transition-all duration-300 border border-gray-200 group-hover:border-amber-200"
                          style={{ transitionDelay: `${techIndex * 50}ms` }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    )}
                  
                    {/* Compact project button */}
                    <div className="flex items-center justify-between">
                      {project.link ? (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm transition-all duration-300"
                        >
                          <span className="border-b border-amber-200 group-hover:border-amber-500 transition-colors duration-300">View Project</span>
                          <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </a>
                      ) : (
                        <button className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm transition-all duration-300 cursor-not-allowed opacity-50">
                          <span className="border-b border-amber-200 group-hover:border-amber-500 transition-colors duration-300">View Project</span>
                          <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      )}
                      
                      {/* Compact status indicator */}
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Projects Yet</h3>
              <p className="text-gray-600 mb-6">Our team is working on amazing projects. Check back soon!</p>
              <Link
                to="/portfolio"
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
          
          {/* Compact CTA */}
          <div className="text-center mt-8">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 text-amber-600 font-medium mb-3">
                <div className="w-8 h-px bg-amber-300"></div>
                <span className="text-sm">Ready to start your project?</span>
                <div className="w-8 h-px bg-amber-300"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                Discuss Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/services"
                className="inline-flex items-center gap-2 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 hover:shadow-md"
              >
                <Briefcase className="w-4 h-4" />
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-yellow-50" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what our satisfied clients have to say 
              about our software engineering services and exceptional project deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative h-full">
                {/* Background gradient that appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-amber-200 h-full flex flex-col">
                  {/* Compact Quote Icon */}
                  <div className="mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Compact Rating Stars */}
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-yellow-400 fill-current mr-1" 
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-500 font-medium">{testimonial.rating}.0</span>
                  </div>
                  
                  {/* Compact Testimonial Text */}
                  <blockquote className="text-gray-700 text-sm leading-relaxed mb-3 flex-grow italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* Compact Project Badge */}
                  <div className="mb-3">
                    <span className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium border border-amber-200">
                      {testimonial.project}
                    </span>
                  </div>
                  
                  {/* Compact Client Info */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-bold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-amber-600 font-medium">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Call to Action */}
          <div className="text-center mt-20">
            <div className="mb-8">
              <div className="inline-flex items-center gap-4 text-amber-600 font-semibold mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
                <span className="text-lg">Ready to join our satisfied clients?</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
              </div>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Experience the same level of excellence and dedicated service that has made our clients successful.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Rocket className="w-6 h-6" />
                Start Your Project Today
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link 
                to="/services" 
                className="inline-flex items-center gap-3 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg"
              >
                <Users className="w-6 h-6" />
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-amber-50" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose EpicEdge Creative?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive approach combines cutting-edge technology with personalized service 
              to deliver exceptional results that drive your business forward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative">
                  {/* Background gradient that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-amber-200 h-full">
                    {/* Icon with animated background */}
                    <div className="mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        {/* Decorative dot */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-200 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-300"></div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-amber-700 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>
                      
                      {/* Decorative bottom border */}
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full group-hover:w-20 transition-all duration-300"></div>
                    </div>
                    
                    {/* Number badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact Bottom CTA */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-amber-600 font-medium mb-3">
              <div className="w-8 h-px bg-amber-300"></div>
              <span className="text-sm">Ready to Experience the Difference?</span>
              <div className="w-8 h-px bg-amber-300"></div>
            </div>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Rocket className="w-4 h-4" />
              Get Started Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">Our Achievement Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-3xl font-bold text-amber-600 mb-2">100+</div>
              <div className="text-gray-600">Projects Delivered</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact CTA Section */}
      {!isAuthenticated && (
        <div className="py-8 bg-gradient-to-r from-amber-500 to-yellow-600">
          <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              Ready to Transform Your Business?
            </h2>
            <p className="text-sm text-amber-100 mb-4">
              Join businesses who trust EpicEdge Creative for exceptional solutions.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-white text-amber-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-base transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Rocket className="w-4 h-4" />
              Start Your Project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
