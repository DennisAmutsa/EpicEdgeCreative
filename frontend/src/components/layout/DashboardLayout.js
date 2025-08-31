import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  FolderOpen,
  User,
  Users,
  Briefcase,
  MessageSquare,
  Plus,
  LogOut,
  Settings,
  BarChart3,
  Download,
  DollarSign,
  Bell,
  Video,
  Upload,
  Menu,
  X,
  Star
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Base navigation for all users
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      current: location.pathname === '/profile'
    }
  ];

  // Client-only main navigation
  const clientMainNavigation = [
    {
      name: 'My Projects',
      href: '/projects',
      icon: FolderOpen,
      current: location.pathname === '/projects' || location.pathname.startsWith('/projects/')
    }
  ];

  // Combine navigation based on user role
  const navigation = isAdmin
    ? baseNavigation
    : [...baseNavigation.slice(0, 1), ...clientMainNavigation, ...baseNavigation.slice(1)];

  // Client-specific navigation for non-admin users
  const clientNavigation = [
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      current: location.pathname === '/messages',
      disabled: false
    },
    {
      name: 'Billing',
      href: '/billing',
      icon: DollarSign,
      current: location.pathname === '/billing',
      disabled: false
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      current: location.pathname === '/notifications',
      disabled: false
    },
    {
      name: 'Feedback',
      href: '/feedback',
      icon: Star,
      current: location.pathname === '/feedback',
      disabled: false
    }
  ];

  const adminNavigation = [
    {
      name: 'Users',
      href: '/admin-users',
      icon: Users,
      current: location.pathname === '/admin-users'
    },
    {
      name: 'All Projects',
      href: '/admin-projects',
      icon: Briefcase,
      current: location.pathname === '/admin-projects'
    },
    {
      name: 'Client Messages',
      href: '/admin-messages',
      icon: MessageSquare,
      current: location.pathname === '/admin-messages'
    },
    {
      name: 'Send Notifications',
      href: '/admin-notifications',
      icon: Bell,
      current: location.pathname === '/admin-notifications'
    },
    {
      name: 'Manage Feedback',
      href: '/admin-feedback',
      icon: Star,
      current: location.pathname === '/admin-feedback'
    },
    {
      name: 'Contact Forms',
      href: '/admin-contacts',
      icon: Bell,
      current: location.pathname === '/admin-contacts'
    },
    {
      name: 'Billing Management',
      href: '/admin-billing',
      icon: DollarSign,
      current: location.pathname === '/admin-billing'
    },
    {
      name: 'Portfolio',
      href: '/admin-portfolio',
      icon: BarChart3,
      current: location.pathname === '/admin-portfolio'
    },
    {
      name: 'Create Project',
      href: '/create-project',
      icon: Plus,
      current: location.pathname === '/create-project'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center h-16 px-6 bg-gradient-to-r from-amber-500 to-yellow-600">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div className="ml-3">
              <h1 className="text-white font-semibold text-lg">EpicEdge</h1>
              <p className="text-amber-100 text-xs">Creative System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Client Section */}
          {!isAdmin && (
            <div className="mt-8">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                  Client Tools
                </h3>
              </div>
              <div className="space-y-2">
                {clientNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-8">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              <div className="space-y-2">
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-gray-900 text-sm font-medium">{user?.name}</p>
              <p className="text-gray-600 text-xs">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-gray-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 ml-2 lg:ml-0">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/projects' && 'My Projects'}
                {location.pathname === '/profile' && 'Profile Settings'}
                {location.pathname === '/messages' && 'Messages'}
                {location.pathname === '/billing' && 'Billing & Invoices'}
                {location.pathname === '/notifications' && 'Notifications'}
                {location.pathname === '/feedback' && 'Feedback & Reviews'}
                {location.pathname === '/admin-users' && 'Manage Users'}
                {location.pathname === '/admin-projects' && 'All Projects'}
                {location.pathname === '/admin-portfolio' && 'Portfolio Management'}
                {location.pathname === '/admin-contacts' && 'Contact Forms'}
                {location.pathname === '/admin-messages' && 'Client Messages'}
                {location.pathname === '/admin-notifications' && 'Send Notifications'}
                  {location.pathname === '/admin-feedback' && 'Manage Feedback'}
                {location.pathname === '/create-project' && 'Create New Project'}
                {location.pathname.startsWith('/edit-project') && 'Edit Project'}
                {location.pathname.startsWith('/projects/') && 'Project Details'}
              </h1>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="hidden sm:block text-sm text-gray-500">
                  Welcome back, {user?.name}
                </span>
                <Link
                  to="/"
                  className="text-xs sm:text-sm text-amber-600 hover:text-amber-500 font-medium px-2 sm:px-3 py-1 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors"
                >
                  <span className="hidden sm:inline">← Back to Website</span>
                  <span className="sm:hidden">← Website</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
