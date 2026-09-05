import React, { useState } from 'react';
import { Newspaper, Copy, Check, Download, Building } from 'lucide-react';

export function PressReleaseGenerator() {
  const [company, setCompany] = useState('SmartToolHub');
  const [headline, setHeadline] = useState('SmartToolHub Launches 30 Next-Gen Free AI & Developer Utilities');
  const [location, setLocation] = useState('SAN FRANCISCO, CA');
  const [quote, setQuote] = useState('"Our mission is to democratize high-performance developer and SEO utilities without paywalls." — CEO, SmartToolHub');
  const [copied, setCopied] = useState(false);

  const release = `FOR IMMEDIATE RELEASE

${headline.toUpperCase()}

${location} — ${company} today announced the official rollout of 30 brand-new web developer, AI, and marketing tools. The expanded platform now delivers over 100 free utilities designed for frontend developers, growth marketers, and content creators.

${quote}

ABOUT ${company.toUpperCase()}
SmartToolHub is a leading provider of browser-based client-side developer, design, and marketing utilities. For more information, visit https://smarttoolhub.net.

###
Media Contact:
Press Office
press@smarttoolhub.net`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Newspaper size={14} /> AP-Style PR & Media Kit Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Press Release & Media Kit Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Craft AP-style press releases and media kits. Enter product launch details and executive quotes to generate press-ready releases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Headline</label>
            <textarea
              rows={2}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Executive Quote</label>
            <textarea
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">AP-Style Press Release</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(release);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied Release' : 'Copy PR'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap max-h-80">
            {release}
          </pre>
        </div>
      </div>
    </div>
  );
}
