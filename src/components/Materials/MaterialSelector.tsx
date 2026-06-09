import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { DataService } from '../../services/dataService';
import { Material } from '../../types';
import {
  CheckCircle,
  Recycle,
  Zap,
  Leaf,
  Sparkles,
  TrendingUp,
  Shield,
  Brain,
  Database,
  Search,
  SlidersHorizontal,
  Filter,
  LayoutGrid,
  Rows3,
  Star,
  X,
} from 'lucide-react';

export const MaterialSelector: React.FC = () => {
  const { materials, selectedMaterial, setSelectedMaterial } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [materialTypeFilter, setMaterialTypeFilter] = useState<'all' | 'aluminum' | 'copper'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lowest-carbon' | 'highest-recycling' | 'lowest-energy'>('name');
  const [showMLOnly, setShowMLOnly] = useState(false);
  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact');
  const [shortlist, setShortlist] = useState<string[]>([]);
  
  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);
  };
  
  const getMaterialColor = (type: string) => {
    return type === 'aluminum' 
      ? 'from-blue-500 to-cyan-500' 
      : 'from-orange-500 to-amber-500';
  };
  
  const getMaterialIcon = (type: string) => {
    return type === 'aluminum' ? 'Al' : 'Cu';
  };

  const getMLFactors = (materialId: string) => {
    return DataService.getFactors(materialId, 'primary');
  };

  const formatValue = (value: number, digits = 2) => {
    return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
  };

  const visibleMaterials = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = materials.filter((material) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        material.name.toLowerCase().includes(normalizedQuery) ||
        material.category.toLowerCase().includes(normalizedQuery);

      const matchesType = materialTypeFilter === 'all' || material.type === materialTypeFilter;
      const matchesML = !showMLOnly || !!getMLFactors(material.id);

      return matchesSearch && matchesType && matchesML;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'lowest-carbon':
          return a.carbonFootprint - b.carbonFootprint;
        case 'highest-recycling':
          return b.recyclingRate - a.recyclingRate;
        case 'lowest-energy':
          return a.energyIntensity - b.energyIntensity;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [materials, materialTypeFilter, searchQuery, showMLOnly, sortBy]);

  const bestCarbon = useMemo(() => {
    if (visibleMaterials.length === 0) return null;
    return [...visibleMaterials].sort((a, b) => a.carbonFootprint - b.carbonFootprint)[0];
  }, [visibleMaterials]);

  const bestRecycling = useMemo(() => {
    if (visibleMaterials.length === 0) return null;
    return [...visibleMaterials].sort((a, b) => b.recyclingRate - a.recyclingRate)[0];
  }, [visibleMaterials]);

  const shortlistMaterials = useMemo(
    () => materials.filter((material) => shortlist.includes(material.id)),
    [materials, shortlist]
  );

  const toggleShortlist = (materialId: string) => {
    setShortlist((current) =>
      current.includes(materialId)
        ? current.filter((id) => id !== materialId)
        : [...current, materialId].slice(-3)
    );
  };
  
  return (
    <div className="space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/70 via-teal-50/50 to-amber-50/40" />
      
      <div className="text-center space-y-4 relative z-10">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 px-4 py-2 rounded-full shadow-md border border-white/50 backdrop-blur-sm">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-bold text-teal-700">AI-Powered Material Selection</span>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 drop-shadow-sm">
            Select Material
          </h2>
          <p className="text-base sm:text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Choose from our comprehensive database of aluminum and copper alloys for precise LCA analysis
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-md">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">8,000+ Data Points</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-semibold text-gray-700">ML Enhanced</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700">Verified Data</span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg p-4 sm:p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Find the right alloy faster</h3>
            <p className="text-sm text-gray-700">Search, filter, and rank materials by sustainability metrics.</p>
          </div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              {visibleMaterials.length} of {materials.length} materials
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or category"
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <select
            value={materialTypeFilter}
            onChange={(e) => setMaterialTypeFilter(e.target.value as 'all' | 'aluminum' | 'copper')}
            className="w-full px-3 py-2.5 bg-white/90 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="all">All Material Types</option>
            <option value="aluminum">Aluminum only</option>
            <option value="copper">Copper only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'lowest-carbon' | 'highest-recycling' | 'lowest-energy')}
            className="w-full px-3 py-2.5 bg-white/90 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="lowest-carbon">Sort: Lowest Carbon Footprint</option>
            <option value="highest-recycling">Sort: Highest Recycling Rate</option>
            <option value="lowest-energy">Sort: Lowest Energy Intensity</option>
          </select>

          <button
            type="button"
            onClick={() => setShowMLOnly((current) => !current)}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              showMLOnly
                ? 'bg-sky-50 border-sky-300 text-sky-700'
                : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            ML Only
          </button>

          <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white/90 p-1">
            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                density === 'compact' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Compact
            </button>
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                density === 'comfortable' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
              }`}
            >
              <Rows3 className="w-4 h-4" />
              Comfortable
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
            <p className="text-xs font-semibold text-emerald-700">Best Carbon Option</p>
            <p className="text-sm font-bold text-emerald-900 mt-1">
              {bestCarbon ? `${bestCarbon.name} (${formatValue(bestCarbon.carbonFootprint)} kg CO2)` : 'No material available'}
            </p>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-3">
            <p className="text-xs font-semibold text-cyan-700">Best Recycling Option</p>
            <p className="text-sm font-bold text-cyan-900 mt-1">
              {bestRecycling ? `${bestRecycling.name} (${(bestRecycling.recyclingRate * 100).toFixed(0)}%)` : 'No material available'}
            </p>
          </div>
        </div>

        {shortlistMaterials.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                <Star className="w-4 h-4" />
                Quick Compare Shortlist ({shortlistMaterials.length}/3)
              </div>
              <button
                type="button"
                onClick={() => setShortlist([])}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {shortlistMaterials.map((material) => (
                <span
                  key={material.id}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-semibold text-slate-700"
                >
                  {material.name}
                  <button
                    type="button"
                    onClick={() => toggleShortlist(material.id)}
                    className="text-amber-700 hover:text-amber-900"
                    aria-label={`Remove ${material.name} from shortlist`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 relative z-10">
        {visibleMaterials.map((material, index) => (
          <div
            key={material.id}
            onClick={() => handleMaterialSelect(material)}
            className={`group relative ${density === 'compact' ? 'p-4' : 'p-6'} rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedMaterial?.id === material.id
                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-cyan-50/70 shadow-lg'
                : 'border-gray-200/70 hover:border-emerald-300 bg-white/85 backdrop-blur-md hover:bg-white hover:shadow-md'
            }`}
            style={{ 
              animationDelay: `${index * 60}ms`,
              animation: 'fade-in 0.35s ease-out'
            }}
          >
            {selectedMaterial?.id === material.id && (
              <div className="absolute top-3 right-3 z-20">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleShortlist(material.id);
              }}
              className={`absolute top-3 left-3 z-20 p-1.5 rounded-full border transition-colors ${
                shortlist.includes(material.id)
                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                  : 'bg-white text-gray-500 border-gray-200 hover:text-amber-600'
              }`}
              aria-label={`${shortlist.includes(material.id) ? 'Remove from' : 'Add to'} quick compare shortlist`}
            >
              <Star className={`w-4 h-4 ${shortlist.includes(material.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            
            <div className={`flex items-center gap-3 ${density === 'compact' ? 'mb-4 mt-3' : 'mb-6 mt-3'}`}>
              <div className={`relative ${density === 'compact' ? 'w-14 h-14 rounded-2xl' : 'w-16 h-16 rounded-2xl'} bg-gradient-to-br ${getMaterialColor(material.type)} flex items-center justify-center shadow-lg`}>
                <span className={`${density === 'compact' ? 'text-2xl' : 'text-2xl'} font-bold text-white`}>
                  {getMaterialIcon(material.type)}
                </span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 leading-tight">
                  {material.name}
                </h3>
                <p className="text-xs text-gray-700 font-semibold mb-2">{material.category}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-700 font-semibold">Verified</span>
                  </div>
                  {getMLFactors(material.id) && (
                    <div className="flex items-center gap-1 bg-sky-100 px-2 py-0.5 rounded-full">
                      <Brain className="w-3 h-3 text-sky-600" />
                      <span className="text-xs text-sky-700 font-semibold">ML Enhanced</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-white/90 to-emerald-50/60 rounded-xl p-3 border border-white/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Recycle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Recycling</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-gray-900">
                    {(material.recyclingRate * 100).toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${material.recyclingRate * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/90 to-yellow-50/60 rounded-xl p-3 border border-white/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Energy</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-gray-900 truncate">
                    {formatValue(material.energyIntensity)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">MJ/kg</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs text-gray-600 font-medium">Efficiency index</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/90 to-green-50/60 rounded-xl p-3 border border-white/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Carbon</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-gray-900 truncate">
                    {formatValue(material.carbonFootprint)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">kg CO2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-gray-600 font-medium">Impact score</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/90 to-sky-50/60 rounded-xl p-3 border border-white/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">ML Data</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-gray-900">
                    {getMLFactors(material.id) ? '✓' : '✗'}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-xs text-gray-600 font-medium">Enhanced</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleMaterials.length === 0 && (
        <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/70 p-8 text-center shadow-lg">
          <h4 className="text-xl font-bold text-gray-900">No materials match your filters</h4>
          <p className="text-gray-600 mt-2">Try clearing the search term or switching the filter options.</p>
        </div>
      )}
      
      {selectedMaterial && (
        <div className="relative z-10">
          <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-800 mb-1">
                  {selectedMaterial.name} Selected
                </h3>
                <p className="text-emerald-700 text-sm font-medium mb-2">
                  Ready to proceed with AI-enhanced LCA analysis
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <Brain className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">ML Enhanced</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-teal-100 px-2.5 py-1 rounded-full">
                    <Database className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-semibold text-teal-700">Data Ready</span>
                  </div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-emerald-600 font-medium mb-1">Next Step</div>
                <div className="text-base font-bold text-emerald-800">Analysis</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};