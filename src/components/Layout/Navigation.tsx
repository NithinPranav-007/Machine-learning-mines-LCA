import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Package, Calculator, FileText, GitCompare, BarChart3 } from 'lucide-react';

type TabId = 'materials' | 'analysis' | 'results' | 'comparison' | 'dashboard';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useStore();
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);
  
  const tabs: Array<{
    id: TabId;
    label: string;
    icon: React.ElementType;
    description: string;
    color: string;
    bgColor: string;
    iconColor: string;
  }> = [
    { 
      id: 'materials', 
      label: 'Materials', 
      icon: Package, 
      description: 'Select Material',
      color: 'from-sky-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-700'
    },
    { 
      id: 'analysis', 
      label: 'Analysis', 
      icon: Calculator, 
      description: 'Configure Parameters',
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-700'
    },
    { 
      id: 'results', 
      label: 'Results', 
      icon: FileText, 
      description: 'View Results',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-700'
    },
    { 
      id: 'comparison', 
      label: 'Comparison', 
      icon: GitCompare, 
      description: 'Compare Models',
      color: 'from-slate-600 to-cyan-700',
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-700'
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      description: 'View Progress',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-700'
    }
  ];

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: TabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(id);
    }
  };
  
  return (
    <nav 
      className="sticky top-0 z-30 bg-white/85 border-b border-slate-200/70 shadow-lg backdrop-blur-md relative overflow-hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,165,233,0.06),rgba(13,148,136,0.06),rgba(245,158,11,0.06))]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-wrap gap-2 py-2" role="tablist">
          {tabs.map(({ id, label, icon: Icon, description, color, bgColor, iconColor }, index) => {
            const isActive = activeTab === id;
            const isHovered = hoveredTab === id;
            
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabClick(id)}
                onKeyDown={(e) => handleKeyDown(e, id)}
                onMouseEnter={() => setHoveredTab(id)}
                onMouseLeave={() => setHoveredTab(null)}
                role="tab"
                aria-selected={isActive}
                aria-label={`${label}: ${description}`}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative min-w-[160px] sm:min-w-[180px] flex-1 flex items-center justify-center sm:justify-start gap-2 py-3.5 px-3 sm:px-4 rounded-2xl font-medium text-xs sm:text-sm transition-all duration-300 focus-ring ${
                  isActive
                    ? `bg-gradient-to-r ${color} text-white shadow-xl ring-2 ring-white/70`
                    : `text-slate-700 hover:text-slate-900 hover:bg-white/90 hover:shadow-md ${isHovered ? bgColor : ''}`
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Background Glow Effect */}
                {isActive && (
                  <div 
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-md opacity-35`}
                    aria-hidden="true"
                  />
                )}
                
                {/* Icon Container */}
                <div className="relative z-10">
                  <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : `bg-white/70 backdrop-blur-sm group-hover:bg-white ${isHovered ? bgColor : ''}`
                  }`}>
                    <Icon className={`w-4 sm:w-5 h-4 sm:h-5 transition-all duration-300 ${
                      isActive 
                        ? 'text-white scale-105' 
                        : `${iconColor} group-hover:scale-105`
                    }`} />
                    
                    {/* Active Sparkle */}
                    {isActive && (
                      <div 
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
                
                {/* Label */}
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};