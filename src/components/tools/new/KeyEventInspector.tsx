import React, { useState, useEffect } from 'react';
import { Keyboard, Copy, Check, Terminal, RotateCcw, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface KeyRecord {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  time: string;
}

export function KeyEventInspector() {
  const [currentKey, setCurrentKey] = useState<KeyRecord>({
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    time: new Date().toLocaleTimeString(),
  });

  const [history, setHistory] = useState<KeyRecord[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing when typing inside inputs if they focus somewhere else
      const record: KeyRecord = {
        key: e.key === ' ' ? 'Space' : e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        location: e.location,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        time: new Date().toLocaleTimeString(),
      };
      setCurrentKey(record);
      setHistory((prev) => [record, ...prev.slice(0, 15)]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getReactHandlerCode = () => {
    return `const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === '${currentKey.key}' && ${currentKey.ctrlKey ? 'e.ctrlKey' : '!e.ctrlKey'}) {
    console.log('Trigger action for ${currentKey.code}');
  }
};`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs font-semibold">
          <Keyboard size={14} /> Ultra Pro Max JavaScript Key Event Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Keyboard Event Code & KeyCode Inspector Pro
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Press any key on your keyboard to instantly capture JavaScript keyboard event properties: <code className="text-violet-500 font-mono">event.key</code>, <code className="text-violet-500 font-mono">event.code</code>, <code className="text-violet-500 font-mono">which</code>, modifier keys, and React event handler snippets.
        </p>
      </div>

      {/* Hero Big Key Display */}
      <div className="p-8 sm:p-12 bg-slate-950 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block animate-pulse">
            Press Any Key To Test
          </span>
          <div className="inline-block p-6 sm:p-8 bg-slate-900 border-2 border-violet-500/50 rounded-3xl shadow-inner min-w-[160px]">
            <span className="text-5xl sm:text-7xl font-extrabold text-white font-mono tracking-tight">
              {currentKey.key}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            JavaScript <code className="text-violet-300">event.keyCode</code> / <code className="text-violet-300">event.which</code>:
          </span>
          <span className="text-2xl font-extrabold text-violet-400 font-mono">
            {currentKey.keyCode}
          </span>
        </div>
      </div>

      {/* Main Grid: Detailed Properties & Modifiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Properties Matrix Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Event Properties</span>
            <span className="text-xs text-slate-400 font-mono">Captured at {currentKey.time}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">event.key</span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate">{currentKey.key}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">event.code</span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate">{currentKey.code}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">event.which</span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{currentKey.which}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">event.location</span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{currentKey.location} (Standard)</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ctrl Key</span>
              <p className={`text-sm font-mono font-bold ${currentKey.ctrlKey ? 'text-emerald-500' : 'text-slate-400'}`}>
                {currentKey.ctrlKey ? 'TRUE' : 'false'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Shift / Alt / Meta</span>
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {currentKey.shiftKey ? 'Shift ' : ''}
                {currentKey.altKey ? 'Alt ' : ''}
                {currentKey.metaKey ? 'Cmd/Win' : ''}
                {!currentKey.shiftKey && !currentKey.altKey && !currentKey.metaKey ? 'None' : ''}
              </p>
            </div>
          </div>

          {/* React Snippet Box */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold uppercase tracking-wider text-slate-400">React OnKeyDown Handler</span>
              <button
                onClick={() => handleCopy(getReactHandlerCode(), 'react-handler')}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
              >
                {copiedKey === 'react-handler' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-900 text-violet-300 font-mono text-xs rounded-lg overflow-x-auto">
              {getReactHandlerCode()}
            </pre>
          </div>
        </div>

        {/* History Log Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal size={18} className="text-violet-500" /> Keypress History Log
            </h2>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Clear
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Press keys on your keyboard to record event history.</p>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono font-bold rounded">
                      {item.key}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{item.code}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">code: {item.keyCode}</span>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default KeyEventInspector;
