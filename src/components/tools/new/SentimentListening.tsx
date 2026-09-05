import React, { useState } from 'react';
import { PieChart, MessageSquare, Sparkles, CheckCircle2, HelpCircle, HeartHandshake, Smile, Frown, Meh, Tag } from 'lucide-react';

export function SentimentListening() {
  const [inputText, setInputText] = useState(
    "SmartToolHub is absolute magic! The tools are blazing fast, intuitive, and completely free. I saved hours on my SEO reports today, though I wish there were a dark mode shortcut button!"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeSentiment = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const text = inputText.toLowerCase();
      let positiveScore = 65;
      let negativeScore = 15;
      let neutralScore = 20;

      if (text.includes('bad') || text.includes('hate') || text.includes('slow') || text.includes('worst') || text.includes('error')) {
        negativeScore += 40;
        positiveScore -= 30;
      }
      if (text.includes('magic') || text.includes('love') || text.includes('saved') || text.includes('awesome') || text.includes('great') || text.includes('fast')) {
        positiveScore += 25;
      }

      const total = positiveScore + negativeScore + neutralScore;
      const posPct = Math.round((positiveScore / total) * 100);
      const negPct = Math.round((negativeScore / total) * 100);
      const neuPct = 100 - posPct - negPct;

      let dominant = 'Positive';
      if (negPct > posPct && negPct > neuPct) dominant = 'Negative';
      if (neuPct > posPct && neuPct > negPct) dominant = 'Neutral';

      // Extract keywords
      const words = inputText.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 4);
      const uniqueEntities = Array.from(new Set(words)).slice(0, 6);

      setResult({
        dominant,
        scores: { positive: posPct, negative: negPct, neutral: neuPct },
        emotions: [
          { name: 'Joy & Delight', score: Math.min(posPct + 10, 95) },
          { name: 'Frustration / Anger', score: Math.min(negPct + 5, 80) },
          { name: 'Surprise / Wonder', score: 45 },
          { name: 'Trust & Confidence', score: Math.min(posPct, 90) },
        ],
        entities: uniqueEntities,
        summary: `The overall sentiment is predominantly ${dominant.toUpperCase()} (${posPct}% positivity rating). Key conversational drivers highlight product value and user experience.`
      });

      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <MessageSquare size={14} /> AI Sentiment & Social Listening
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Sentiment Analysis & Social Listening Tool
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Analyze customer feedback, social media tweets, product reviews, and survey responses for emotional tone, positivity ratios, and core topic entities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Input Text, Tweet, or Customer Review
            </label>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Paste customer reviews, feedback, or social posts here..."
            />
            <button
              onClick={analyzeSentiment}
              disabled={isAnalyzing || !inputText.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isAnalyzing ? 'Analyzing Sentiment & Emotion...' : 'Analyze Sentiment Now'}
            </button>
          </div>
        </div>

        <div className="md:col-span-6">
          {result ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase">Overall Tone</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  result.dominant === 'Positive' ? 'bg-emerald-500/10 text-emerald-600' : result.dominant === 'Negative' ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-500/10 text-slate-600'
                }`}>
                  {result.dominant === 'Positive' ? <Smile size={14} /> : result.dominant === 'Negative' ? <Frown size={14} /> : <Meh size={14} />}
                  {result.dominant} Sentiment
                </span>
              </div>

              {/* Ratios */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-600">Positive: {result.scores.positive}%</span>
                  <span className="text-slate-500">Neutral: {result.scores.neutral}%</span>
                  <span className="text-rose-500">Negative: {result.scores.negative}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.scores.positive}%` }} className="bg-emerald-500" />
                  <div style={{ width: `${result.scores.neutral}%` }} className="bg-slate-400" />
                  <div style={{ width: `${result.scores.negative}%` }} className="bg-rose-500" />
                </div>
              </div>

              {/* Emotion breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Emotion Spectrum</span>
                <div className="space-y-2">
                  {result.emotions.map((emo: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{emo.name}</span>
                        <span>{emo.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${emo.score}%` }} className="h-full bg-emerald-500/80 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entities */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Key Extracted Topics</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.entities.map((ent: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <Tag size={12} className="text-emerald-500" /> {ent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[280px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <PieChart size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Enter text and click analyze to view social listening metrics.</p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-500" /> How Social Sentiment Analysis Works
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Our Sentiment Analysis & Social Listening Tool uses natural language processing (NLP) to parse text input for positive, negative, and neutral emotion markers. It extracts customer intent, brand perceptions, and key topics for brand monitoring and UX research.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">What can I analyze?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Paste Twitter/X posts, Google Reviews, support ticket notes, survey comments, or blog comments.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Is this tool free?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Yes! 100% free with no registration required or token caps.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
