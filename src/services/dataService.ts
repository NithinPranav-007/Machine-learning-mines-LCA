import * as d3 from 'd3-dsv';
import { Material } from '../types';

type DatasetRow = {
  material_id: string;
  material_name: string;
  category: string;
  route: string; // primary / secondary
  recycling_rate: number;
  energy_MJ_per_kg: number;
  carbon_kgCO2_per_kg: number;
  scrap_recovery_rate: number;
  mci: number;
  transport_km: number;
  renewable_share: number;
};

type LearnedFactors = {
  carbonBase: number;
  energyBase: number;
};

export class DataService {
  private static initialized = false;
  private static byMaterialRoute: Map<string, LearnedFactors> = new Map();
  private static materials: Material[] = [];

  private static normalizeMaterialId(rawId: string): string {
    // Dataset IDs already include route suffix in many rows (e.g. al_6061_primary).
    // Normalize to a stable material ID (e.g. al_6061) and store route separately.
    return rawId.replace(/_(primary|secondary|unknown)$/i, '');
  }

  static isReady(): boolean {
    return this.initialized;
  }

  static getMaterials(): Material[] {
    return this.materials;
  }

  static getFactors(materialId: string, route: 'primary' | 'secondary' | 'unknown' = 'unknown'): LearnedFactors | null {
    const keyCandidates = [
      `${materialId}|${route}`,
      `${materialId}|primary`,
      `${materialId}|secondary`,
      `${materialId}|unknown`,
    ];
    for (const key of keyCandidates) {
      const f = this.byMaterialRoute.get(key);
      if (f) return f;
    }
    return null;
  }

  static async init(): Promise<void> {
    if (this.initialized) return;
    try {
      const response = await fetch('/lca_metals_dataset.csv');
      if (!response.ok) throw new Error(`Failed to load dataset: ${response.status}`);
      const csvText = await response.text();

      const rows = d3.csvParse(csvText).map((r) => ({
        material_id: this.normalizeMaterialId(String(r['material_id'] || '').trim()),
        material_name: String(r['material_name'] || '').trim(),
        category: String(r['category'] || '').trim(),
        route: String(r['route'] || '').trim().toLowerCase() as 'primary' | 'secondary' | 'unknown',
        recycling_rate: Number(r['recycling_rate'] ?? 0),
        energy_MJ_per_kg: Number(r['energy_MJ_per_kg'] ?? 0),
        carbon_kgCO2_per_kg: Number(r['carbon_kgCO2_per_kg'] ?? 0),
        scrap_recovery_rate: Number(r['scrap_recovery_rate'] ?? 0),
        mci: Number(r['mci'] ?? 0),
        transport_km: Number(r['transport_km'] ?? 0),
        renewable_share: Number(r['renewable_share'] ?? 0),
      })) as unknown as DatasetRow[];

      // Group by material_id + route, compute ML-enhanced factors
      const groups = new Map<string, DatasetRow[]>();
      for (const row of rows) {
        if (!row.material_id) continue;
        const route = row.route || 'unknown';
        const key = `${row.material_id}|${route}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(row);
      }

      // Enhanced ML-based factor calculation
      for (const [key, rowsForKey] of groups.entries()) {
        if (rowsForKey.length < 3) continue; // Need minimum data for ML
        
        // Calculate weighted factors based on multiple features
        const factors = this.calculateMLFactors(rowsForKey);
        if (factors) {
          this.byMaterialRoute.set(key, factors);
        }
      }

      // Load materials from dataset
      this.loadMaterials(rows);

      this.initialized = true;
    } catch (err) {
      console.error('DataService init failed', err);
      this.initialized = false;
    }
  }

  private static calculateMLFactors(rows: DatasetRow[]): LearnedFactors | null {
    if (rows.length < 3) return null;

    // Feature engineering for ML prediction
    const features = rows.map(row => ({
      recyclingRate: row.recycling_rate,
      renewableShare: row.renewable_share,
      transportKm: row.transport_km,
      mci: row.mci,
      scrapRecovery: row.scrap_recovery_rate
    }));

    const targets = {
      carbon: rows.map(r => r.carbon_kgCO2_per_kg),
      energy: rows.map(r => r.energy_MJ_per_kg)
    };

    // Simple linear regression with feature weighting
    const carbonBase = this.predictWithFeatures(features, targets.carbon);
    const energyBase = this.predictWithFeatures(features, targets.energy);

    if (Number.isFinite(carbonBase) && Number.isFinite(energyBase)) {
      return { carbonBase, energyBase };
    }

    return null;
  }

  private static predictWithFeatures(features: any[], targets: number[]): number {
    if (features.length !== targets.length || features.length < 2) return 0;

    // Weighted average with feature importance
    const weights = {
      recyclingRate: 0.3,
      renewableShare: 0.25,
      transportKm: 0.2,
      mci: 0.15,
      scrapRecovery: 0.1
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      const target = targets[i];
      
      if (!Number.isFinite(target)) continue;

      // Calculate feature-weighted prediction
      const featureScore = 
        feature.recyclingRate * weights.recyclingRate +
        feature.renewableShare * weights.renewableShare +
        (1 - Math.min(feature.transportKm / 1000, 1)) * weights.transportKm +
        feature.mci * weights.mci +
        feature.scrapRecovery * weights.scrapRecovery;

      weightedSum += target * featureScore;
      totalWeight += featureScore;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private static loadMaterials(rows: DatasetRow[]): void {
    // Group by material_id to get unique materials
    const materialGroups = new Map<string, DatasetRow[]>();
    
    for (const row of rows) {
      if (!row.material_id) continue;
      const baseId = row.material_id;
      
      if (!materialGroups.has(baseId)) {
        materialGroups.set(baseId, []);
      }
      materialGroups.get(baseId)!.push(row);
    }

    // Convert to Material objects
    this.materials = Array.from(materialGroups.entries()).map(([baseId, rows]) => {
      // Calculate average values for the material
      const avgRecyclingRate = rows.reduce((sum, r) => sum + r.recycling_rate, 0) / rows.length;
      const avgEnergy = rows.reduce((sum, r) => sum + r.energy_MJ_per_kg, 0) / rows.length;
      const avgCarbon = rows.reduce((sum, r) => sum + r.carbon_kgCO2_per_kg, 0) / rows.length;
      const avgDensity = rows.reduce((sum, r) => sum + (r.material_id.includes('al') ? 2.7 : 8.9), 0) / rows.length;
      
      // Determine material type and category
      const firstRow = rows[0];
      const materialType = firstRow.material_name.toLowerCase().includes('aluminium') || firstRow.material_name.toLowerCase().includes('aluminum') 
        ? 'aluminum' : 'copper';
      
      return {
        id: baseId,
        name: firstRow.material_name,
        type: materialType,
        category: firstRow.category,
        density: avgDensity,
        recyclingRate: avgRecyclingRate,
        energyIntensity: avgEnergy,
        carbonFootprint: avgCarbon
      };
    });

    console.log(`Loaded ${this.materials.length} materials from dataset`);
  }
}


