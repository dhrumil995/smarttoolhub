import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/tools';
import { ToolIcon } from '../pages/Home';
import { CategoryId, PageId } from '../types';

interface MobileCategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onNavigateCategoryHub: (categoryId: string) => void;
}

export default function MobileCategorySheet({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  onNavigateCategoryHub,
}: MobileCategorySheetProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Bottom Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-h-[85vh] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl flex flex-col z-10 overflow-hidden pb-safe"
        >
          {/* Pull Notch */}
          <div className="w-full flex items-center justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                  Tool Categories
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select a category to filter or explore
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close categories"
            >
              <X size={18} />
            </button>
          </div>

          {/* Category List */}
          <div className="overflow-y-auto px-4 py-3 space-y-2 max-h-[60vh]">
            {/* All Tools Option */}
            <button
              onClick={() => {
                onSelectCategory('all');
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all min-h-[52px] ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-750'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedCategory === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="font-bold text-sm block">All Categories</span>
                  <span
                    className={`text-[11px] ${
                      selectedCategory === 'all' ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    View all {TOOLS.length} utilities
                  </span>
                </div>
              </div>
              <ChevronRight
                size={16}
                className={selectedCategory === 'all' ? 'text-white' : 'text-slate-400'}
              />
            </button>

            {/* Individual Categories */}
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl text-left transition-all min-h-[52px] ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-750'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <ToolIcon name={cat.icon} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-sm block truncate">{cat.name}</span>
                      <span
                        className={`text-[11px] truncate block ${
                          isSelected ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        {count} tools available
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateCategoryHub(cat.id);
                      onClose();
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white'
                    }`}
                    title={`Go to ${cat.name} Hub`}
                  >
                    Hub
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
