import React, { useState } from 'react';
import { FileText, Copy, Check, Trash2, ArrowDownAZ, ArrowUpAZ, Sparkles, Filter, Scissors, RefreshCw } from 'lucide-react';

export function TextCaseDiffCleaner() {
  const [inputText, setInputText] = useState(`Apple
Banana
Orange
apple
Banana
Strawberry
<p>Clean Web Data</p>
Orange
Grapefruit`);

  const [copied, setCopied] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  // Operations
  const handleRemoveDuplicates = (caseSensitive = false) => {
    const lines = inputText.split('\n');
    const seen = new Set();
    const result: string[] = [];

    lines.forEach((line) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    });
    setInputText(result.join('\n'));
  };

  const handleSort = (direction: 'asc' | 'desc') => {
    const lines = inputText.split('\n');
    lines.sort((a, b) => direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    setInputText(lines.join('\n'));
  };

  const handleStripHTML = () => {
    const cleaned = inputText.replace(/<[^>]*>?/gm, '');
    setInputText(cleaned);
  };

  const handleTrimWhitespace = () => {
    const cleaned = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    setInputText(cleaned);
  };

  const handleFindReplace = () => {
    if (!findText) return;
    const cleaned = inputText.split(findText).join(replaceText);
    setInputText(cleaned);
  };

  const handleFilterLines = () => {
    if (!filterQuery) return;
    const lines = inputText.split('\n').filter(l => l.toLowerCase().includes(filterQuery.toLowerCase()));
    setInputText(lines.join('\n'));
  };

  const linesCount = inputText ? inputText.split('\n').length : 0;
  const wordsCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charsCount = inputText.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full text-xs font-semibold">
          <FileText size={14} /> Ultra Pro Max Text Cleaning Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Text Case Diff, Dedup & Clean Studio
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Deduplicate lines, sort alphabetically, strip HTML tags, trim excess whitespace, batch find & replace, and filter text in real-time.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-medium">Total Lines</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">{linesCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-medium">Word Count</span>
          <p className="text-xl font-extrabold text-teal-600 dark:text-teal-400 font-mono mt-1">{wordsCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-medium">Characters</span>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1">{charsCount}</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fast Clean Actions:</span>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRemoveDuplicates(false)}
              className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold hover:bg-teal-100 transition-colors cursor-pointer"
            >
              Remove Duplicates
            </button>
            <button
              onClick={() => handleSort('asc')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowDownAZ size={14} /> Sort A-Z
            </button>
            <button
              onClick={() => handleSort('desc')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowUpAZ size={14} /> Sort Z-A
            </button>
            <button
              onClick={handleStripHTML}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Strip HTML Tags
            </button>
            <button
              onClick={handleTrimWhitespace}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Trim Empty Lines
            </button>
          </div>
        </div>

        {/* Find & Replace / Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Find text..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="w-1/2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-1/2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
            />
            <button
              onClick={handleFindReplace}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
            >
              Replace
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter lines containing..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
            />
            <button
              onClick={handleFilterLines}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Editor Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Text Buffer
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputText('')}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 cursor-pointer"
            >
              <Trash2 size={13} /> Clear
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Clean Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        <textarea
          rows={14}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 leading-relaxed resize-none"
          placeholder="Paste or type text to clean, format, and organize..."
        />
      </div>
    </div>
  );
}
export default TextCaseDiffCleaner;
