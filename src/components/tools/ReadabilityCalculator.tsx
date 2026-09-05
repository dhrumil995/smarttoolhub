import React, { useState } from 'react';
import { 
  FileText, Copy, RefreshCw, Check, Sparkles, BookOpen, AlertCircle, BarChart3, CheckCircle2
} from 'lucide-react';

export function ReadabilityCalculator() {
  const [inputText, setInputText] = useState(
    "Artificial intelligence is transforming modern software engineering by enabling automated code generation, real-time bug detection, and enhanced continuous integration pipelines. As developers integrate large language models into daily workflows, understanding algorithmic efficiency and system architecture remains paramount."
  );

  const [copied, setCopied] = useState(false);

  // Helper syllable count calculation
  const countSyllables = (word: string) => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const wordsList = inputText.trim() ? inputText.trim().split(/\s+/) : [];
  const wordsCount = wordsList.length;
  const charsCount = inputText.length;
  const sentencesCount = inputText.split(/[.!?]+/).filter(Boolean).length || 1;
  const totalSyllables = wordsList.reduce((acc, word) => acc + countSyllables(word), 0);

  const avgWordsPerSentence = wordsCount > 0 ? (wordsCount / sentencesCount) : 0;
  const avgSyllablesPerWord = wordsCount > 0 ? (totalSyllables / wordsCount) : 0;

  // Flesch Reading Ease Score = 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const fleschScore = wordsCount > 0
    ? Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord)))
    : 0;

  // Flesch-Kincaid Grade Level = 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
  const fleschGrade = wordsCount > 0
    ? Math.max(0, Number((0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59).toFixed(1)))
    : 0;

  const getFleschDescription = (score: number) => {
    if (score >= 90) return { label: 'Very Easy (5th Grade)', color: 'text-emerald-500' };
    if (score >= 80) return { label: 'Easy (6th Grade)', color: 'text-emerald-400' };
    if (score >= 70) return { label: 'Fairly Easy (7th Grade)', color: 'text-teal-400' };
    if (score >= 60) return { label: 'Standard / Plain English (8th-9th Grade)', color: 'text-blue-500' };
    if (score >= 50) return { label: 'Fairly Difficult (High School)', color: 'text-amber-500' };
    if (score >= 30) return { label: 'Difficult (College)', color: 'text-orange-500' };
    return { label: 'Very Confusing / Graduate Level', color: 'text-rose-500' };
  };

  const fleschDesc = getFleschDescription(fleschScore);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
            <BookOpen size={12} className="text-amber-500" />
            SEO & Content Readability Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Readability & Flesch-Kincaid Score Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Analyze text readability index, grade level, sentence density, and syllable distribution to craft engaging content.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flesch Reading Ease</span>
          <div className={`font-mono text-3xl font-extrabold ${fleschDesc.color}`}>{fleschScore} / 100</div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{fleschDesc.label}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grade Level</span>
          <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">Grade {fleschGrade}</div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">US School Grade Scale</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Words / Sentence</span>
          <div className="font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{avgWordsPerSentence.toFixed(1)}</div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Target: 15-20 words</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Words</span>
          <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">{wordsCount}</div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{sentencesCount} sentences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
              Content Input Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              placeholder="Paste article or draft text here to evaluate readability..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs font-medium leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Readability Tips */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <BarChart3 size={14} className="text-amber-500" /> Readability Optimization Tips
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Shorten Sentences</span>
                <p>Aim for fewer than 20 words per sentence to keep readers engaged on mobile screens.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Use Simple Vocabulary</span>
                <p>Replace multi-syllable jargon with simpler synonyms where possible.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Target Score 60-70</span>
                <p>A score between 60-70 is optimal for general web audiences, blog posts, and marketing pages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadabilityCalculator;
