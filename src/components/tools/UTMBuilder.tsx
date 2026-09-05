import React, { useState, useEffect } from 'react';
import { Compass, Copy, Check, RefreshCw, Sliders, Info, HelpCircle } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function UTMBuilder() {
  const [baseUrl, setBaseUrl] = useState('https://smarttoolhub.net');
  const [source, setSource] = useState('newsletter');
  const [medium, setMedium] = useState('email');
  const [campaign, setCampaign] = useState('summer_sale');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!baseUrl.trim()) {
      setGeneratedUrl('');
      return;
    }

    // Standardize protocol
    let formattedBase = baseUrl.trim();
    if (!formattedBase.startsWith('http://') && !formattedBase.startsWith('https://')) {
      formattedBase = 'https://' + formattedBase;
    }

    try {
      const urlObj = new URL(formattedBase);
      
      if (source.trim()) {
        urlObj.searchParams.set('utm_source', source.trim());
      }
      if (medium.trim()) {
        urlObj.searchParams.set('utm_medium', medium.trim());
      }
      if (campaign.trim()) {
        urlObj.searchParams.set('utm_campaign', campaign.trim());
      }
      if (term.trim()) {
        urlObj.searchParams.set('utm_term', term.trim());
      }
      if (content.trim()) {
        urlObj.searchParams.set('utm_content', content.trim());
      }

      setGeneratedUrl(urlObj.toString());
    } catch {
      setGeneratedUrl('Error: Invalid Base URL path.');
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const handleCopy = () => {
    if (!generatedUrl || generatedUrl.startsWith('Error:')) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBaseUrl('https://smarttoolhub.net');
    setSource('newsletter');
    setMedium('email');
    setCampaign('summer_sale');
    setTerm('');
    setContent('');
  };

  const handleLoadPreset = (src: string, med: string) => {
    setSource(src);
    setMedium(med);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Compass size={12} />
            SEO & Content Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Google Analytics UTM Link Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Build tracking links for marketing campaigns with standard UTM parameter schema to track incoming clicks in GA4.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-slate-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  Campaign Parameters
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] px-2.5 py-1 font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Reset Form
              </button>
            </div>

            {/* Base Website URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Website Base URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Source & Medium in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Campaign Source (utm_source) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="newsletter, google, facebook"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Campaign Medium (utm_medium) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="email, cpc, social"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Campaign Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Campaign Name (utm_campaign)
              </label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="summer_promo, launch_2026"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Term & Content in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Campaign Term (utm_term)
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="marketing_keywords"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Campaign Content (utm_content)
                </label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="banner_ad, text_link"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Compliant Campaign Link
              </span>
              <button
                onClick={handleCopy}
                disabled={!generatedUrl || generatedUrl.startsWith('Error:')}
                className="p-1 px-3 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors border border-slate-200/40 dark:border-slate-800/60 disabled:opacity-50"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>

            <textarea
              value={generatedUrl}
              readOnly
              placeholder="Tracking link will display here in real time..."
              rows={5}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 break-all resize-none"
            />
          </div>

          {/* Preset Buttons Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <Info size={14} className="text-slate-400" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Common Presets
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLoadPreset('google', 'cpc')}
                className="p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors text-left"
              >
                Google Ad (CPC)
              </button>
              <button
                onClick={() => handleLoadPreset('newsletter', 'email')}
                className="p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors text-left"
              >
                Newsletter Email
              </button>
              <button
                onClick={() => handleLoadPreset('facebook', 'social')}
                className="p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors text-left"
              >
                Facebook Social Post
              </button>
              <button
                onClick={() => handleLoadPreset('linkedin', 'referral')}
                className="p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors text-left"
              >
                LinkedIn Referral
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdSenseSlot slot="utm-builder-bottom" />
    </div>
  );
}
