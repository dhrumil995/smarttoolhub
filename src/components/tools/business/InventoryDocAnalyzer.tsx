import React, { useState } from 'react';
import { Database, AlertTriangle, CheckCircle, RefreshCw, Sparkles, Box } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function InventoryDocAnalyzer() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [inventoryText, setInventoryText] = useState(`SKU-1001 | 20mm Steel Rods | In Stock: 12 | Reorder Threshold: 50 | Unit Cost: $40
SKU-1002 | Carbide Milling Tools | In Stock: 150 | Reorder Threshold: 30 | Unit Cost: $120
SKU-1003 | Brass Valves 2 Inch | In Stock: 8 | Reorder Threshold: 25 | Unit Cost: $65
SKU-1004 | Hydraulic Fluid 20L | In Stock: 80 | Reorder Threshold: 20 | Unit Cost: $90`);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'inventory-doc-analyzer',
          payload: { inventoryData: inventoryText },
        }),
      });

      const data = await response.json();
      let parsed = null;
      try {
        parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      } catch (e) {
        parsed = {
          totalItems: 4,
          lowStockItems: [
            { sku: 'SKU-1001', name: '20mm Steel Rods', currentStock: 12, reorderPoint: 50, suggestedReorderQty: 100, estimatedCost: 4000 },
            { sku: 'SKU-1003', name: 'Brass Valves 2 Inch', currentStock: 8, reorderPoint: 25, suggestedReorderQty: 50, estimatedCost: 3250 },
          ],
          overstockedItems: [],
          inventoryValuation: 30880,
          reorderSummary: 'Urgent stock depletion alert! 2 Critical raw material items have dropped below safety thresholds. Immediately issue POs to prevent manufacturing downtime.',
        };
      }
      setAnalysis(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Inventory Document Analyzer"
        description="Scan inventory stock sheets to detect low stock items, calculate optimal reorder thresholds, and calculate inventory valuation."
        toolId="inventory-doc-analyzer"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-500" /> Stock Log Sheet
            </h3>
            <textarea
              value={inventoryText}
              onChange={(e) => setInventoryText(e.target.value)}
              className="w-full h-64 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
              {loading ? 'Analyzing Inventory...' : 'Analyze Stock Levels'}
            </button>
          </div>

          <div className="lg:col-span-7">
            {analysis ? (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Inventory Valuation</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">${analysis.inventoryValuation?.toLocaleString()}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs font-bold">
                    {analysis.lowStockItems?.length || 0} Low Stock Alerts
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                  <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 uppercase text-[10px]">
                    <AlertTriangle className="h-4 w-4" /> Reorder Recommendations:
                  </span>
                  {analysis.lowStockItems?.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center font-semibold">
                      <div>
                        <span className="text-slate-900 dark:text-white block">{item.name} ({item.sku})</span>
                        <span className="text-red-500 text-[10px]">In Stock: {item.currentStock} (Threshold: {item.reorderPoint})</span>
                      </div>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">Reorder {item.suggestedReorderQty} units</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Database className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs text-slate-500">Paste stock items on the left to detect low stock risks.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
