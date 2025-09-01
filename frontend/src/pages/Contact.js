import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  CheckCircle,
  Calendar,
  Download,
  FileText,
  Users,
  Zap,
  Globe,
  Star,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/common/SEOHead';
import OnlineStatusBar from '../components/common/OnlineStatusBar';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [responseTime, setResponseTime] = useState('2-4');
  const [projectEstimate, setProjectEstimate] = useState(null);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackRequest, setCallbackRequest] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Live clock and status updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Update response time based on business hours (Mon-Fri 9 AM - 6 PM EAT)
      const hour = now.getHours();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      const isBusinessHours = hour >= 9 && hour <= 18;
      
      if (isWeekday && isBusinessHours) {
        setResponseTime('2-4');
        setIsOnline(true);
      } else {
        setResponseTime('6-8');
        setIsOnline(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotating testimonials
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(testimonialTimer);
  }, []);

  // Interactive data
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Tech Startup",
      message: "EpicEdge Creative delivered our website ahead of schedule. Their communication was excellent throughout!",
      rating: 5,
      project: "E-commerce Website"
    },
    {
      name: "James Kiprotich",
      company: "Digital Agency",
      message: "Professional, reliable, and creative. They understood our vision perfectly and brought it to life.",
      rating: 5,
      project: "Brand Identity"
    },
    {
      name: "Grace Wanjiku",
      company: "Local Business",
      message: "Best decision we made was working with EpicEdge. Our online presence has never been stronger!",
      rating: 5,
      project: "Business Website"
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "Schedule Call",
      description: "Book a callback or call now",
      action: () => setShowCallbackModal(true),
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "View Portfolio",
      description: "See our latest projects",
      action: () => window.open('/portfolio', '_blank'),
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: FileText,
      title: "Get Quote",
      description: "Instant project estimate",
      action: () => document.getElementById('project-estimator').scrollIntoView({ behavior: 'smooth' }),
      color: "from-amber-500 to-yellow-600"
    },
    {
      icon: PlayCircle,
      title: "Watch Demo",
      description: "See our process",
      action: () => toast.success('Demo video coming soon!'),
      color: "from-purple-500 to-pink-600"
    }
  ];

  const projectTypes = [
    { name: 'Simple Website', basePrice: 50000, duration: '1-2 weeks' },
    { name: 'E-commerce Store', basePrice: 150000, duration: '3-4 weeks' },
    { name: 'Web Application', basePrice: 300000, duration: '6-8 weeks' },
    { name: 'Mobile App', basePrice: 400000, duration: '8-12 weeks' }
  ];

  const calculateEstimate = (projectType, features = 1) => {
    const base = projectTypes.find(p => p.name === projectType);
    if (!base) return null;
    
    const estimate = base.basePrice * features;
    return {
      ...base,
      estimatedPrice: estimate,
      priceRange: `KES ${(estimate * 0.8).toLocaleString()} - ${(estimate * 1.2).toLocaleString()}`
    };
  };

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Submit contact form
      const contactResponse = await axios.post('/api/contact', {
        firstName: callbackRequest.name.split(' ')[0] || callbackRequest.name,
        lastName: callbackRequest.name.split(' ').slice(1).join(' ') || 'N/A',
        email: callbackRequest.email,
        phone: callbackRequest.phone,
        subject: 'callback-request',
        message: `CALLBACK REQUEST:
Name: ${callbackRequest.name}
Email: ${callbackRequest.email}
Phone: ${callbackRequest.phone}
Preferred Date: ${callbackRequest.preferredDate}
Preferred Time: ${callbackRequest.preferredTime}
Message: ${callbackRequest.message || 'No additional message'}`
      });
      
      if (contactResponse.data.success) {
        // Send notification to admin about the callback request
        try {
          await axios.post('/api/notifications/callback', {
            title: '📞 Urgent Callback Request',
            message: `New callback request from ${callbackRequest.name} (${callbackRequest.email} | ${callbackRequest.phone}). Preferred time: ${callbackRequest.preferredDate} at ${callbackRequest.preferredTime}`,
            type: 'callback',
            priority: 'high'
          });
        } catch (notificationError) {
          console.warn('Failed to send admin notification:', notificationError);
          // Don't fail the main request if notification fails
        }
        
        toast.success('Callback request sent! We\'ll call you at your preferred time.');
        setShowCallbackModal(false);
        setCallbackRequest({
          name: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Callback request error:', error);
      toast.error('Failed to send callback request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/contact', data);
      
      if (response.data.success) {
        setIsSubmitted(true);
        reset();
        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+254 787 205 456',
      description: 'Call us during business hours',
      href: 'tel:+254787205456'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'epicedgecreative@gmail.com',
      description: 'We respond within 24 hours',
      href: 'mailto:epicedgecreative@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Nairobi, Kenya',
      description: 'East Africa Hub',
      href: null
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Fri: 9AM - 6PM',
      description: 'EAT (GMT+3)',
      href: null
    }
  ];

  const faqs = [
    {
      question: 'How quickly can you start working on my project?',
      answer: 'We typically begin new projects within 24-48 hours of finalizing the requirements. For urgent projects, we can often start the same day. Our team will schedule a discovery call to understand your needs and provide a clear timeline.'
    },
    {
      question: 'What services do you offer exactly?',
      answer: 'We specialize in three main areas: Web Development (full-stack applications, websites, e-commerce), Virtual Assistance (administrative support, data management, customer service), and Educational Support (mentorship, project guidance, technical consultation for students).'
    },
    {
      question: 'Do you work with international clients?',
      answer: 'Absolutely! While we\'re based in Nairobi, Kenya, we work with clients globally. We\'re experienced in remote collaboration and can accommodate different time zones for meetings and communication.'
    },
    {
      question: 'What are your pricing models?',
      answer: 'Our pricing varies by service type and project complexity. We offer both fixed-price packages for standard services and hourly rates for custom work. Contact us for a detailed quote tailored to your specific needs.'
    },
    {
      question: 'Do you provide ongoing support after project completion?',
      answer: 'Yes! We believe in long-term partnerships. We offer maintenance packages, technical support, and are always available to help with updates, improvements, or new features as your business grows.'
    }
  ];

  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact EpicEdge Creative",
    "description": "Get in touch with EpicEdge Creative for project management solutions. Call +254787205456 or email epicedgecreative@gmail.com",
    "mainEntity": {
      "@type": "Organization",
      "name": "EpicEdge Creative",
      "telephone": "+254787205456",
      "email": "epicedgecreative@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressCountry": "Kenya"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+254787205456",
        "contactType": "Customer Service",
        "email": "epicedgecreative@gmail.com",
        "availableLanguage": "English",
        "hoursAvailable": "Mo-Fr 09:00-18:00"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Contact EpicEdge Creative - Get in Touch | Web Development & Digital Solutions"
        description="Contact EpicEdge Creative for web development, virtual assistance, and digital solutions. Call 0787205456 or email epicedgecreative@gmail.com. Based in Nairobi, Kenya."
        keywords="contact EpicEdge Creative, web development contact, digital solutions contact, Nairobi contact, Kenya creative agency, 0787205456, epicedgecreative@gmail.com"
        url="/contact"
        structuredData={contactStructuredData}
      />
      
      {/* Online Status Bar */}
      <OnlineStatusBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-32 min-h-screen flex items-center">
        {/* Complex Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated mesh gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-yellow-100/20 to-orange-100/30 animate-pulse"></div>
          
          {/* Large floating orbs with glow effect */}
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-10 blur-3xl animate-float"></div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-15 blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Floating tech elements */}
          <div className="absolute top-20 left-16 opacity-30 animate-float-orbit" style={{ animationDelay: '1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute bottom-24 right-20 opacity-35 animate-float-drift" style={{ animationDelay: '3s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Phone className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="absolute top-1/3 right-1/4 opacity-40 animate-float-swing" style={{ animationDelay: '2s' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Geometric network connections */}
          <div className="absolute top-1/4 left-1/4 w-1 h-32 bg-gradient-to-b from-amber-300 to-transparent opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-1 bg-gradient-to-r from-blue-300 to-transparent opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Particle system */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-20 animate-float-random"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Logo with enhanced animation */}
            <div className="mb-12 animate-fade-in">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
                <img 
                  src="/logo.png" 
                  alt="EpicEdge Creative" 
                  className="relative mx-auto h-32 md:h-40 w-auto drop-shadow-2xl hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Enhanced title with typewriter effect */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 animate-slide-up">
                Let's{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent animate-glow">
                    Create
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg blur opacity-20 animate-pulse"></div>
                </span>
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Something Amazing Together
              </h2>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.4s' }}>
              From stunning websites to seamless virtual assistance, we turn your digital dreams into reality. 
              Ready to make your mark in the digital world?
            </p>

            {/* Interactive CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <a
                href="#contact-form"
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <MessageSquare className="w-6 h-6" />
                  Start Your Project
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </span>
              </a>
              <a
                href="tel:+254787205456"
                className="group px-8 py-4 border-3 border-amber-500 text-amber-600 font-bold rounded-2xl hover:bg-amber-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6 group-hover:animate-bounce" />
                Call Us Now
              </a>
            </div>

            {/* Enhanced stats with counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">24hr</div>
                <div className="text-gray-600 font-semibold">Response Time</div>
              </div>
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">100+</div>
                <div className="text-gray-600 font-semibold">Happy Clients</div>
              </div>
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">Global</div>
                <div className="text-gray-600 font-semibold">From Nairobi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-amber-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Interactive Status Bar */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Live Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {isOnline ? 'Online Now' : 'Offline'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Response time: <span className="font-semibold text-amber-600">{responseTime} hours</span>
              </div>
            </div>

            {/* Live Clock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Nairobi Time:</span>
                <span className="font-mono text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', { 
                    timeZone: 'Africa/Nairobi',
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>100+ Projects</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>4+ Years</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600">
              Choose how you'd like to connect with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
                >
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                    <div className="flex items-center text-amber-600 text-sm font-medium">
                      <span>Let's go</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real feedback from real projects
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 border border-amber-200">
              <div className="flex items-center mb-6">
                <div className="flex gap-1">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {testimonials[activeTestimonial].project}
                </span>
              </div>
              
              <blockquote className="text-lg text-gray-800 leading-relaxed mb-6">
                "{testimonials[activeTestimonial].message}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[activeTestimonial].company}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        index === activeTestimonial ? 'bg-amber-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Estimator Tool */}
      <section id="project-estimator" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Project Estimate
            </h2>
            <p className="text-lg text-gray-600">
              Get an instant estimate for your project
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Project Type
                </label>
                <div className="space-y-3">
                  {projectTypes.map((type, index) => (
                    <button
                      key={index}
                      onClick={() => setProjectEstimate(calculateEstimate(type.name))}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        projectEstimate?.name === type.name
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-600">
                        From KES {type.basePrice.toLocaleString()} • {type.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {projectEstimate ? (
                  <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Your Estimate</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-amber-100 text-sm">Project Type</div>
                        <div className="font-semibold">{projectEstimate.name}</div>
                      </div>
                      <div>
                        <div className="text-amber-100 text-sm">Estimated Price Range</div>
                        <div className="font-bold text-xl">{projectEstimate.priceRange}</div>
                      </div>
                      <div>
                        <div className="text-amber-100 text-sm">Timeline</div>
                        <div className="font-semibold">{projectEstimate.duration}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                      className="w-full mt-6 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Get Detailed Quote
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Select a project type to see your estimate
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section id="contact-form" className="py-32 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/50 relative overflow-hidden">
        {/* Advanced Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Moving gradient mesh */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-100/20 via-transparent to-blue-100/20 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-yellow-100/30 to-transparent animate-float"></div>
          </div>
          
          {/* Dynamic geometric shapes */}
          <div className="absolute top-20 right-16 w-32 h-32 border-2 border-amber-300/30 rounded-2xl animate-spin-slow transform rotate-12"></div>
          <div className="absolute bottom-24 left-20 w-24 h-24 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full animate-float-drift"></div>
          <div className="absolute top-1/2 left-12 w-16 h-16 bg-gradient-to-br from-green-300/25 to-emerald-300/25 transform rotate-45 animate-float-swing"></div>
          
          {/* Network connection lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,50 100,0" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-500 animate-draw-line" />
            <path d="M0,100 Q50,50 100,100" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-500 animate-draw-line" style={{ animationDelay: '2s' }} />
          </svg>
          
          {/* Floating contact elements */}
          <div className="absolute top-32 right-32 opacity-20 animate-float-orbit" style={{ animationDelay: '1s' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="absolute bottom-32 left-32 opacity-25 animate-float-drift" style={{ animationDelay: '3s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-block p-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Connect?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose your preferred way to reach out. We're here to turn your ideas into digital reality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Information */}
            <div className="animate-slide-up">
              <div className="mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Let's Start Building
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Every great project starts with a conversation. Whether you're launching a startup, 
                  scaling your business, or need reliable virtual support, we're here to make it happen.
                </p>
                
                {/* Quick response guarantee */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Fast Response Guarantee</h4>
                      <p className="text-gray-600 text-sm">We respond to all inquiries within 24 hours, usually much sooner!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  const gradients = [
                    'from-amber-500 to-yellow-600',
                    'from-blue-500 to-cyan-600',
                    'from-green-500 to-emerald-600',
                    'from-purple-500 to-pink-600'
                  ];
                  
                  const content = (
                    <div className="relative overflow-hidden">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                            {info.title}
                          </h4>
                          <p className="text-gray-800 font-semibold text-lg mb-2">
                            {info.value}
                          </p>
                          <p className="text-gray-600 leading-relaxed">
                            {info.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
                    </div>
                  );

                  return (
                    <div key={index} className="group animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="block p-8 rounded-3xl bg-white border border-gray-200 hover:border-amber-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-lg relative overflow-hidden">
                          {content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Social/Contact CTA */}
              <div className="mt-16 relative animate-slide-up" style={{ animationDelay: '0.8s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-3xl p-8 text-white overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 border border-white rounded-full animate-spin-slow"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full opacity-20 animate-float"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Prefer a Quick Chat?</h3>
                    </div>
                    <p className="text-amber-100 mb-6 text-lg leading-relaxed">
                      Sometimes a conversation is worth a thousand emails. Let's discuss your project over a call!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="tel:+254787205456"
                        className="group inline-flex items-center justify-center px-8 py-4 bg-white text-amber-600 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Phone className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                        Call Now
                      </a>
                      <a
                        href="https://wa.me/254787205456"
                        className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-amber-600 transition-all duration-300 transform hover:scale-105"
                      >
                        <MessageSquare className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Contact Form */}
            <div className="relative animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                {/* Compact Form header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Send us a Message
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                {isSubmitted && (
                  <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center animate-fade-in">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">Message sent successfully!</p>
                      <p className="text-sm text-green-600">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        {...register('firstName', {
                          required: 'First name is required'
                        })}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        {...register('lastName', {
                          required: 'Last name is required'
                        })}
                        type="text"
                        className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      type="email"
                      className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      {...register('subject', {
                        required: 'Please select a subject'
                      })}
                      className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option value="web-development">Web Development</option>
                      <option value="virtual-assistance">Virtual Assistance</option>
                      <option value="educational-support">Educational Support</option>
                      <option value="general">General Inquiry</option>
                      <option value="pricing">Pricing Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      {...register('message', {
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters'
                        }
                      })}
                      className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-vertical min-h-[80px]"
                      rows={3}
                      placeholder="Tell us about your project..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner className="w-4 h-4" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 relative overflow-hidden">
        {/* Advanced Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large decorative elements */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-amber-300/10 to-yellow-400/15 rounded-full blur-2xl animate-float-drift" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 right-24 w-32 h-32 bg-gradient-to-br from-blue-300/15 to-cyan-400/20 rounded-full blur-xl animate-float-swing" style={{ animationDelay: '3s' }}></div>
          
          {/* Geometric patterns */}
          <div className="absolute top-1/3 right-16 w-24 h-24 border-2 border-amber-300/20 rounded-2xl rotate-12 animate-spin-slow"></div>
          <div className="absolute bottom-1/4 left-16 w-16 h-16 bg-gradient-to-br from-green-300/20 to-emerald-400/25 transform rotate-45 animate-float-orbit"></div>
          
          {/* Question mark particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-amber-400/20 text-2xl font-bold animate-float-random"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            >
              ?
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl mb-8">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">
              Got{' '}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Questions?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've compiled answers to the most common questions about our services. 
              Still curious? We're just a message away!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl hover:border-amber-300/50 transition-all duration-500 transform hover:-translate-y-2 animate-slide-up relative overflow-hidden" 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white text-lg font-black">Q</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-amber-700 transition-colors duration-300">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '1s' }}>
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl blur-2xl opacity-20"></div>
              
              <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-3xl p-12 text-white overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-6 right-6 w-24 h-24 border-2 border-white rounded-full animate-spin-slow"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 bg-white/20 rounded-full animate-float"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full animate-pulse"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Still Have Questions?
                  </h3>
                  <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Don't let questions hold you back from your next big project. 
                    Our team is ready to provide personalized answers and guidance.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <a
                      href="mailto:epicedgecreative@gmail.com"
                      className="group inline-flex items-center justify-center px-8 py-4 bg-white text-amber-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      <Mail className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                      Email Your Questions
                    </a>
                    <a
                      href="tel:+254787205456"
                      className="group inline-flex items-center justify-center px-8 py-4 border-3 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-amber-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <Phone className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                      Call & Discuss
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Callback Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl transform animate-scale-in">
            {/* Header */}
            <div className="text-center mb-5">
              <button
                onClick={() => setShowCallbackModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
              
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Schedule a Call</h3>
              <p className="text-gray-600 text-sm">Choose your preferred option</p>
            </div>

            {/* Quick Call Option */}
            <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800 text-sm">Call Now</h4>
                  <p className="text-green-600 text-xs">Immediate support</p>
                </div>
                <button
                  onClick={() => {
                    window.location.href = 'tel:+254787205456';
                    setShowCallbackModal(false);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Now
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-gray-500 text-xs">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Schedule Form */}
            <form onSubmit={handleCallbackSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={callbackRequest.name}
                  onChange={(e) => setCallbackRequest({...callbackRequest, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900"
                  placeholder="Your name"
                  style={{ color: '#111827' }}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={callbackRequest.email}
                  onChange={(e) => setCallbackRequest({...callbackRequest, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900"
                  placeholder="your@email.com"
                  style={{ color: '#111827' }}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={callbackRequest.phone}
                  onChange={(e) => setCallbackRequest({...callbackRequest, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900"
                  placeholder="+254 xxx xxx"
                  style={{ color: '#111827' }}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">📅 Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={callbackRequest.preferredDate}
                    onChange={(e) => setCallbackRequest({...callbackRequest, preferredDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900"
                    min={new Date().toISOString().split('T')[0]}
                    style={{ colorScheme: 'light', color: '#111827' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">🕐 Preferred Time *</label>
                  <select
                    required
                    value={callbackRequest.preferredTime}
                    onChange={(e) => setCallbackRequest({...callbackRequest, preferredTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white appearance-none text-gray-900"
                    style={{ 
                      color: '#111827',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="" style={{ color: '#6b7280' }}>Select time</option>
                    <option value="09:00" style={{ color: '#111827' }}>9:00 AM</option>
                    <option value="10:00" style={{ color: '#111827' }}>10:00 AM</option>
                    <option value="11:00" style={{ color: '#111827' }}>11:00 AM</option>
                    <option value="12:00" style={{ color: '#111827' }}>12:00 PM</option>
                    <option value="13:00" style={{ color: '#111827' }}>1:00 PM</option>
                    <option value="14:00" style={{ color: '#111827' }}>2:00 PM</option>
                    <option value="15:00" style={{ color: '#111827' }}>3:00 PM</option>
                    <option value="16:00" style={{ color: '#111827' }}>4:00 PM</option>
                    <option value="17:00" style={{ color: '#111827' }}>5:00 PM</option>
                    <option value="18:00" style={{ color: '#111827' }}>6:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  value={callbackRequest.message}
                  onChange={(e) => setCallbackRequest({...callbackRequest, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-vertical min-h-[60px] bg-white text-gray-900"
                  placeholder="Brief description..."
                  rows={2}
                  style={{ color: '#111827' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCallbackModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 text-sm font-medium"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="w-3 h-3" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3 h-3" />
                      Schedule Callback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
