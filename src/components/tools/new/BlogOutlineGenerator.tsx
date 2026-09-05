import React, { useState } from 'react';
import { ListOrdered, Sparkles, Copy, Check, FileText } from 'lucide-react';

export function BlogOutlineGenerator() {
  const [topic, setTopic] = useState('Comprehensive Guide to B2B SaaS Content Marketing in 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      const clean = topic.trim();
      const sections = [
        {
          h2: `1. Introduction to ${clean}`,
          h3s: [`Understanding the Core Value Proposition`, `Why ${clean} Matters Right Now`],
          wordEstimate: '350 words'
        },
        {
          h2: `2. Essential Frameworks & Best Practices for ${clean}`,
          h3s: [`Step-by-Step Implementation Strategy`, `Common Pitfalls and How to Avoid Them`],
          wordEstimate: '750 words'
        },
        {
          h2: `3. Advanced Techniques & Optimization`,
          h3s: [`Automation, Tooling, and Workflow Efficiency`, `Key Performance Metrics and Benchmarks`],
          wordEstimate: '800 words'
        },
        {
          h2: `4. Conclusion & Actionable Next Steps`,
          h3s: [`Summary Checklist for Getting Started`, `Future Trends and Expert Recommendations`],
          wordEstimate: '300 words'
        }
      ];

      setOutline({
        title: clean,
        suggestedWordCount: '2,200 - 2,800 Words',
        h1: `The Complete Guide to ${clean} (${new Date().getFullYear()})`,
        sections
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ListOrdered size={14} /> SEO Content Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Blog Post Outline & Structure Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Generate complete SEO blog outlines with H1, H2, and H3 subheadings, section word count targets, and key takeaways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Target Topic or Focus Keyword</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} /> {isGenerating ? 'Structuring Outline...' : 'Generate Blog Outline'}
          </button>
        </div>

        <div className="lg:col-span-7">
          {outline ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Outline Blueprint ({outline.suggestedWordCount})</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(outline, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-emerald-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy Outline'}
                </button>
              </div>

              <div className="space-y-4">
                {outline.sections.map((sec: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>H2: {sec.h2}</span>
                      <span className="text-[10px] text-slate-400">{sec.wordEstimate}</span>
                    </div>
                    <ul className="pl-4 list-disc text-slate-600 dark:text-slate-400 space-y-0.5">
                      {sec.h3s.map((h3: string, i: number) => (
                        <li key={i}>H3: {h3}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[280px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <FileText size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Enter a topic to generate structured blog outlines.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
