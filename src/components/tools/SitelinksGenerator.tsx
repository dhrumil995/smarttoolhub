import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, Download, Plus, Trash2, Sliders, Info, AlertTriangle, Eye, ArrowRight, Laptop, Smartphone } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

interface Sitelink {
  id: string;
  text: string;
  desc1: string;
  desc2: string;
  url: string;
}

const DEFAULT_SITELINKS: Sitelink[] = [
  {
    id: 's1',
    text: 'Premium Pricing Plans',
    desc1: 'Unlock unlimited workspace tools.',
    desc2: 'Compare monthly and annual savings.',
    url: 'https://smarttoolhub.net/pricing'
  },
  {
    id: 's2',
    text: 'Contact Sales Support',
    desc1: 'Get expert digital growth assistance.',
    desc2: 'Response times under 15 minutes.',
    url: 'https://smarttoolhub.net/contact'
  },
  {
    id: 's3',
    text: 'Interactive Features Demo',
    desc1: 'Try all creator suites for free.',
    desc2: 'Zero subscription required to test.',
    url: 'https://smarttoolhub.net/features'
  },
  {
    id: 's4',
    text: 'Success Customer Reviews',
    desc1: 'Read what active agencies say.',
    desc2: 'Rated 4.9/5 stars across platforms.',
    url: 'https://smarttoolhub.net/reviews'
  },
  {
    id: 's5',
    text: 'About Our Mission',
    desc1: 'Discover our 100% browser tools.',
    desc2: 'Learn how we secure your RAM state.',
    url: 'https://smarttoolhub.net/about'
  },
  {
    id: 's6',
    text: 'Free Platform Sign-Up',
    desc1: 'Start using dev suites instantly.',
    desc2: 'No credit card or accounts needed.',
    url: 'https://smarttoolhub.net/register'
  }
];

export default function SitelinksGenerator() {
  const [sitelinks, setSitelinks] = useState<Sitelink[]>(DEFAULT_SITELINKS);
  
  // Simulated main ad copy
  const [displayUrl, setDisplayUrl] = useState('smarttoolhub.net');
  const [headline1, setHeadline1] = useState('Best Creative Developer Tools');
  const [headline2, setHeadline2] = useState('Free Interactive Online Suites');
  const [headline3, setHeadline3] = useState('Optimize Digital Ads Today');
  const [description1, setDescription1] = useState('Supercharge your search campaigns with fully client-side formatted toolkits.');
  const [description2, setDescription2] = useState('Boost click-through rates by up to 20% using structured ad assets in your feed.');
  
  // Tab/Preview settings
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [copiedCSV, setCopiedCSV] = useState(false);

  // Validate limits
  const isSitelinkValid = (link: Sitelink) => {
    return (
      link.text.trim().length > 0 &&
      link.text.length <= 25 &&
      link.desc1.length <= 35 &&
      link.desc2.length <= 35 &&
      link.url.trim().length > 0
    );
  };

  const totalErrors = sitelinks.filter(link => !isSitelinkValid(link)).length;

  const handleAddSitelink = () => {
    if (sitelinks.length >= 10) return;
    const newId = `s_${Date.now()}`;
    setSitelinks([
      ...sitelinks,
      {
        id: newId,
        text: 'New Sitelink Link',
        desc1: 'Short description line 1 details',
        desc2: 'Short description line 2 details',
        url: 'https://smarttoolhub.net'
      }
    ]);
  };

  const handleUpdateSitelink = (id: string, field: keyof Sitelink, value: string) => {
    setSitelinks(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveSitelink = (id: string) => {
    if (sitelinks.length <= 1) return; // Must keep at least one
    setSitelinks(prev => prev.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setSitelinks(DEFAULT_SITELINKS);
    setDisplayUrl('smarttoolhub.net');
    setHeadline1('Best Creative Developer Tools');
    setHeadline2('Free Interactive Online Suites');
    setHeadline3('Optimize Digital Ads Today');
    setDescription1('Supercharge your search campaigns with fully client-side formatted toolkits.');
    setDescription2('Boost click-through rates by up to 20% using structured ad assets in your feed.');
  };

  // Export options
  const generateTextOutput = () => {
    return sitelinks
      .map((link, index) => {
        return `[SITELINK ${index + 1}]
Link Text: ${link.text} (${link.text.length}/25)
Description 1: ${link.desc1} (${link.desc1.length}/35)
Description 2: ${link.desc2} (${link.desc2.length}/35)
Final URL: ${link.url}
-----------------------------`;
      })
      .join('\n');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateTextOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCSV = () => {
    // Standard headers for Google Ads Editor import
    const headers = 'Campaign,Ad Group,Sitelink text,Description line 1,Description line 2,Final URL';
    const rows = sitelinks.map(link => {
      const escape = (text: string) => `"${text.replace(/"/g, '""')}"`;
      return `"[Campaign Name]","[Ad Group Name]",${escape(link.text)},${escape(link.desc1)},${escape(link.desc2)},${escape(link.url)}`;
    });
    return [headers, ...rows].join('\n');
  };

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(generateCSV());
    setCopiedCSV(true);
    setTimeout(() => setCopiedCSV(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(generateCSV());
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'google_ads_sitelinks_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Link2 size={12} />
            Google Campaign Optimization
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Google Ads Sitelinks Builder & Previewer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Draft, validate, and preview your ad extensions in high-fidelity desktop & mobile search mockups to optimize CTR.
          </p>
        </div>
      </div>

      {/* GOOGLE ADS RECOMMENDATION COMPLIANCE CARD */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        {/* Subtle accent background pattern */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#1a73e8] text-white font-mono text-xs font-black">E+</span>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-300">Google Ads Recommendation Audit</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sitelinks.length >= 6 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'}`}>
            {sitelinks.length >= 6 ? '✓ OPTIMIZED' : '⚠️ OPTIMIZATION REQUIRED'}
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Add Sitelinks to Your Ads & Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Get more conversions at a similar or better ROI by adding <span className="font-semibold text-emerald-400">at least 6 sitelinks</span> to your campaigns. You will see positive increases in clicks, overall click-through rates (CTR), and ad quality scores.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            Recommended because having at least 6 active sitelinks allows your search ads to serve in the most prominent high-visibility formats across both desktop and mobile networks.
          </p>
        </div>

        {/* Dynamic score visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 items-center border-t border-slate-800">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Compliance Progress:</span>
              <span className={`font-mono font-bold ${sitelinks.length >= 6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {sitelinks.length} of 6 recommended
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${sitelinks.length >= 6 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, (sitelinks.length / 6) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex sm:justify-end">
            {sitelinks.length >= 6 ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <Check size={14} />
                <span>Recommendation Satisfied!</span>
              </div>
            ) : (
              <button 
                onClick={() => {
                  const needed = 6 - sitelinks.length;
                  const newLinks = [...sitelinks];
                  for(let i = 0; i < needed; i++) {
                    newLinks.push({
                      id: `s_rec_${Date.now()}_${i}`,
                      text: `Optimized Sitelink ${sitelinks.length + i + 1}`,
                      desc1: 'Attract search clicks with rich info',
                      desc2: 'Show unique page call to action',
                      url: 'https://smarttoolhub.net/service'
                    });
                  }
                  setSitelinks(newLinks);
                }}
                className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] active:scale-98 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Autofill to 6 Sitelinks</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Sitelink Editor form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Ad Level configuration */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-emerald-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  1. Base Search Ad Copy (Optional Context)
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                Reset Layout
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Display Domain Path
                </label>
                <input
                  type="text"
                  value={displayUrl}
                  onChange={(e) => setDisplayUrl(e.target.value)}
                  placeholder="example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Ad Headline 1
                    </label>
                    <span className={`text-[9px] font-mono ${headline1.length > 30 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      {headline1.length}/30
                    </span>
                  </div>
                  <input
                    type="text"
                    value={headline1}
                    onChange={(e) => setHeadline1(e.target.value)}
                    maxLength={35}
                    placeholder="Headline 1"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Ad Headline 2
                    </label>
                    <span className={`text-[9px] font-mono ${headline2.length > 30 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      {headline2.length}/30
                    </span>
                  </div>
                  <input
                    type="text"
                    value={headline2}
                    onChange={(e) => setHeadline2(e.target.value)}
                    maxLength={35}
                    placeholder="Headline 2"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Ad Headline 3
                    </label>
                    <span className={`text-[9px] font-mono ${headline3.length > 30 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      {headline3.length}/30
                    </span>
                  </div>
                  <input
                    type="text"
                    value={headline3}
                    onChange={(e) => setHeadline3(e.target.value)}
                    maxLength={35}
                    placeholder="Headline 3"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Ad Description Line 1
                  </label>
                  <span className={`text-[9px] font-mono ${description1.length > 90 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    {description1.length}/90
                  </span>
                </div>
                <input
                  type="text"
                  value={description1}
                  onChange={(e) => setDescription1(e.target.value)}
                  maxLength={105}
                  placeholder="First description lines details"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Ad Description Line 2
                  </label>
                  <span className={`text-[9px] font-mono ${description2.length > 90 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    {description2.length}/90
                  </span>
                </div>
                <input
                  type="text"
                  value={description2}
                  onChange={(e) => setDescription2(e.target.value)}
                  maxLength={105}
                  placeholder="Second description lines details"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Sitelink Items Configuration */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Link2 size={16} className="text-emerald-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  2. Sitelink Assets ({sitelinks.length}/10 max)
                </h3>
              </div>
              {totalErrors > 0 && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                  <AlertTriangle size={10} />
                  <span>{totalErrors} Errors</span>
                </div>
              )}
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {sitelinks.map((link, index) => {
                const textErr = link.text.length > 25 || link.text.trim().length === 0;
                const desc1Err = link.desc1.length > 35;
                const desc2Err = link.desc2.length > 35;
                const urlErr = link.url.trim().length === 0;

                return (
                  <div
                    key={link.id}
                    className={`p-4 rounded-xl border transition-all ${
                      textErr || desc1Err || desc2Err || urlErr
                        ? 'border-red-200 dark:border-red-950 bg-red-500/[0.01]'
                        : 'border-slate-150 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">
                        Sitelink Asset #{index + 1}
                      </span>
                      {sitelinks.length > 1 && (
                        <button
                          onClick={() => handleRemoveSitelink(link.id)}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove sitelink"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Sitelink text */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Sitelink Text
                          </label>
                          <span className={`text-[9px] font-mono ${textErr ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                            {link.text.length}/25
                          </span>
                        </div>
                        <input
                          type="text"
                          value={link.text}
                          onChange={(e) => handleUpdateSitelink(link.id, 'text', e.target.value)}
                          placeholder="e.g. Premium Plans"
                          className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs focus:outline-none focus:ring-1 text-slate-800 dark:text-slate-100 ${
                            textErr
                              ? 'border-red-300 dark:border-red-900 focus:ring-red-500'
                              : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500'
                          }`}
                        />
                      </div>

                      {/* Final URL */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Final Target URL
                          </label>
                          {urlErr && <span className="text-[9px] text-red-500 font-bold uppercase">Required</span>}
                        </div>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleUpdateSitelink(link.id, 'url', e.target.value)}
                          placeholder="e.g. https://yoursite.com/plans"
                          className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs focus:outline-none focus:ring-1 text-slate-800 dark:text-slate-100 font-mono ${
                            urlErr
                              ? 'border-red-300 dark:border-red-900 focus:ring-red-500'
                              : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500'
                          }`}
                        />
                      </div>

                      {/* Description 1 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Description Line 1
                          </label>
                          <span className={`text-[9px] font-mono ${desc1Err ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                            {link.desc1.length}/35
                          </span>
                        </div>
                        <input
                          type="text"
                          value={link.desc1}
                          onChange={(e) => handleUpdateSitelink(link.id, 'desc1', e.target.value)}
                          placeholder="Compare our options (Optional)"
                          className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs focus:outline-none focus:ring-1 text-slate-800 dark:text-slate-100 ${
                            desc1Err
                              ? 'border-red-300 dark:border-red-900 focus:ring-red-500'
                              : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500'
                          }`}
                        />
                      </div>

                      {/* Description 2 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Description Line 2
                          </label>
                          <span className={`text-[9px] font-mono ${desc2Err ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                            {link.desc2.length}/35
                          </span>
                        </div>
                        <input
                          type="text"
                          value={link.desc2}
                          onChange={(e) => handleUpdateSitelink(link.id, 'desc2', e.target.value)}
                          placeholder="Get a 20% off discount (Optional)"
                          className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs focus:outline-none focus:ring-1 text-slate-800 dark:text-slate-100 ${
                            desc2Err
                              ? 'border-red-300 dark:border-red-900 focus:ring-red-500'
                              : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sitelinks.length < 10 && (
              <button
                onClick={handleAddSitelink}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-850/60 text-slate-700 dark:text-slate-300 border border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={14} className="text-emerald-500" />
                Add Sitelink Asset ({10 - sitelinks.length} slots left)
              </button>
            )}
          </div>
        </div>

        {/* Right column: Previews & Exports */}
        <div className="lg:col-span-6 space-y-6">
          {/* Live search result layout simulation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-emerald-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Google Search Ad Live Preview
                </h3>
              </div>

              {/* Device Selector tabs */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all ${
                    previewDevice === 'desktop'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Laptop size={12} />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all ${
                    previewDevice === 'mobile'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Smartphone size={12} />
                  Mobile
                </button>
              </div>
            </div>

            {/* Google Search Mockup Container */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 max-w-full">
              <div className="max-w-full overflow-x-auto">
                <div className={`mx-auto bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-850 shadow-sm ${
                  previewDevice === 'mobile' ? 'max-w-[360px]' : 'w-full min-w-[480px]'
                }`}>
                  {/* Top line: URL structure */}
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-800 dark:text-slate-300 leading-none">
                    <span className="font-sans font-medium text-slate-400 dark:text-slate-500">Ad</span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="font-sans hover:underline cursor-pointer truncate font-normal">
                      https://www.{displayUrl || 'example.com'}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h4 className="text-[15px] sm:text-[16px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight mb-1 font-normal">
                    {headline1 || 'Headline 1'} | {headline2 || 'Headline 2'} | {headline3 || 'Headline 3'}
                  </h4>

                  {/* Main Descriptions text */}
                  <p className="text-[12px] sm:text-[13px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed mb-3">
                    {description1 || 'Enter an optional primary ad description to see your text block rendered perfectly in the Google Search network.'}{' '}
                    {description2 || 'Include a secondary description to maximize ad space relevance.'}
                  </p>

                  {/* Sitelinks Extensions Area */}
                  {previewDevice === 'desktop' ? (
                    /* Desktop 2-Column Grid Sitelinks */
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      {sitelinks.map((link) => (
                        <div key={link.id} className="space-y-0.5 max-w-[280px]">
                          <span className="text-[13px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer block truncate font-normal">
                            {link.text || 'Sitelink Title text'}
                          </span>
                          {(link.desc1 || link.desc2) && (
                            <p className="text-[11px] text-[#4d5156] dark:text-[#bdc1c6] leading-snug line-clamp-2">
                              {link.desc1} {link.desc2}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Mobile Sitelink Row Layout or Grid */
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-3 gap-y-2.5">
                      {sitelinks.map((link) => (
                        <div key={link.id} className="bg-slate-50/50 dark:bg-slate-950/30 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/80 text-[11px] hover:underline cursor-pointer min-w-[120px] max-w-[145px]">
                          <span className="text-[#1a0dab] dark:text-[#8ab4f8] hover:underline block truncate font-medium text-xs">
                            {link.text || 'Sitelink Text'}
                          </span>
                          {link.desc1 && (
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate leading-none mt-0.5">
                              {link.desc1}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex gap-2.5 items-start">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Sitelink Sizing Best Practices:</span>
                  <p className="text-[11px] leading-relaxed">
                    Google Ads sitelinks require target URLs to use the same domain as the main ad's display URL. Additionally, each sitelink final URL in an ad must point to a unique page path (e.g., do not point three sitelinks to the exact same pricing URL).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Export suite panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-850 pb-3">
              3. Copy or Export Assets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Draft text copy */}
              <div className="space-y-2.5 p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-mono">
                  Standard Text Copy
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Copy draft text with character counters for manual entry into the Google Ads dashboard platform.
                </p>
                <button
                  onClick={handleCopyText}
                  className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span>Copied Draft Text!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Sitelinks text</span>
                    </>
                  )}
                </button>
              </div>

              {/* CSV Editor Bulk Upload */}
              <div className="space-y-2.5 p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-mono">
                  Google Ads Editor CSV
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Download a pre-formatted CSV sheet template for instant bulk imports inside the desktop Google Ads Editor app.
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCSV}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedCSV ? 'Copied CSV!' : 'Copy CSV'}
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 shadow-sm"
                  >
                    <Download size={11} />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdSenseSlot />

      {/* Deep-dive educational explanation block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Info size={16} className="text-emerald-500" />
          Pro-Marketing Advice: How Sitelinks Generate More High-Value Traffic
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          <div className="space-y-3">
            <p>
              **What are Sitelink Extensions?** Sitelinks are additional links that display directly beneath your primary text ad on Google Search results. They allow potential customers to bypass your default homepage landing page and navigate directly to what they actually want—be it a specific pricing structure, product specs, reviews, or your contact forms.
            </p>
            <p>
              **Increasing Ad Screen Prominence:** Adding sitelinks significantly increases the physical "height" of your advertisement on Google Search pages. On mobile screens, a fully fleshed-out search ad with 4 sitelinks can occupy the entire viewable screen area before scrolling, pushing competitor results further down the feed.
            </p>
          </div>
          <div className="space-y-3">
            <p>
              **Driving Conversion-Ready Leads:** Sitelinks don't just increase clicks; they qualify your traffic. If a search user clicks "Premium Pricing Plans" inside your sitelink grid, they are entering your site with explicit high purchasing intent compared to someone visiting a standard informational homepage.
            </p>
            <p>
              **Structured Character Constraints:** Google strictly enforces character limitations to prevent search results from looking cluttered. Your sitelink text is hard-capped at **25 characters**, and each description line is capped at **35 characters**. Sitelinks that exceed these boundaries are flagged by Google Ads campaign engines and fail to render. Use this generator to draft within bounds!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
