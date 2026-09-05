import React, { useState } from 'react';
import { Globe, Copy, Check, Search, ShieldCheck, AlertTriangle, CheckCircle2, Share2, Sparkles, ExternalLink, Twitter, Linkedin, Facebook, RefreshCw } from 'lucide-react';

export function MetaTagAnalyzer() {
  const [url, setUrl] = useState('https://smarttoolhub.net/seo-auditor');
  const [title, setTitle] = useState('Free Online SEO Auditor & Technical Web Checker | SmartToolHub');
  const [description, setDescription] = useState('Audit any website in seconds. Check core web vitals, mobile friendliness, meta tags, schema markup, SSL security, and speed optimization 100% free.');
  const [canonical, setCanonical] = useState('https://smarttoolhub.net/seo-auditor');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80');
  const [siteName, setSiteName] = useState('SmartToolHub');
  const [twitterHandle, setTwitterHandle] = useState('@smarttoolhub');
  const [copied, setCopied] = useState(false);
  const [activePreview, setActivePreview] = useState<'google' | 'twitter' | 'facebook' | 'linkedin'>('google');

  const titleLength = title.length;
  const descLength = description.length;

  const isTitleIdeal = titleLength >= 30 && titleLength <= 60;
  const isDescIdeal = descLength >= 120 && descLength <= 160;

  const generateHTML = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:site_name" content="${siteName}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${canonical}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">
<meta name="twitter:site" content="${twitterHandle}">`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (type: 'blog' | 'saas' | 'ecommerce') => {
    if (type === 'blog') {
      setTitle('10 Essential Web Developer Tools for 2026 | Tech Guides');
      setDescription('Discover the best developer utilities, formatters, and AI assistants to boost your frontend workflow, automate repetitive tasks, and speed up debugging.');
      setCanonical('https://example.com/blog/best-dev-tools');
      setImageUrl('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80');
      setSiteName('Tech Guides');
    } else if (type === 'saas') {
      setTitle('OmniFlow - AI-Powered Cloud Automation & Workflow Engine');
      setDescription('Scale your engineering velocity with automated CI/CD pipelines, container orchestration, and instant cloud deployment testing.');
      setCanonical('https://omniflow.io');
      setImageUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80');
      setSiteName('OmniFlow SaaS');
    } else {
      setTitle('UltraGlow Ergonomic Mechanical Keyboard | Official Store');
      setDescription('Custom hot-swappable mechanical switches, CNC aluminum chassis, wireless Bluetooth 5.3, and all-day ergonomic wrist support. Free worldwide shipping.');
      setCanonical('https://store.example.com/products/ultraglow-keyboard');
      setImageUrl('https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80');
      setSiteName('UltraGlow Store');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Globe size={14} /> Ultra Pro Max Meta Tag Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Live Meta Tag & Open Graph Social Preview Analyzer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Audit, design, and simulate how your web pages appear on Google Search, X (Twitter), Facebook, and LinkedIn. Generate clean SEO meta tags with 1-click copy.
        </p>
      </div>

      {/* Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Preset Templates:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadPreset('blog')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Article / Blog
          </button>
          <button
            onClick={() => loadPreset('saas')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            SaaS Landing Page
          </button>
          <button
            onClick={() => loadPreset('ecommerce')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            E-Commerce Product
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Configuration Column */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Meta Information</span>
            <span className="text-xs font-normal text-slate-400">Live Real-Time Sync</span>
          </h2>

          {/* Title input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Page Title</label>
              <span className={`font-mono text-[11px] font-bold ${isTitleIdeal ? 'text-emerald-500' : 'text-amber-500'}`}>
                {titleLength}/60 chars {isTitleIdeal ? '✓ Perfect' : '(Optimal: 50-60)'}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-medium"
              placeholder="e.g. Free Online Audio & Video Converter"
            />
          </div>

          {/* Description input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Meta Description</label>
              <span className={`font-mono text-[11px] font-bold ${isDescIdeal ? 'text-emerald-500' : 'text-amber-500'}`}>
                {descLength}/160 chars {isDescIdeal ? '✓ Perfect' : '(Optimal: 120-160)'}
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-medium resize-none leading-relaxed"
              placeholder="Enter comprehensive meta description for search engines..."
            />
          </div>

          {/* Canonical URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Canonical URL (og:url)</label>
            <input
              type="text"
              value={canonical}
              onChange={(e) => setCanonical(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>

          {/* Open Graph Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Social Share Image (og:image 1200x630)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>

          {/* Site Name & Twitter Handle */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Site Brand Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Twitter Handle</label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Social Previews Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Preview Selector Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <button
              onClick={() => setActivePreview('google')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activePreview === 'google' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Globe size={14} /> Google Search
            </button>
            <button
              onClick={() => setActivePreview('twitter')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activePreview === 'twitter' ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Twitter size={14} /> X Card
            </button>
            <button
              onClick={() => setActivePreview('facebook')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activePreview === 'facebook' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Facebook size={14} /> Facebook
            </button>
            <button
              onClick={() => setActivePreview('linkedin')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activePreview === 'linkedin' ? 'bg-white dark:bg-slate-800 text-[#0077b5] shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Linkedin size={14} /> LinkedIn
            </button>
          </div>

          {/* Render Active Preview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            {activePreview === 'google' && (
              <div className="space-y-2 font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                    G
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-none">{siteName}</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-sm">{canonical}</span>
                  </div>
                </div>
                <h3 className="text-blue-700 dark:text-blue-400 text-base sm:text-lg font-medium hover:underline cursor-pointer leading-snug">
                  {title || 'Your Page Title Preview'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {description || 'Your page meta description will appear here inside Google search result snippets.'}
                </p>
              </div>
            )}

            {activePreview === 'twitter' && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 max-w-md mx-auto">
                <div className="aspect-[1.91/1] w-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  <img
                    src={imageUrl}
                    alt="Social card preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-3.5 space-y-1 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-mono uppercase truncate block">{new URL(canonical || 'https://example.com').hostname}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">{title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{description}</p>
                </div>
              </div>
            )}

            {(activePreview === 'facebook' || activePreview === 'linkedin') && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 max-w-md mx-auto">
                <div className="aspect-[1.91/1] w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Open Graph preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 space-y-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{siteName || 'DOMAIN.COM'}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight">{title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Generated Code Output Box */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold uppercase tracking-wider text-slate-400">Export Ready HTML Code</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-300" />
                    <span>Copied HTML!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy HTML Meta Tags</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900/80 rounded-xl text-xs text-cyan-300 font-mono overflow-x-auto max-h-48 scrollbar-thin">
              {generateHTML()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MetaTagAnalyzer;
