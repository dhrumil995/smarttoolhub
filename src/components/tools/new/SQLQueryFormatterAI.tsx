import React, { useState } from 'react';
import { Database, Copy, Check, Sparkles, FileCode } from 'lucide-react';

export function SQLQueryFormatterAI() {
  const [sql, setSql] = useState(`select u.id, u.name, count(o.id) as total_orders from users u left join orders o on u.id=o.user_where where u.status='active' group by u.id, u.name order by total_orders desc;`);
  const [formatted, setFormatted] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    // Basic SQL formatter
    let res = sql
      .replace(/\s+/g, ' ')
      .replace(/\b(SELECT|FROM|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT)\b/gi, '\n$1')
      .trim();

    // Uppercase keywords
    const keywords = ['SELECT', 'FROM', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'AS', 'ON', 'AND', 'OR', 'COUNT', 'DESC', 'ASC'];
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      res = res.replace(regex, kw);
    });

    setFormatted(res);
  };

  React.useEffect(() => {
    handleFormat();
  }, [sql]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Database size={14} /> SQL Query Optimization Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          SQL Query Formatter, Explainer & Optimizer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Format raw SQL queries, capitalize standard keywords, indent complex joins, and analyze execution query performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Unformatted SQL Query</label>
          <textarea
            rows={8}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Formatted SQL Output</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(formatted);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy SQL'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-blue-300 p-4 rounded-xl overflow-x-auto min-h-[200px] whitespace-pre-wrap">
            {formatted}
          </pre>
        </div>
      </div>
    </div>
  );
}
