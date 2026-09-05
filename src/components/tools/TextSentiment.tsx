import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Smile, Frown, Meh, Sparkles, BarChart2 } from 'lucide-react';

export const TextSentiment: React.FC = () => {
  const [text, setText] = useState<string>(
    `SmartToolHub is an incredible, highly efficient web application! It provides fast, private, and secure developer tools right in your browser. I absolutely love using it every day.`
  );

  const analyzeText = () => {
    if (!text.trim()) {
      return { score: 0, sentiment: 'neutral', words: 0, sentences: 0, characters: text.length, readability: 100 };
    }

    const positiveWords = ['incredible', 'love', 'amazing', 'great', 'excellent', 'fantastic', 'fast', 'secure', 'efficient', 'best', 'easy', 'happy', 'good', 'superb', 'awesome', 'brilliant'];
    const negativeWords = ['terrible', 'bad', 'slow', 'hate', 'broken', 'difficult', 'awful', 'poor', 'worst', 'fail', 'ugly', 'hard', 'error', 'bug', 'annoying'];

    const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
    let posCount = 0;
    let negCount = 0;

    words.forEach((w) => {
      if (positiveWords.includes(w)) posCount++;
      if (negativeWords.includes(w)) negCount++;
    });

    const score = posCount - negCount;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (score > 0) sentiment = 'positive';
    if (score < 0) sentiment = 'negative';

    const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const avgWordsPerSentence = words.length / sentences;
    const readability = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWordsPerSentence)));

    return {
      score,
      sentiment,
      posCount,
      negCount,
      words: words.length,
      sentences,
      characters: text.length,
      readability,
    };
  };

  const results = analyzeText();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-500" />
              Content Text Input
            </h2>
            <button
              onClick={() => setText('')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              Clear
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste paragraph text to analyze tone & readability..."
            className="w-full h-64 p-3 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed"
          />
        </div>

        {/* Right Dashboard Results */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Sentiment & Tone Score
            </h3>

            {/* Sentiment Gauge */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  results.sentiment === 'positive'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : results.sentiment === 'negative'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                {results.sentiment === 'positive' ? (
                  <Smile size={32} />
                ) : results.sentiment === 'negative' ? (
                  <Frown size={32} />
                ) : (
                  <Meh size={32} />
                )}
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Overall Tone
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white capitalize">
                  {results.sentiment} Tone ({results.score > 0 ? `+${results.score}` : results.score})
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detected {results.posCount} positive & {results.negCount} negative key terms.
                </p>
              </div>
            </div>

            {/* Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Words</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{results.words}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Sentences</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{results.sentences}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Characters</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{results.characters}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Readability</span>
                <span className="text-base font-black text-emerald-500">{results.readability}/100</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <Sparkles size={16} className="shrink-0" />
            <span>Analyzed completely client-side in browser RAM.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
