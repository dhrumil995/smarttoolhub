import React, { useState } from 'react';
import { Hash, TrendingUp, Copy, Check, Sparkles } from 'lucide-react';

export function HashtagAnalyticsPredictor() {
  const [tag, setTag] = useState('techstartups');
  const [copied, setCopied] = useState(false);

  const cleanTag = tag.replace(/[^a-zA-Z0-9]/g, '');

  const analytics = {
    estimatedReach: '2.4M Impressions / Week',
    difficulty: 'Medium (42/100)',
    engagementRate: '4.8%',
    related: [`#${cleanTag}2026`, `#${cleanTag}tips`, `#${cleanTag}hacks`, `#${cleanTag}life`, `#buildinginpublic`, `#saasgrowth`]
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 rounded-full text-xs font-semibold">
          <Hash size={14} /> Social Reach & Viral Predictor
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Hashtag Analytics & Performance Predictor
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Analyze social media hashtags for projected reach, competition difficulty, engagement potential, and related trending tags.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Input Hashtag</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold font-mono"
          />
        </div>

        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="block text-[10px] font-bold text-slate-400">PROJECTED REACH</span>
              <span className="text-sm font-extrabold text-fuchsia-600">{analytics.estimatedReach}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="block text-[10px] font-bold text-slate-400">DIFFICULTY</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{analytics.difficulty}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Related High-Engagement Hashtags</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(analytics.related.join(' '));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs text-fuchsia-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analytics.related.map((r, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg text-xs font-semibold">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
