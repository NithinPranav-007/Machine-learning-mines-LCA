import { LCAParameters, LCAResult, CircularityMetrics } from '../types';
import { DataService } from './dataService';

// Mock AI service for parameter prediction and LCA calculations
export class AIService {
  
  // Simulate AI parameter prediction with confidence scoring
  static async predictMissingParameters(params: Partial<LCAParameters>): Promise<{
    predictions: Partial<LCAParameters>;
    confidence: number;
    predictedFields: string[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const predictions: Partial<LCAParameters> = {};
    const predictedFields: string[] = [];
    
    // AI predictions based on material type and existing parameters
    if (!params.transportDistance) {
      predictions.transportDistance = params.region === 'local' ? 150 : 800;
      predictedFields.push('transportDistance');
    }
    
    if (!params.recycledContent) {
      predictions.recycledContent = params.processType === 'circular' ? 0.75 : 0.15;
      predictedFields.push('recycledContent');
    }
    
    if (!params.energySource) {
      predictions.energySource = 'mixed-grid';
      predictedFields.push('energySource');
    }
    
    // Real confidence calculation based on data quality and ML factors
    const confidence = this.calculateRealConfidence(params);
    
    return {
      predictions,
      confidence,
      predictedFields
    };
  }
  
  // Calculate LCA impacts with AI-enhanced accuracy
  static async calculateLCA(params: LCAParameters): Promise<LCAResult> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Base calculations with material-specific factors
    const learned = DataService.getFactors(params.materialId, 'primary') || undefined;
    let materialFactors = learned || this.getMaterialFactors(params.materialId);

    // If we don't have learned factors from dataset, try calling local ML API
    if (!learned) {
      try {
        const features = {
          recycling_rate: params.recycledContent ?? 0.1,
          renewable_share: params.energySource === 'renewable' ? 1 : params.energySource === 'mixed-grid' ? 0.6 : 0.2,
          transport_km: params.transportDistance ?? 500,
          mci: 0.05,
          scrap_recovery_rate: 0.1
        };

        const carbonPred = await this.fetchModelPrediction(features, 'carbon');
        const energyPred = await this.fetchModelPrediction(features, 'energy');
        if (Number.isFinite(carbonPred) && Number.isFinite(energyPred)) {
          materialFactors = { carbonBase: carbonPred, energyBase: energyPred };
        }
      } catch (e) {
        // ignore and fall back to built-in factors
      }
    }
    const processMultiplier = params.processType === 'circular' ? 0.4 : 1.0;
    const recyclingBonus = params.recycledContent * 0.6;
    
    const carbonFootprint = (
      materialFactors.carbonBase * params.quantity * processMultiplier * 
      (1 - recyclingBonus) * (1 + params.transportDistance / 1000)
    );
    
    const energyConsumption = (
      materialFactors.energyBase * params.quantity * processMultiplier * 
      (1 - recyclingBonus * 0.8)
    );
    
    const circularityScore = this.calculateCircularityScore(params);
    
    const result: LCAResult = {
      id: `lca-${Date.now()}`,
      parameters: params,
      impacts: {
        carbonFootprint: Math.round(carbonFootprint * 100) / 100,
        energyConsumption: Math.round(energyConsumption * 100) / 100,
        waterUsage: Math.round(energyConsumption * 0.15 * 100) / 100,
        wasteGeneration: Math.round(carbonFootprint * 0.05 * 100) / 100,
        circularityScore: Math.round(circularityScore * 100) / 100
      },
      predictions: {
        confidence: 0.87,
        predictedParameters: ['transportDistance', 'recycledContent']
      },
      recommendations: this.generateRecommendations(params, circularityScore)
    };
    
    return result;
  }
  
  private static calculateRealConfidence(params: Partial<LCAParameters>): number {
    let confidence = 0.5; // Base confidence
    
    // Check if we have ML factors for this material
    const mlFactors = DataService.getFactors(params.materialId || '', 'primary');
    if (mlFactors) {
      confidence += 0.25; // ML factors available
    }
    
    // Data completeness factor
    const providedFields = Object.keys(params).filter(key => 
      params[key as keyof LCAParameters] !== undefined && 
      params[key as keyof LCAParameters] !== ''
    ).length;
    const totalFields = 7; // Total number of LCA parameters
    const completenessRatio = providedFields / totalFields;
    confidence += completenessRatio * 0.2;
    
    // Material type confidence (aluminum vs copper)
    if (params.materialId?.includes('al')) {
      confidence += 0.1; // Aluminum has more data
    }
    
    // Process type confidence
    if (params.processType === 'circular') {
      confidence += 0.05; // Circular processes have more predictable patterns
    }
    
    // Region confidence
    if (params.region === 'local') {
      confidence += 0.05; // Local data is more reliable
    }
    
    return Math.min(0.98, Math.max(0.3, confidence));
  }

  private static getMaterialFactors(materialId: string) {
    const factors: Record<string, { carbonBase: number; energyBase: number }> = {
      'al-6061': { carbonBase: 8.24, energyBase: 15.7 },
      'al_6061': { carbonBase: 8.24, energyBase: 15.7 },
      'al-1100': { carbonBase: 7.89, energyBase: 14.2 },
      'al_1100': { carbonBase: 7.89, energyBase: 14.2 },
      'cu-c101': { carbonBase: 3.88, energyBase: 42.3 },
      'cu_c101': { carbonBase: 3.88, energyBase: 42.3 },
      'cu-c110': { carbonBase: 3.92, energyBase: 41.8 }
      ,
      'cu_c110': { carbonBase: 3.92, energyBase: 41.8 }
    };
    
    return factors[materialId] || { carbonBase: 5.0, energyBase: 20.0 };
  }

  // Call local ML API (Flask) to get prediction for carbon or energy
  private static async fetchModelPrediction(features: Record<string, number>, target: 'carbon' | 'energy'): Promise<number | null> {
    try {
      const resp = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features, target, model: 'random_forest' })
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      if (typeof data.prediction === 'number') return data.prediction;
      return null;
    } catch (e) {
      return null;
    }
  }
  
  private static calculateCircularityScore(params: LCAParameters): number {
    let score = 0;
    
    // Recycled content contribution (35%)
    score += params.recycledContent * 0.35;
    
    // Process type contribution (25%)
    score += (params.processType === 'circular' ? 1 : 0) * 0.25;
    
    // End of life scenario (20%)
    const eolScore = params.endOfLifeScenario === 'recycling' ? 1 : 
                     params.endOfLifeScenario === 'reuse' ? 0.9 : 
                     params.endOfLifeScenario === 'repair' ? 0.8 : 0.2;
    score += eolScore * 0.2;
    
    // Transport efficiency (10%)
    score += Math.max(0, (1000 - params.transportDistance) / 1000) * 0.1;
    
    // Energy source contribution (10%)
    const energyScore = params.energySource === 'renewable' ? 1 :
                       params.energySource === 'mixed-grid' ? 0.6 : 0.2;
    score += energyScore * 0.1;
    
    return Math.min(1, score);
  }
  
  private static generateRecommendations(params: LCAParameters, circularityScore: number): string[] {
    const recommendations: string[] = [];
    
    if (params.recycledContent < 0.5) {
      recommendations.push('Increase recycled content to 50%+ for significant carbon reduction');
    }
    
    if (params.processType === 'linear') {
      recommendations.push('Consider circular processing to reduce environmental impact by 60%');
    }
    
    if (params.transportDistance > 500) {
      recommendations.push('Source materials locally to reduce transport emissions');
    }
    
    if (circularityScore < 0.6) {
      recommendations.push('Implement design for circularity principles to improve sustainability');
    }
    
    if (params.energySource === 'fossil') {
      recommendations.push('Switch to renewable energy sources for processing');
    }
    
    return recommendations;
  }
  
  // Calculate circular economy metrics
  static calculateCircularityMetrics(linearResult: LCAResult, circularResult: LCAResult): CircularityMetrics {
    const carbonReduction = ((linearResult.impacts.carbonFootprint - circularResult.impacts.carbonFootprint) / 
                            linearResult.impacts.carbonFootprint) * 100;
    
    const energyReduction = ((linearResult.impacts.energyConsumption - circularResult.impacts.energyConsumption) / 
                            linearResult.impacts.energyConsumption) * 100;
    
    // Enhanced economic benefit calculation
    const materialSavings = circularResult.parameters.recycledContent * 0.3; // 30% material cost savings
    const energySavings = energyReduction * 0.15; // 15% energy cost savings
    const wasteReduction = ((linearResult.impacts.wasteGeneration - circularResult.impacts.wasteGeneration) / 
                           linearResult.impacts.wasteGeneration) * 100;
    const wasteSavings = wasteReduction * 0.1; // 10% waste disposal cost savings
    
    const totalEconomicBenefit = materialSavings + energySavings + wasteSavings;
    
    return {
      materialCircularityIndicator: circularResult.impacts.circularityScore,
      recyclingRate: circularResult.parameters.recycledContent,
      energyRecovery: energyReduction,
      carbonReduction: carbonReduction,
      economicBenefit: Math.min(100, totalEconomicBenefit * 100) // Cap at 100%
    };
  }
}