import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Percent, PieChart, RefreshCw, 
  Copy, Check, ArrowUpRight, ShieldCheck, AlertTriangle, Layers, BarChart3
} from 'lucide-react';

export function ProfitROICalculator() {
  // Financial Inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(50000); // Initial Capital
  const [revenue, setRevenue] = useState<number>(180000); // Annual Sales Revenue
  const [cogs, setCogs] = useState<number>(60000); // Cost of Goods Sold
  const [opex, setOpex] = useState<number>(45000); // Operating Expenses (Salaries, Marketing, Rent)
  const [taxRate, setTaxRate] = useState<number>(15); // Corporate Income Tax %
  const [projectedGrowthRate, setProjectedGrowthRate] = useState<number>(20); // Annual Growth %

  const [copied, setCopied] = useState(false);

  // Financial Metric Calculations
  const grossProfit = Math.max(0, revenue - cogs);
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  const operatingProfit = grossProfit - opex; // EBITDA / Operating Income
  const taxAmount = operatingProfit > 0 ? (operatingProfit * taxRate) / 100 : 0;
  const netProfit = operatingProfit - taxAmount;
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  // ROI % = (Net Profit / Initial Investment) * 100
  const roiPercentage = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0;

  // Break Even Revenue = OPEX / (1 - (COGS / Revenue))
  const cogsRatio = revenue > 0 ? cogs / revenue : 0;
  const breakEvenRevenue = (1 - cogsRatio) > 0 ? opex / (1 - cogsRatio) : 0;

  // Payback Period (Months) = (Initial Investment / Monthly Net Profit)
  const monthlyNetProfit = netProfit / 12;
  const paybackMonths = monthlyNetProfit > 0 ? initialInvestment / monthlyNetProfit : 0;

  // Multi-Year Growth Projections
  const projections = [1, 2, 3, 4, 5].map((year) => {
    const yrRevenue = revenue * Math.pow(1 + projectedGrowthRate / 100, year - 1);
    const yrCogs = cogs * Math.pow(1 + projectedGrowthRate / 100, year - 1);
    const yrOpex = opex * Math.pow(1 + (projectedGrowthRate * 0.7) / 100, year - 1);
    const yrGross = yrRevenue - yrCogs;
    const yrOp = yrGross - yrOpex;
    const yrTax = yrOp > 0 ? (yrOp * taxRate) / 100 : 0;
    const yrNet = yrOp - yrTax;
    return {
      year,
      revenue: yrRevenue,
      grossProfit: yrGross,
      netProfit: yrNet
    };
  });

  const handleReset = () => {
    setInitialInvestment(50000);
    setRevenue(180000);
    setCogs(60000);
    setOpex(45000);
    setTaxRate(15);
    setProjectedGrowthRate(20);
  };

  const handleCopySummary = () => {
    const text = `BUSINESS FINANCIAL & ROI SUMMARY
Initial Capital: $${initialInvestment.toLocaleString()}
Total Revenue: $${revenue.toLocaleString()}
Gross Profit: $${grossProfit.toLocaleString()} (${grossMargin.toFixed(1)}% Gross Margin)
Net Profit: $${netProfit.toLocaleString()} (${netMargin.toFixed(1)}% Net Margin)
ROI (Return on Investment): ${roiPercentage.toFixed(1)}%
Break-Even Revenue Point: $${breakEvenRevenue.toFixed(0)}
Estimated Payback Period: ${paybackMonths > 0 ? paybackMonths.toFixed(1) + ' Months' : 'N/A'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportJSON = () => {
    const data = {
      title: "Business Profit & ROI Analysis",
      date: new Date().toISOString(),
      inputs: {
        initialInvestment,
        revenue,
        cogs,
        opex,
        taxRate,
        projectedGrowthRate
      },
      metrics: {
        grossProfit,
        grossMarginPercentage: Number(grossMargin.toFixed(2)),
        operatingProfit,
        taxAmount,
        netProfit,
        netMarginPercentage: Number(netMargin.toFixed(2)),
        roiPercentage: Number(roiPercentage.toFixed(2)),
        breakEvenRevenue: Number(breakEvenRevenue.toFixed(2)),
        paybackMonths: Number(paybackMonths.toFixed(1))
      },
      projections
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profit_roi_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Initial Investment Capital', `$${initialInvestment.toFixed(2)}`],
      ['Sales Revenue', `$${revenue.toFixed(2)}`],
      ['Cost of Goods Sold (COGS)', `$${cogs.toFixed(2)}`],
      ['Operating Expenses (OPEX)', `$${opex.toFixed(2)}`],
      ['Gross Profit', `$${grossProfit.toFixed(2)}`],
      ['Gross Margin (%)', `${grossMargin.toFixed(2)}%`],
      ['Operating Profit (EBITDA)', `$${operatingProfit.toFixed(2)}`],
      ['Tax Rate (%)', `${taxRate}%`],
      ['Tax Amount', `$${taxAmount.toFixed(2)}`],
      ['Net Profit', `$${netProfit.toFixed(2)}`],
      ['Net Profit Margin (%)', `${netMargin.toFixed(2)}%`],
      ['ROI (Return on Investment)', `${roiPercentage.toFixed(2)}%`],
      ['Break-Even Sales Revenue', `$${breakEvenRevenue.toFixed(2)}`],
      ['Payback Period (Months)', `${paybackMonths.toFixed(1)} Months`],
      ['', ''],
      ['Year', 'Projected Revenue', 'Projected Gross Profit', 'Projected Net Profit'],
      ...projections.map(p => [
        `Year ${p.year}`,
        `$${p.revenue.toFixed(2)}`,
        `$${p.grossProfit.toFixed(2)}`,
        `$${p.netProfit.toFixed(2)}`
      ])
    ];

    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profit_roi_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
            <TrendingUp size={12} className="text-emerald-500" />
            Financial Intelligence & Unit Economics
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Business Profit & ROI Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Calculate gross margins, net profit, ROI percentage, break-even sales revenue, and export JSON / CSV reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 size={14} />
            <span>Save as JSON</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers size={14} />
            <span>Save as CSV</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Return on Investment (ROI)</span>
          <div className={`font-mono text-3xl font-black ${roiPercentage >= 20 ? 'text-emerald-500' : roiPercentage > 0 ? 'text-amber-500' : 'text-rose-500'}`}>
            {roiPercentage.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Net Return vs Initial Capital</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Net Profit Margin</span>
          <div className="font-mono text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {netMargin.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Net Profit: ${netProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Break-Even Sales Point</span>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            ${breakEvenRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Required Minimum Annual Sales</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Payback Duration</span>
          <div className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {paybackMonths > 0 ? `${paybackMonths.toFixed(1)} Months` : 'N/A'}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Full Capital Recovery Time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Financial Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-500" />
              Business Financial Parameters ($)
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Initial Investment Capital</label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Annual Sales Revenue</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 block">COGS (Direct Costs)</label>
                  <input
                    type="number"
                    value={cogs}
                    onChange={(e) => setCogs(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 block">OPEX (Operating Expenses)</label>
                  <input
                    type="number"
                    value={opex}
                    onChange={(e) => setOpex(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Projected Growth Rate (%)</label>
                  <input
                    type="number"
                    value={projectedGrowthRate}
                    onChange={(e) => setProjectedGrowthRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-year Growth Projections Table */}
        <div className="lg:col-span-7 space-y-6">
          {/* Revenue Waterfall & Margin Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
              <PieChart size={14} className="text-emerald-500" />
              Annual Profitability Breakdown
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Gross Revenue:</span>
                <span className="font-mono text-emerald-600">${revenue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Cost of Goods Sold (COGS):</span>
                <span className="font-mono text-rose-500">-${cogs.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <span>Gross Profit ({grossMargin.toFixed(1)}% Margin):</span>
                <span className="font-mono">${grossProfit.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Operating Expenses (OPEX):</span>
                <span className="font-mono text-rose-500">-${opex.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Corporate Tax ({taxRate}%):</span>
                <span className="font-mono text-rose-500">-${taxAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-extrabold text-sm pt-3 border-t-2 border-slate-900 dark:border-white text-slate-900 dark:text-white">
                <span>Net Profit After Tax:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">${netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 5-Year Financial Projection Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 size={14} className="text-blue-500" /> 5-Year Financial Growth Projection ({projectedGrowthRate}% YoY)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-4">Year</th>
                    <th className="py-2.5 px-4 text-right">Revenue ($)</th>
                    <th className="py-2.5 px-4 text-right">Gross Profit ($)</th>
                    <th className="py-2.5 px-4 text-right">Net Profit ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
                  {projections.map((p) => (
                    <tr key={p.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Year {p.year}</td>
                      <td className="py-3 px-4 text-right text-slate-800 dark:text-slate-200">${p.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td className="py-3 px-4 text-right text-slate-800 dark:text-slate-200">${p.grossProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">${p.netProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitROICalculator;
