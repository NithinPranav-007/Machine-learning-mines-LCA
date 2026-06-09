import { LCAResult, CircularityMetrics } from '../types';
import { Recommendation } from './recommendationsService';

export interface ExportData {
  analysisResults: LCAResult[];
  linearResult?: LCAResult;
  circularResult?: LCAResult;
  metrics?: CircularityMetrics;
  recommendations?: Recommendation[];
  materialName?: string;
  exportDate: string;
}

export class ExportService {
  
  static exportToPDF(data: ExportData): void {
    const content = this.generatePDFContent(data);
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LCA_Report_${data.materialName || 'Analysis'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  static exportToCSV(data: ExportData): void {
    const csvContent = this.generateCSVContent(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LCA_Data_${data.materialName || 'Analysis'}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  static exportToJSON(data: ExportData): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LCA_Data_${data.materialName || 'Analysis'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  private static generatePDFContent(data: ExportData): string {
    const { analysisResults, linearResult, circularResult, metrics, recommendations, materialName, exportDate } = data;
    const latestResult = analysisResults[analysisResults.length - 1];
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LCA Analysis Report - ${materialName || 'Material Analysis'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 8px; min-width: 150px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #10b981; }
        .metric-label { font-size: 14px; color: #666; }
        .recommendation { margin: 15px 0; padding: 15px; border-left: 4px solid #10b981; background: #f8f9fa; }
        .high-impact { border-left-color: #ef4444; }
        .medium-impact { border-left-color: #f59e0b; }
        .low-impact { border-left-color: #10b981; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #10b981; color: white; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌍 Life Cycle Assessment Report</h1>
        <h2>${materialName || 'Material Analysis'}</h2>
        <p>Generated on: ${exportDate}</p>
    </div>

    <div class="section">
        <h2>📊 Executive Summary</h2>
        <div class="metric">
            <div class="metric-value">${latestResult.impacts.carbonFootprint.toFixed(2)}</div>
            <div class="metric-label">Carbon Footprint (kg CO₂)</div>
        </div>
        <div class="metric">
            <div class="metric-value">${latestResult.impacts.energyConsumption.toFixed(2)}</div>
            <div class="metric-label">Energy Consumption (MJ)</div>
        </div>
        <div class="metric">
            <div class="metric-value">${(latestResult.impacts.circularityScore * 100).toFixed(1)}%</div>
            <div class="metric-label">Circularity Score</div>
        </div>
    </div>

    ${linearResult && circularResult ? `
    <div class="section">
        <h2>🔄 Linear vs Circular Comparison</h2>
        <table>
            <tr>
                <th>Impact Category</th>
                <th>Linear Process</th>
                <th>Circular Process</th>
                <th>Improvement</th>
            </tr>
            <tr>
                <td>Carbon Footprint (kg CO₂)</td>
                <td>${linearResult.impacts.carbonFootprint.toFixed(2)}</td>
                <td>${circularResult.impacts.carbonFootprint.toFixed(2)}</td>
                <td>${(((linearResult.impacts.carbonFootprint - circularResult.impacts.carbonFootprint) / linearResult.impacts.carbonFootprint) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
                <td>Energy Consumption (MJ)</td>
                <td>${linearResult.impacts.energyConsumption.toFixed(2)}</td>
                <td>${circularResult.impacts.energyConsumption.toFixed(2)}</td>
                <td>${(((linearResult.impacts.energyConsumption - circularResult.impacts.energyConsumption) / linearResult.impacts.energyConsumption) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
                <td>Water Usage (L)</td>
                <td>${linearResult.impacts.waterUsage.toFixed(2)}</td>
                <td>${circularResult.impacts.waterUsage.toFixed(2)}</td>
                <td>${(((linearResult.impacts.waterUsage - circularResult.impacts.waterUsage) / linearResult.impacts.waterUsage) * 100).toFixed(1)}%</td>
            </tr>
        </table>
    </div>
    ` : ''}

    ${metrics ? `
    <div class="section">
        <h2>📈 Circularity Metrics</h2>
        <div class="metric">
            <div class="metric-value">${(metrics.materialCircularityIndicator * 100).toFixed(1)}%</div>
            <div class="metric-label">Material Circularity Indicator</div>
        </div>
        <div class="metric">
            <div class="metric-value">${(metrics.recyclingRate * 100).toFixed(1)}%</div>
            <div class="metric-label">Recycling Rate</div>
        </div>
        <div class="metric">
            <div class="metric-value">${metrics.carbonReduction.toFixed(1)}%</div>
            <div class="metric-label">Carbon Reduction</div>
        </div>
        <div class="metric">
            <div class="metric-value">${metrics.economicBenefit.toFixed(1)}%</div>
            <div class="metric-label">Economic Benefit</div>
        </div>
    </div>
    ` : ''}

    ${recommendations && recommendations.length > 0 ? `
    <div class="section">
        <h2>💡 AI Recommendations</h2>
        ${recommendations.map(rec => `
            <div class="recommendation ${rec.impact}-impact">
                <h3>${rec.title}</h3>
                <p>${rec.description}</p>
                <p><strong>Impact:</strong> ${rec.impact.toUpperCase()} | 
                   <strong>Difficulty:</strong> ${rec.implementation.difficulty.toUpperCase()} | 
                   <strong>Timeframe:</strong> ${rec.implementation.timeframe}</p>
                ${rec.potentialSavings.carbonReduction ? `<p><strong>Potential Carbon Reduction:</strong> ${rec.potentialSavings.carbonReduction}%</p>` : ''}
                ${rec.potentialSavings.costSavings ? `<p><strong>Potential Cost Savings:</strong> ${rec.potentialSavings.costSavings}%</p>` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <h2>🔬 Analysis Parameters</h2>
        <table>
            <tr>
                <th>Parameter</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Material</td>
                <td>${latestResult.parameters.materialId}</td>
            </tr>
            <tr>
                <td>Quantity (kg)</td>
                <td>${latestResult.parameters.quantity}</td>
            </tr>
            <tr>
                <td>Process Type</td>
                <td>${latestResult.parameters.processType}</td>
            </tr>
            <tr>
                <td>Transport Distance (km)</td>
                <td>${latestResult.parameters.transportDistance}</td>
            </tr>
            <tr>
                <td>Energy Source</td>
                <td>${latestResult.parameters.energySource}</td>
            </tr>
            <tr>
                <td>Recycled Content</td>
                <td>${(latestResult.parameters.recycledContent * 100).toFixed(1)}%</td>
            </tr>
            <tr>
                <td>End of Life Scenario</td>
                <td>${latestResult.parameters.endOfLifeScenario}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Generated by AI-Powered LCA Platform | ${exportDate}</p>
        <p>This report provides environmental impact assessment and circular economy insights for sustainable decision-making.</p>
    </div>
</body>
</html>
    `;
  }
  
  private static generateCSVContent(data: ExportData): string {
    const { analysisResults, linearResult, circularResult, metrics, recommendations, materialName, exportDate } = data;
    const latestResult = analysisResults[analysisResults.length - 1];
    
    let csv = `LCA Analysis Report,${materialName || 'Material Analysis'},${exportDate}\n`;
    csv += `\nEnvironmental Impacts\n`;
    csv += `Metric,Value,Unit\n`;
    csv += `Carbon Footprint,${latestResult.impacts.carbonFootprint},kg CO₂\n`;
    csv += `Energy Consumption,${latestResult.impacts.energyConsumption},MJ\n`;
    csv += `Water Usage,${latestResult.impacts.waterUsage},L\n`;
    csv += `Waste Generation,${latestResult.impacts.wasteGeneration},kg\n`;
    csv += `Circularity Score,${latestResult.impacts.circularityScore * 100},%\n`;
    
    if (linearResult && circularResult) {
      csv += `\nLinear vs Circular Comparison\n`;
      csv += `Impact Category,Linear Process,Circular Process,Improvement (%)\n`;
      csv += `Carbon Footprint,${linearResult.impacts.carbonFootprint},${circularResult.impacts.carbonFootprint},${(((linearResult.impacts.carbonFootprint - circularResult.impacts.carbonFootprint) / linearResult.impacts.carbonFootprint) * 100).toFixed(1)}\n`;
      csv += `Energy Consumption,${linearResult.impacts.energyConsumption},${circularResult.impacts.energyConsumption},${(((linearResult.impacts.energyConsumption - circularResult.impacts.energyConsumption) / linearResult.impacts.energyConsumption) * 100).toFixed(1)}\n`;
    }
    
    if (metrics) {
      csv += `\nCircularity Metrics\n`;
      csv += `Metric,Value\n`;
      csv += `Material Circularity Indicator,${metrics.materialCircularityIndicator * 100}\n`;
      csv += `Recycling Rate,${metrics.recyclingRate * 100}\n`;
      csv += `Carbon Reduction,${metrics.carbonReduction}\n`;
      csv += `Economic Benefit,${metrics.economicBenefit}\n`;
    }
    
    if (recommendations && recommendations.length > 0) {
      csv += `\nRecommendations\n`;
      csv += `Title,Description,Impact,Difficulty,Priority\n`;
      recommendations.forEach(rec => {
        csv += `"${rec.title}","${rec.description}",${rec.impact},${rec.implementation.difficulty},${rec.priority}\n`;
      });
    }
    
    return csv;
  }
}
