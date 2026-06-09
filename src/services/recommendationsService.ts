import { LCAParameters, LCAResult, CircularityMetrics } from '../types';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'carbon' | 'energy' | 'water' | 'waste' | 'circularity' | 'economic';
  potentialSavings: {
    carbonReduction?: number; // percentage
    energyReduction?: number; // percentage
    costSavings?: number; // percentage
  };
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    timeframe: 'immediate' | 'short-term' | 'long-term';
    cost: 'low' | 'medium' | 'high';
  };
  priority: number; // 1-10, higher is more important
}

export class RecommendationsService {
  
  static generateRecommendations(
    linearResult: LCAResult,
    circularResult: LCAResult,
    metrics: CircularityMetrics
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Carbon reduction recommendations
    if (metrics.carbonReduction < 30) {
      recommendations.push({
        id: 'increase-recycled-content',
        title: 'Increase Recycled Content',
        description: `Boost recycled content from ${(circularResult.parameters.recycledContent * 100).toFixed(0)}% to 60%+ for significant carbon reduction`,
        impact: 'high',
        category: 'carbon',
        potentialSavings: {
          carbonReduction: 25,
          costSavings: 15
        },
        implementation: {
          difficulty: 'medium',
          timeframe: 'short-term',
          cost: 'medium'
        },
        priority: 9
      });
    }
    
    if (linearResult.parameters.energySource === 'fossil') {
      recommendations.push({
        id: 'switch-renewable-energy',
        title: 'Switch to Renewable Energy',
        description: 'Replace fossil fuel energy with renewable sources (solar, wind, hydro) for processing',
        impact: 'high',
        category: 'energy',
        potentialSavings: {
          carbonReduction: 40,
          energyReduction: 15
        },
        implementation: {
          difficulty: 'hard',
          timeframe: 'long-term',
          cost: 'high'
        },
        priority: 8
      });
    }
    
    if (linearResult.parameters.transportDistance > 500) {
      recommendations.push({
        id: 'local-sourcing',
        title: 'Implement Local Sourcing',
        description: 'Source materials from local suppliers to reduce transport emissions and costs',
        impact: 'medium',
        category: 'carbon',
        potentialSavings: {
          carbonReduction: 20,
          costSavings: 10
        },
        implementation: {
          difficulty: 'medium',
          timeframe: 'short-term',
          cost: 'medium'
        },
        priority: 7
      });
    }
    
    // Circularity recommendations
    if (metrics.materialCircularityIndicator < 0.6) {
      recommendations.push({
        id: 'design-for-circularity',
        title: 'Design for Circularity',
        description: 'Implement design principles that enable easy disassembly, repair, and material recovery',
        impact: 'high',
        category: 'circularity',
        potentialSavings: {
          carbonReduction: 35,
          costSavings: 25
        },
        implementation: {
          difficulty: 'hard',
          timeframe: 'long-term',
          cost: 'high'
        },
        priority: 9
      });
    }
    
    if (circularResult.parameters.endOfLifeScenario !== 'recycling') {
      recommendations.push({
        id: 'improve-end-of-life',
        title: 'Improve End-of-Life Management',
        description: 'Establish proper recycling and recovery systems for end-of-life products',
        impact: 'medium',
        category: 'circularity',
        potentialSavings: {
          carbonReduction: 15,
          costSavings: 20
        },
        implementation: {
          difficulty: 'medium',
          timeframe: 'short-term',
          cost: 'medium'
        },
        priority: 6
      });
    }
    
    // Water and waste recommendations
    if (linearResult.impacts.waterUsage > circularResult.impacts.waterUsage * 1.5) {
      recommendations.push({
        id: 'water-efficiency',
        title: 'Improve Water Efficiency',
        description: 'Implement water recycling and efficiency measures in production processes',
        impact: 'medium',
        category: 'water',
        potentialSavings: {
          costSavings: 12
        },
        implementation: {
          difficulty: 'medium',
          timeframe: 'short-term',
          cost: 'medium'
        },
        priority: 5
      });
    }
    
    if (linearResult.impacts.wasteGeneration > circularResult.impacts.wasteGeneration * 2) {
      recommendations.push({
        id: 'waste-reduction',
        title: 'Implement Waste Reduction',
        description: 'Adopt lean manufacturing and waste minimization strategies',
        impact: 'medium',
        category: 'waste',
        potentialSavings: {
          costSavings: 18
        },
        implementation: {
          difficulty: 'easy',
          timeframe: 'immediate',
          cost: 'low'
        },
        priority: 6
      });
    }
    
    // Economic recommendations
    if (metrics.economicBenefit < 20) {
      recommendations.push({
        id: 'circular-business-model',
        title: 'Adopt Circular Business Model',
        description: 'Transition to service-based models (leasing, sharing) to maximize resource utilization',
        impact: 'high',
        category: 'economic',
        potentialSavings: {
          costSavings: 40,
          carbonReduction: 30
        },
        implementation: {
          difficulty: 'hard',
          timeframe: 'long-term',
          cost: 'high'
        },
        priority: 8
      });
    }
    
    // Process optimization
    if (linearResult.parameters.processType === 'linear') {
      recommendations.push({
        id: 'process-optimization',
        title: 'Optimize Manufacturing Process',
        description: 'Implement advanced manufacturing techniques and process optimization',
        impact: 'medium',
        category: 'energy',
        potentialSavings: {
          energyReduction: 20,
          costSavings: 15
        },
        implementation: {
          difficulty: 'medium',
          timeframe: 'short-term',
          cost: 'medium'
        },
        priority: 7
      });
    }
    
    // Sort by priority (highest first)
    return recommendations.sort((a, b) => b.priority - a.priority);
  }
  
  static getRecommendationImpact(recommendation: Recommendation): string {
    const impactColors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50'
    };
    
    return impactColors[recommendation.impact];
  }
  
  static getImplementationDifficulty(recommendation: Recommendation): string {
    const difficultyColors = {
      easy: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      hard: 'text-red-600 bg-red-50'
    };
    
    return difficultyColors[recommendation.implementation.difficulty];
  }
  
  static getCategoryIcon(category: Recommendation['category']): string {
    const icons = {
      carbon: '🌍',
      energy: '⚡',
      water: '💧',
      waste: '♻️',
      circularity: '🔄',
      economic: '💰'
    };
    
    return icons[category];
  }
}
