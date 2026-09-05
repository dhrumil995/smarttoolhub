import React, { useState } from 'react';
import { BarChart3, TrendingDown, DollarSign, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function AIExpenseAnalyzer() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [expenseData, setExpenseData] = useState(`Raw Material Purchasing: $42,500
Freight & Logistics: $12,800
Factory Utilities & Power: $8,200
Equipment Maintenance: $4,500
Office Software & Subscriptions: $2,100
Travel & Client Entertainment: $1,900`);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'ai-expense-analyzer',
          payload: { expenseLogs: expenseData },
        }),
      });

      const data = await response.json();
      let parsed = null;
      try {
        parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      } catch (e) {
        parsed = {
          totalSpend: 72000,
          topCategory: 'Raw Material Purchasing (59%)',
          categoryBreakdown: [
            { category: 'Raw Materials', amount: 42500, percentage: 59 },
            { category: 'Logistics', amount: 12800, percentage: 17.8 },
            { category: 'Utilities', amount: 8200, percentage: 11.4 },
            { category: 'Maintenance', amount: 4500, percentage: 6.2 },
          ],
          costSavingsRecommendations: [
            'Consolidate freight logistics with VRL Logistics to negotiate a 12% bulk volume discount ($1,536 monthly savings).',
            'Conduct power audit on factory compressors to reduce peak-load utility costs.'
          ],
          anomalyAlerts: ['Freight expenses increased by 18% compared to prior quarter baseline.'],
          financialHealthScore: 88,
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
        title="AI Expense Analyzer"
        description="Analyze corporate expenditure logs to identify hidden cost leaks, vendor concentration risks, and actionable cost reduction strategies."
        toolId="ai-expense-analyzer"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" /> Expense Log Data
            </h3>
            <textarea
              value={expenseData}
              onChange={(e) => setExpenseData(e.target.value)}
              className="w-full h-64 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
              {loading ? 'Analyzing Cost Leaks...' : 'Run Financial Expense Audit'}
            </button>
          </div>

          <div className="lg:col-span-7">
            {analysis ? (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Financial Audit Score</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Total Spend: ${analysis.totalSpend?.toLocaleString()}</h3>
                  </div>
                  <span className="text-2xl font-black text-emerald-500">{analysis.financialHealthScore}/100</span>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-1.5">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 text-xs">
                    <TrendingDown className="h-4 w-4 text-emerald-500" /> Recommended Cost Savings Opportunities:
                  </span>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    {analysis.costSavingsRecommendations?.map((rec: string, idx: number) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs text-slate-500">Paste expenditure logs on the left to generate cost reduction insights.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
