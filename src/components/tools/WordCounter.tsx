import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check, RefreshCw, X, Clock, BarChart } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

interface KeywordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export default function WordCounter() {
  const [text, setText] = useState('SmartToolHub provides secure offline-ready utility applications. All your processed files and character metrics are stored safely inside your browser. No analytical data ever leaves your device. Start typing or copy and paste paragraphs to analyze content parameters instantly.');
  const [charCount, setCharCount] = useState(0);
  const [charNoSpacesCount, setCharNoSpacesCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [readTime, setReadTime] = useState(0); // in minutes
  const [speakTime, setSpeakTime] = useState(0); // in minutes
  const [keywordFreq, setKeywordFreq] = useState<KeywordFrequency[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!text.trim()) {
      setCharCount(0);
      setCharNoSpacesCount(0);
      setWordCount(0);
      setSentenceCount(0);
      setParagraphCount(0);
      setReadTime(0);
      setSpeakTime(0);
      setKeywordFreq([]);
      return;
    }

    // 1. Core counters
    setCharCount(text.length);
    setCharNoSpacesCount(text.replace(/\s/g, '').length);

    // Clean word extraction
    const words: string[] = text.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || [];
    setWordCount(words.length);

    // Sentences
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    setSentenceCount(sentences.length);

    // Paragraphs
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
    setParagraphCount(paragraphs.length);

    // Reading time: Average reading speed of 225 wpm
    setReadTime(Math.ceil(words.length / 225));

    // Speaking time: Average speaking speed of 130 wpm
    setSpeakTime(Math.ceil(words.length / 130));

    // Keyword density frequency
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'in', 'of', 'for', 'or', 'your', 'with', 'this', 'are', 'all', 'be', 'it', 'from', 'our', 'as']);
    const freqMap: Record<string, number> = {};
    let validWordsCount = 0;

    words.forEach((w) => {
      if (w.length > 2 && !stopWords.has(w)) {
        freqMap[w] = (freqMap[w] || 0) + 1;
        validWordsCount++;
      }
    });

    const densities: KeywordFrequency[] = Object.keys(freqMap)
      .map((k) => ({
        word: k,
        count: freqMap[k],
        percentage: Number(((freqMap[k] / words.length) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 words

    setKeywordFreq(densities);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <FileText size={12} />
            Text Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Word & Character Counter Pro
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Analyze characters, syllables, lines, reading times, and map keyword densities of your copywriting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Editor Work Area
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className="px-2.5 py-1 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 rounded-lg flex items-center gap-1 transition-colors border border-slate-200/40 dark:border-slate-800/60"
                >
                  {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  Copy text
                </button>
                <button
                  onClick={handleClear}
                  disabled={!text}
                  className="px-2.5 py-1 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your creative paragraphs here..."
              rows={12}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-4 text-xs font-sans leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850 dark:text-slate-100"
            />
          </div>

          {/* Core metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Words</span>
              <p className="font-display font-black text-2xl text-indigo-600 dark:text-indigo-400">{wordCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Characters</span>
              <p className="font-display font-black text-2xl text-indigo-600 dark:text-indigo-400">{charCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">No Spaces</span>
              <p className="font-display font-black text-2xl text-indigo-600 dark:text-indigo-400">{charNoSpacesCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paragraphs</span>
              <p className="font-display font-black text-2xl text-indigo-600 dark:text-indigo-400">{paragraphCount}</p>
            </div>
          </div>
        </div>

        {/* Analytics column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Estimated duration */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <Clock size={16} className="text-slate-400" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                Audience Estimators
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Silent Reading Time</span>
                <span className="font-bold text-slate-850 dark:text-slate-200 font-mono">~{readTime} min</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Public Speaking Time</span>
                <span className="font-bold text-slate-850 dark:text-slate-200 font-mono">~{speakTime} min</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Sentence Count</span>
                <span className="font-bold text-slate-850 dark:text-slate-200 font-mono">{sentenceCount} sentences</span>
              </div>
            </div>
          </div>

          {/* Keyword Density List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <BarChart size={16} className="text-slate-400" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                Keyword Densities (Top 8)
              </h3>
            </div>

            {keywordFreq.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No recurring keywords found.</p>
            ) : (
              <div className="space-y-2.5">
                {keywordFreq.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-650 dark:text-slate-350">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.word}</span>
                      <span className="text-slate-450">{item.count} times ({item.percentage}%)</span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(item.percentage * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSenseSlot slot="word-counter-bottom" />
    </div>
  );
}
