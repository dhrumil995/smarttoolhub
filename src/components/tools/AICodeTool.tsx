import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Sparkles, Code2, RefreshCw, Zap, FileText, AlertCircle, HelpCircle } from 'lucide-react';

const SAMPLES: Record<string, string> = {
  javascript: `// A standard recursive Fibonacci function that needs optimization
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  python: `# A slow function searching for pairs in list
def find_pairs(arr, target):
    pairs = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] + arr[j] == target:
                pairs.append((arr[i], arr[j]))
    return pairs`,
  typescript: `// An unannotated function that could benefit from docs and safety
interface User {
  id: string;
  name: string;
  roles: string[];
}

function checkUserAccess(user: User, requiredRole: string) {
  const hasAccess = user.roles.includes(requiredRole);
  if (!hasAccess) {
    throw new Error("Access Denied");
  }
  return true;
}`,
  sql: `-- A query to optimize with multiple subqueries
SELECT id, name, (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) as order_count
FROM users
WHERE status = 'active' AND (SELECT SUM(total) FROM orders WHERE orders.user_id = users.id) > 500;`,
  cpp: `// C++ raw array rotation
#include <iostream>
void rotateArray(int arr[], int n, int d) {
    for (int i = 0; i < d; i++) {
        int temp = arr[0];
        for (int j = 0; j < n - 1; j++) {
            arr[j] = arr[j + 1];
        }
        arr[n - 1] = temp;
    }
}`
};

export default function AICodeTool() {
  const [code, setCode] = useState(SAMPLES.javascript);
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState<'explain' | 'optimize' | 'document' | 'test' | 'review'>('explain');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLoadSample = (lang: string) => {
    setLanguage(lang);
    setCode(SAMPLES[lang] || '');
  };

  const handleAction = async () => {
    if (!code.trim()) {
      setError('Please provide a code snippet to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, mode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error.');
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
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                Code Assistant Options
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your language, select an action, and run instant AI audits.
              </p>
            </div>
          </div>

          {/* Action Modes */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Select AI Action
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'explain', label: 'Explain', desc: 'Step-by-step logic and time complexity details.' },
                { id: 'optimize', label: 'Optimize', desc: 'Identify bottlenecks and optimize performance.' },
                { id: 'document', label: 'Comment', desc: 'Insert rich docstrings and detailed inline remarks.' },
                { id: 'test', label: 'Unit Tests', desc: 'Produce complete unit test suites instantly.' },
                { id: 'review', label: 'Review', desc: 'Audit for best practices, safety, and readability.' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  title={m.desc}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    mode === m.id
                      ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector & Sample Loaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 dark:text-slate-200 transition-all cursor-pointer font-medium"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="sql">SQL Query</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Load Sample Code
              </label>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {Object.keys(SAMPLES).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLoadSample(lang)}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-950 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Raw Code Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Paste Your Code
              </label>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {code.split('\n').length} lines
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your source code here..."
              className="w-full h-72 p-4 text-xs bg-slate-950 text-slate-100 font-mono border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-600 leading-relaxed resize-none shadow-inner"
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
                Optimizing & Auditing Code...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Run AI Assistant
              </>
            )}
          </button>
        </div>

        {/* Informational Guidelines Banner */}
        <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <Zap size={16} className="text-violet-500 shrink-0 mt-0.5" />
          <p>
            <strong>Sandbox Safety Note:</strong> To respect your confidentiality, ToolHub is designed with a sandbox structure. All API calls are routed through our backend without persisting code fragments or query metrics in databases.
          </p>
        </div>
      </div>

      {/* AI Output Result Column */}
      <div className="lg:col-span-6 space-y-6">
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl p-4 flex gap-3 text-xs items-start">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Execution Failed:</span>
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xs h-[520px] flex flex-col justify-center items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-12 w-12 rounded-full border-4 border-violet-500/10 dark:border-violet-500/20 border-t-violet-600 dark:border-t-violet-400 animate-spin" />
              <Sparkles size={20} className="text-violet-500 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-sm">
                Thinking in progress...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini is auditing your syntax, measuring Big O thresholds, and mapping performance matrices. This should take just a second.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs flex flex-col min-h-[520px]">
            {/* Output Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-violet-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  AI Recommendation
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
            <div className="flex-1 overflow-y-auto max-h-[600px] pr-2">
              <div className="markdown-body text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Markdown>{result}</Markdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/30 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-12 text-center space-y-4 h-[520px] flex flex-col justify-center items-center">
            <HelpCircle className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <div className="space-y-1 max-w-sm">
              <h4 className="font-display font-extrabold text-slate-700 dark:text-slate-300 text-sm">
                No analysis generated yet
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Provide a script on the left, choose your operational mode, and click "Run AI Assistant" to kickstart the system analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
