import React, { useState } from 'react';
import { BrainCircuit, Database, Braces, Play, Check, Copy, Sparkles, Loader2, RefreshCw, AlertTriangle, HelpCircle, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIRegexSQLGenerator() {
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'regex' | 'sql'>('regex');
  const [dialect, setDialect] = useState('PostgreSQL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sqlDialects = [
    'PostgreSQL',
    'MySQL',
    'SQLite',
    'Microsoft SQL Server',
    'Oracle Database',
    'MongoDB Query'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolType: 'ai-regex',
          payload: {
            description,
            type,
            dialect: type === 'sql' ? dialect : undefined,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate query or expression');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the AI generator.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSampleLoad = () => {
    if (type === 'regex') {
      setDescription('Match a secure password that must contain at least 8 characters, one uppercase letter, one lowercase letter, one numeric digit, and one special symbol.');
    } else {
      setDescription('Select users who signed up in the last 30 days, spent more than $100 total, grouped by their country, sorted by highest spent.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <BrainCircuit size={12} />
            AI Query Helpers
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Regex & SQL Query Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Convert natural language sentences into highly optimized regular expressions or SQL statements with step-by-step documentation.
          </p>
        </div>

        <button
          onClick={handleSampleLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw size={12} />
          Load Sample Prompt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Utility Selection Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Output Syntax Target
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setType('regex');
                    setResult(null);
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    type === 'regex'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Code size={14} />
                  Regular Expression
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('sql');
                    setResult(null);
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    type === 'sql'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Database size={14} />
                  SQL Statement
                </button>
              </div>
            </div>

            {/* SQL Dialect selection */}
            {type === 'sql' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  SQL Dialect / Engine
                </label>
                <select
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {sqlDialects.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Describe what you want to achieve
                </label>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                  {description.length} chars
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  type === 'regex'
                    ? 'Example: Match a standard US phone number format with optional area codes and dashes...'
                    : 'Example: Find the top 5 products by order frequency, including their total revenue contribution...'
                }
                rows={7}
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed text-xs font-semibold"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs font-mono uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating Syntax...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate {type === 'regex' ? 'Regex' : 'SQL'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Generated Code & Breakdown
            </span>
            {result && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    Copied Output
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy Markdown
                  </>
                )}
              </button>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-3">
              <Loader2 size={32} className="text-emerald-500 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Compiling regular expressions or query structures...
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Making sure dialect syntax is fully verified and documented.
                </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="p-5 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="shrink-0 mt-0.5" size={16} />
              <div className="space-y-1">
                <h4 className="text-xs font-bold">Generation Failed</h4>
                <p className="text-[11px] leading-relaxed opacity-90">{error}</p>
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl text-center p-6 space-y-4">
              <Database className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <div className="max-w-xs space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Awaiting Prompt Description
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Type your business logic requirement or structural match request on the left. Gemini will produce valid query commands and full group reviews.
                </p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs max-h-[600px] overflow-y-auto">
              <div className="markdown-body prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
