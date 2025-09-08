import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Code,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Contact', href: '/contact' }
    ],

    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Data Protection', href: '/data-protection' }
    ]
  };

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/company/epicedgecreative', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/5 to-yellow-600/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-500/5 to-yellow-600/5 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
            
            {/* Company Info */}
            <div className="xl:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Code className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">EpicEdge Creative</h3>
                  <p className="text-amber-400 text-xs font-medium">Software Engineering Excellence</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-2 leading-relaxed text-xs">
                Empowering businesses with innovative software solutions.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-1 mb-2">
                <div className="flex items-center gap-2 text-gray-300 text-xs">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>+254787205456</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-xs">
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>epicedgecreative@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-xs">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-6 h-6 bg-gray-800 hover:bg-gradient-to-br hover:from-amber-500 hover:to-yellow-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                    >
                      <Icon className="w-2.5 h-2.5" />
                    </a>
                  );
                })}
              </div>
            </div>
            

            
            {/* Company */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2 relative">
                Company
                <div className="absolute -bottom-1 left-0 w-4 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600"></div>
              </h4>
              <ul className="flex flex-wrap gap-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 group text-xs whitespace-nowrap"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
        

        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="text-gray-300 text-xs">
                <p>© {currentYear} EpicEdge Creative. All rights reserved.</p>
              </div>
              
              <div className="flex gap-4 text-xs">
                {footerLinks.legal.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
