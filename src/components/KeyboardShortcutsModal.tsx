import React, { useState, useMemo, useEffect } from 'react';
import {
  Keyboard,
  X,
  Search,
  Check,
  Copy,
  Compass,
  Zap,
  Sliders,
  Sparkles,
  Command,
  SunMoon,
  ArrowRight
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useKeyboardShortcuts, SHORTCUTS_LIST, ShortcutDefinition } from '../context/KeyboardShortcutContext';

export default function KeyboardShortcutsModal() {
  const {
    isCheatSheetOpen,
    closeCheatSheet,
    shortcutsEnabled,
    setShortcutsEnabled,
    lastPressedKey,
    activeSequence
  } = useKeyboardShortcuts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);

  const categories = [
    { id: 'all', label: 'All Shortcuts', icon: Sparkles },
    { id: 'search', label: 'Search & Tools', icon: Search },
    { id: 'navigation', label: 'Navigation', icon: Compass },
    { id: 'display', label: 'Display & UI', icon: SunMoon },
    { id: 'actions', label: 'Actions', icon: Zap },
  ];

  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_LIST.filter((shortcut) => {
      const matchCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.actionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.displayKeys.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyShortcuts = () => {
    const text = SHORTCUTS_LIST.map((s) => `${s.actionName} [${s.displayKeys.join(' + ')}]: ${s.description}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isCheatSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeCheatSheet} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Keyboard size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-950 dark:text-white tracking-tight">
                  Keyboard Shortcuts
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                  {isMac ? 'macOS' : 'Windows / Linux'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Navigate, search 150+ tools, and trigger quick actions at lightning speed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShortcuts}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Copy all shortcuts as text"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>

            <button
              onClick={closeCheatSheet}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter shortcuts (e.g. search, theme, pricing, home)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Enable / Disable Shortcuts Toggle */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 select-none">
                Enable Shortcuts:
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={shortcutsEnabled}
                onClick={() => setShortcutsEnabled(!shortcutsEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  shortcutsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    shortcutsEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={13} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shortcuts List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
          {filteredShortcuts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredShortcuts.map((shortcut) => {
                return (
                  <div
                    key={shortcut.id}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                          {shortcut.actionName}
                        </span>
                        {shortcut.isSequence && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-mono font-bold">
                            Sequence
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {shortcut.description}
                      </p>
                    </div>

                    {/* Key Caps */}
                    <div className="flex items-center gap-1 shrink-0">
                      {shortcut.displayKeys.map((k, idx) => {
                        const isHelperWord = k === 'then' || k === 'or';
                        if (isHelperWord) {
                          return (
                            <span key={idx} className="text-[10px] text-slate-400 font-medium px-0.5">
                              {k}
                            </span>
                          );
                        }

                        let renderKey = k;
                        if (k === '⌘ / Ctrl') {
                          renderKey = isMac ? '⌘' : 'Ctrl';
                        }

                        return (
                          <kbd
                            key={idx}
                            className="min-w-[24px] px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-black text-slate-800 dark:text-slate-200 shadow-2xs text-center inline-block group-hover:border-blue-400 transition-colors"
                          >
                            {renderKey}
                          </kbd>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <Keyboard size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No shortcuts found</h4>
              <p className="text-xs text-slate-400">Try searching for "search", "theme", or "home".</p>
            </div>
          )}
        </div>

        {/* Bottom Footer Helper */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Active Sequence:</span>
            {activeSequence ? (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold animate-pulse">
                Pressed '{activeSequence.toUpperCase()}', waiting for next key...
              </span>
            ) : (
              <span className="text-slate-400">None (Press G then H)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
              Esc
            </kbd>
            <span>to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
