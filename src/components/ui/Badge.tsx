import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  success: 'bg-success-100 text-success-700 border-success-200',
  danger: 'bg-danger-100 text-danger-700 border-danger-200',
  warning: 'bg-warning-100 text-warning-700 border-warning-200',
  info: 'bg-slate-100 text-slate-700 border-slate-200',
};

/**
 * Badge Component
 * Small label for status, category, or tag
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1
        rounded-full text-xs font-semibold border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
