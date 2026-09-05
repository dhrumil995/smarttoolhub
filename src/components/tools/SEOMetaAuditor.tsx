import React, { useState, useMemo } from 'react';
import { Eye, HelpCircle, FileText, CheckCircle2, AlertTriangle, Info, Copy, Check, Upload, ArrowRight, Laptop, Tablet, Facebook, Twitter } from 'lucide-react';

type PreviewMode = 'google-desktop' | 'google-mobile' | 'facebook' | 'twitter';

export default function SEOMetaAuditor() {
  const [inputMode, setInputMode] = useState<'fields' | 'html'>('fields');
  const [rawHtml, setRawHtml] = useState('');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('google-desktop');
  const [copied, setCopied] = useState(false);

  // Core metadata states
  const [metaTitle, setMetaTitle] = useState('Top 10 Tailwind CSS Tips for Responsive Fluid Layouts');
  const [metaDescription, setMetaDescription] = useState('Explore how to craft responsive, fluid web grids using modern utility classes. Avoid spacing chaos, leverage fluid typography, and optimize custom layouts.');
  const [robotsIndex, setRobotsIndex] = useState<'index' | 'noindex'>('index');
  const [robotsFollow, setRobotsFollow] = useState<'follow' | 'nofollow'>('follow');
  const [canonicalUrl, setCanonicalUrl] = useState('https://mysite.com/tailwind-responsive-tips');
  const [ogTitle, setOgTitle] = useState('Responsive Grid Hacks in Tailwind CSS');
  const [ogImage, setOgImage] = useState('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&h=315&q=80');

  // Parse HTML Header Tags dynamically
  const handleParseHtml = () => {
    if (!rawHtml.trim()) return;

    // Helper patterns to grab tag contents
    const titleMatch = rawHtml.match(/<title>([^<]*)<\/title>/i);
    const descMatch = rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                      rawHtml.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    
    const robotsMatch = rawHtml.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const canonicalMatch = rawHtml.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);

    const ogTitleMatch = rawHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ogImgMatch = rawHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);

    if (titleMatch && titleMatch[1]) setMetaTitle(titleMatch[1]);
    if (descMatch && descMatch[1]) setMetaDescription(descMatch[1]);
    if (canonicalMatch && canonicalMatch[1]) setCanonicalUrl(canonicalMatch[1]);
    if (ogTitleMatch && ogTitleMatch[1]) setOgTitle(ogTitleMatch[1]);
    if (ogImgMatch && ogImgMatch[1]) setOgImage(ogImgMatch[1]);

    if (robotsMatch && robotsMatch[1]) {
      const val = robotsMatch[1].toLowerCase();
      setRobotsIndex(val.includes('noindex') ? 'noindex' : 'index');
      setRobotsFollow(val.includes('nofollow') ? 'nofollow' : 'follow');
    }

    setInputMode('fields');
  };

  // Length calculation rules
  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;

  const titleAnalysis = useMemo(() => {
    if (titleLength === 0) return { status: 'error', text: 'Missing meta title! Add a title for indexing.', color: 'text-red-500' };
    if (titleLength < 30) return { status: 'warning', text: 'Too short. Target 50-60 characters for optimal click rates.', color: 'text-amber-500' };
    if (titleLength > 60) return { status: 'warning', text: 'Too long. Google will truncate this on search views (60 max).', color: 'text-red-500' };
    return { status: 'success', text: 'Optimal title length (50-60 characters). Perfectly balanced!', color: 'text-emerald-500' };
  }, [titleLength]);

  const descAnalysis = useMemo(() => {
    if (descLength === 0) return { status: 'error', text: 'Missing meta description. Google will auto-generate arbitrary snippets.', color: 'text-red-500' };
    if (descLength < 110) return { status: 'warning', text: 'Too short. Use 120-160 characters to expand your context.', color: 'text-amber-500' };
    if (descLength > 160) return { status: 'warning', text: 'Too long. Text will be cut short in standard search snippets.', color: 'text-red-500' };
    return { status: 'success', text: 'Optimal description length (120-160 characters). Perfect!', color: 'text-emerald-500' };
  }, [descLength]);

  const indexabilityAudit = useMemo(() => {
    const findings: { type: 'success' | 'warn' | 'info'; title: string; text: string }[] = [];

    // Crawl block warn
    if (robotsIndex === 'noindex') {
      findings.push({
        type: 'warn',
        title: 'Crawl Blocked',
        text: 'The robots "noindex" parameter tells search bots to ignore this page completely. Do not deploy unless intended.'
      });
    } else {
      findings.push({
        type: 'success',
        title: 'Indexable State',
        text: 'Search engines are allowed to crawl, parse, and index this web page.'
      });
    }

    // Canonical check
    if (!canonicalUrl) {
      findings.push({
        type: 'warn',
        title: 'Missing Canonical Tag',
        text: 'Without a canonical link, search engines might flag duplicate pages if users access your site via http/https/www variations.'
      });
    } else if (!canonicalUrl.startsWith('https://')) {
      findings.push({
        type: 'info',
        title: 'Insecure Canonical link',
        text: 'Prefer using absolute secure HTTPS links for canonical addresses.'
      });
    }

    // Og Title check
    if (!ogTitle) {
      findings.push({
        type: 'info',
        title: 'Fallback Social Tags',
        text: 'Social networks will fallback to standard meta titles since OpenGraph is blank.'
      });
    }

    return findings;
  }, [robotsIndex, canonicalUrl, ogTitle]);

  const handleCopyTags = () => {
    const code = `<!-- Primary Meta Tags -->
<title>${metaTitle}</title>
<meta name="title" content="${metaTitle}">
<meta name="description" content="${metaDescription}">
<meta name="robots" content="${robotsIndex}, ${robotsFollow}">
${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${canonicalUrl || 'https://example.com'}">
<meta property="og:title" content="${ogTitle || metaTitle}">
<meta property="og:description" content="${metaDescription}">
${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${canonicalUrl || 'https://example.com'}">
<meta property="twitter:title" content="${ogTitle || metaTitle}">
<meta property="twitter:description" content="${metaDescription}">
${ogImage ? `<meta property="twitter:image" content="${ogImage}">` : ''}`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSampleHTML = () => {
    setRawHtml(`<!DOCTYPE html>
<html>
<head>
  <title>Sarah's Advanced Guide to TypeScript Generics</title>
  <meta name="description" content="Discover how to design fully type-safe polymorphic structures in TypeScript. Avoid any casts, reuse component logic, and map strict object bindings easily.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://example.com/typescript-generics-guide">
  <meta property="og:title" content="TypeScript Generics Masterclass">
  <meta property="og:image" content="https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=600&h=315&q=80">
</head>
<body></body>
</html>`);
  };

  return (
    <div className="space-y-6">
      {/* Tab select header */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 flex flex-wrap gap-1.5 justify-between items-center">
        <div className="flex gap-1">
          <button
            onClick={() => setInputMode('fields')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
              inputMode === 'fields'
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Direct Editor Fields
          </button>
          <button
            onClick={() => setInputMode('html')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
              inputMode === 'html'
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paste HTML / Scrap Code
          </button>
        </div>

        {inputMode === 'html' && (
          <button
            type="button"
            onClick={loadSampleHTML}
            className="px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 rounded-lg transition-colors cursor-pointer"
          >
            Load Sample HTML Head
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: input fields or scraper */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {inputMode === 'html' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                <Upload size={16} className="text-blue-500" />
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Paste Web Page HTML
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste the HTML header tag contents of any website. Our client-side index crawler will automatically extract title, description, and OpenGraph variables.
              </p>
              <textarea
                value={rawHtml}
                onChange={(e) => setRawHtml(e.target.value)}
                placeholder="e.g. <title>My Site</title><meta name='description' content='Best utilities...'>"
                rows={11}
                className="w-full px-4 py-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 resize-none"
              />
              <button
                onClick={handleParseHtml}
                disabled={!rawHtml.trim()}
                type="button"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Start Scraping & Audit Header
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                <FileText size={16} className="text-blue-500" />
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Meta Tag Attributes
                </h3>
              </div>

              {/* Title tag and character checker */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-bold">
                  <label className="text-slate-600 dark:text-slate-400">Page Meta Title</label>
                  <span className={`font-mono text-[11px] ${
                    titleLength > 60 || titleLength === 0 ? 'text-red-500' : titleLength < 30 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {titleLength} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200 font-bold"
                />
                <span className={`block text-[10px] font-medium leading-normal ${titleAnalysis.color}`}>
                  {titleAnalysis.text}
                </span>
              </div>

              {/* Description tag and character checker */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center font-bold">
                  <label className="text-slate-600 dark:text-slate-400">Meta Description</label>
                  <span className={`font-mono text-[11px] ${
                    descLength > 160 || descLength === 0 ? 'text-red-500' : descLength < 110 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {descLength} / 160 chars
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200 resize-none font-medium leading-normal"
                />
                <span className={`block text-[10px] font-medium leading-normal ${descAnalysis.color}`}>
                  {descAnalysis.text}
                </span>
              </div>

              {/* Canonical URL */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Canonical URL Tag</label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://mysite.com/page"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-850 dark:text-slate-200 font-medium"
                />
              </div>

              {/* Indexability settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-400">Robots Index Tag</label>
                  <select
                    value={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.value as 'index' | 'noindex')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-850 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="index">Index (Crawlers can rank)</option>
                    <option value="noindex">Noindex (Hide from search)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-400">Robots Follow Tag</label>
                  <select
                    value={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.value as 'follow' | 'nofollow')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-850 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="follow">Follow links</option>
                    <option value="nofollow">Nofollow (Ignore outbound)</option>
                  </select>
                </div>
              </div>

              {/* OpenGraph variables */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3.5">
                <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                  Social Open Graph Metadata
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">OG Share Title</label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="e.g. Tips to code TS"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-850 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">OG Share Image URL</label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://mysite.com/cover.png"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-850 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right pane: crawler simulator and preview cards */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mockups view */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950 p-1 border border-slate-150 dark:border-slate-850 rounded-xl justify-center">
              <button
                onClick={() => setPreviewMode('google-desktop')}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                  previewMode === 'google-desktop'
                    ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-2xs border border-slate-150 dark:border-slate-800'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Laptop size={11} /> Google Web
              </button>
              <button
                onClick={() => setPreviewMode('google-mobile')}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                  previewMode === 'google-mobile'
                    ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-2xs border border-slate-150 dark:border-slate-800'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Tablet size={11} /> Google Mobile
              </button>
              <button
                onClick={() => setPreviewMode('facebook')}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                  previewMode === 'facebook'
                    ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-2xs border border-slate-150 dark:border-slate-800'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Facebook size={11} className="text-blue-650" /> Facebook OG
              </button>
              <button
                onClick={() => setPreviewMode('twitter')}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                  previewMode === 'twitter'
                    ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-2xs border border-slate-150 dark:border-slate-800'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Twitter size={11} className="text-sky-500" /> Twitter Card
              </button>
            </div>

            {/* Mock screens canvases */}
            <div className="text-left">
              {/* GOOGLE DESKTOP */}
              {previewMode === 'google-desktop' && (
                <div className="p-4 bg-white dark:bg-[#1a1b1c] rounded-2xl border border-slate-200 dark:border-slate-800 font-sans space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#202124] dark:text-[#bdc1c6]">
                    <span>{canonicalUrl || 'https://mysite.com'}</span>
                  </div>
                  <h5 className="text-[18px] leading-snug font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer truncate max-w-full">
                    {metaTitle || 'No Title Provided'}
                  </h5>
                  <p className="text-[12.5px] text-[#4d5156] dark:text-[#dae0e6] leading-relaxed line-clamp-2">
                    {metaDescription || 'No description provided.'}
                  </p>
                </div>
              )}

              {/* GOOGLE MOBILE */}
              {previewMode === 'google-mobile' && (
                <div className="max-w-[340px] mx-auto p-4 bg-white dark:bg-[#1a1b1c] rounded-2xl border border-slate-200 dark:border-slate-800 font-sans space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-600 dark:text-slate-300">mysite.com</span>
                  </div>
                  <h5 className="text-[15px] leading-snug font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-2">
                    {metaTitle || 'No Title Provided'}
                  </h5>
                  <p className="text-[11.5px] text-[#4d5156] dark:text-[#dae0e6] leading-normal line-clamp-3">
                    {metaDescription || 'No description provided.'}
                  </p>
                </div>
              )}

              {/* FACEBOOK */}
              {previewMode === 'facebook' && (
                <div className="max-w-[420px] mx-auto bg-[#f0f2f5] dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs font-sans">
                  {ogImage ? (
                    <img referrerPolicy="no-referrer" src={ogImage} alt="Social Meta Visual" className="w-full h-[200px] object-cover" />
                  ) : (
                    <div className="w-full h-[180px] bg-slate-200 dark:bg-slate-850 flex items-center justify-center text-slate-400 text-xs">No Meta Image defined</div>
                  )}
                  <div className="p-3 bg-white dark:bg-slate-900 space-y-0.5 border-t border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">MYSITE.COM</span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {ogTitle || metaTitle}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal font-medium">
                      {metaDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* TWITTER */}
              {previewMode === 'twitter' && (
                <div className="max-w-[420px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-2xs font-sans">
                  {ogImage ? (
                    <img referrerPolicy="no-referrer" src={ogImage} alt="Social Meta Visual" className="w-full h-[190px] object-cover" />
                  ) : (
                    <div className="w-full h-[170px] bg-slate-200 dark:bg-slate-850 flex items-center justify-center text-slate-400 text-xs">No Meta Image defined</div>
                  )}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 block">🔗 mysite.com</span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {ogTitle || metaTitle}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {metaDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Crawler audit scorecard results */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-3.5">
            <h4 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3 text-xs sm:text-sm">
              <CheckCircle2 size={16} className="text-blue-500" />
              Crawler Diagnostics
            </h4>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {indexabilityAudit.map((finding, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border flex gap-2.5 text-xs ${
                    finding.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    finding.type === 'warn' ? 'bg-red-500/5 border-red-500/10 text-red-600 dark:text-red-400' :
                    'bg-blue-500/5 border-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">{finding.title}</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                      {finding.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Exporter panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-mono text-xs font-bold text-slate-350">
                SEO Ready HTML Header Code
              </span>
              <button
                onClick={handleCopyTags}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl font-semibold font-sans text-[10px] text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy Head Block'}
              </button>
            </div>
            <pre className="text-[10px] sm:text-xs font-mono text-[#79c0ff] p-3.5 bg-slate-950/60 rounded-xl overflow-x-auto max-h-[160px] border border-slate-900 text-left">
              {`<!-- Primary Meta Tags -->
<title>${metaTitle}</title>
<meta name="title" content="${metaTitle}">
<meta name="description" content="${metaDescription}">
<meta name="robots" content="${robotsIndex}, ${robotsFollow}">
${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ''}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
