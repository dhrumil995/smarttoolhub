import React, { useState } from 'react';
import { Copy, Trash2, Check, Type, ArrowLeftRight } from 'lucide-react';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Text case converters
  const toUpper = () => {
    setText(text.toUpperCase());
  };

  const toLower = () => {
    setText(text.toLowerCase());
  };

  const toTitle = () => {
    const transformed = text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setText(transformed);
  };

  const toSentence = () => {
    if (!text) return;
    const sentences = text.split(/([.!?]\s+)/);
    const transformed = sentences
      .map((part) => {
        if (!part.trim()) return part;
        // If it starts with a letter, capitalize the first letter
        const trimmed = part.trim();
        return part.replace(trimmed, trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
      })
      .join('');
    setText(transformed);
  };

  const toSlugify = () => {
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word characters
      .replace(/[\s_]+/g, '-') // replace spaces or underscores with hyphens
      .replace(/^-+|-+$/g, ''); // trim starting or ending hyphens
    setText(slug);
  };

  const reverseText = () => {
    setText(text.split('').reverse().join(''));
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleClear = () => {
    setText('');
  };

  // Text metrics
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-6">
      {/* Quick metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 p-3 rounded-lg text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Words</span>
          <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">{wordCount}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 p-3 rounded-lg text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Characters</span>
          <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">{charCount}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 p-3 rounded-lg text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chars (No Space)</span>
          <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">{charNoSpaces}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 p-3 rounded-lg text-center">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sentences</span>
          <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">{sentenceCount}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 p-3 rounded-lg text-center col-span-2 md:col-span-1">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Paragraphs</span>
          <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">{paragraphCount}</span>
        </div>
      </div>

      {/* Editor Block */}
      <div className="flex flex-col h-[320px]">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-xl border-t border-x border-gray-200 dark:border-gray-700">
          <span className="text-xs font-semibold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Type size={14} className="text-indigo-500" />
            Text Editor Canvas
          </span>
          {text && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied Text!' : 'Copy Results'}
              </button>
              <button
                onClick={handleClear}
                className="text-rose-500 hover:text-rose-600 p-1 rounded-md transition-colors flex items-center gap-0.5 text-xs font-semibold"
                title="Clear all text"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write your text block here. Then choose any conversion action below..."
          className="flex-1 p-4 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 resize-none h-full"
        />
      </div>

      {/* Actions Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
          CONVERSION CONTROLS
        </span>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={toUpper}
            disabled={!text}
            className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            UPPERCASE
          </button>
          <button
            onClick={toLower}
            disabled={!text}
            className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            lowercase
          </button>
          <button
            onClick={toTitle}
            disabled={!text}
            className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Title Case
          </button>
          <button
            onClick={toSentence}
            disabled={!text}
            className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sentence Case
          </button>
          <button
            onClick={toSlugify}
            disabled={!text}
            className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            slugify-text
          </button>
          <button
            onClick={reverseText}
            disabled={!text}
            className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ArrowLeftRight size={12} />
            txeT esreveR
          </button>
        </div>
      </div>
    </div>
  );
}
