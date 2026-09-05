import React, { useState, useMemo } from 'react';
import { BarChart3, Search, FileText, CheckCircle2, AlertTriangle, HelpCircle, Sliders, Info, Copy, Check } from 'lucide-react';

const COMMON_STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't", 'cannot', 'could',
  "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's",
  'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm",
  "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't",
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't",
  'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "won't",
  "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom',
  'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your',
  'yours', 'yourself', 'yourselves'
]);

interface KeywordItem {
  text: string;
  count: number;
  density: number;
}

export default function SEOKeywordAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [excludeStopwords, setExcludeStopwords] = useState(true);
  const [minWordLength, setMinWordLength] = useState(3);
  const [activeTab, setActiveTab] = useState<'1gram' | '2gram' | '3gram'>('1gram');
  const [targetKeywords, setTargetKeywords] = useState<string>('seo, web, dynamic');
  const [copiedText, setCopiedText] = useState(false);

  // Parse text into words
  const cleanWords = useMemo(() => {
    if (!inputText.trim()) return [];
    // Convert to lowercase and strip punctuation
    return inputText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
      .split(/\s+/)
      .filter((word) => {
        const cleaned = word.trim();
        if (!cleaned) return false;
        if (cleaned.length < minWordLength) return false;
        if (excludeStopwords && COMMON_STOPWORDS.has(cleaned)) return false;
        return true;
      });
  }, [inputText, excludeStopwords, minWordLength]);

  // Total word counts (including standard words)
  const rawWordCount = useMemo(() => {
    if (!inputText.trim()) return 0;
    return inputText.trim().split(/\s+/).filter(Boolean).length;
  }, [inputText]);

  // Generate 1-Gram, 2-Gram, 3-Gram frequencies
  const analysisData = useMemo(() => {
    const list1: Record<string, number> = {};
    const list2: Record<string, number> = {};
    const list3: Record<string, number> = {};

    const words = cleanWords;
    const n = words.length;

    for (let i = 0; i < n; i++) {
      // 1-Gram
      const w1 = words[i];
      list1[w1] = (list1[w1] || 0) + 1;

      // 2-Gram
      if (i < n - 1) {
        const w2 = `${words[i]} ${words[i + 1]}`;
        list2[w2] = (list2[w2] || 0) + 1;
      }

      // 3-Gram
      if (i < n - 2) {
        const w3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        list3[w3] = (list3[w3] || 0) + 1;
      }
    }

    const mapToSortedArray = (record: Record<string, number>): KeywordItem[] => {
      return Object.entries(record)
        .map(([text, count]) => ({
          text,
          count,
          density: n > 0 ? parseFloat(((count / n) * 100).toFixed(2)) : 0,
        }))
        .sort((a, b) => b.count - a.count || b.density - a.density)
        .slice(0, 15);
    };

    return {
      grams1: mapToSortedArray(list1),
      grams2: mapToSortedArray(list2),
      grams3: mapToSortedArray(list3),
    };
  }, [cleanWords]);

  // Target keyword evaluation reports
  const targetEvaluation = useMemo(() => {
    if (!inputText.trim()) return [];
    const targets = targetKeywords
      .split(',')
      .map((kw) => kw.trim().toLowerCase())
      .filter(Boolean);

    const words = inputText
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    const n = words.length;

    return targets.map((target) => {
      // Handle multi-word target keyword support
      let count = 0;
      if (target.includes(' ')) {
        const targetPhrase = target;
        const joinedText = words.join(' ');
        let pos = joinedText.indexOf(targetPhrase);
        while (pos !== -1) {
          count++;
          pos = joinedText.indexOf(targetPhrase, pos + 1);
        }
      } else {
        count = words.filter((w) => w === target).length;
      }

      const density = n > 0 ? (count / n) * 100 : 0;
      let status: 'under' | 'optimal' | 'stuffed' = 'under';
      let message = 'Keyword is under-optimized (density below 1.0%). Paste it more naturally.';

      if (density >= 1.0 && density <= 2.5) {
        status = 'optimal';
        message = 'Optimal Search Engine Density (1.0% - 2.5%). Perfect distribution!';
      } else if (density > 2.5) {
        status = 'stuffed';
        message = 'Keyword Stuffing Alert (density above 2.5%). Reduce usage to avoid Google penalty.';
      }

      return {
        target,
        count,
        density: parseFloat(density.toFixed(2)),
        status,
        message,
      };
    });
  }, [inputText, targetKeywords]);

  // Overall Score Calculations
  const overallSeoScore = useMemo(() => {
    if (!inputText.trim()) return 0;
    let score = 50;

    // Word count checks
    if (rawWordCount >= 300 && rawWordCount < 600) score += 20;
    else if (rawWordCount >= 600) score += 30;
    else score += 5; // too thin content

    // Stopword usage check
    if (excludeStopwords) score += 10;

    // Keyword stuffing penalty
    const stuffedKeywords = analysisData.grams1.filter((kw) => kw.density > 3.5);
    if (stuffedKeywords.length > 0) {
      score -= Math.min(25, stuffedKeywords.length * 8);
    } else {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }, [inputText, rawWordCount, excludeStopwords, analysisData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const loadSampleData = () => {
    setInputText(`In today's digital environment, web search engine optimization is absolutely vital for any creator. Building high-quality, professional search engine friendly content requires careful strategic planning. Your SEO keyword distribution determines how search bots analyze and rank your web assets. You must monitor keyword density carefully. Keyword stuffing or spamming high-density tags will lead to severe search engine penalties.

Instead, craft detailed web publications containing descriptive paragraphs, helpful tables, and structured data schemas. Google favors comprehensive web topics that address reader queries. Keep keyword density of your primary topic between 1.5% and 2.5% to rank securely on search result screens. Optimize meta tags, structure your code semantically, and generate custom JSON-LD schemas.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-amber-500" />
              <h3 className="font-display font-bold text-slate-900 dark:text-white">
                Input Content Workspace
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSampleData}
                type="button"
                className="px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:text-emerald-400 bg-amber-500/5 hover:bg-amber-500/10 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10 border border-amber-500/10 rounded-lg transition-colors cursor-pointer"
              >
                Load Sample Article
              </button>
              {inputText && (
                <button
                  onClick={handleCopy}
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Copy entered text"
                >
                  {copiedText ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or write your web page text, blog post draft, or YouTube descriptions here to analyze keyword distributions instantly..."
              rows={9}
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-850 dark:text-slate-200 placeholder-slate-400 resize-none font-sans"
            />

            {/* Config sliders & toggles */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Filter Noise Words
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Exclude standard grammar particles (the, is, an, to)
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={excludeStopwords}
                    onChange={(e) => setExcludeStopwords(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-250 dark:bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Min Character Length
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-500">{minWordLength} chars</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={minWordLength}
                  onChange={(e) => setMinWordLength(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Target Keywords checking tool */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Compare Target Search Terms (comma-separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  placeholder="e.g. seo, website, optimize, tags"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
                />
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <span className="block text-[10px] text-slate-400 leading-normal">
                Compare specific terms against search crawler sweet spots (1.0% to 2.5% frequency bounds).
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostic Reports panel */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
                <BarChart3 size={16} className="text-amber-500" />
                SEO Health Diagnostics
              </h3>
              {inputText && (
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider ${
                  overallSeoScore >= 80 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                  overallSeoScore >= 50 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                  'bg-red-500/15 text-red-600 dark:text-red-400'
                }`}>
                  {overallSeoScore >= 80 ? 'EXCELLENT' : overallSeoScore >= 50 ? 'IMPROVABLE' : 'WEAK CONTENT'}
                </span>
              )}
            </div>

            {/* Health indicators */}
            {!inputText ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sliders size={20} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    Workspace Currently Empty
                  </p>
                  <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                    Write or paste your article copy in the workspace on the left to review keyword densities, word density graphs, and SEO scoring diagnostics.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 flex-1">
                {/* Score & Volume row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 text-center">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      SEO score
                    </span>
                    <span className={`text-3xl font-extrabold block mt-1 ${
                      overallSeoScore >= 80 ? 'text-emerald-500' :
                      overallSeoScore >= 50 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {overallSeoScore}/100
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 text-center">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Word Count
                    </span>
                    <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 block mt-1">
                      {rawWordCount}
                    </span>
                  </div>
                </div>

                {/* Word length tips */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Content Length Audit
                  </span>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                    {rawWordCount < 300 ? (
                      <>
                        <AlertTriangle className="text-amber-500 shrink-0" size={14} />
                        <span>Thin content penalty risk. Write at least <strong>300 words</strong> to index reliably on modern search engines.</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={14} />
                        <span>Strong content footprint length. Perfect size for organic search parsing indexing.</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Target keywords scorecard results */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Target Term Auditing
                  </span>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {targetEvaluation.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 flex flex-col gap-1 text-[11px]"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-850 dark:text-slate-200 font-mono">
                            "{item.target}"
                          </span>
                          <span className={`font-semibold ${
                            item.status === 'optimal' ? 'text-emerald-600 dark:text-emerald-400' :
                            item.status === 'stuffed' ? 'text-red-500' : 'text-amber-500'
                          }`}>
                            {item.count} hits ({item.density}%)
                          </span>
                        </div>
                        <p className="text-slate-400 leading-normal">
                          {item.message}
                        </p>
                      </div>
                    ))}
                    {targetEvaluation.length === 0 && (
                      <p className="text-[11px] text-slate-400 italic text-center py-2">
                        No target words defined.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main n-gram density table panels */}
      {inputText && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-slate-900 dark:text-white">
                Keyword & Phrase Frequency Distribution
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore calculated keyword distributions mapped across distinct multi-word phrase patterns.
              </p>
            </div>

            {/* Selector tabs */}
            <div className="flex bg-slate-50 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-850 rounded-xl self-start sm:self-center">
              {(['1gram', '2gram', '3gram'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs border border-slate-150 dark:border-slate-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab === '1gram' ? 'Single Words' : tab === '2gram' ? '2-Word Phrases' : '3-Word Phrases'}
                </button>
              ))}
            </div>
          </div>

          {/* Table display & visual progress bars */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Table section */}
              <div className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      <th className="p-3">Rank & Keyword</th>
                      <th className="p-3 text-center">Frequency</th>
                      <th className="p-3 text-right">Density %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                    {(activeTab === '1gram' ? analysisData.grams1 : activeTab === '2gram' ? analysisData.grams2 : analysisData.grams3).slice(0, 8).map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 font-medium">
                        <td className="p-3 text-slate-850 dark:text-slate-200 font-mono">
                          <span className="text-slate-400 mr-2 font-sans font-bold">{index + 1}.</span>
                          {item.text}
                        </td>
                        <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-300">
                          {item.count}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`inline-block px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                            item.density > 3.5 ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                            item.density >= 1.5 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400'
                          }`}>
                            {item.density}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(activeTab === '1gram' ? analysisData.grams1 : activeTab === '2gram' ? analysisData.grams2 : analysisData.grams3).length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-slate-400 italic">
                          No phrases found fitting min-character requirements.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bar charts visualization */}
              <div className="space-y-4">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Visual Density Distributions
                </span>
                <div className="space-y-3.5">
                  {(activeTab === '1gram' ? analysisData.grams1 : activeTab === '2gram' ? analysisData.grams2 : analysisData.grams3).slice(0, 6).map((item, idx) => {
                    // Normalize width against first rank
                    const maxDensity = (activeTab === '1gram' ? analysisData.grams1 : activeTab === '2gram' ? analysisData.grams2 : analysisData.grams3)[0]?.density || 1;
                    const fillPercentage = Math.max(10, Math.min(100, (item.density / maxDensity) * 100));

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px] font-mono">
                            {item.text}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {item.density}% ({item.count}x)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-slate-850">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.density > 3.5 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                              item.density >= 1.5 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                              'bg-gradient-to-r from-amber-500 to-yellow-500'
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Guidelines Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h4 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850 text-sm">
          <Info className="text-amber-500 shrink-0" size={16} />
          Premium SEO Density Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              1. Optimal Density Spot
            </span>
            <p className="text-[11px] leading-relaxed">
              Google crawlers recommend keeping the density of your target topics at <strong>1.5% to 2.5%</strong>. This establishes clear contextual focus without appearing spammy.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              2. Avoid Keyword Stuffing
            </span>
            <p className="text-[11px] leading-relaxed">
              A density exceeding <strong>3.5%</strong> for any keyword represents keyword stuffing. Modern NLP search engines easily identify this and will downgrade search rankings.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              3. Power of Long-Tail 3-Grams
            </span>
            <p className="text-[11px] leading-relaxed">
              Optimize for 3-Gram phrase structures. Users search using questions. Matching descriptive 3-word patterns (e.g., "easy code helper") will attract high organic search volumes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
