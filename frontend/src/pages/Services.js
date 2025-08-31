import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Smartphone, 
  Database, 
  Headphones, 
  GraduationCap, 
  Code,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Zap
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Full-stack web applications using React, Node.js, Python, and modern frameworks. From simple websites to complex enterprise solutions.',
      technologies: ['React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL'],
      features: [
        'Responsive web design',
        'E-commerce platforms',
        'Content management systems',
        'Progressive web apps (PWA)',
        'RESTful API development',
        'Database design & optimization'
      ],
      price: 'From KES 150,000',
      duration: '2-8 weeks',
      rating: 4.9
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.',
      technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
      features: [
        'Cross-platform development',
        'Native iOS & Android apps',
        'App Store optimization',
        'Push notifications',
        'Offline functionality',
        'App analytics integration'
      ],
      price: 'From KES 200,000',
      duration: '4-12 weeks',
      rating: 4.8
    },
    {
      icon: Database,
      title: 'Database Integration',
      description: 'Seamless database integration and management solutions for your business applications and systems.',
      technologies: ['MongoDB', 'PostgreSQL', 'Firebase', 'AWS RDS'],
      features: [
        'Database design & architecture',
        'Data migration services',
        'API integration',
        'Real-time synchronization',
        'Performance optimization',
        'Backup & security'
      ],
      price: 'From KES 80,000',
      duration: '1-4 weeks',
      rating: 4.9
    },
    {
      icon: Headphones,
      title: 'Virtual Assistance',
      description: 'Professional virtual assistance services including administrative support, data entry, research, and digital task management.',
      technologies: ['Admin Tools', 'CRM Systems', 'Automation', 'Analytics'],
      features: [
        'Administrative support',
        'Data entry & management',
        'Research & analysis',
        'Digital task automation',
        'Customer service support',
        'Project coordination'
      ],
      price: 'From KES 45,000/month',
      duration: 'Ongoing',
      rating: 4.7
    },
    {
      icon: GraduationCap,
      title: 'Educational Support',
      description: 'Learning-focused mentorship and guidance for students. We provide tutoring, concept explanation, and help students understand programming fundamentals.',
      technologies: ['Programming Tutoring', 'Code Review', 'Concept Teaching', 'Study Guidance'],
      features: [
        'Programming concepts tutoring',
        'Code review & feedback',
        'Technical mentorship',
        'Career guidance',
        'Study plan development',
        'Interview preparation'
      ],
      price: 'From KES 3,000/hour',
      duration: 'Flexible',
      rating: 4.8
    },
    {
      icon: Code,
      title: 'Digital Solutions',
      description: 'Complete digital transformation services including custom software, automation tools, and system integrations for modern businesses.',
      technologies: ['Custom Software', 'Automation', 'System Integration', 'Digital Strategy'],
      features: [
        'Business process automation',
        'System integrations',
        'Legacy system modernization',
        'Custom reporting tools',
        'Workflow optimization',
        'Digital transformation strategy'
      ],
      price: 'From KES 300,000',
      duration: '6-16 weeks',
      rating: 4.9
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We start by understanding your business needs, goals, and technical requirements through detailed consultation.',
      icon: Users
    },
    {
      step: '02',
      title: 'Design & Development',
      description: 'Our expert team creates wireframes, designs, and develops your solution using industry best practices.',
      icon: Code
    },
    {
      step: '03',
      title: 'Testing & Quality Assurance',
      description: 'Rigorous testing ensures your solution is bug-free, secure, and performs optimally across all platforms.',
      icon: Award
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'We deploy your solution and provide ongoing support, maintenance, and optimization services.',
      icon: Zap
    }
  ];

  return (
    <>
      <SEOHead 
        title="Professional Software Development Services | EpicEdge Creative"
        description="Expert web development, mobile apps, database integration, virtual assistance, and digital solutions. Professional software engineering services in Kenya with competitive pricing."
        keywords="web development, mobile apps, database integration, virtual assistance, software development Kenya, digital solutions"
        canonicalUrl="https://epicedgecreative.com/services"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-20 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Subtle Floating Icons */}
            <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: '0s' }}>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm opacity-40">
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="absolute top-32 right-16 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center opacity-50">
                <Smartphone className="w-3 h-3 text-amber-400" />
              </div>
            </div>
            <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
              <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center opacity-30">
                <Database className="w-3 h-3 text-gray-500" />
              </div>
            </div>



            {/* Subtle Geometric Shapes */}
            <div className="absolute top-24 left-1/4" style={{ animationDelay: '0s' }}>
              <div className="w-3 h-3 bg-amber-200 rounded-full opacity-10"></div>
              </div>
            <div className="absolute bottom-20 right-1/3" style={{ animationDelay: '1s' }}>
              <div className="w-2 h-2 bg-gray-300 transform rotate-45 opacity-15"></div>
            </div>
            <div className="absolute top-40 right-1/4">
              <div className="w-2 h-2 bg-amber-300 rounded-full opacity-20"></div>
            </div>







          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Star className="w-4 h-4 mr-2" />
                Professional Digital Services
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
                Transform Your Ideas Into
                <span className="block bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Digital Reality
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                From web applications to mobile apps, database solutions to virtual assistance - 
                we deliver comprehensive digital services that drive your business forward.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center px-6 py-3 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-medium rounded-lg transition-all duration-300"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Professional Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive digital solutions designed to meet your business needs and exceed your expectations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    {/* Service Header */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex items-center bg-amber-50 px-1.5 py-0.5 rounded-full">
                          <Star className="w-2.5 h-2.5 text-amber-500 mr-0.5" />
                          <span className="text-xs font-semibold text-amber-700">{service.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-amber-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                        {service.description}
                      </p>

                      {/* Technologies */}
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold text-gray-900 mb-1 uppercase tracking-wider">Technologies</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.technologies.slice(0, 3).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {service.technologies.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                              +{service.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Key Features - Limited */}
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold text-gray-900 mb-1 uppercase tracking-wider">Key Features</h4>
                        <ul className="space-y-0.5">
                          {service.features.slice(0, 2).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-xs text-gray-600">
                              <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {service.features.length > 2 && (
                            <li className="text-xs text-amber-600 font-medium">
                              +{service.features.length - 2} more features...
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Price and CTA */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm font-bold text-gray-900">{service.price}</div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="w-2.5 h-2.5 mr-0.5" />
                              {service.duration}
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/contact"
                          className="w-full inline-flex items-center justify-center px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg text-xs transition-all duration-300"
                        >
                          Get Quote
                          <ArrowRight className="ml-1 w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Development Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A proven methodology that ensures quality, efficiency, and client satisfaction at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compact CTA Section */}
        <section className="py-12 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-base text-amber-100 mb-6 leading-relaxed">
              Let's discuss your project and create a digital solution that drives growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-white text-amber-600 hover:bg-gray-50 font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-amber-600 font-medium rounded-lg transition-all duration-300"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;
