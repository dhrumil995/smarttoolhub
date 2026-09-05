import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Sparkles, BrainCircuit, RefreshCw, HelpCircle, AlertCircle, Terminal, Database, Play } from 'lucide-react';

const REGEX_SAMPLES = [
  { label: 'Secure Password Check', text: 'Validate secure passwords: at least 8 characters, one uppercase, one lowercase, one number, and one special character.' },
  { label: 'Email Validator', text: 'Validate complete email addresses ensuring it supports custom subdomains and typical suffix endings.' },
  { label: 'Date Parser (YYYY-MM-DD)', text: 'Match and validate standard ISO date formats like YYYY-MM-DD, capturing year, month, and day as named variables.' },
];

const SQL_SAMPLES = [
  { label: 'Filter Top Orders', text: 'Select active customers who registered in the last 6 months, had more than 5 distinct orders, and spent over $250 total.' },
  { label: 'Calculate Cohorts', text: 'Calculate month-over-month active user retention cohort rates grouped by their initial sign-up month.' },
  { label: 'Recursive Staff Directory', text: 'Create a recursive query to output a full organizational tree structure showing employees, titles, and managers.' },
];

export default function AIRegexTool() {
  const [type, setType] = useState<'regex' | 'sql'>('regex');
  const [prompt, setPrompt] = useState(REGEX_SAMPLES[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleToggleType = (newType: 'regex' | 'sql') => {
    setType(newType);
    setResult(null);
    setError(null);
    if (newType === 'regex') {
      setPrompt(REGEX_SAMPLES[0].text);
    } else {
      setPrompt(SQL_SAMPLES[0].text);
    }
  };

  const handleAction = async () => {
    if (!prompt.trim()) {
      setError('Please write a prompt describing what you want to generate.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/regex-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error occurred.');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration & Input Column */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xs">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center shrink-0">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                Regex & SQL Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Write technical criteria in English and generate accurate outputs in seconds.
              </p>
            </div>
          </div>

          {/* Toggle Type Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Select Output Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleToggleType('regex')}
                className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  type === 'regex'
                    ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Terminal size={14} />
                Regular Expression
              </button>
              <button
                onClick={() => handleToggleType('sql')}
                className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  type === 'sql'
                    ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Database size={14} />
                SQL Query Statement
              </button>
            </div>
          </div>

          {/* Sample Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Try Quick Presets
            </label>
            <div className="flex flex-col gap-1.5">
              {(type === 'regex' ? REGEX_SAMPLES : SQL_SAMPLES).map((sample) => (
                <button
                  key={sample.label}
                  onClick={() => setPrompt(sample.text)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center justify-between group ${
                    prompt === sample.text
                      ? 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-200 dark:border-violet-850 text-violet-600 dark:text-violet-400 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{sample.label}</span>
                  <Play size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Prompt Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Describe What You Need
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={type === 'regex' ? 'Describe the string pattern requirements...' : 'Describe the database filter query requirements...'}
              className="w-full h-36 p-4 text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-400 leading-relaxed resize-none shadow-inner"
            />
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleAction}
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              loading
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95 shadow-violet-600/10 hover:shadow-violet-600/15'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Compiling AI Formulas...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate {type === 'regex' ? 'Regex' : 'SQL'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Output Result Column */}
      <div className="lg:col-span-6 space-y-6">
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl p-4 flex gap-3 text-xs items-start animate-fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Generation Failed:</span>
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xs h-[480px] flex flex-col justify-center items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-12 w-12 rounded-full border-4 border-violet-500/10 dark:border-violet-500/20 border-t-violet-600 dark:border-t-violet-400 animate-spin" />
              <BrainCircuit size={20} className="text-violet-500 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-sm">
                Thinking in progress...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini is mapping pattern characters, checking escape boundaries, and optimizing joins and indexing pathways.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs flex flex-col min-h-[480px]">
            {/* Output Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-violet-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  AI Solution & Breakdown
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200/60 dark:border-slate-850 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy Response
                  </>
                )}
              </button>
            </div>

            {/* Markdown Container */}
            <div className="flex-1 overflow-y-auto max-h-[550px] pr-2">
              <div className="markdown-body text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Markdown>{result}</Markdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/30 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-12 text-center space-y-4 h-[480px] flex flex-col justify-center items-center">
            <HelpCircle className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <div className="space-y-1 max-w-sm">
              <h4 className="font-display font-extrabold text-slate-700 dark:text-slate-300 text-sm">
                No syntax generated yet
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Describe your requirements, or select from one of our quick presets, and click the trigger button to generate a clean syntax breakdown.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
