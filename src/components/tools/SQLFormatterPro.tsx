import React, { useState } from 'react';
import { Database, Copy, Check, Code, Play, RefreshCw, Sparkles } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function SQLFormatterPro() {
  const [inputSql, setInputSql] = useState(
    'select u.id, u.name, u.email, count(o.id) as total_orders, sum(o.amount) as total_spent from users u left join orders o on u.id = o.user_id where u.status = \'active\' and o.created_at >= \'2026-01-01\' group by u.id, u.name, u.email having sum(o.amount) > 500 order by total_spent desc limit 50;'
  );
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [copied, setCopied] = useState(false);

  const formatSQL = (sql: string) => {
    if (!sql.trim()) return '';

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 'ORDER BY',
      'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
      'ON', 'AS', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
      'ALTER TABLE', 'DROP TABLE', 'UNION', 'UNION ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
    ];

    let formatted = sql.replace(/\s+/g, ' ');

    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const replacement = uppercaseKeywords ? kw.toUpperCase() : kw.toLowerCase();
      formatted = formatted.replace(regex, replacement);
    });

    const newLinesKeywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 'ORDER BY',
      'LIMIT', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'INSERT INTO', 'VALUES', 'SET'
    ];

    newLinesKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      formatted = formatted.replace(regex, `\n${kw}`);
    });

    return formatted.trim();
  };

  const formattedSql = formatSQL(inputSql);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-extrabold uppercase tracking-widest border border-amber-500/20">
          <Database size={14} /> Database Utility
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          SQL Query Formatter & Beautifier
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Format, indent, and uppercase unformatted raw SQL queries for PostgreSQL, MySQL, SQLite, and SQL Server in seconds.
        </p>
      </div>

      <AdSenseSlot slot="sql-formatter-top" />

      {/* Settings Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercaseKeywords}
            onChange={(e) => setUppercaseKeywords(e.target.checked)}
            className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
          />
          <span>Uppercase Reserved SQL Keywords (SELECT, FROM, WHERE)</span>
        </label>

        <button
          onClick={handleCopy}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            copied ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-black hover:bg-amber-400 font-extrabold'
          }`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied SQL' : 'Copy Formatted SQL'}</span>
        </button>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Raw Unformatted SQL
          </label>
          <textarea
            rows={12}
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            placeholder="Paste raw SQL query here..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-xs space-y-2 flex flex-col">
          <label className="block text-xs font-bold text-slate-300">
            Formatted SQL Query Output
          </label>
          <pre className="flex-1 p-3 bg-slate-900 rounded-xl font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre leading-relaxed border border-slate-800/80">
            {formattedSql || '-- Formatted query will render here...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
