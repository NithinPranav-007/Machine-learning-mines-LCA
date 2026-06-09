import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { useStore } from '../store/useStore';
import { Database, CheckCircle, AlertCircle, Brain } from 'lucide-react';

export const DataStatus: React.FC = () => {
  const [dataStatus, setDataStatus] = useState({
    isReady: false,
    materialsCount: 0,
    mlFactorsCount: 0,
    error: null as string | null
  });
  
  const { materials } = useStore();

  useEffect(() => {
    const checkDataStatus = async () => {
      try {
        // Check if DataService is ready
        const isReady = DataService.isReady();
        
        // Get materials count
        const materialsCount = DataService.getMaterials().length;
        
        // Count ML factors (this is a bit hacky but works)
        let mlFactorsCount = 0;
        const testMaterials = ['al_6061', 'al_1100', 'cu_c101', 'cu_c110'];
        for (const materialId of testMaterials) {
          const factors = DataService.getFactors(materialId, 'primary');
          if (factors) mlFactorsCount++;
        }
        
        setDataStatus({
          isReady,
          materialsCount,
          mlFactorsCount,
          error: null
        });
      } catch (error) {
        setDataStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    checkDataStatus();
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50 mb-6 relative overflow-hidden transform-3d card-hover-3d">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/50"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full -translate-y-10 translate-x-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-200/40 to-cyan-200/40 rounded-full translate-y-8 -translate-x-8 animate-float delay-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Data Loading Status</h3>
            <p className="text-sm text-gray-600">Real-time system monitoring</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${dataStatus.isReady ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="font-semibold text-gray-700">DataService Ready</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {dataStatus.isReady ? '✅ Online' : '❌ Offline'}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${dataStatus.materialsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="font-semibold text-gray-700">Materials Loaded</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {dataStatus.materialsCount}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${dataStatus.mlFactorsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="font-semibold text-gray-700">ML Factors</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {dataStatus.mlFactorsCount}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${materials.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="font-semibold text-gray-700">Store Materials</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {materials.length}
            </p>
          </div>
        </div>
        
        {dataStatus.error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error Detected</span>
            </div>
            <p className="text-red-700 mt-2">{dataStatus.error}</p>
          </div>
        )}
        
        {dataStatus.isReady && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-emerald-800 text-lg">System Operational</span>
            </div>
            <p className="text-emerald-700 font-medium">
              ✅ Machine learning data is working! The system has loaded {dataStatus.materialsCount} materials 
              with {dataStatus.mlFactorsCount} ML-enhanced factors available for predictions.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-1 rounded-full">
                <Brain className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">AI Ready</span>
              </div>
              <div className="flex items-center space-x-2 bg-teal-100 px-3 py-1 rounded-full">
                <Database className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">Data Connected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
