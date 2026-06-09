import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isHoverable?: boolean;
  elevation?: 'sm' | 'md' | 'lg';
}

const elevationClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

/**
 * Card Component
 * Flexible container with consistent styling
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  isHoverable = false,
  elevation = 'md',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-slate-200
        ${elevationClasses[elevation]}
        transition-all duration-300
        ${isHoverable ? 'hover:shadow-xl hover:border-primary-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * Card Header
 */
export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-b border-slate-200 ${className}`}>
    {children}
  </div>
);

/**
 * Card Body
 */
export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

/**
 * Card Footer
 */
export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg ${className}`}>
    {children}
  </div>
);
