import React, { useState } from 'react';
import { BarChart3, Download, RefreshCw, FileText, PieChart as PieIcon, TrendingUp, CircleDot, HelpCircle, CheckCircle2 } from 'lucide-react';

export function ChartBuilder() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [chartTitle, setChartTitle] = useState('Quarterly Revenue Growth (2026)');
  const [xAxisLabel, setXAxisLabel] = useState('Quarter');
  const [yAxisLabel, setYAxisLabel] = useState('Revenue ($K)');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  
  const [csvData, setCsvData] = useState(`Quarter,Revenue ($K),Users
Q1,120,4500
Q2,190,6200
Q3,280,8900
Q4,410,12500`);

  // Parse CSV
  const parseData = () => {
    const lines = csvData.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return { labels: [], values: [] };
    
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 2) {
        labels.push(parts[0]);
        values.push(parseFloat(parts[1]) || 0);
      }
    }
    return { labels, values };
  };

  const { labels, values } = parseData();
  const maxValue = Math.max(...values, 1);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <BarChart3 size={14} /> Free Interactive Chart Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Data Visualization & Chart Builder
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Transform raw CSV or JSON data into beautiful interactive bar charts, line graphs, pie charts, and scatter plots. Customize colors, labels, and download as high-res graphics.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-blue-500" /> Chart Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Chart Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'bar', label: 'Bar', icon: BarChart3 },
                  { id: 'line', label: 'Line', icon: TrendingUp },
                  { id: 'pie', label: 'Pie', icon: PieIcon },
                  { id: 'scatter', label: 'Scatter', icon: CircleDot },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setChartType(type.id as any)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        chartType === type.id
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      <Icon size={16} className="mb-1" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Chart Title
              </label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  X-Axis Label
                </label>
                <input
                  type="text"
                  value={xAxisLabel}
                  onChange={(e) => setXAxisLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Y-Axis Label
                </label>
                <input
                  type="text"
                  value={yAxisLabel}
                  onChange={(e) => setYAxisLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                CSV Input Data
              </label>
              <textarea
                rows={6}
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                className="w-full px-3 py-2 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Label,Value&#10;Q1,120&#10;Q2,190"
              />
            </div>
          </div>
        </div>

        {/* Chart Canvas Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{chartTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{yAxisLabel} by {xAxisLabel}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Download size={14} /> Export / Print
              </button>
            </div>
          </div>

          {/* Render Visual Chart */}
          <div className="flex-1 min-h-[300px] flex items-end justify-center gap-4 pt-8 pb-4 px-4 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 relative">
            {chartType === 'bar' && (
              <div className="w-full h-64 flex items-end justify-around gap-2 px-4">
                {labels.map((lbl, idx) => {
                  const val = values[idx] || 0;
                  const heightPct = Math.round((val / maxValue) * 100);
                  const color = colors[idx % colors.length];
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </span>
                      <div
                        style={{ height: `${heightPct}%`, backgroundColor: color }}
                        className="w-full max-w-[48px] rounded-t-md transition-all duration-500 hover:brightness-110 shadow-sm"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[60px]">
                        {lbl}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {chartType === 'pie' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full py-4">
                <div className="relative w-44 h-44 rounded-full border-8 border-white dark:border-slate-900 shadow-lg flex items-center justify-center bg-gradient-to-tr from-blue-500 via-emerald-500 to-purple-500">
                  <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-xs font-bold text-slate-400">Total</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {values.reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  {labels.map((lbl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{lbl}:</span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">{values[idx]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(chartType === 'line' || chartType === 'scatter') && (
              <div className="w-full h-64 flex flex-col justify-between py-2 px-2 relative">
                <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                  <div className="border-b border-slate-500 w-full" />
                  <div className="border-b border-slate-500 w-full" />
                  <div className="border-b border-slate-500 w-full" />
                </div>
                <div className="flex-1 flex items-end justify-between px-6 relative z-10">
                  {labels.map((lbl, idx) => {
                    const val = values[idx] || 0;
                    const bottomPct = Math.round((val / maxValue) * 80);
                    return (
                      <div key={idx} className="flex flex-col items-center group relative" style={{ marginBottom: `${bottomPct}%` }}>
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900 shadow-md transform group-hover:scale-125 transition-all" />
                        <span className="absolute -top-6 text-[10px] font-bold font-mono bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {val}
                        </span>
                        <span className="absolute top-6 text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {lbl}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Article Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20} /> How to Use the Free Online Chart Maker
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-300 text-sm">
            <li>Select your preferred visual style: Bar Chart, Line Graph, Pie Chart, or Scatter Plot.</li>
            <li>Paste your raw data into the CSV input box using simple comma-separated formatting.</li>
            <li>Customize your chart title, X-axis label, Y-axis label, and display styling.</li>
            <li>Review the instant live rendering and export your chart or print high-res reports.</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Why Use SmartToolHub Chart Builder?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Whether you are preparing business quarterly reports, academic research papers, or social media infographics, our free client-side chart generator turns raw spreadsheet numbers into compelling visual stories without requiring design skills or complex software downloads.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="text-blue-500" size={20} /> Frequently Asked Questions (FAQ)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Is my data uploaded to an external server?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">No. All CSV parsing and chart rendering happen 100% locally in your web browser for complete data privacy.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">What format should my CSV data be in?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Use standard comma-separated lines. The first column serves as labels (e.g. Quarters) and the second column as numeric values.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
