import React, { useState } from 'react';
import { Link, Copy, Check, RefreshCw, X } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function URLEncoder() {
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<'all' | 'components'>('components');
  const [copied, setCopied] = useState(false);

  const handleProcess = (text: string, currentMode = mode, curEncodeMode = encodeMode) => {
    if (!text) {
      setOutputVal('');
      return;
    }
    try {
      if (currentMode === 'encode') {
        if (curEncodeMode === 'components') {
          setOutputVal(encodeURIComponent(text));
        } else {
          setOutputVal(encodeURI(text));
        }
      } else {
        setOutputVal(decodeURIComponent(text));
      }
    } catch (e) {
      setOutputVal('Error: Invalid URI format for processing.');
    }
  };

  const onInputChange = (val: string) => {
    setInputVal(val);
    handleProcess(val);
  };

  const handleToggleMode = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    // Swap inputs for user convenience
    if (outputVal && !outputVal.startsWith('Error:')) {
      setInputVal(outputVal);
      handleProcess(outputVal, newMode);
    } else {
      handleProcess(inputVal, newMode);
    }
  };

  const handleToggleEncodeMode = (newEncodeMode: 'all' | 'components') => {
    setEncodeMode(newEncodeMode);
    handleProcess(inputVal, mode, newEncodeMode);
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
            <Link size={12} />
            Developer Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            URL Encoder & Decoder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Percent-encode query parameters or decode unreadable URLs. High precision client-side utility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Source Input
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleToggleMode('encode')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Encode Mode
              </button>
              <button
                onClick={() => handleToggleMode('decode')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                  mode === 'decode'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Decode Mode
              </button>
            </div>
          </div>

          {mode === 'encode' && (
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1">Standard:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleEncodeMode('components')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    encodeMode === 'components'
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-250 dark:border-blue-800'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  All Characters (encodeURIComponent)
                </button>
                <button
                  onClick={() => handleToggleEncodeMode('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    encodeMode === 'all'
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-250 dark:border-blue-800'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  URI Only (Keep protocol/slashes)
                </button>
              </div>
            </div>
          )}

          <div className="relative">
            <textarea
              value={inputVal}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? 'Type or paste raw query variables, strings, or URLs to encode...'
                  : 'Paste encoded URI components (e.g. hello%20world%21) to decode...'
              }
              rows={10}
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
              Processed Output
            </span>
            <button
              onClick={handleCopy}
              disabled={!outputVal || outputVal.startsWith('Error:')}
              className="p-1 px-3 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50 border border-slate-200/40 dark:border-slate-800/60"
            >
              {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>

          <textarea
            value={outputVal}
            readOnly
            placeholder="Processed output will appear here automatically..."
            rows={mode === 'encode' ? 12 : 10}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 break-all resize-none"
          />
        </div>
      </div>

      <AdSenseSlot slot="url-encoder-bottom" />
    </div>
  );
}
