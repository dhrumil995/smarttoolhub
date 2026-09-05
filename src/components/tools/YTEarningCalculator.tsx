import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, TrendingUp, Info, HelpCircle, Activity, PiggyBank, Briefcase } from 'lucide-react';

interface NichePreset {
  name: string;
  minCpm: number;
  maxCpm: number;
  icon: string;
}

const NICHE_PRESETS: NichePreset[] = [
  { name: 'Finance & Investing', minCpm: 8.00, maxCpm: 18.00, icon: 'Briefcase' },
  { name: 'Tech & Gadgets', minCpm: 5.00, maxCpm: 12.00, icon: 'Activity' },
  { name: 'Lifestyle & Travel', minCpm: 3.00, maxCpm: 7.00, icon: 'TrendingUp' },
  { name: 'Gaming & Streams', minCpm: 1.00, maxCpm: 3.00, icon: 'PiggyBank' },
  { name: 'Educational', minCpm: 2.50, maxCpm: 6.00, icon: 'TrendingUp' },
];

export default function YTEarningCalculator() {
  const [views, setViews] = useState<number>(5000);
  const [cpm, setCpm] = useState<number>(3.50);
  const [monetizedPercent, setMonetizedPercent] = useState<number>(60); // 60% of views are typically monetized playbacks
  const [includePlatformCut, setIncludePlatformCut] = useState<boolean>(true); // YouTube takes 45% cut

  // Sync variables
  const [dailyEarnings, setDailyEarnings] = useState<number>(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState<number>(0);
  const [yearlyEarnings, setYearlyEarnings] = useState<number>(0);

  useEffect(() => {
    // Number of monetized views
    const monetizedViews = views * (monetizedPercent / 100);
    // Gross Earning per day = (monetizedViews / 1000) * CPM
    let daily = (monetizedViews / 1000) * cpm;
    
    if (includePlatformCut) {
      // YouTube creator share is 55%
      daily = daily * 0.55;
    }

    setDailyEarnings(daily);
    setMonthlyEarnings(daily * 30.4);
    setYearlyEarnings(daily * 365);
  }, [views, cpm, monetizedPercent, includePlatformCut]);

  const handleApplyPreset = (min: number, max: number) => {
    // Apply mid-point CPM of the selected niche
    const mid = parseFloat(((min + max) / 2).toFixed(2));
    setCpm(mid);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Input Sliders and Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
            <Activity size={18} className="text-red-500" />
            Earning Assumptions
          </h3>

          {/* Daily Views Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Estimated Daily Views
              </label>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="number"
                  value={views}
                  min={100}
                  max={5000000}
                  step={100}
                  onChange={(e) => setViews(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 px-2 py-1 text-right bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                />
                <span>views / day</span>
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={views > 1000000 ? 1000000 : views}
              onChange={(e) => setViews(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1K views</span>
              <span>250K views</span>
              <span>500K views</span>
              <span>1M+ views</span>
            </div>
          </div>

          {/* CPM Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Estimated CPM (Ad Rate)
              </label>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                <span>$</span>
                <input
                  type="number"
                  value={cpm}
                  min={0.10}
                  max={50}
                  step={0.10}
                  onChange={(e) => setCpm(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="w-16 px-2 py-1 text-right bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                />
                <span>per 1K views</span>
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.1"
              value={cpm > 25 ? 25 : cpm}
              onChange={(e) => setCpm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$0.50</span>
              <span>$5.00</span>
              <span>$15.00</span>
              <span>$25.00+</span>
            </div>
          </div>

          {/* Advanced Monetization options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Monetized Playback Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Monetized Playbacks
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {monetizedPercent}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={monetizedPercent}
                onChange={(e) => setMonetizedPercent(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <span className="block text-[10px] text-slate-400 leading-normal">
                Only a percentage of views show ads (typically 50% to 70%).
              </span>
            </div>

            {/* YouTube Cut Toggle */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    YouTube Platform Cut
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    Deduct YouTube's 45% platform fee to show net creator share.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludePlatformCut(!includePlatformCut)}
                  className={`w-10 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-all ${
                    includePlatformCut ? 'bg-red-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Niche CPM Presets Sidebar */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
            <TrendingUp size={16} className="text-red-500" />
            <h3 className="font-display font-bold text-slate-900 dark:text-white">
              Niche Benchmark CPMs
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            CPMs vary widely by viewer location and video category. Click a niche below to set realistic average CPM assumptions:
          </p>

          <div className="space-y-2.5 pt-1">
            {NICHE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p.minCpm, p.maxCpm)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950 dark:hover:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-850 hover:border-red-500/30 dark:hover:border-red-500/30 transition-all text-left cursor-pointer group"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-red-500 transition-colors">
                    {p.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    Niche average range
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                  ${p.minCpm.toFixed(0)} - ${p.maxCpm.toFixed(0)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Earnings Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
            Estimated Earnings Projections
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Based on <span className="font-semibold text-slate-700 dark:text-slate-300">{formatNumber(views)}</span> views daily, a monetized rate of <span className="font-semibold text-slate-700 dark:text-slate-300">{monetizedPercent}%</span>, and CPM of <span className="font-semibold text-slate-700 dark:text-slate-300">${cpm.toFixed(2)}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Card */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] font-bold text-slate-300 dark:text-slate-700 group-hover:text-red-500/20 transition-colors">
              DAILY
            </div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Daily Revenue
            </span>
            <span className="block text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              {formatCurrency(dailyEarnings)}
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Average earnings generated every 24 hours of video consumption.
            </p>
          </div>

          {/* Monthly Card */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] font-bold text-slate-300 dark:text-slate-700 group-hover:text-red-500/20 transition-colors">
              MONTHLY
            </div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Monthly Revenue
            </span>
            <span className="block text-2xl sm:text-3xl font-display font-extrabold text-red-600 dark:text-red-400 mb-2 tracking-tight">
              {formatCurrency(monthlyEarnings)}
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Estimated steady-state income based on a 30.4-day operational calendar.
            </p>
          </div>

          {/* Yearly Card */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] font-bold text-slate-300 dark:text-slate-700 group-hover:text-red-500/20 transition-colors">
              YEARLY
            </div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Yearly Revenue
            </span>
            <span className="block text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              {formatCurrency(yearlyEarnings)}
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Annual cumulative projection assuming consistent daily view performance.
            </p>
          </div>
        </div>

        {/* Informative Disclaimer footnote */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-2xl text-slate-500 leading-relaxed text-xs">
          <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-300">Important Revenue Factors:</span>
            <p className="text-[11px]">
              Actual YouTube earnings are subject to many external variables, including user geolocation (US/Europe traffic has higher CPM than Asian traffic), seasonality (Q4 holiday rates are highest), ad blocker usage rates, and content safety suitability checks. This calculator provides estimates based on popular ad industry benchmarks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
