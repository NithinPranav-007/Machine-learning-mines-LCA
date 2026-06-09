import React, { useState, useEffect } from 'react';
import { Recycle, Brain, BarChart3, Zap, Shield, Database, Sparkles, TrendingUp, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Brain, label: "AI-Powered", color: "text-amber-200", bg: "bg-amber-500/20" },
    { icon: BarChart3, label: "Real-time Analysis", color: "text-sky-200", bg: "bg-sky-500/20" },
    { icon: Database, label: "Dataset Connected", color: "text-emerald-200", bg: "bg-emerald-500/20" }
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-800 text-white shadow-2xl relative overflow-hidden">
      {/* Advanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-24">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Recycle className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-300 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-300 rounded-full animate-pulse"></div>
            </div>
            <div className="transform transition-all duration-500">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg animate-fade-in">
                CircuMetal AI
              </h1>
              <p className="text-sm text-white/90 font-medium animate-fade-in-delay">
                Next-Gen LCA Platform
              </p>
            </div>
          </div>
          
          {/* Feature Indicators */}
          <div className="flex items-center space-x-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-500 transform ${
                    isActive 
                      ? 'bg-white/20 border-white/40 scale-105 shadow-lg' 
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${feature.color} ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">{feature.label}</span>
                  {isActive && <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between py-3 border-t border-white/20">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-cyan-100">System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 text-sky-300" />
              <span className="text-xs text-cyan-100">8,000+ Data Points</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-3 h-3 text-amber-300" />
              <span className="text-xs text-cyan-100">Global Coverage</span>
            </div>
          </div>
          <div className="text-xs text-cyan-100">
            Powered by Machine Learning
          </div>
        </div>
      </div>
      
      {/* Advanced Animated Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float-slow"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float delay-500"></div>
    </header>
  );
};