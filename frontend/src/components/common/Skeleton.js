import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  variant = 'default',
  animated = true 
}) => {
  const variants = {
    default: 'bg-gray-200',
    card: 'bg-gray-100 rounded-lg',
    circle: 'bg-gray-200 rounded-full',
    text: 'bg-gray-200 rounded',
    button: 'bg-gray-200 rounded-lg'
  };

  return (
    <div 
      className={clsx(
        variants[variant],
        width,
        height,
        animated && 'animate-pulse',
        className
      )}
    />
  );
};

// Pre-built skeleton components for common use cases
export const ProjectCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="space-y-4">
      {/* Image placeholder */}
      <Skeleton variant="card" height="h-48" />
      
      {/* Title */}
      <Skeleton variant="text" height="h-6" width="w-3/4" />
      
      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton variant="text" height="h-4" width="w-full" />
        <Skeleton variant="text" height="h-4" width="w-5/6" />
      </div>
      
      {/* Tags */}
      <div className="flex space-x-2">
        <Skeleton variant="button" height="h-6" width="w-16" />
        <Skeleton variant="button" height="h-6" width="w-20" />
        <Skeleton variant="button" height="h-6" width="w-14" />
      </div>
      
      {/* Button */}
      <Skeleton variant="button" height="h-10" width="w-32" />
    </div>
  </div>
);

export const ServiceCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="space-y-4">
      {/* Icon */}
      <Skeleton variant="circle" width="w-12" height="h-12" />
      
      {/* Title */}
      <Skeleton variant="text" height="h-6" width="w-2/3" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="text" height="h-4" width="w-full" />
        <Skeleton variant="text" height="h-4" width="w-4/5" />
        <Skeleton variant="text" height="h-4" width="w-3/4" />
      </div>
    </div>
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="space-y-4">
      {/* Stars */}
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="circle" width="w-4" height="h-4" />
        ))}
      </div>
      
      {/* Quote */}
      <div className="space-y-2">
        <Skeleton variant="text" height="h-4" width="w-full" />
        <Skeleton variant="text" height="h-4" width="w-5/6" />
        <Skeleton variant="text" height="h-4" width="w-4/5" />
      </div>
      
      {/* Profile */}
      <div className="flex items-center space-x-3 mt-4">
        <Skeleton variant="circle" width="w-10" height="h-10" />
        <div className="space-y-1">
          <Skeleton variant="text" height="h-4" width="w-24" />
          <Skeleton variant="text" height="h-3" width="w-32" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
