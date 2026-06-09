import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { LCAParameters } from '../../types';
import { AIService } from '../../services/aiService';
import { DataService } from '../../services/dataService';
import { Brain, Calculator, Loader, Globe, Truck, Zap, Recycle, Trash2, Sparkles, TrendingUp, AlertCircle, CheckCircle, ArrowRight, BarChart3 } from 'lucide-react';

export const AnalysisForm: React.FC = () => {
  const { selectedMaterial, setCurrentAnalysis, addAnalysisResult, isAnalyzing, setIsAnalyzing, setActiveTab, analysisResults } = useStore();
  const [formData, setFormData] = useState<Partial<LCAParameters>>({
    quantity: 1000,
    processType: 'linear',
    region: 'local',
    transportDistance: undefined,
    energySource: '',
    recycledContent: undefined,
    endOfLifeScenario: 'recycling'
  });
  const [aiPredictions, setAiPredictions] = useState<any>(null);
  const [showPredictions, setShowPredictions] = useState(false);
  const [mlFactors, setMlFactors] = useState<any>(null);
  const [dataInsights, setDataInsights] = useState<any>(null);
  
  const resetPredictions = () => {
    setAiPredictions(null);
    setShowPredictions(false);
  };
  
  // Load ML factors and insights when material changes
  useEffect(() => {
    if (selectedMaterial) {
      const factors = DataService.getFactors(selectedMaterial.id, 'primary');
      setMlFactors(factors);
      
      // Generate data insights based on material properties
      const insights = {
        recyclingRate: selectedMaterial.recyclingRate,
        energyIntensity: selectedMaterial.energyIntensity,
        carbonFootprint: selectedMaterial.carbonFootprint,
        density: selectedMaterial.density,
        recommendations: generateMaterialInsights(selectedMaterial)
      };
      setDataInsights(insights);
    }
  }, [selectedMaterial]);

  const generateMaterialInsights = (material: any) => {
    const insights = [];
    
    if (material.recyclingRate > 0.8) {
      insights.push("High recyclability - excellent for circular economy");
    } else if (material.recyclingRate < 0.5) {
      insights.push("Low recyclability - consider alternative materials");
    }
    
    if (material.energyIntensity > 30) {
      insights.push("High energy intensity - focus on energy efficiency");
    }
    
    if (material.carbonFootprint > 10) {
      insights.push("High carbon footprint - prioritize carbon reduction strategies");
    }
    
    return insights;
  };

  const handleInputChange = (field: keyof LCAParameters, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAIPrediction = async () => {
    if (!selectedMaterial) return;
    
    setShowPredictions(true);
    
    // Show loading state
    const loadingPredictions = {
      predictions: {},
      confidence: 0,
      predictedFields: [],
      isLoading: true
    };
    setAiPredictions(loadingPredictions);
    
    try {
      const predictions = await AIService.predictMissingParameters({
        ...formData,
        materialId: selectedMaterial.id
      });
      
      setAiPredictions(predictions);
      
      // Apply predictions to form with animation
      setFormData(prev => ({
        ...prev,
        ...predictions.predictions
      }));
      
      // Show success animation
      setTimeout(() => {
        setAiPredictions(prev => ({ ...prev, isLoading: false }));
      }, 1000);
      
    } catch (error) {
      console.error('AI prediction failed:', error);
      setAiPredictions({
        predictions: {},
        confidence: 0,
        predictedFields: [],
        error: 'Failed to generate predictions'
      });
    }
  };
  
  const handleAnalysis = async () => {
    if (!selectedMaterial) return;
    
    setIsAnalyzing(true);
    
    const completeParams: LCAParameters = {
      materialId: selectedMaterial.id,
      quantity: formData.quantity || 1000,
      processType: formData.processType || 'linear',
      region: formData.region || 'local',
      transportDistance: formData.transportDistance || 500,
      energySource: formData.energySource || 'mixed-grid',
      recycledContent: formData.recycledContent || 0.15,
      endOfLifeScenario: formData.endOfLifeScenario || 'recycling'
    };
    
    try {
      const result = await AIService.calculateLCA(completeParams);
      addAnalysisResult(result);
      setCurrentAnalysis(completeParams);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  if (!selectedMaterial) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a material first</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-12 relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-teal-50 to-amber-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-48 translate-x-48 animate-float-slow"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full translate-y-40 -translate-x-40 animate-float-slow delay-1000"></div>
      
      {/* Hero Section */}
      <div className="text-center space-y-6 relative z-10">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-sky-100 via-teal-100 to-emerald-100 px-6 py-3 rounded-full shadow-lg border border-white/50 backdrop-blur-sm animate-fade-in">
          <div className="relative">
            <Brain className="w-5 h-5 text-teal-600 animate-spin-slow" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-bold text-teal-700">AI-Powered Parameter Configuration</span>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-gray-900 drop-shadow-lg animate-fade-in-delay">
            LCA Analysis Setup
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay font-medium">
            Configure parameters for <span className="font-bold text-emerald-600">{selectedMaterial.name}</span> with AI assistance
          </p>
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center justify-center space-x-8 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-semibold text-gray-700">AI Enhanced</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700">Real-time Predictions</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-semibold text-gray-700">ML Factors Available</span>
          </div>
        </div>
      </div>
      
      {/* ML Data Insights */}
      {dataInsights && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <Brain className="w-6 h-6 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <span className="font-semibold text-blue-800 text-lg">ML-Enhanced Material Insights</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Recycle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-gray-600">Recycling Rate</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {(dataInsights.recyclingRate * 100).toFixed(1)}%
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Energy Intensity</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {dataInsights.energyIntensity} MJ/kg
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600">Carbon Footprint</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {dataInsights.carbonFootprint} kg CO₂
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">ML Factors</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {mlFactors ? 'Available' : 'N/A'}
              </p>
            </div>
          </div>
          
          {dataInsights.recommendations.length > 0 && (
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>AI Recommendations</span>
              </h4>
              <div className="space-y-2">
                {dataInsights.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-blue-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-10 relative overflow-hidden transform-3d hover:bg-white/70 transition-all duration-300">
        {/* Advanced Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-sky-50/50 to-amber-50/40"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-sky-200/40 to-cyan-200/40 rounded-full translate-y-16 -translate-x-16 animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-full animate-float delay-500"></div>
        
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span>Quantity (kg)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.quantity || ''}
                  onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="1000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-400">kg</span>
                </div>
              </div>
            </div>
          
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Recycle className="w-4 h-4 text-blue-500" />
                <span>Process Type</span>
              </label>
              <div className="relative">
                <select
                  value={formData.processType || ''}
                  onChange={(e) => handleInputChange('processType', e.target.value as 'linear' | 'circular')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="linear">Linear (Traditional)</option>
                  <option value="circular">Circular (Sustainable)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-500" />
                <span>Region</span>
              </label>
              <div className="relative">
                <select
                  value={formData.region || ''}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="local">Local</option>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>Transport Distance (km)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.transportDistance || ''}
                  onChange={(e) => handleInputChange('transportDistance', Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="AI will predict if empty"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-400">km</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Energy Source</span>
              </label>
              <div className="relative">
                <select
                  value={formData.energySource || ''}
                  onChange={(e) => handleInputChange('energySource', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="">AI will predict</option>
                  <option value="renewable">Renewable</option>
                  <option value="mixed-grid">Mixed Grid</option>
                  <option value="fossil">Fossil</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Recycle className="w-4 h-4 text-green-500" />
                <span>Recycled Content (0-1)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.recycledContent || ''}
                  onChange={(e) => handleInputChange('recycledContent', Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="AI will predict if empty"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-400">ratio</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>End of Life Scenario</span>
              </label>
              <div className="relative">
                <select
                  value={formData.endOfLifeScenario || ''}
                  onChange={(e) => handleInputChange('endOfLifeScenario', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="recycling">Recycling</option>
                  <option value="reuse">Reuse</option>
                  <option value="repair">Repair</option>
                  <option value="landfill">Landfill</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2 rounded-2xl border border-sky-100 bg-white/70 backdrop-blur-sm p-4 shadow-lg">
              <button
                onClick={handleAIPrediction}
                disabled={aiPredictions?.isLoading}
                className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 text-white rounded-2xl hover:from-sky-600 hover:via-cyan-600 hover:to-teal-600 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed btn-hover-lift"
                title="Use AI to automatically fill missing parameters based on material data and ML predictions"
              >
                {aiPredictions?.isLoading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    <span className="font-bold text-lg">AI Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6 group-hover:animate-pulse" />
                    <span className="font-bold text-lg">AI Predict Missing</span>
                    <Sparkles className="w-5 h-5 opacity-80 animate-pulse" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 text-center font-medium">
                Automatically fill empty fields using ML-enhanced predictions
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-4 shadow-lg">
              <button
                onClick={handleAnalysis}
                disabled={isAnalyzing}
                className="group flex items-center justify-center space-x-3 px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed btn-hover-lift"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    <span className="font-bold text-lg">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-6 h-6 group-hover:animate-pulse" />
                    <span className="font-bold text-lg">Run Analysis</span>
                    <Zap className="w-5 h-5 opacity-80 animate-pulse" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 text-center font-medium">
                Execute comprehensive LCA analysis with AI insights
              </p>
            </div>

            <div className="flex flex-col space-y-2 rounded-2xl border border-amber-100 bg-white/70 backdrop-blur-sm p-4 shadow-lg">
              <button
                onClick={() => setActiveTab('results')}
                disabled={!analysisResults.length}
                className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-40 disabled:transform-none disabled:cursor-not-allowed btn-hover-lift"
                title={analysisResults.length ? 'Go to the results screen' : 'Run an analysis first'}
              >
                <BarChart3 className="w-6 h-6 group-hover:animate-pulse" />
                <span className="font-bold text-lg">Next: Results</span>
                <ArrowRight className="w-5 h-5 opacity-80" />
              </button>
              <p className="text-sm text-gray-600 text-center font-medium">
                Continue to the result dashboard after analysis
              </p>
            </div>
          </div>
        </div>
        
        {showPredictions && aiPredictions && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <Brain className="w-6 h-6 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <span className="font-semibold text-blue-800 text-lg">
                {aiPredictions.isLoading ? 'AI Analyzing Data...' : 'AI Predictions Applied'}
              </span>
            </div>
            
            {aiPredictions.isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Loader className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-blue-700">Processing material data and generating predictions...</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            ) : aiPredictions.error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Prediction Error</span>
                </div>
                <p className="text-red-700 mt-2">{aiPredictions.error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-sm text-blue-600 mb-1">Confidence Score</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {(aiPredictions.confidence * 100).toFixed(0)}%
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(aiPredictions.confidence * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-sm text-blue-600 mb-1">Predicted Fields</p>
                  <div className="flex flex-wrap gap-2">
                    {aiPredictions.predictedFields.map((field, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium animate-in fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {!aiPredictions.isLoading && !aiPredictions.error && (
              <div className="mt-4 bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-blue-800">Predictions Applied</span>
                  </div>
                  <button
                    onClick={resetPredictions}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Reset Predictions
                  </button>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  AI has successfully predicted missing parameters based on {selectedMaterial?.name} material data and ML-enhanced factors.
                </p>
                
                {/* Confidence Breakdown */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Confidence Score Breakdown</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Base Confidence:</span>
                      <span className="font-medium">50%</span>
                    </div>
                    {mlFactors && (
                      <div className="flex justify-between">
                        <span className="text-blue-600">ML Factors Available:</span>
                        <span className="font-medium text-green-600">+25%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-blue-600">Data Completeness:</span>
                      <span className="font-medium">+{Math.round((Object.keys(formData).filter(key => formData[key as keyof LCAParameters] !== undefined && formData[key as keyof LCAParameters] !== '').length / 7) * 20)}%</span>
                    </div>
                    {selectedMaterial?.id.includes('al') && (
                      <div className="flex justify-between">
                        <span className="text-blue-600">Aluminum Data:</span>
                        <span className="font-medium text-green-600">+10%</span>
                      </div>
                    )}
                    {formData.processType === 'circular' && (
                      <div className="flex justify-between">
                        <span className="text-blue-600">Circular Process:</span>
                        <span className="font-medium text-green-600">+5%</span>
                      </div>
                    )}
                    {formData.region === 'local' && (
                      <div className="flex justify-between">
                        <span className="text-blue-600">Local Region:</span>
                        <span className="font-medium text-green-600">+5%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};