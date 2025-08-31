import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    'dashboard': 'Dashboard',
    'projects': 'Projects',
    'profile': 'Profile', 
    'about': 'About',
    'contact': 'Contact',
    'login': 'Sign In',
    'register': 'Create Account',
    'admin-users': 'Manage Users',
    'admin-projects': 'Manage Projects',
    'create-project': 'Create Project',
    'edit-project': 'Edit Project'
  };

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            to="/" 
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const breadcrumbName = breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <React.Fragment key={to}>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <li>
                {isLast ? (
                  <span className="text-gray-200 font-medium" aria-current="page">
                    {breadcrumbName}
                  </span>
                ) : (
                  <Link 
                    to={to} 
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {breadcrumbName}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>

      {/* Structured Data for Breadcrumbs */}
      {typeof window !== 'undefined' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${window.location.origin}/`
              },
              ...pathnames.map((value, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1),
                "item": `${window.location.origin}/${pathnames.slice(0, index + 1).join('/')}`
              }))
            ]
          })}
        </script>
      )}
    </nav>
  );
};

export default BreadcrumbNavigation;
