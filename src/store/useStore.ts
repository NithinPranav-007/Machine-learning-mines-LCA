import { create } from 'zustand';
import { Material, LCAParameters, LCAResult } from '../types';
import { DataService } from '../services/dataService';

interface AppState {
  // Materials
  materials: Material[];
  selectedMaterial: Material | null;
  
  // LCA Analysis
  currentAnalysis: LCAParameters | null;
  analysisResults: LCAResult[];
  isAnalyzing: boolean;
  
  // UI State
  activeTab: 'materials' | 'analysis' | 'results' | 'comparison' | 'dashboard';
  
  // Actions
  setSelectedMaterial: (material: Material | null) => void;
  setCurrentAnalysis: (analysis: LCAParameters | null) => void;
  addAnalysisResult: (result: LCAResult) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setActiveTab: (tab: 'materials' | 'analysis' | 'results' | 'comparison' | 'dashboard') => void;
  loadMaterials: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state - will be populated by DataService
  materials: [],
  selectedMaterial: null,
  currentAnalysis: null,
  analysisResults: [],
  isAnalyzing: false,
  activeTab: 'materials',
  
  // Actions
  setSelectedMaterial: (material) => set({ selectedMaterial: material }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  addAnalysisResult: (result) => set((state) => ({ 
    analysisResults: [...state.analysisResults, result] 
  })),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Load materials from DataService
  loadMaterials: () => {
    if (DataService.isReady()) {
      const materials = DataService.getMaterials();
      set({ materials });
      console.log(`Store loaded ${materials.length} materials from dataset`);
    } else {
      // Fallback to hardcoded materials if DataService not ready
      const fallbackMaterials: Material[] = [
        {
          id: 'al-6061',
          name: 'Aluminum 6061',
          type: 'aluminum',
          category: 'Structural Alloy',
          density: 2.7,
          recyclingRate: 0.95,
          energyIntensity: 15.7,
          carbonFootprint: 8.24
        },
        {
          id: 'al-1100',
          name: 'Aluminum 1100',
          type: 'aluminum',
          category: 'Pure Aluminum',
          density: 2.71,
          recyclingRate: 0.98,
          energyIntensity: 14.2,
          carbonFootprint: 7.89
        },
        {
          id: 'cu-c101',
          name: 'Copper C101',
          type: 'copper',
          category: 'Oxygen-Free Copper',
          density: 8.96,
          recyclingRate: 0.85,
          energyIntensity: 42.3,
          carbonFootprint: 3.88
        },
        {
          id: 'cu-c110',
          name: 'Copper C110',
          type: 'copper',
          category: 'Electrolytic Tough Pitch',
          density: 8.94,
          recyclingRate: 0.87,
          energyIntensity: 41.8,
          carbonFootprint: 3.92
        }
      ];
      set({ materials: fallbackMaterials });
    }
  }
}));