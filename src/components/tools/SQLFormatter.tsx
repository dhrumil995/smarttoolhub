import React, { useState } from 'react';
import { Database, Copy, Check, RefreshCw, X, Sliders } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function SQLFormatter() {
  const [sqlInput, setSqlInput] = useState('select id, name, created_at from users where status = \'active\' and role = \'admin\' order by created_at desc limit 10;');
  const [formattedSql, setFormattedSql] = useState('');
  const [indentWidth, setIndentWidth] = useState<2 | 4 | 'tab'>(4);
  const [keywordCase, setKeywordCase] = useState<'upper' | 'lower' | 'preserve'>('upper');
  const [copied, setCopied] = useState(false);

  // Custom regex SQL Beautifier
  const handleFormat = (input = sqlInput, indent = indentWidth, casing = keywordCase) => {
    if (!input.trim()) {
      setFormattedSql('');
      return;
    }

    // List of standard SQL keywords to match and format
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
      'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'ON', 'UNION', 'CREATE TABLE',
      'ALTER TABLE', 'DROP TABLE', 'INDEX', 'PRIMARY KEY'
    ];

    // Indent string builder
    const indentStr = indent === 'tab' ? '\t' : ' '.repeat(indent);

    // Clean up extra whitespaces
    let clean = input.replace(/\s+/g, ' ').trim();

    // Regular Expression helper to replace keywords while keeping word boundaries
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, (matched) => {
        if (casing === 'upper') return matched.toUpperCase();
        if (casing === 'lower') return matched.toLowerCase();
        return matched;
      });
    });

    // Structure formatting by injecting line-breaks before core query components
    const breakKeywords = [
      'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'SET', 'VALUES'
    ];

    let lines = clean;
    breakKeywords.forEach((kw) => {
      // Find casing version of keywords currently formatted
      const kwUpper = kw.toUpperCase();
      const kwLower = kw.toLowerCase();

      // Replace with line breaks + indentation
      const regexUpper = new RegExp(`\\s\\b${kwUpper}\\b`, 'g');
      lines = lines.replace(regexUpper, `\n${indentStr}${kwUpper}`);

      const regexLower = new RegExp(`\\s\\b${kwLower}\\b`, 'g');
      lines = lines.replace(regexLower, `\n${indentStr}${kwLower}`);
    });

    // Also put SELECT itself on first line with clean indent for column items
    // If query starts with SELECT, format any commas to keep select list readable if long
    setFormattedSql(lines);
  };

  const onInputChange = (val: string) => {
    setSqlInput(val);
    handleFormat(val);
  };

  const handleApplyFormatting = (width: 2 | 4 | 'tab', casing: 'upper' | 'lower' | 'preserve') => {
    setIndentWidth(width);
    setKeywordCase(casing);
    handleFormat(sqlInput, width, casing);
  };

  const handleClear = () => {
    setSqlInput('');
    setFormattedSql('');
  };

  const handleCopy = () => {
    if (!formattedSql) return;
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Database size={12} />
            Developer Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SQL Query Formatter & Beautifier
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Structure and beautify raw SQL queries instantly to boost query readability. Completely secure offline tool.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input box */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Raw SQL Input Query
              </span>
              <button
                onClick={handleClear}
                className="text-[10px] px-2.5 py-1 font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                Clear Query
              </button>
            </div>

            <textarea
              value={sqlInput}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE orders.total > 100;"
              rows={12}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Configurations & Output */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Formatted SQL Query
              </span>
              <button
                onClick={handleCopy}
                disabled={!formattedSql}
                className="p-1 px-3 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors border border-slate-200/40 dark:border-slate-800/60 disabled:opacity-50"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy Query'}
              </button>
            </div>

            {/* Customizer row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keyword Casing</span>
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  {(['upper', 'lower', 'preserve'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => handleApplyFormatting(indentWidth, c)}
                      className={`flex-1 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                        keywordCase === c
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Indentation width</span>
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  {([2, 4, 'tab'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => handleApplyFormatting(w, keywordCase)}
                      className={`flex-1 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                        indentWidth === w
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {w === 'tab' ? 'Tab' : `${w} spaces`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              value={formattedSql}
              readOnly
              placeholder="Beautified structured query statement will render here..."
              rows={12}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 whitespace-pre overflow-x-auto resize-none"
            />
          </div>
        </div>
      </div>

      <AdSenseSlot slot="sql-formatter-bottom" />
    </div>
  );
}
