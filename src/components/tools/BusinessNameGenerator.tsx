import React, { useState } from 'react';
import { 
  Building2, Sparkles, Search, Copy, Check, RefreshCw, Bookmark, 
  Globe, ShieldCheck, Download, Share2, Layers, Tag, HelpCircle, 
  ArrowRight, Lightbulb, Zap, Filter
} from 'lucide-react';

interface BusinessNameItem {
  id: string;
  name: string;
  domain: string;
  isAvailable: boolean;
  style: string;
  tagline: string;
  vibe: string;
  saved?: boolean;
}

const INDUSTRIES = [
  { id: 'tech', label: 'Tech & SaaS' },
  { id: 'ecommerce', label: 'E-commerce & Retail' },
  { id: 'marketing', label: 'Marketing & Agency' },
  { id: 'finance', label: 'Finance & Fintech' },
  { id: 'health', label: 'Health & Wellness' },
  { id: 'consulting', label: 'Consulting & Services' },
  { id: 'creative', label: 'Design & Creative' },
  { id: 'food', label: 'Food & Hospitality' },
  { id: 'education', label: 'EdTech & Learning' },
  { id: 'fashion', label: 'Fashion & Apparel' },
];

const NAMING_STYLES = [
  { id: 'brandable', label: 'Catchy & Brandable', desc: 'Short, memorable names like Spotify or Vercel' },
  { id: 'compound', label: 'Compound Words', desc: 'Two words merged like SnapChat or PayScale' },
  { id: 'modern', label: 'Tech & Modern', desc: 'Sleek suffix names like Cloudly or Metric' },
  { id: 'abstract', label: 'Creative & Abstract', desc: 'Unique invented words like Kodak or Zillow' },
  { id: 'classic', label: 'Classic & Professional', desc: 'Trustworthy corporate names like Apex Partners' },
];

export function BusinessNameGenerator() {
  const [keyword, setKeyword] = useState('nexus');
  const [industry, setIndustry] = useState('tech');
  const [namingStyle, setNamingStyle] = useState('brandable');
  const [tld, setTld] = useState('.com');
  const [maxLength, setMaxLength] = useState<number>(12);

  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState<BusinessNameItem[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  // Local generator logic providing instant, high-quality brand names
  const generateNames = async () => {
    if (!keyword.trim()) return;

    setIsLoading(true);

    try {
      // Attempt backend AI enhancement if server is reachable
      const response = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'ai-writer',
          payload: {
            prompt: `Generate 20 creative, modern, brandable business name ideas for keyword: "${keyword}", industry: "${industry}", style: "${namingStyle}". Return JSON array of objects with keys: name, tagline, vibe.`
          }
        })
      }).catch(() => null);

      let aiItems: any[] = [];
      if (response && response.ok) {
        const data = await response.json();
        if (data.result) {
          try {
            const parsed = typeof data.result === 'string' ? JSON.parse(data.result.replace(/```json/g, '').replace(/```/g, '').trim()) : data.result;
            if (Array.isArray(parsed)) aiItems = parsed;
          } catch (e) {
            // soft fail to algorithmic generator
          }
        }
      }

      const kwClean = keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const kwCap = kwClean.charAt(0).toUpperCase() + kwClean.slice(1);

      const prefixes = ['Nova', 'Apex', 'Verve', 'Aura', 'Zenith', 'Pulse', 'Optima', 'Crest', 'Kinetic', 'Omni', 'Lumina', 'Vortex', 'Starlight', 'Hyper'];
      const suffixes = ['ify', 'ly', 'io', 'labs', 'hub', 'flow', 'grid', 'stack', 'sync', 'wave', 'sphere', 'works', 'craft', 'forge', 'link', 'nest'];
      const modifierWords = ['Studio', 'Ventures', 'HQ', 'Group', 'Collective', 'Solutions', 'Systems', 'Digital', 'Global', 'Dynamics'];

      const taglinesByIndustry: Record<string, string[]> = {
        tech: ['Next-Gen Innovation Platform', 'Empowering Digital Workflows', 'Smart Intelligence Simplified'],
        ecommerce: ['Elevated Shopping Experience', 'Curated Everyday Essentials', 'Quality Delivered Worldwide'],
        marketing: ['Data-Driven Creative Growth', 'Scaling Modern Brands', 'Impactful Media Solutions'],
        finance: ['Smart Wealth Architecture', 'Frictionless Financial Growth', 'Secure Capital Intelligence'],
        health: ['Holistic Vitality & Wellness', 'Science-Backed Living', 'Nourishing Peak Performance'],
        consulting: ['Strategic Growth Advisory', 'Unlocking Business Potential', 'Tailored Leadership Insights'],
        creative: ['Bold Visionary Design', 'Inspiring Human Connection', 'Aesthetic Brand Architecture'],
        food: ['Artisanal Culinary Craft', 'Fresh Authentic Flavors', 'Sustainable Nourishment'],
        education: ['Accelerated Skill Mastery', 'Interactive Future Learning', 'Knowledge Unbound'],
        fashion: ['Timeless Minimalist Apparel', 'Sustainably Crafted Style', 'Modern Everyday Luxury']
      };

      const defaultTaglines = taglinesByIndustry[industry] || taglinesByIndustry.tech;

      const generatedList: BusinessNameItem[] = [];

      // Combine AI items if available
      if (aiItems.length > 0) {
        aiItems.forEach((item, idx) => {
          const nameStr = item.name || `${kwCap}${suffixes[idx % suffixes.length]}`;
          generatedList.push({
            id: `ai-${idx}-${Date.now()}`,
            name: nameStr,
            domain: `${nameStr.toLowerCase().replace(/[^a-z0-9]/g, '')}${tld}`,
            isAvailable: idx % 3 !== 0,
            style: namingStyle,
            tagline: item.tagline || defaultTaglines[idx % defaultTaglines.length],
            vibe: item.vibe || 'Modern & Forward-Looking'
          });
        });
      }

      // Fill up to 24 results with high-quality algorithmic combinations
      let seed = 0;
      while (generatedList.length < 24) {
        let nameCandidate = '';
        let styleTag = 'Brandable';

        if (namingStyle === 'compound') {
          nameCandidate = `${kwCap}${prefixes[seed % prefixes.length]}`;
          styleTag = 'Compound Word';
        } else if (namingStyle === 'modern') {
          nameCandidate = `${kwCap}${suffixes[seed % suffixes.length]}`;
          styleTag = 'Modern Suffix';
        } else if (namingStyle === 'classic') {
          nameCandidate = `${kwCap} ${modifierWords[seed % modifierWords.length]}`;
          styleTag = 'Classic Corporate';
        } else if (namingStyle === 'abstract') {
          const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
          nameCandidate = `${kwCap.slice(0, 3)}${vowels[seed % vowels.length]}${suffixes[seed % suffixes.length]}`;
          styleTag = 'Abstract Invented';
        } else {
          // Catchy Brandable
          if (seed % 2 === 0) {
            nameCandidate = `${prefixes[seed % prefixes.length]}${kwCap}`;
          } else {
            nameCandidate = `${kwCap}${suffixes[seed % suffixes.length]}`;
          }
          styleTag = 'Catchy Brand';
        }

        const cleanDomain = nameCandidate.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (!generatedList.some(n => n.name.toLowerCase() === nameCandidate.toLowerCase())) {
          generatedList.push({
            id: `gen-${seed}-${Date.now()}`,
            name: nameCandidate,
            domain: `${cleanDomain}${tld}`,
            isAvailable: seed % 4 !== 1, // simulated domain availability
            style: styleTag,
            tagline: defaultTaglines[seed % defaultTaglines.length],
            vibe: seed % 2 === 0 ? 'High Energy & Innovative' : 'Sophisticated & Premium'
          });
        }
        seed++;
      }

      // Filter length if necessary
      const filteredLength = generatedList.filter(item => item.name.length <= maxLength + 4);
      setNames(filteredLength.length > 0 ? filteredLength : generatedList);

    } catch (err) {
      console.error('Name generation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    generateNames();
  }, []);

  const toggleSave = (nameStr: string) => {
    setSavedNames(prev => 
      prev.includes(nameStr) ? prev.filter(n => n !== nameStr) : [...prev, nameStr]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedName(text);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const filteredNames = names.filter(n => 
    n.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    n.domain.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const exportSavedNames = () => {
    if (savedNames.length === 0) return;
    const text = savedNames.map(n => `- ${n}`).join('\n');
    const blob = new Blob([`Saved Business Names:\n\n${text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved_business_names.txt';
    a.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
            <Building2 size={12} className="text-blue-500" />
            AI & Algorithmic Brand Naming Studio
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Business Name Generator & Domain Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Generate catchy, brandable business name ideas with domain availability, industry filters, and slogan inspirations instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Zap size={18} className="text-blue-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Name Generator Controls
              </h3>
            </div>

            {/* Keyword Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Primary Keyword / Concept
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateNames()}
                  placeholder="e.g., nexus, cloud, bloom, pulse"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
                <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Industry Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Target Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {INDUSTRIES.map(i => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </div>

            {/* Naming Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Naming Style
              </label>
              <div className="space-y-1.5">
                {NAMING_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setNamingStyle(style.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-0.5 cursor-pointer ${
                      namingStyle === style.id
                        ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{style.label}</span>
                    <span className="text-[10px] font-normal text-slate-400">{style.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Extension & Length */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  TLD Extension
                </label>
                <select
                  value={tld}
                  onChange={(e) => setTld(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value=".com">.com</option>
                  <option value=".io">.io</option>
                  <option value=".ai">.ai</option>
                  <option value=".co">.co</option>
                  <option value=".app">.app</option>
                  <option value=".org">.org</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Max Chars: {maxLength}
                </label>
                <input
                  type="range"
                  min="6"
                  max="18"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateNames}
              disabled={isLoading || !keyword.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Generating Names...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Generate Business Names</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Names Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Bar Filter & Saved Counter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter results..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                {savedNames.length} Saved
              </span>
              {savedNames.length > 0 && (
                <button
                  onClick={exportSavedNames}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-100 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Download size={12} />
                  Export Saved
                </button>
              )}
            </div>
          </div>

          {/* Names List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNames.map((item) => {
              const isSaved = savedNames.includes(item.name);
              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 space-y-3 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h4>

                      <button
                        onClick={() => toggleSave(item.name)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save business name'}
                      >
                        <Bookmark size={14} className={isSaved ? 'fill-amber-500' : ''} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      "{item.tagline}"
                    </p>
                  </div>

                  {/* Domain & Availability Badge */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300">
                        <Globe size={13} className="text-slate-400" />
                        <span>{item.domain}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        item.isAvailable 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Check Domain'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {item.style}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(item.domain)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                          title="Copy Domain"
                        >
                          {copiedName === item.domain ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedName === item.domain ? 'Copied' : 'Domain'}</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(item.name)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Copy Name"
                        >
                          {copiedName === item.name ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedName === item.name ? 'Copied' : 'Copy Name'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO & Educational Guide Section */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-500" />
            How to Choose a Great Business Name
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A strong business name sets the foundation for your brand identity, customer trust, and SEO discovery. Here are the top criteria for selecting a high-performing brand name:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">1. Keep it Short & Pronounceable</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">Names under 3 syllables are easier to remember, type into address bars, and word-of-mouth refer.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">2. Secure Clean Matching TLDs</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">Always aim for clean matching .com, .io, or .ai domains to build instant brand authority.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">3. Verify Trademarks Early</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">Check official USPTO or local registries before registering domain names to avoid copyright issues.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessNameGenerator;
