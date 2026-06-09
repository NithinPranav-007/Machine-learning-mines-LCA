import React from 'react';
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from 'lucide-react';

type AlertType = 'success' | 'danger' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
}

const alertConfig = {
  success: {
    bg: 'bg-success-50',
    border: 'border-success-200',
    icon: CheckCircle,
    iconColor: 'text-success-600',
    titleColor: 'text-success-900',
  },
  danger: {
    bg: 'bg-danger-50',
    border: 'border-danger-200',
    icon: AlertCircle,
    iconColor: 'text-danger-600',
    titleColor: 'text-danger-900',
  },
  warning: {
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    icon: AlertTriangle,
    iconColor: 'text-warning-600',
    titleColor: 'text-warning-900',
  },
  info: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    icon: InfoIcon,
    iconColor: 'text-primary-600',
    titleColor: 'text-primary-900',
  },
};

/**
 * Alert Component
 * Displays dismissible alerts with different severity levels
 */
export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex gap-4 p-4 rounded-lg border ${config.bg} ${config.border}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1">
        <h3 className={`font-semibold mb-1 ${config.titleColor}`}>{title}</h3>
        <p className="text-slate-700 text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};
