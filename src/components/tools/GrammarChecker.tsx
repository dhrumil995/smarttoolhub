import React, { useState } from 'react';
import { 
  CheckCircle2, Sparkles, Copy, RefreshCw, Check, 
  AlertCircle, AlertTriangle, FileText, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';

interface GrammarIssue {
  id: string;
  type: 'grammar' | 'spelling' | 'style';
  original: string;
  suggestion: string;
  context: string;
  explanation: string;
}

export function GrammarChecker() {
  const [inputText, setInputText] = useState(
    "Their is many reasons why learning to code are important. People who works hard in programming achieves great results, even when they encounters difficult problems. Its clear that technology shape the future."
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [correctedText, setCorrectedText] = useState(
    "There are many reasons why learning to code is important. People who work hard in programming achieve great results, even when they encounter difficult problems. It's clear that technology shapes the future."
  );

  const [issues, setIssues] = useState<GrammarIssue[]>([
    {
      id: '1',
      type: 'grammar',
      original: 'Their is',
      suggestion: 'There are',
      context: 'Their is many reasons',
      explanation: 'Possessive pronoun "Their" used instead of existential "There are" for plural noun "reasons".'
    },
    {
      id: '2',
      type: 'grammar',
      original: 'are important',
      suggestion: 'is important',
      context: 'learning to code are important',
      explanation: 'Singular gerund subject "learning" requires singular verb "is".'
    },
    {
      id: '3',
      type: 'spelling',
      original: 'People who works',
      suggestion: 'People who work',
      context: 'People who works hard',
      explanation: 'Plural subject "People" requires plural verb "work".'
    },
    {
      id: '4',
      type: 'grammar',
      original: 'they encounters',
      suggestion: 'they encounter',
      context: 'when they encounters',
      explanation: 'Plural pronoun "they" requires verb "encounter".'
    },
    {
      id: '5',
      type: 'spelling',
      original: 'Its clear',
      suggestion: "It's clear",
      context: 'Its clear that',
      explanation: 'Missing apostrophe for contraction "It\'s" (It is).'
    }
  ]);

  const [copied, setCopied] = useState(false);

  // Readability calculation
  const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const characters = inputText.length;
  const sentences = inputText.split(/[.!?]+/).filter(Boolean).length || 1;
  const avgWordsPerSentence = (words / sentences).toFixed(1);

  const handleCheckGrammar = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'ai-writer',
          payload: {
            prompt: `Act as a proofreader. Check and fix all spelling, grammar, and punctuation errors in this text: "${inputText}". Return ONLY the corrected, polished text.`
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          setCorrectedText(data.result.trim());
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAllFixes = () => {
    setInputText(correctedText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedText || inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Grammar & Proofreading Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Grammar & Spell Checker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Detect grammatical mistakes, spelling errors, awkward phrasing, and apply 1-click intelligent corrections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyAllFixes}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Zap size={14} />
            <span>Apply All Fixes</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Corrected Text'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Words</span>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">{words}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Characters</span>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">{characters}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Words/Sentence</span>
          <div className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{avgWordsPerSentence}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issues Detected</span>
          <div className="font-mono text-2xl font-extrabold text-amber-500">{issues.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input & Output Text Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Original Input Text
              </span>

              <button
                onClick={handleCheckGrammar}
                disabled={isAnalyzing}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={12} className={isAnalyzing ? 'animate-spin' : ''} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze Grammar'}</span>
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              placeholder="Paste your text here to check grammar..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block border-b border-slate-100 dark:border-slate-800 pb-3">
              Corrected & Polished Output
            </span>

            <textarea
              readOnly
              value={correctedText}
              rows={6}
              className="w-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Right Column: Detected Issues Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              Grammar & Spelling Suggestions ({issues.length})
            </h3>

            <div className="space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <AlertTriangle size={10} /> {issue.type.toUpperCase()}
                    </span>

                    <span className="font-mono text-slate-400 text-[10px]">
                      "{issue.original}" → <span className="text-emerald-600 font-bold">"{issue.suggestion}"</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {issue.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GrammarChecker;
