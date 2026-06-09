export interface Material {
  id: string;
  name: string;
  type: 'aluminum' | 'copper';
  category: string;
  density: number;
  recyclingRate: number;
  energyIntensity: number;
  carbonFootprint: number;
}

export interface LCAParameters {
  materialId: string;
  quantity: number;
  processType: 'linear' | 'circular';
  region: string;
  transportDistance: number;
  energySource: string;
  recycledContent: number;
  endOfLifeScenario: string;
}

export interface LCAResult {
  id: string;
  parameters: LCAParameters;
  impacts: {
    carbonFootprint: number;
    energyConsumption: number;
    waterUsage: number;
    wasteGeneration: number;
    circularityScore: number;
  };
  predictions: {
    confidence: number;
    predictedParameters: string[];
  };
  recommendations: string[];
}

export interface FlowData {
  source: string;
  target: string;
  value: number;
  type: 'material' | 'energy' | 'waste';
}

export interface CircularityMetrics {
  materialCircularityIndicator: number;
  recyclingRate: number;
  energyRecovery: number;
  carbonReduction: number;
  economicBenefit: number;
}

// Gamification types
export type { BadgeType, Badge, GameificationState } from './gamification';
export { BADGES } from './gamification';