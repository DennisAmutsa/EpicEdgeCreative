import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  text = '',
  className = '',
  fullScreen = false,
  showDots = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-amber-500 border-t-transparent',
    secondary: 'border-gray-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gradient: 'border-transparent border-t-amber-500 border-r-amber-400'
  };

  const content = (
    <div className={clsx(
      'flex flex-col items-center justify-center',
      fullScreen ? 'min-h-screen' : 'py-8',
      className
    )}>
      {/* Modern spinner with multiple effects */}
      <div className="relative">
        {/* Main spinner */}
        <div className={clsx(
          'animate-spin rounded-full border-4',
          sizeClasses[size],
          variant === 'gradient' ? 'border-gray-200' : colorClasses[variant]
        )}></div>
        
        {/* Gradient overlay for gradient variant */}
        {variant === 'gradient' && (
          <div className={clsx(
            'absolute top-0 left-0 animate-spin rounded-full border-4',
            sizeClasses[size],
            colorClasses.gradient
          )}></div>
        )}
        
        {/* Center dot */}
        {size !== 'sm' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      {/* Loading text and dots */}
      {text && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">{text}</p>
          {showDots && (
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return fullScreen ? (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      {content}
    </div>
  ) : content;
};

export default LoadingSpinner;
