import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  Menu as MenuIcon,
  X,
  Home,
  Briefcase,
  Book,
  Mail,
  LogIn,
  User,
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
  UserPlus,
  FileText,
  Palette,
  Edit
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Portfolio', href: '/portfolio', icon: Palette },
    { name: 'About', href: '/about', icon: Book },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
  ];

  const adminNavigation = [
    { name: 'Users', href: '/admin-users', icon: UserPlus },
    { name: 'All Projects', href: '/admin-projects', icon: FileText },
    { name: 'Portfolio', href: '/admin-portfolio', icon: Palette },
    { name: 'Create Project', href: '/create-project', icon: Edit },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/logo.png" 
                  alt="EpicEdge Creative" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-lg font-bold text-white hidden">EC</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  EpicEdge Creative
                </div>
                <div className="text-xs text-gray-600 -mt-1">Digital Solutions</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? 'text-amber-600 font-semibold'
                    : 'text-gray-700 hover:text-amber-600'
                } px-3 py-2 text-sm font-medium transition-colors duration-200 relative group`}
              >
                {item.name}
                <span className={`${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                } absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-300`}></span>
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {/* User Navigation */}
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'text-amber-600 font-semibold'
                        : 'text-gray-700 hover:text-amber-600'
                    } px-3 py-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Admin Navigation */}
                {isAdmin && adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-700 hover:text-red-600'
                    } px-3 py-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* User Profile and Logout */}
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-amber-700 px-4 py-2 text-sm font-medium transition-all duration-300 border border-gray-300 hover:border-amber-400 rounded-lg hover:bg-amber-50"
                >
                  Client Portal
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Quote
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[9999] bg-black bg-opacity-50" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Menu Panel */}
          <div 
            className="fixed top-0 right-0 h-auto max-h-[80vh] w-56 bg-white shadow-2xl rounded-bl-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-yellow-600">
              <div>
                <h3 className="text-lg font-bold text-white">Menu</h3>
                <p className="text-xs text-amber-100">Navigate EpicEdge</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            
            {/* Menu Content */}
            <div className="p-4 bg-white">
              {/* Navigation Links */}
              <div className="space-y-2">
                <a
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-800 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Home</span>
                </a>
                <a
                  href="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-800 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">Services</span>
                </a>
                <a
                  href="/portfolio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-800 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Portfolio</span>
                </a>
                <a
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-800 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Book className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-medium">About</span>
                </a>
                <a
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-800 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="font-medium">Contact</span>
                </a>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <a
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full p-3 text-center text-amber-700 border border-amber-300 rounded-lg font-medium hover:bg-amber-50 transition-colors duration-200"
                >
                  Client Portal
                </a>
                <a
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full p-3 text-center bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors duration-200"
                >
                  Get Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

