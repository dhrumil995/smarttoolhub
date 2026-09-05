import React, { useState } from 'react';
import { TrendingUp, Calculator, CheckCircle2, HelpCircle, Award, AlertCircle, ArrowUpRight } from 'lucide-react';

export function ABTestCalculator() {
  const [controlVisitors, setControlVisitors] = useState(10000);
  const [controlConversions, setControlConversions] = useState(250);
  const [variationVisitors, setVariationVisitors] = useState(10200);
  const [variationConversions, setVariationConversions] = useState(320);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95);

  // Calculations
  const crControl = controlVisitors > 0 ? (controlConversions / controlVisitors) : 0;
  const crVariation = variationVisitors > 0 ? (variationConversions / variationVisitors) : 0;
  
  const crControlPct = (crControl * 100).toFixed(2);
  const crVariationPct = (crVariation * 100).toFixed(2);

  const relativeLift = crControl > 0 ? (((crVariation - crControl) / crControl) * 100).toFixed(2) : '0';

  // Statistical significance math approximation
  const pPool = (controlConversions + variationConversions) / (controlVisitors + variationVisitors);
  const sePool = Math.sqrt(pPool * (1 - pPool) * ((1 / controlVisitors) + (1 / variationVisitors)));
  const zScore = sePool > 0 ? Math.abs((crVariation - crControl) / sePool) : 0;

  let significancePct = 50;
  if (zScore > 2.58) significancePct = 99.5;
  else if (zScore > 1.96) significancePct = 95.0 + (zScore - 1.96) * 10;
  else if (zScore > 1.645) significancePct = 90.0 + (zScore - 1.645) * 10;
  else significancePct = Math.min(89.9, Math.round(zScore * 40 + 50));

  const isSignificant = significancePct >= confidenceLevel;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold">
          <TrendingUp size={14} /> CRO & Significance Test
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          A/B Testing & Conversion Rate Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Determine statistical significance, conversion rate lift, and required sample size for split tests with plain-English recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator size={18} className="text-amber-500" /> Test Data Entry
          </h2>

          <div className="space-y-4">
            {/* Control Group */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Control Group (Original A)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Visitors (Sessions)</label>
                  <input
                    type="number"
                    value={controlVisitors}
                    onChange={(e) => setControlVisitors(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Conversions</label>
                  <input
                    type="number"
                    value={controlConversions}
                    onChange={(e) => setControlConversions(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Conversion Rate: <span className="font-mono font-bold text-slate-800 dark:text-white">{crControlPct}%</span>
              </div>
            </div>

            {/* Variation Group */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                Variation Group (Variant B)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Visitors (Sessions)</label>
                  <input
                    type="number"
                    value={variationVisitors}
                    onChange={(e) => setVariationVisitors(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Conversions</label>
                  <input
                    type="number"
                    value={variationConversions}
                    onChange={(e) => setVariationConversions(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Conversion Rate: <span className="font-mono font-bold text-amber-600">{crVariationPct}%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Target Confidence Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[90, 95, 99].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setConfidenceLevel(lvl)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      confidenceLevel === lvl
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {lvl}% Confidence
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              isSignificant ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
            }`}>
              {isSignificant ? <Award size={24} className="text-emerald-500 shrink-0 mt-0.5" /> : <AlertCircle size={24} className="text-amber-500 shrink-0 mt-0.5" />}
              <div>
                <h3 className="font-bold text-sm">
                  {isSignificant ? 'Statistically Significant Winner!' : 'Test Needs More Data'}
                </h3>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                  {isSignificant
                    ? `Variation B outperformed Control A with ${significancePct.toFixed(1)}% statistical certainty. You can confidently deploy Variation B to 100% of traffic.`
                    : `Current statistical confidence is ${significancePct.toFixed(1)}% (below target ${confidenceLevel}%). Continue running the experiment to gather more visitor conversions.`}
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Relative Lift</span>
                <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-1">
                  <ArrowUpRight size={20} />
                  {Number(relativeLift) > 0 ? `+${relativeLift}%` : `${relativeLift}%`}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Statistical Certainty</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {significancePct.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 size={20} className="text-amber-500" /> How A/B Test Significance Works
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Statistical significance measures the probability that a difference in conversion rates between two web page variations is caused by real user preference rather than random chance. A 95% confidence threshold means there is only a 5% risk of a false positive winner (type I error).
        </p>
      </div>
    </div>
  );
}
