import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, Sparkles } from 'lucide-react';
import { useKeyboardShortcuts } from '../context/KeyboardShortcutContext';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { PageId } from '../types';
import { toast } from '../utils/toast';

interface KeyboardShortcutHandlerProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const KeyboardShortcutHandler: React.FC<KeyboardShortcutHandlerProps> = ({
  currentPage,
  setCurrentPage,
  darkMode,
  toggleDarkMode,
}) => {
  const { registerShortcutHandler, activeSequence } = useKeyboardShortcuts();

  useEffect(() => {
    registerShortcutHandler({
      onOpenSearch: () => {
        window.dispatchEvent(new CustomEvent('smarttoolhub:openSearch'));
      },
      onNavigate: (page: PageId) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onToggleDarkMode: () => {
        toggleDarkMode();
        toast.info(`Switched to ${darkMode ? 'Light' : 'Dark'} mode [D]`, 'Theme Toggled');
      },
      onScrollTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onCopyLink: () => {
        if (typeof window !== 'undefined') {
          navigator.clipboard.writeText(window.location.href).then(() => {
            toast.success('Page link copied to clipboard.', 'URL Copied');
          });
        }
      },
    });
  }, [registerShortcutHandler, setCurrentPage, toggleDarkMode, darkMode]);

  return (
    <>
      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal />

      {/* Floating Sequence Indicator (e.g. When user presses 'G') */}
      <AnimatePresence>
        {activeSequence === 'g' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700 dark:border-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-semibold"
          >
            <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <Compass size={16} className="animate-spin" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-400 font-bold">G</span>
              <span className="text-slate-400">then:</span>
              <span className="space-x-1 font-mono text-[11px]">
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300">H</kbd>ome,
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 ml-1">P</kbd>ricing,
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 ml-1">D</kbd>ashboard,
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 ml-1">B</kbd>log,
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 ml-1">A</kbd>ccount
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
