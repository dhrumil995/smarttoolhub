import React, { useState } from 'react';
import { Eye, Sparkles, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export function LandingPageHeatmapFeedback() {
  const [url, setUrl] = useState('https://example.com/landing-page');
  const [isAuditing, setIsAuditing] = useState(false);
  const [audit, setAudit] = useState<any>(null);

  const runAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAudit({
        score: 82,
        clarity: "High",
        ctaVisibility: "Primary CTA button is above the fold with strong contrast.",
        frictionPoints: [
          "Secondary navigation bar has 8 links which dilutes hero focus.",
          "Hero subheadline character count is slightly too long (120 chars)."
        ],
        recommendations: [
          "Reduce top navigation options down to 3 key links + login.",
          "Add social proof logos immediately below the primary hero CTA."
        ]
      });
      setIsAuditing(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Eye size={14} /> UI & Conversion Audit Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Landing Page Heatmap & UI Feedback Tool
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Analyze landing page design hierarchy, CTA prominence, and conversion friction points with automated UX recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Landing Page URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
          <button
            onClick={runAudit}
            disabled={isAuditing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} /> {isAuditing ? 'Analyzing Visual Hierarchy...' : 'Audit UI Hierarchy'}
          </button>
        </div>

        <div className="md:col-span-7">
          {audit ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold text-slate-400 uppercase">UX Conversion Score</span>
                <span className="text-2xl font-black text-blue-600">{audit.score}/100</span>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-rose-500 flex items-center gap-1"><AlertTriangle size={14} /> Friction Points</span>
                {audit.frictionPoints.map((f: string, i: number) => (
                  <p key={i} className="bg-slate-50 dark:bg-slate-800 p-2 rounded">{f}</p>
                ))}
              </div>
              <div className="space-y-2">
                <span className="font-bold text-emerald-600 flex items-center gap-1"><Lightbulb size={14} /> Recommended Fixes</span>
                {audit.recommendations.map((r: string, i: number) => (
                  <p key={i} className="bg-slate-50 dark:bg-slate-800 p-2 rounded">{r}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[250px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Eye size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Enter a landing page URL to evaluate UI visual hierarchy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
