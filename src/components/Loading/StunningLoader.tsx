import React from 'react';
import { Brain, Zap, Database, TrendingUp } from 'lucide-react';

interface StunningLoaderProps {
  message?: string;
  type?: 'analysis' | 'prediction' | 'data' | 'processing';
}

export const StunningLoader: React.FC<StunningLoaderProps> = ({ 
  message = "Processing your request...", 
  type = 'analysis' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'prediction': return Brain;
      case 'data': return Database;
      case 'processing': return TrendingUp;
      default: return Zap;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'prediction': return 'from-purple-500 to-pink-500';
      case 'data': return 'from-blue-500 to-cyan-500';
      case 'processing': return 'from-green-500 to-emerald-500';
      default: return 'from-orange-500 to-red-500';
    }
  };

  const Icon = getIcon();
  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 max-w-md mx-4">
        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`w-20 h-20 bg-gradient-to-r ${colors} rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow`}>
              <Icon className="w-10 h-10 text-white animate-spin-slow" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-white/20 to-transparent rounded-2xl animate-ping"></div>
            <div className="absolute -inset-2 w-24 h-24 border-2 border-white/30 rounded-2xl animate-ping delay-500"></div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {message}
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we process your data...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${colors} rounded-full animate-shimmer`}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl loading-skeleton"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded loading-skeleton w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded loading-skeleton w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded loading-skeleton"></div>
          <div className="h-4 bg-gray-200 rounded loading-skeleton w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded loading-skeleton w-4/6"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full loading-skeleton"></div>
      </div>
    </div>
  );
};

export const DataFlowLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-4 py-8">
      <div className="data-flow w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
        <Database className="w-8 h-8 text-white" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">Loading Data</h3>
        <p className="text-sm text-gray-600">Processing 8,000+ data points...</p>
      </div>
    </div>
  );
};

