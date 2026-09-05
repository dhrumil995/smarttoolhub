import React, { useState } from 'react';
import { Copy, Check, Sparkles, HelpCircle, AlertTriangle, RotateCcw, Award, Lightbulb } from 'lucide-react';

interface GeneratedTitle {
  text: string;
  type: 'educational' | 'curiosity' | 'fomo' | 'list';
  strength: 'Exceptional' | 'High CTR' | 'Viral Potential' | 'Good SEO';
  strengthColor: string;
  charCount: number;
}

export default function YTTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [mistake, setMistake] = useState('');
  const [number, setNumber] = useState('5');
  const [generatedTitles, setGeneratedTitles] = useState<GeneratedTitle[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const t = topic.trim();
    const res = result.trim() || 'Double Your Results';
    const tf = timeframe.trim() || '30 Days';
    const mist = mistake.trim() || 'Wasting Time';
    const num = number.trim() || '5';

    // Capitalize helper
    const cap = (str: string) => str.replace(/\b\w/g, c => c.toUpperCase());
    const capTopic = cap(t);
    const capResult = cap(res);
    const capTf = cap(tf);
    const capMist = cap(mist);

    const formulas: Omit<GeneratedTitle, 'charCount'>[] = [
      // 1. Educational / How-To
      {
        text: `How to Master ${capTopic} in ${capTf} (Step-by-Step Guide)`,
        type: 'educational',
        strength: 'Good SEO',
        strengthColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      },
      {
        text: `The Only ${capTopic} Guide You'll Ever Need to ${capResult}`,
        type: 'educational',
        strength: 'Exceptional',
        strengthColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
      },
      {
        text: `How I Learned ${capTopic} to Finally ${capResult}`,
        type: 'educational',
        strength: 'High CTR',
        strengthColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      },
      // 2. Curiosity / Clickbait
      {
        text: `I Tried ${capTopic} for ${capTf}... Here's What Happened!`,
        type: 'curiosity',
        strength: 'Viral Potential',
        strengthColor: 'text-red-500 bg-red-500/10 border-red-500/20',
      },
      {
        text: `They Don't Want You Knowing This ${capTopic} Secret...`,
        type: 'curiosity',
        strength: 'Viral Potential',
        strengthColor: 'text-red-500 bg-red-500/10 border-red-500/20',
      },
      {
        text: `This Simple ${capTopic} Hack is Actually Genius`,
        type: 'curiosity',
        strength: 'High CTR',
        strengthColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      },
      // 3. FOMO / Mistakes
      {
        text: `Stop ${capMist}! Do This ${capTopic} Method Instead`,
        type: 'fomo',
        strength: 'Exceptional',
        strengthColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
      },
      {
        text: `Before You Try ${capTopic}, WATCH THIS Video!`,
        type: 'fomo',
        strength: 'High CTR',
        strengthColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      },
      // 4. List Style
      {
        text: `${num} ${capTopic} Mistakes You Are Probably Making (And How to Fix Them)`,
        type: 'list',
        strength: 'Good SEO',
        strengthColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      },
      {
        text: `${num} Insane ${capTopic} Secrets to ${capResult} Today`,
        type: 'list',
        strength: 'Exceptional',
        strengthColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
      },
    ];

    const finalTitles: GeneratedTitle[] = formulas.map(f => ({
      ...f,
      charCount: f.text.length,
    }));

    setGeneratedTitles(finalTitles);
  };

  const handleCopyTitle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setResult('');
    setTimeframe('');
    setMistake('');
    setNumber('5');
    setGeneratedTitles([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Core Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Primary Video Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. video editing, baking sourdough, buying index funds"
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200 placeholder-slate-400"
                required
              />
            </div>

            {/* Target Outcome */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Desired Result / Benefit (Optional)
              </label>
              <input
                type="text"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="e.g. get 10,000 views, bake like a pro, save $500"
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Timeframe / Duration (Optional)
              </label>
              <input
                type="text"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="e.g. 30 days, 24 hours, 1 week"
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Avoidable Mistake */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Mistake / Pain Point (Optional)
              </label>
              <input
                type="text"
                value={mistake}
                onChange={(e) => setMistake(e.target.value)}
                placeholder="e.g. wasting money, ruin the texture, buying useless gear"
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Number of tips */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Number for list-style options (Optional)
              </label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                min="3"
                max="50"
                className="w-32 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles size={14} className="fill-white" />
              Generate Video Titles
            </button>

            {generatedTitles.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {generatedTitles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Output list */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="border-b border-slate-150 dark:border-slate-850 pb-4">
                <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lightbulb size={18} className="text-red-500" />
                  Your Optimized Title Suggestions
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Copy whichever title fits your branding style. Keep final titles under 60 characters for best mobile displays.
                </p>
              </div>

              <div className="space-y-4">
                {generatedTitles.map((item, index) => {
                  const isLengthWarning = item.charCount > 60;
                  return (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group hover:border-red-500/20 transition-all"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 border font-mono text-[9px] font-bold uppercase rounded-md ${item.strengthColor}`}>
                            {item.strength}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            Style: {item.type}
                          </span>
                        </div>
                        <span className="block text-sm font-bold text-slate-850 dark:text-slate-200 leading-snug">
                          {item.text}
                        </span>
                      </div>

                      <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2.5 shrink-0">
                        {/* Title Character counter */}
                        <div className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold border ${
                          isLengthWarning 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' 
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}>
                          {item.charCount} Chars
                        </div>

                        <button
                          onClick={() => handleCopyTitle(item.text, index)}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/30 text-slate-500 hover:text-red-500 dark:text-slate-400 rounded-xl transition-all cursor-pointer"
                          title="Copy Title"
                        >
                          {copiedIndex === index ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
                <Award size={16} className="text-red-500" />
                CTR Pro-Tips
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    1. Keep it Short & Snappy
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    YouTube cuts off titles in search results after 60 characters on mobile. Try to keep your primary hook at the beginning.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    2. Use Parentheses or Brackets
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Studies show adding information in brackets (e.g., "[Step-by-Step]" or "(New Guide)") increases average CTR by up to 38%!
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    3. Match Your Thumbnail
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Your title should complete the story started by your thumbnail. Do not duplicate text exactly; use the title for detail and thumbnail for immediate emotional impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
