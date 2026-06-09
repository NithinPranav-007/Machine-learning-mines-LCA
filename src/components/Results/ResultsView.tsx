import React from 'react';
import { useStore } from '../../store/useStore';
import { DataService } from '../../services/dataService';
import { ExportService } from '../../services/exportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingDown, Zap, Droplets, Trash2, Recycle, FileText, BarChart as BarChartIcon, Brain, TrendingUp, Target, CheckCircle, Download, Database, Braces } from 'lucide-react';

export const ResultsView: React.FC = () => {
  const { analysisResults, selectedMaterial } = useStore();
  
  if (analysisResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analysis results yet. Run an analysis first.</p>
      </div>
    );
  }
  
  const latestResult = analysisResults[analysisResults.length - 1];
  const { impacts, predictions, recommendations } = latestResult;
  
  // Get ML factors for the selected material
  const mlFactors = selectedMaterial ? DataService.getFactors(selectedMaterial.id, 'primary') : null;
  
  const impactData = [
    { name: 'Carbon Footprint', value: impacts.carbonFootprint, unit: 'kg CO₂', icon: TrendingDown, color: '#ef4444' },
    { name: 'Energy Consumption', value: impacts.energyConsumption, unit: 'MJ', icon: Zap, color: '#f59e0b' },
    { name: 'Water Usage', value: impacts.waterUsage, unit: 'L', icon: Droplets, color: '#3b82f6' },
    { name: 'Waste Generation', value: impacts.wasteGeneration, unit: 'kg', icon: Trash2, color: '#6b7280' }
  ];
  
  const circularityData = [
    { name: 'Circular', value: impacts.circularityScore * 100, fill: '#10b981' },
    { name: 'Linear', value: (1 - impacts.circularityScore) * 100, fill: '#e5e7eb' }
  ];

  const normalizedCarbon = Math.max(0, 100 - impacts.carbonFootprint * 1.2);
  const normalizedEnergy = Math.max(0, 100 - impacts.energyConsumption * 0.4);
  const normalizedWater = Math.max(0, 100 - impacts.waterUsage * 0.03);
  const sustainabilityScore = Math.round(
    normalizedCarbon * 0.35 +
    normalizedEnergy * 0.25 +
    normalizedWater * 0.15 +
    impacts.circularityScore * 100 * 0.25
  );

  const scoreBand = sustainabilityScore >= 80
    ? { label: 'Excellent', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    : sustainabilityScore >= 60
    ? { label: 'Strong', className: 'bg-teal-100 text-teal-700 border-teal-200' }
    : sustainabilityScore >= 40
    ? { label: 'Moderate', className: 'bg-amber-100 text-amber-700 border-amber-200' }
    : { label: 'Needs Improvement', className: 'bg-rose-100 text-rose-700 border-rose-200' };

  const handleExport = (format: 'csv' | 'json' | 'report') => {
    const exportData = {
      analysisResults,
      materialName: selectedMaterial?.name,
      exportDate: new Date().toLocaleDateString()
    };

    if (format === 'csv') {
      ExportService.exportToCSV(exportData);
      return;
    }

    if (format === 'json') {
      ExportService.exportToJSON(exportData);
      return;
    }

    ExportService.exportToPDF(exportData);
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-12 relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-48 translate-x-48 animate-float-slow"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-rose-200/30 to-orange-200/30 rounded-full translate-y-40 -translate-x-40 animate-float-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full animate-float delay-500"></div>
      
      {/* Hero Section */}
      <div className="text-center space-y-6 relative z-10">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 px-6 py-3 rounded-full shadow-lg border border-white/50 backdrop-blur-sm animate-fade-in">
          <div className="relative">
            <FileText className="w-5 h-5 text-purple-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-bold text-purple-700">AI-Powered Results</span>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-gray-900 drop-shadow-lg animate-fade-in-delay">
            Analysis Results
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay font-medium">
            Environmental impact assessment with <span className="font-bold text-purple-600">AI insights</span> and recommendations
          </p>
        </div>
        
        {/* Results Stats */}
        <div className="flex items-center justify-center space-x-8 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-700">AI Enhanced</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700">Real-time Data</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">Verified Results</span>
          </div>
        </div>
      </div>

      {/* Result Command Center */}
      <div className="relative z-10 bg-white/70 backdrop-blur-lg border border-white/60 rounded-3xl shadow-2xl p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-600">Sustainability Intelligence</p>
            <h3 className="text-2xl font-bold text-slate-900">Result Command Center</h3>
          </div>
          <div className={`px-4 py-2 rounded-full border text-sm font-bold ${scoreBand.className}`}>
            Score Status: {scoreBand.label}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
            <p className="text-xs font-semibold text-cyan-700">Sustainability Score</p>
            <p className="text-3xl font-extrabold text-cyan-900 mt-1">{sustainabilityScore}</p>
            <p className="text-xs text-cyan-700 mt-1">Composite index (0-100)</p>
          </div>

          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
            <p className="text-xs font-semibold text-emerald-700">Circularity</p>
            <p className="text-3xl font-extrabold text-emerald-900 mt-1">{(impacts.circularityScore * 100).toFixed(1)}%</p>
            <p className="text-xs text-emerald-700 mt-1">Material loop performance</p>
          </div>

          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
            <p className="text-xs font-semibold text-violet-700">AI Confidence</p>
            <p className="text-3xl font-extrabold text-violet-900 mt-1">{Math.round(predictions.confidence * 100)}%</p>
            <p className="text-xs text-violet-700 mt-1">Prediction reliability</p>
          </div>

          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
            <p className="text-xs font-semibold text-amber-700">Recommendations</p>
            <p className="text-3xl font-extrabold text-amber-900 mt-1">{recommendations.length}</p>
            <p className="text-xs text-amber-700 mt-1">Actions ready to apply</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport('report')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <FileText className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Database className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Braces className="w-4 h-4" />
            Export JSON
          </button>
          <span className="inline-flex items-center gap-2 text-xs text-slate-600 font-medium ml-auto">
            <Download className="w-3.5 h-3.5" /> One-click result sharing
          </span>
        </div>
      </div>
      
      {/* Stunning Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {impactData.map(({ name, value, unit, icon: Icon, color }, index) => (
          <div 
            key={name} 
            className="group bg-white/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 hover:shadow-glow-lg hover:bg-white/60 transition-all duration-500 hover:scale-105 relative overflow-hidden transform-3d card-hover-3d"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animation: 'fade-in 0.6s ease-out'
            }}
          >
            {/* Advanced Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-gray-50/50 to-gray-100/50"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100/60 to-gray-200/60 rounded-full -translate-y-10 translate-x-10 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-100/60 to-gray-200/60 rounded-full translate-y-8 -translate-x-8 animate-float delay-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7" style={{ color }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                    {value.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">{unit}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-lg font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {name}
                </p>
                
                {/* Advanced Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 rounded-full transition-all duration-1000 animate-shimmer"
                    style={{ 
                      background: `linear-gradient(90deg, ${color}, ${color}88, ${color})`,
                      width: `${Math.min((value / 100) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                
                {/* Impact Level Indicator */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Impact Level</span>
                  <span className="font-semibold" style={{ color }}>
                    {value > 50 ? 'High' : value > 25 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      {/* Stunning Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Impact Comparison Chart */}
        <div className="bg-white/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-10 relative overflow-hidden transform-3d card-hover-3d hover:bg-white/60 transition-all duration-300">
          {/* Advanced Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/40 to-cyan-200/40 rounded-full translate-y-12 -translate-x-12 animate-float delay-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <BarChartIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Environmental Impacts</h3>
                <p className="text-sm text-gray-600">Comprehensive impact analysis</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={1} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fontSize: 14, fill: '#374151', fontWeight: 'bold' }}
                  stroke="#6b7280"
                  strokeWidth={2}
                />
                <YAxis 
                  tick={{ fontSize: 14, fill: '#374151', fontWeight: 'bold' }}
                  stroke="#6b7280"
                  strokeWidth={2}
                  label={{ value: 'Impact Value', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '14px', fontWeight: 'bold' } }}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value} ${impactData.find(d => d.name === name)?.unit}`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(10px)'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#gradient)"
                  radius={[8, 8, 0, 0]}
                  stroke="#059669"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Circularity Score */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-8 relative overflow-hidden hover:bg-white/60 transition-all duration-300">
          {/* Background Pattern */}
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-teal-100 to-emerald-100 rounded-full translate-y-10 -translate-x-10 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Circularity Score</h3>
                <p className="text-sm text-gray-600">Sustainability achievement</p>
              </div>
            </div>
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={circularityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={130}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                    stroke="white"
                    strokeWidth={3}
                  >
                    {circularityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(1)}%`, '']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #10b981',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      backdropFilter: 'blur(10px)'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 rounded-2xl border border-emerald-200">
                <div className="relative">
                  <p className="text-4xl font-bold text-emerald-600">
                    {(impacts.circularityScore * 100).toFixed(1)}%
                  </p>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-emerald-800">Circularity Achievement</p>
                  <p className="text-xs text-emerald-600">Sustainability Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ML Data Insights */}
      {mlFactors && (
        <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/80 to-blue-50/80 backdrop-blur-lg border-2 border-purple-200/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden hover:from-purple-50 hover:via-indigo-50 hover:to-blue-50 transition-all duration-300">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-purple-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/40 to-indigo-200/40 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/40 to-blue-200/40 rounded-full translate-y-12 -translate-x-12 animate-float delay-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800">ML-Enhanced Analysis Data</h3>
                <p className="text-sm text-purple-600">AI-powered predictions</p>
              </div>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-purple-200/50 shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-purple-800 text-lg">ML Carbon Factor</span>
              </div>
              <p className="text-4xl font-bold text-purple-600 mb-2">
                {mlFactors.carbonBase.toFixed(2)}
              </p>
              <p className="text-sm text-purple-600 font-medium">kg CO₂ per kg (ML-predicted)</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-yellow-200/50 shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-purple-800 text-lg">ML Energy Factor</span>
              </div>
              <p className="text-4xl font-bold text-yellow-600 mb-2">
                {mlFactors.energyBase.toFixed(2)}
              </p>
              <p className="text-sm text-purple-600 font-medium">MJ per kg (ML-predicted)</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/40 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-purple-800">Data Quality</span>
            </div>
            <p className="text-sm text-purple-700">
              These factors are calculated using machine learning algorithms trained on {selectedMaterial?.name} data, 
              providing more accurate predictions than traditional LCA methods.
            </p>
          </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Predictions */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 hover:bg-white/70 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Predictions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Confidence Score</span>
              <span className="font-medium text-emerald-600">
                {(predictions.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Predicted Parameters:</p>
              <div className="flex flex-wrap gap-2">
                {predictions.predictedParameters.map((param) => (
                  <span
                    key={param}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {param}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 hover:bg-white/70 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Recycle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};