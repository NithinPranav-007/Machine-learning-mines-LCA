import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
  batch?: 'card' | 'list' | 'table';
}

/**
 * Loading Skeleton Component
 * Shows placeholder while content loads for better perceived performance
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = 'h-4',
  width = 'w-full',
  circle = false,
  batch = 'list',
}) => {
  if (batch === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-slate-200 rounded-lg animate-shimmer"></div>
        {/* Text skeleton */}
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 rounded animate-shimmer"></div>
          <div className="h-4 bg-slate-200 rounded animate-shimmer w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded animate-shimmer w-4/6"></div>
        </div>
      </div>
    );
  }

  if (batch === 'table') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-4 bg-slate-200 rounded animate-shimmer flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Default list skeleton
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} ${width} bg-slate-200 rounded animate-shimmer`}></div>
      ))}
    </div>
  );
};

/**
 * Spinner Component
 * For loading states
 */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
  );
};
