import React, { useState } from 'react';
import { DollarSign, TrendingUp, Target, Calculator, PieChart, Sparkles, Download } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function AdROASCalculator() {
  const [adSpend, setAdSpend] = useState(1500);
  const [revenue, setRevenue] = useState(6000);
  const [conversions, setConversions] = useState(80);
  const [cogs, setCogs] = useState(1200); // Cost of Goods Sold

  const roas = adSpend > 0 ? ((revenue / adSpend) * 100).toFixed(1) : '0';
  const cpa = conversions > 0 ? (adSpend / conversions).toFixed(2) : '0';
  const netProfit = (revenue - adSpend - cogs).toFixed(2);
  const profitMargin = revenue > 0 ? (((revenue - adSpend - cogs) / revenue) * 100).toFixed(1) : '0';
  const breakEvenRoas = (revenue - cogs) > 0 ? ((revenue / (revenue - cogs)) * 100).toFixed(1) : '100';

  const exportJSON = () => {
    const data = {
      calculator: "Ad Campaign ROAS & CPA Profitability Calculator",
      date: new Date().toISOString(),
      inputs: {
        adSpend,
        revenue,
        conversions,
        cogs
      },
      results: {
        roasPercentage: Number(roas),
        roasMultiplier: Number((Number(roas) / 100).toFixed(2)),
        cpa: Number(cpa),
        netProfit: Number(netProfit),
        profitMarginPercentage: Number(profitMargin),
        breakEvenRoasPercentage: Number(breakEvenRoas)
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roas_campaign_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Ad Spend', `$${adSpend}`],
      ['Generated Ad Revenue', `$${revenue}`],
      ['Conversions / Sales', conversions],
      ['Product COGS / Fulfillment', `$${cogs}`],
      ['ROAS (%)', `${roas}%`],
      ['ROAS Multiplier', `${(Number(roas) / 100).toFixed(2)}x`],
      ['Cost Per Acquisition (CPA)', `$${cpa}`],
      ['Net Ad Profit', `$${netProfit}`],
      ['Profit Margin (%)', `${profitMargin}%`],
      ['Break-Even ROAS', `${breakEvenRoas}%`]
    ];

    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roas_campaign_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-extrabold uppercase tracking-widest border border-emerald-500/20">
            <TrendingUp size={14} /> Marketing Calculator
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Ad Campaign ROAS & CPA Profitability Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Calculate Return on Ad Spend (ROAS), Cost Per Acquisition (CPA), break-even ROAS, and export reports.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download size={14} />
            <span>Save as JSON</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download size={14} />
            <span>Save as CSV</span>
          </button>
        </div>
      </div>

      <AdSenseSlot slot="ad-roas-top" />

      {/* Inputs & Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Metric Inputs */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calculator size={14} className="text-emerald-500" /> Campaign Metrics Input
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Total Ad Spend ($)
            </label>
            <input
              type="number"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Generated Ad Revenue ($)
            </label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Total Conversions / Sales
            </label>
            <input
              type="number"
              value={conversions}
              onChange={(e) => setConversions(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Product COGS / Fulfillment ($)
            </label>
            <input
              type="number"
              value={cogs}
              onChange={(e) => setCogs(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Calculated Results Cards */}
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Campaign Performance Output
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">ROAS</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {roas}%
                </p>
                <span className="text-[9px] text-slate-500">{(Number(roas) / 100).toFixed(2)}x Return</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Cost Per Acquisition</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  ${cpa}
                </p>
                <span className="text-[9px] text-slate-500">Per conversion</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Net Ad Profit</span>
                <p className={`text-xl font-black ${Number(netProfit) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${netProfit}
                </p>
                <span className="text-[9px] text-slate-500">{profitMargin}% Margin</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Break-Even ROAS</span>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {breakEvenRoas}%
                </p>
                <span className="text-[9px] text-slate-500">Min target</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
