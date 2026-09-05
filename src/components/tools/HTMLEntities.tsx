import React, { useState } from 'react';
import { FileCode, Copy, Check, RefreshCw, X } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function HTMLEntities() {
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  // Core HTML Entity Dictionary for precise conversion
  const ENTITY_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  const encodeEntities = (str: string) => {
    return str.replace(/[&<>"'`=\/]/g, (s) => ENTITY_MAP[s] || s);
  };

  const decodeEntities = (str: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  const handleProcess = (text: string, currentMode = mode) => {
    if (!text) {
      setOutputVal('');
      return;
    }
    if (currentMode === 'encode') {
      setOutputVal(encodeEntities(text));
    } else {
      setOutputVal(decodeEntities(text));
    }
  };

  const onInputChange = (val: string) => {
    setInputVal(val);
    handleProcess(val);
  };

  const handleToggleMode = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    if (outputVal) {
      setInputVal(outputVal);
      handleProcess(outputVal, newMode);
    } else {
      handleProcess(inputVal, newMode);
    }
  };

  const handleClear = () => {
    setInputVal('');
    setOutputVal('');
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <FileCode size={12} />
            Developer Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            HTML Entity Converter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Convert code elements or special characters to named and numeric HTML entity sequences to prevent display bugs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Input Text
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleToggleMode('encode')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Escape Entities
              </button>
              <button
                onClick={() => handleToggleMode('decode')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                  mode === 'decode'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Unescape Entities
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={inputVal}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? 'Paste raw code or text (e.g. <div>Hello & Welcome</div>) to escape...'
                  : 'Paste escaped entities (e.g. &lt;div&gt;Hello &amp; Welcome&lt;/div&gt;) to unescape...'
              }
              rows={11}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 pr-10"
            />
            {inputVal && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 p-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                title="Clear input"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Output box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Output Text
            </span>
            <button
              onClick={handleCopy}
              disabled={!outputVal}
              className="p-1 px-3 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50 border border-slate-200/40 dark:border-slate-800/60"
            >
              {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>

          <textarea
            value={outputVal}
            readOnly
            placeholder="Parsed entity content will display here immediately..."
            rows={11}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 break-all resize-none"
          />
        </div>
      </div>

      <AdSenseSlot slot="html-entities-bottom" />
    </div>
  );
}
