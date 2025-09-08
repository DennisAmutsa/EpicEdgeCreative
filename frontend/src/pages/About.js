import React from 'react';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Lightbulb,
  Rocket,
  Shield,
  Code,
  Palette,
  Star,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to deliver digital solutions that push boundaries and exceed expectations.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Eye,
      title: 'Excellence',
      description: 'Every project receives our meticulous attention to detail, ensuring quality that stands the test of time.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Heart,
      title: 'Collaboration',
      description: 'We work closely with our clients as partners, ensuring your vision is brought to life exactly as imagined.',
      color: 'from-red-400 to-red-600'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Trust and dependability are at our core. We deliver on time, every time, with solutions you can count on.',
      color: 'from-amber-400 to-yellow-600'
    }
  ];

  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Full-stack web applications using modern technologies like React, Node.js, and MongoDB.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'Virtual Assistance',
      description: 'Professional virtual assistance services to help streamline your business operations.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Educational Support',
      description: 'Mentorship and guidance for students in technology and software development projects.',
      color: 'from-amber-500 to-yellow-500'
    }
  ];

  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About EpicEdge Creative",
    "description": "Learn about EpicEdge Creative's mission to empower creative agencies with design, code, and care. Our story of innovation and dedication to excellence.",
    "mainEntity": {
      "@type": "Organization",
      "name": "EpicEdge Creative",
      "foundingDate": "2023",
      "description": "Creative agency project management platform empowering brands with design, code, and care",
      "knowsAbout": [
        "Project Management",
        "Creative Agency Services", 
        "Web Development",
        "Digital Design",
        "Client Collaboration"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="About EpicEdge Creative - Our Story | Design, Code & Care"
        description="Learn about EpicEdge Creative's mission to deliver exceptional digital solutions. Discover our story, values, and expertise in web development, virtual assistance, and educational support."
        keywords="about EpicEdge Creative, software development company, web development Kenya, virtual assistance, educational support, Nairobi tech company"
        url="/about"
        structuredData={aboutStructuredData}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large floating orbs */}
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full opacity-20 animate-float"></div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-24 right-16 w-12 h-12 bg-gradient-to-br from-blue-200 to-cyan-300 opacity-25 animate-spin-slow transform rotate-45"></div>
          <div className="absolute bottom-32 left-24 w-8 h-16 bg-gradient-to-br from-green-200 to-emerald-300 opacity-30 animate-wiggle rounded-sm"></div>
          <div className="absolute top-1/3 right-1/4 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-amber-300 opacity-40 animate-float-swing" style={{ animationDelay: '2.3s' }}></div>
          <div className="absolute bottom-1/4 right-12 w-10 h-10 bg-gradient-to-br from-red-200 to-pink-300 opacity-35 animate-float-rotate transform" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          
          {/* Floating icons */}
          <div className="absolute top-16 left-1/3 opacity-20 animate-float-drift" style={{ animationDelay: '1.2s' }}>
            <Code className="w-6 h-6 text-amber-500" />
          </div>
          <div className="absolute bottom-24 right-1/3 opacity-25 animate-bounce-slow" style={{ animationDelay: '3.1s' }}>
            <Lightbulb className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="absolute top-2/3 left-16 opacity-30 animate-float-wiggle" style={{ animationDelay: '0.7s' }}>
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          
          {/* Small animated bubbles */}
          <div className="absolute top-20 left-10 w-8 h-8 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full opacity-40 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-32 right-20 w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full opacity-50 animate-scale-pulse" style={{ animationDelay: '2.5s' }}></div>
          <div className="absolute bottom-40 left-20 w-10 h-10 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full opacity-30 animate-float-drift" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-20 right-40 w-12 h-12 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full opacity-35 animate-float-wiggle" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-60 animate-glow" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-14 h-14 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-full opacity-25 animate-float-swing" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Dotted pattern */}
          <div className="absolute top-8 right-8 grid grid-cols-3 gap-1 opacity-20 animate-glow" style={{ animationDelay: '2.8s' }}>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
          </div>
          
          {/* Wavy lines */}
          <div className="absolute bottom-8 left-8 opacity-15 animate-float-swing" style={{ animationDelay: '1.9s' }}>
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 10 Q10 0 20 10 T40 10" stroke="currentColor" strokeWidth="2" fill="none" className="text-amber-400"/>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <img 
                src="/logo.png" 
                alt="EpicEdge Creative" 
                className="mx-auto h-24 md:h-32 w-auto drop-shadow-lg"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
              About{' '}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                EpicEdge Creative
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Empowering your brand with <span className="font-semibold text-amber-600">design</span>, 
              <span className="font-semibold text-amber-600"> code</span>, and 
              <span className="font-semibold text-amber-600"> care</span>. We deliver exceptional digital solutions 
              that transform businesses and create lasting impact.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-600" />
                <span>0787205456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-600" />
                <span>epicedgecreative@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Creative elements for Our Story */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating bubbles */}
          <div className="absolute top-10 right-10 w-12 h-12 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full opacity-20 animate-float-rotate" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/4 left-8 w-8 h-8 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-30 animate-float-scale" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full opacity-15 animate-spin-slow" style={{ animationDelay: '3s' }}></div>
          
          {/* Floating timeline elements */}
          <div className="absolute top-1/3 left-12 opacity-25 animate-float-drift" style={{ animationDelay: '0.8s' }}>
            <Rocket className="w-6 h-6 text-blue-500" />
          </div>
          <div className="absolute bottom-1/4 right-16 opacity-20 animate-bounce-slow" style={{ animationDelay: '2.4s' }}>
            <Users className="w-7 h-7 text-green-500" />
          </div>
          
          {/* Geometric patterns */}
          <div className="absolute top-16 left-1/4 w-6 h-6 border-2 border-dashed border-blue-300 opacity-30 animate-spin-slow"></div>
          <div className="absolute bottom-32 left-1/3 w-4 h-12 bg-gradient-to-t from-transparent to-green-300 opacity-25 animate-float-swing"></div>
          
          {/* Star shapes */}
          <div className="absolute top-1/2 left-8 opacity-30 animate-glow" style={{ animationDelay: '1.7s' }}>
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          
          {/* Connection lines */}
          <div className="absolute top-1/4 right-1/3 opacity-15 animate-float-drift" style={{ animationDelay: '3.2s' }}>
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
              <path d="M0 15 L15 5 L30 20 L45 10 L60 15" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-blue-400"/>
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Journey Behind EpicEdge Creative
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every great company has a story. Ours began with a laptop, endless nights of coding, 
              and an unshakeable belief that technology should serve humanity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-3xl border border-amber-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">The Spark</h3>
                    <p className="text-amber-600 font-medium">2021 - Where It All Began</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  It started in a small room in Nairobi. Dennis Amutsa, a passionate software engineer, 
                  noticed how many small businesses struggled to get online or manage their operations efficiently. 
                  "Why should amazing digital solutions be available only to big corporations?" he wondered. 
                  That question sparked the birth of EpicEdge Creative.
                </p>
              </div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border border-blue-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">The Growth</h3>
                    <p className="text-blue-600 font-medium">2022-2023 - Building Dreams</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  What began as one person's vision quickly attracted like-minded individuals. 
                  Our team grew from solving friends' business problems to helping startups, 
                  established companies, and students across Kenya. Each project taught us something new, 
                  and every client became part of our extended family.
                </p>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">The Impact</h3>
                    <p className="text-green-600 font-medium">2024-Present - Transforming Lives</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Today, we're proud to have helped over 100 businesses digitize their operations, 
                  supported countless students in their academic projects, and provided virtual assistance 
                  that lets entrepreneurs focus on what they do best. But we're just getting started.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mt-8">
            <div className="animate-slide-up">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-6 h-6 text-red-500 mr-3" />
                  What Drives Us
                </h4>
                <p className="mb-4 text-gray-600 leading-relaxed">
                  We believe that behind every website, every app, every digital solution, 
                  there's a human story. Someone's dream to start a business, a student's 
                  ambition to excel, or an organization's mission to serve better.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  That's why we don't just write code - we craft experiences. We don't just 
                  build websites - we create digital homes for brands. We don't just provide 
                  services - we build lasting partnerships.
                </p>
              </div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-6 rounded-2xl text-white shadow-lg">
                <h4 className="text-xl font-bold mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-3" />
                  Our Promise
                </h4>
                <p>
                  "Every line of code we write, every design we create, every solution we deliver 
                  carries our commitment to excellence and our passion for helping you succeed. 
                  Your success is our success."
                </p>
                <p className="text-sm mt-4 text-amber-100 font-medium">- Dennis Amutsa, Founder</p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="mt-20">
            <div className="grid grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-blue-200">
                <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-700">2021</div>
                <div className="text-sm text-blue-600 font-medium">Founded</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-green-200">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-700">100+</div>
                <div className="text-sm text-green-600 font-medium">Happy Clients</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-amber-200">
                <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-amber-700">100+</div>
                <div className="text-sm text-amber-600 font-medium">Projects Completed</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-red-200">
                <Lightbulb className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-red-700">4+</div>
                <div className="text-sm text-red-600 font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Creative elements for Team section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating tech icons */}
          <div className="absolute top-12 right-16 opacity-20 animate-float-orbit" style={{ animationDelay: '1.1s' }}>
            <Code className="w-8 h-8 text-blue-500" />
          </div>
          <div className="absolute bottom-16 left-12 opacity-25 animate-float-swing" style={{ animationDelay: '2.6s' }}>
            <Palette className="w-6 h-6 text-purple-500" />
          </div>
          <div className="absolute top-1/3 left-20 opacity-30 animate-bounce-slow" style={{ animationDelay: '0.9s' }}>
            <Shield className="w-7 h-7 text-green-500" />
          </div>
          
          {/* Network connections */}
          <div className="absolute top-20 left-1/3 opacity-15 animate-float-drift" style={{ animationDelay: '3.4s' }}>
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
              <circle cx="10" cy="20" r="3" fill="currentColor" className="text-blue-400"/>
              <circle cx="40" cy="10" r="2" fill="currentColor" className="text-green-400"/>
              <circle cx="70" cy="30" r="2.5" fill="currentColor" className="text-amber-400"/>
              <path d="M10 20 Q25 5 40 10 Q55 15 70 30" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className="text-gray-300"/>
            </svg>
          </div>
          
          {/* Hexagon patterns */}
          <div className="absolute bottom-20 right-1/4 opacity-20 animate-spin-slow" style={{ animationDelay: '1.5s' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" className="text-amber-400"/>
            </svg>
          </div>
          
          {/* Floating bubbles */}
          <div className="absolute top-16 left-12 w-10 h-10 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full opacity-25 animate-float-drift" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-1/3 right-20 w-6 h-6 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full opacity-35 animate-scale-pulse" style={{ animationDelay: '2.2s' }}></div>
          <div className="absolute bottom-24 left-1/4 w-14 h-14 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-20 animate-float-orbit" style={{ animationDelay: '1.8s' }}></div>
          
          {/* Light rays */}
          <div className="absolute top-8 right-8 opacity-10 animate-glow" style={{ animationDelay: '4.1s' }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 10 L30 0 M45 15 L53 7 M50 30 L60 30 M45 45 L53 53 M30 50 L30 60 M15 45 L7 53 M10 30 L0 30 M15 15 L7 7" stroke="currentColor" strokeWidth="1" className="text-yellow-400"/>
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet the Minds Behind the Magic
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just developers and designers. We're dreamers, problem-solvers, 
              and your partners in digital transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Founder */}
            <div className="group animate-slide-up">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden rounded-full">
                    <img 
                      src="/DENNIS.jpg" 
                      alt="Dennis Amutsa - Founder & Lead Developer" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Dennis image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                      <span className="text-2xl font-bold text-white">DA</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Dennis Amutsa</h3>
                  <p className="text-amber-600 font-semibold mb-4">Founder & Lead Developer</p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    The visionary behind EpicEdge Creative. With a passion for clean code and 
                    innovative solutions, Dennis turns complex problems into elegant digital experiences.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Code className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Rocket className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Creative Team */}
            <div className="group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden rounded-full">
                    <img 
                      src="/creative.jpg" 
                      alt="Creative Team - Design & Development Specialists" 
                      className="w-full h-full object-contain bg-gray-50"
                      onError={(e) => {
                        console.log('Creative team image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                      <span className="text-2xl font-bold text-white">CT</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Creative Team</h3>
                  <p className="text-blue-600 font-semibold mb-4">Design & Development Specialists</p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Our talented team of designers and developers who work together to create 
                    exceptional digital experiences. They bring creativity, technical expertise, 
                    and innovation to every project.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Palette className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Star className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Team */}
            <div className="group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden rounded-full">
                    <img 
                      src="/support.jpg" 
                      alt="Support Team - Client Success Champions" 
                      className="w-full h-full object-contain bg-gray-50"
                      onError={(e) => {
                        console.log('Support team image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                      <Users className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Support Team</h3>
                  <p className="text-green-600 font-semibold mb-4">Client Success Champions</p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    The caring hands that ensure your journey with us is smooth and successful. 
                    Always ready to help, guide, and support your digital transformation.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mt-20 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl p-8 md:p-12 text-white animate-fade-in">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Fun Facts About Our Team</h3>
              <p className="text-amber-100 text-lg">The human side of EpicEdge Creative</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">10,000+</h4>
                <p className="text-amber-100">Lines of Code Written</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">24/7</h4>
                <p className="text-amber-100">Creative Thinking Mode</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">∞</h4>
                <p className="text-amber-100">Passion for Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Stories Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Floating bubbles for Client Stories */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 left-16 w-9 h-9 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full opacity-30 animate-float" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-1/4 right-12 w-11 h-11 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2.7s' }}></div>
          <div className="absolute bottom-16 left-1/5 w-13 h-13 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
          <div className="absolute top-1/3 left-1/3 w-5 h-5 bg-gradient-to-br from-red-200 to-pink-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '3.8s' }}></div>
          <div className="absolute bottom-1/4 right-20 w-15 h-15 bg-gradient-to-br from-purple-200 to-violet-300 rounded-full opacity-22 animate-bounce" style={{ animationDelay: '1.6s' }}></div>
          <div className="absolute top-40 right-1/4 w-7 h-7 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full opacity-35 animate-pulse" style={{ animationDelay: '4.1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Stories That Inspire Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Behind every project is a success story. Here are a few that make us proud 
              to do what we do every day.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border border-blue-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">The Property Revolution</h3>
                    <p className="text-blue-600 font-medium">Amutsa.com Project</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                  "Dennis and his team didn't just build us a website - they revolutionized 
                  how we manage our rental properties. What used to take hours now takes minutes. 
                  Our tenants love the online portal, and we've seen our efficiency improve by 300%."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">G</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Gloria</p>
                    <p className="text-sm text-blue-600">Property Manager, Herufi Properties</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Healthcare Transformed</h3>
                    <p className="text-green-600 font-medium">Hospital Management System</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                  "The hospital management system has completely transformed our operations. 
                  Patient records are now digital, appointments run smoothly, and our staff 
                  can focus on what matters most - caring for patients."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">Dr</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. James Mwangi</p>
                    <p className="text-sm text-green-600">Hospital Administrator, Hopecare</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Creative elements for Mission & Vision */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mission & Vision themed icons */}
          <div className="absolute top-16 left-16 opacity-20 animate-float-drift" style={{ animationDelay: '1.4s' }}>
            <Target className="w-10 h-10 text-amber-500" />
          </div>
          <div className="absolute top-20 right-20 opacity-25 animate-float-swing" style={{ animationDelay: '2.7s' }}>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
          
          {/* Inspirational elements */}
          <div className="absolute bottom-24 left-20 opacity-30 animate-bounce-slow" style={{ animationDelay: '0.6s' }}>
            <Lightbulb className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="absolute top-1/3 right-16 opacity-25 animate-glow" style={{ animationDelay: '3.8s' }}>
            <Star className="w-7 h-7 text-amber-400" />
          </div>
          
          {/* Abstract patterns */}
          <div className="absolute top-12 left-1/3 opacity-15 animate-spin-slow" style={{ animationDelay: '2.1s' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="text-blue-400"/>
              <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1" className="text-amber-400"/>
              <circle cx="16" cy="16" r="4" fill="currentColor" className="text-green-400"/>
            </svg>
          </div>
          
          {/* Growth arrows */}
          <div className="absolute bottom-16 right-1/4 opacity-20 animate-float-wiggle" style={{ animationDelay: '1.9s' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M10 30 L20 10 L30 30" stroke="currentColor" strokeWidth="2" fill="none" className="text-green-500"/>
              <path d="M15 15 L20 10 L25 15" stroke="currentColor" strokeWidth="2" fill="none" className="text-green-500"/>
            </svg>
          </div>
          
          {/* Floating bubbles */}
          <div className="absolute top-14 right-14 w-12 h-12 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full opacity-25 animate-float" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute top-1/3 left-10 w-8 h-8 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full opacity-30 animate-scale-pulse" style={{ animationDelay: '2.1s' }}></div>
          <div className="absolute bottom-20 right-1/5 w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-20 animate-float-orbit" style={{ animationDelay: '3.4s' }}></div>
          
          {/* Particle trail */}
          <div className="absolute top-8 left-8 opacity-25 animate-float-random" style={{ animationDelay: '4.3s' }}>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The driving forces behind everything we do at EpicEdge Creative
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Mission */}
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-3xl border border-amber-200 shadow-lg h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                    <p className="text-amber-600 font-medium">What We Do Daily</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To empower businesses and individuals with innovative digital solutions that transform 
                  ideas into reality. We believe in the power of <span className="font-semibold text-amber-600">design</span>, 
                  <span className="font-semibold text-amber-600"> code</span>, and <span className="font-semibold text-amber-600">care</span> 
                  to create meaningful impact in the digital world.
                </p>
              </div>
            </div>
            
            {/* Vision */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border border-blue-200 shadow-lg h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                    <p className="text-blue-600 font-medium">Where We're Heading</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To become the leading digital solutions provider in Kenya and across Africa, 
                  known for delivering exceptional quality, innovation, and customer satisfaction. 
                  We envision a future where every business has access to world-class digital tools.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide everything we do and shape how we serve our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>




    </div>
  );
};

export default About;
