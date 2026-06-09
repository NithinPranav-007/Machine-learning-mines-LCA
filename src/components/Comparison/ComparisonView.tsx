import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { AIService } from '../../services/aiService';
import { RecommendationsService, Recommendation } from '../../services/recommendationsService';
import { ExportService, ExportData } from '../../services/exportService';
import { SankeyDiagram } from '../Visualization/SankeyDiagram';
import { LCAResult, CircularityMetrics } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Leaf, DollarSign, Download, FileText, Database, GitCompare, Brain, CheckCircle, Recycle } from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const { analysisResults, selectedMaterial } = useStore();
  const [linearResult, setLinearResult] = useState<LCAResult | null>(null);
  const [circularResult, setCircularResult] = useState<LCAResult | null>(null);
  const [metrics, setMetrics] = useState<CircularityMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    // Find existing linear and circular results
    const linear = analysisResults.find(r => r.parameters.processType === 'linear');
    const circular = analysisResults.find(r => r.parameters.processType === 'circular');
    
    setLinearResult(linear || null);
    setCircularResult(circular || null);
    
    if (linear && circular) {
      const calculatedMetrics = AIService.calculateCircularityMetrics(linear, circular);
      setMetrics(calculatedMetrics);
      
      // Generate recommendations
      const generatedRecommendations = RecommendationsService.generateRecommendations(linear, circular, calculatedMetrics);
      setRecommendations(generatedRecommendations);
    }
  }, [analysisResults]);
  
  const generateMissingAnalysis = async (processType: 'linear' | 'circular') => {
    if (!selectedMaterial) return;
    
    setIsGenerating(true);
    
    // Use parameters from existing analysis or defaults
    const existingResult = analysisResults[analysisResults.length - 1];
    const baseParams = existingResult?.parameters || {
      materialId: selectedMaterial.id,
      quantity: 1000,
      region: 'local',
      transportDistance: 500,
      energySource: 'mixed-grid',
      recycledContent: processType === 'circular' ? 0.75 : 0.15,
      endOfLifeScenario: 'recycling'
    };
    
    const newParams = {
      ...baseParams,
      processType
    };
    
    try {
      const result = await AIService.calculateLCA(newParams);
      
      if (processType === 'linear') {
        setLinearResult(result);
      } else {
        setCircularResult(result);
      }
      
      // Recalculate metrics if both results exist
      const linear = processType === 'linear' ? result : linearResult;
      const circular = processType === 'circular' ? result : circularResult;
      
      if (linear && circular) {
        const calculatedMetrics = AIService.calculateCircularityMetrics(linear, circular);
        setMetrics(calculatedMetrics);
        
        // Generate recommendations
        const generatedRecommendations = RecommendationsService.generateRecommendations(linear, circular, calculatedMetrics);
        setRecommendations(generatedRecommendations);
      }
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    if (!linearResult || !circularResult || !metrics) return;
    
    const exportData: ExportData = {
      analysisResults,
      linearResult,
      circularResult,
      metrics,
      recommendations,
      materialName: selectedMaterial?.name,
      exportDate: new Date().toLocaleDateString()
    };
    
    switch (format) {
      case 'pdf':
        ExportService.exportToPDF(exportData);
        break;
      case 'csv':
        ExportService.exportToCSV(exportData);
        break;
      case 'json':
        ExportService.exportToJSON(exportData);
        break;
    }
  };
  
  if (!selectedMaterial) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a material and run analyses first</p>
      </div>
    );
  }
  
  const comparisonData = linearResult && circularResult ? [
    {
      metric: 'Carbon Footprint',
      linear: linearResult.impacts.carbonFootprint,
      circular: circularResult.impacts.carbonFootprint,
      unit: 'kg CO₂'
    },
    {
      metric: 'Energy Consumption',
      linear: linearResult.impacts.energyConsumption,
      circular: circularResult.impacts.energyConsumption,
      unit: 'MJ'
    },
    {
      metric: 'Water Usage',
      linear: linearResult.impacts.waterUsage,
      circular: circularResult.impacts.waterUsage,
      unit: 'L'
    },
    {
      metric: 'Waste Generation',
      linear: linearResult.impacts.wasteGeneration,
      circular: circularResult.impacts.wasteGeneration,
      unit: 'kg'
    }
  ] : [];
  
  const radarData = metrics ? [
    { metric: 'Material Circularity', value: metrics.materialCircularityIndicator * 100 },
    { metric: 'Recycling Rate', value: metrics.recyclingRate * 100 },
    { metric: 'Energy Recovery', value: Math.max(0, metrics.energyRecovery) },
    { metric: 'Carbon Reduction', value: Math.max(0, metrics.carbonReduction) },
    { metric: 'Economic Benefit', value: Math.max(0, metrics.economicBenefit) }
  ] : [];
  
  return (
    <div className="max-w-7xl mx-auto space-y-12 relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full -translate-y-48 translate-x-48 animate-float-slow"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-200/30 to-rose-200/30 rounded-full translate-y-40 -translate-x-40 animate-float-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full animate-float delay-500"></div>
      
      <div className="text-center space-y-6 relative z-10">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 px-6 py-3 rounded-full shadow-lg border border-white/50 backdrop-blur-sm animate-fade-in">
          <div className="relative">
            <GitCompare className="w-5 h-5 text-orange-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-bold text-orange-700">Advanced Comparison Analysis</span>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-gray-900 drop-shadow-lg animate-fade-in-delay">
            Linear vs Circular Comparison
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay font-medium">
            Compare environmental impacts of different processing approaches with <span className="font-bold text-orange-600">AI-enhanced insights</span>
          </p>
        </div>
        
        {/* Comparison Stats */}
        <div className="flex items-center justify-center space-x-8 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-700">AI Enhanced</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700">Real-time Analysis</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">Verified Data</span>
          </div>
        </div>
      </div>
      
      {/* User Guidance */}
      {analysisResults.length === 0 && (
        <div data-guidance className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/50 to-indigo-50/50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/40 to-purple-200/40 rounded-full translate-y-12 -translate-x-12 animate-float delay-1000"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-blue-800 mb-4">Ready to Compare?</h3>
            <p className="text-lg text-blue-700 mb-6 max-w-2xl mx-auto">
              To compare linear vs circular approaches, you'll need to run analyses first. 
              Start by going to the <strong>Analysis</strong> tab to configure your parameters.
            </p>
            <div className="flex items-center justify-center space-x-6 text-blue-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Select Material</span>
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Run Analysis</span>
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Compare Results</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Export Controls */}
      {linearResult && circularResult && metrics && (
        <div className="flex justify-center space-x-4 relative z-10">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            <span className="font-semibold">Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Database className="w-5 h-5" />
            <span className="font-semibold">Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            <span className="font-semibold">Export JSON</span>
          </button>
        </div>
      )}
      
      {/* Generate Missing Analyses */}
      {(!linearResult || !circularResult) && (
        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-yellow-50/50 to-orange-50/50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/40 to-red-200/40 rounded-full translate-y-12 -translate-x-12 animate-float delay-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <GitCompare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-800">Generate Missing Analysis</h3>
                <p className="text-sm text-yellow-600">Create comparison data for comprehensive analysis</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!linearResult && (
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Linear Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Traditional linear production model with standard environmental impacts
                  </p>
                  <button
                    onClick={() => generateMissingAnalysis('linear')}
                    disabled={isGenerating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-semibold"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Linear Analysis'}
                  </button>
                </div>
              )}
              
              {!circularResult && (
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Circular Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Circular economy model with enhanced recycling and sustainability
                  </p>
                  <button
                    onClick={() => generateMissingAnalysis('circular')}
                    disabled={isGenerating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-semibold"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Circular Analysis'}
                  </button>
                </div>
              )}
            </div>
            
            {analysisResults.length === 0 && (
              <div className="mt-6 bg-blue-50/80 backdrop-blur-md border border-blue-200/60 rounded-2xl p-6 hover:bg-blue-50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-blue-800 text-lg">No Analysis Results Found</span>
                </div>
                <p className="text-blue-700 mb-4">
                  You need to run an analysis first before comparing different approaches. 
                  Go to the <strong>Analysis</strong> tab to configure parameters and run your first analysis.
                </p>
                <div className="flex items-center space-x-2 text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Tip: Run multiple analyses with different process types for comparison</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Comparison Results */}
      {linearResult && circularResult && metrics && (
        <div data-comparison>
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40 p-6 hover:bg-white/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <TrendingDown className="w-8 h-8 text-red-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {metrics.carbonReduction.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Carbon Reduction</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">CO₂ Savings</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40 p-6 hover:bg-white/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">
                    {metrics.energyRecovery.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Energy Recovery</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Energy Savings</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40 p-6 hover:bg-white/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Leaf className="w-8 h-8 text-emerald-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    {(metrics.materialCircularityIndicator * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Circularity Index</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Material Efficiency</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40 p-6 hover:bg-white/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.economicBenefit.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Economic Benefit</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Cost Savings</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Impact Comparison */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40 p-6 hover:bg-white/70 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => [
                    `${value} ${props.payload.unit}`,
                    name === 'linear' ? 'Linear Process' : 'Circular Process'
                  ]} />
                  <Bar dataKey="linear" fill="#ef4444" name="linear" />
                  <Bar dataKey="circular" fill="#10b981" name="circular" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Circularity Radar */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40 p-6 hover:bg-white/70 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Circularity Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Performance']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Detailed Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Impact Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Impact Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Linear Process</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Circular Process</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => {
                    const improvement = ((row.linear - row.circular) / row.linear) * 100;
                    return (
                      <tr key={row.metric} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{row.metric}</td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {row.linear.toFixed(2)} {row.unit}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-600">
                          {row.circular.toFixed(2)} {row.unit}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-medium ${improvement > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {improvement > 0 ? '↓' : '↑'} {Math.abs(improvement).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Material Flow Diagrams */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Material Flow Visualization</h3>
            <SankeyDiagram linearResult={linearResult} circularResult={circularResult} />
          </div>
          
          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40 p-6 hover:bg-white/70 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">💡 AI-Powered Recommendations</h3>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className={`p-4 rounded-lg border-l-4 ${
                    rec.impact === 'high' ? 'border-red-500 bg-red-50' :
                    rec.impact === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{RecommendationsService.getCategoryIcon(rec.category)}</span>
                          <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${RecommendationsService.getRecommendationImpact(rec)}`}>
                            {rec.impact.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{rec.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Implementation</p>
                            <p className="font-medium">{rec.implementation.difficulty} • {rec.implementation.timeframe}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Cost</p>
                            <p className="font-medium">{rec.implementation.cost}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Priority</p>
                            <p className="font-medium">{rec.priority}/10</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          {rec.potentialSavings.carbonReduction && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">CO₂ Reduction:</span>
                              <span className="font-semibold text-emerald-600">
                                {rec.potentialSavings.carbonReduction}%
                              </span>
                            </div>
                          )}
                          {rec.potentialSavings.energyReduction && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Energy Savings:</span>
                              <span className="font-semibold text-blue-600">
                                {rec.potentialSavings.energyReduction}%
                              </span>
                            </div>
                          )}
                          {rec.potentialSavings.costSavings && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Cost Savings:</span>
                              <span className="font-semibold text-green-600">
                                {rec.potentialSavings.costSavings}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
        </div>
      )}
    </div>
  );
};