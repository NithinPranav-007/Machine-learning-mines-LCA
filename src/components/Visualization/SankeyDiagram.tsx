import React from 'react';
import { LCAResult } from '../../types';

interface SankeyNode {
  id: string;
  name: string;
  color: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color: string;
}

interface SankeyDiagramProps {
  linearResult: LCAResult;
  circularResult: LCAResult;
}

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ linearResult, circularResult }) => {
  // Define nodes for the Sankey diagram
  const nodes: SankeyNode[] = [
    { id: 'raw-material', name: 'Raw Material', color: '#8b5cf6' },
    { id: 'recycled-material', name: 'Recycled Material', color: '#10b981' },
    { id: 'production', name: 'Production', color: '#3b82f6' },
    { id: 'use-phase', name: 'Use Phase', color: '#f59e0b' },
    { id: 'waste', name: 'Waste', color: '#ef4444' },
    { id: 'recycling', name: 'Recycling', color: '#06b6d4' },
    { id: 'reuse', name: 'Reuse', color: '#84cc16' }
  ];

  // Calculate flow values based on results
  const getFlowData = () => {
    const totalQuantity = linearResult.parameters.quantity;
    const recycledContent = circularResult.parameters.recycledContent;
    const recyclingRate = 0.85; // From material properties
    
    return {
      linear: {
        nodes: nodes,
        links: [
          {
            source: 'raw-material',
            target: 'production',
            value: totalQuantity,
            color: '#8b5cf6'
          },
          {
            source: 'production',
            target: 'use-phase',
            value: totalQuantity,
            color: '#3b82f6'
          },
          {
            source: 'use-phase',
            target: 'waste',
            value: totalQuantity,
            color: '#ef4444'
          }
        ]
      },
      circular: {
        nodes: nodes,
        links: [
          {
            source: 'raw-material',
            target: 'production',
            value: totalQuantity * (1 - recycledContent),
            color: '#8b5cf6'
          },
          {
            source: 'recycled-material',
            target: 'production',
            value: totalQuantity * recycledContent,
            color: '#10b981'
          },
          {
            source: 'production',
            target: 'use-phase',
            value: totalQuantity,
            color: '#3b82f6'
          },
          {
            source: 'use-phase',
            target: 'recycling',
            value: totalQuantity * recyclingRate,
            color: '#06b6d4'
          },
          {
            source: 'recycling',
            target: 'recycled-material',
            value: totalQuantity * recyclingRate * 0.8,
            color: '#10b981'
          },
          {
            source: 'use-phase',
            target: 'reuse',
            value: totalQuantity * 0.1,
            color: '#84cc16'
          },
          {
            source: 'reuse',
            target: 'use-phase',
            value: totalQuantity * 0.1,
            color: '#84cc16'
          },
          {
            source: 'use-phase',
            target: 'waste',
            value: totalQuantity * (1 - recyclingRate - 0.1),
            color: '#ef4444'
          }
        ]
      }
    };
  };

  const flowData = getFlowData();

  return (
    <div className="space-y-8">
      {/* Linear Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Linear Material Flow</h3>
        <div className="relative">
          <div className="flex items-center justify-between py-4">
            {flowData.linear.nodes.slice(0, 4).map((node, index) => (
              <div key={node.id} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: node.color }}
                >
                  {node.name.split(' ')[0]}
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">{node.name}</p>
              </div>
            ))}
          </div>
          
          {/* Flow arrows */}
          <div className="absolute top-8 left-0 right-0 flex justify-between">
            {flowData.linear.links.map((link, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div className="flex-1 h-1 bg-gray-200 rounded-full mx-2">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: link.color,
                      width: '100%'
                    }}
                  />
                </div>
                {index < flowData.linear.links.length - 1 && (
                  <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-b-2 border-t-transparent border-b-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Raw Material Input</p>
            <p className="font-semibold text-gray-900">{linearResult.parameters.quantity} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Waste Output</p>
            <p className="font-semibold text-red-600">{linearResult.parameters.quantity} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Efficiency</p>
            <p className="font-semibold text-gray-900">0%</p>
          </div>
        </div>
      </div>

      {/* Circular Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Circular Material Flow</h3>
        <div className="relative">
          <div className="grid grid-cols-4 gap-4 py-4">
            {flowData.circular.nodes.map((node, index) => (
              <div key={node.id} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: node.color }}
                >
                  {node.name.split(' ')[0]}
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">{node.name}</p>
              </div>
            ))}
          </div>
          
          {/* Circular flow visualization */}
          <div className="absolute top-8 left-0 right-0">
            <svg width="100%" height="200" className="overflow-visible">
              {/* Main flow lines */}
              <path
                d="M 50 100 Q 200 50 350 100 Q 500 150 650 100"
                stroke="#3b82f6"
                strokeWidth="4"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              
              {/* Recycling loop */}
              <path
                d="M 350 100 Q 300 200 200 200 Q 100 200 100 150 Q 100 100 200 100"
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead-green)"
              />
              
              {/* Reuse loop */}
              <path
                d="M 500 100 Q 550 50 600 50 Q 650 50 700 100"
                stroke="#84cc16"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead-yellow)"
              />
              
              {/* Waste output */}
              <path
                d="M 650 100 L 750 100"
                stroke="#ef4444"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead-red)"
              />
              
              {/* Arrow markers */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
                <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#84cc16" />
                </marker>
                <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Raw Material Input</p>
            <p className="font-semibold text-gray-900">
              {Math.round(circularResult.parameters.quantity * (1 - circularResult.parameters.recycledContent))} kg
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Recycled Input</p>
            <p className="font-semibold text-emerald-600">
              {Math.round(circularResult.parameters.quantity * circularResult.parameters.recycledContent)} kg
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Waste Output</p>
            <p className="font-semibold text-red-600">
              {Math.round(circularResult.parameters.quantity * 0.15)} kg
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Efficiency</p>
            <p className="font-semibold text-emerald-600">85%</p>
          </div>
        </div>
      </div>

      {/* Flow Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Flow Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600">Raw Material</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm text-gray-600">Recycled Material</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Production/Use</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Waste</span>
          </div>
        </div>
      </div>
    </div>
  );
};
