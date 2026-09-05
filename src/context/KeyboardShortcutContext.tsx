import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PageId } from '../types';

export interface ShortcutDefinition {
  id: string;
  category: 'navigation' | 'search' | 'display' | 'actions';
  keys: string[];
  displayKeys: string[];
  description: string;
  actionName: string;
  isSequence?: boolean;
}

export const SHORTCUTS_LIST: ShortcutDefinition[] = [
  // Search & Command Palette
  {
    id: 'search-palette',
    category: 'search',
    keys: ['mod+k', 'ctrl+k', 'meta+k'],
    displayKeys: ['⌘ / Ctrl', 'K'],
    description: 'Open Global Command Palette & Tool Search',
    actionName: 'Open Search',
  },
  {
    id: 'focus-search',
    category: 'search',
    keys: ['/'],
    displayKeys: ['/'],
    description: 'Focus search bar or quick search palette',
    actionName: 'Focus Search',
  },
  {
    id: 'close-modal',
    category: 'search',
    keys: ['escape'],
    displayKeys: ['Esc'],
    description: 'Close active modal, search palette, or unfocus inputs',
    actionName: 'Close / Dismiss',
  },

  // Cheat Sheet
  {
    id: 'open-shortcuts',
    category: 'display',
    keys: ['?', 'shift+/', 'mod+/', 'ctrl+/'],
    displayKeys: ['?'],
    description: 'Open Keyboard Shortcuts Cheat Sheet',
    actionName: 'Shortcut Help',
  },
  {
    id: 'toggle-dark-mode',
    category: 'display',
    keys: ['d', 'alt+m', 'alt+t'],
    displayKeys: ['D', 'or', 'Alt', 'M'],
    description: 'Toggle Dark / Light Theme Mode',
    actionName: 'Toggle Theme',
  },

  // Navigation (Sequence & Combos)
  {
    id: 'nav-home',
    category: 'navigation',
    keys: ['g h', 'alt+h'],
    displayKeys: ['G', 'then', 'H'],
    description: 'Navigate to Home / Main Tool Hub',
    actionName: 'Go Home',
    isSequence: true,
  },
  {
    id: 'nav-pricing',
    category: 'navigation',
    keys: ['g p', 'alt+p'],
    displayKeys: ['G', 'then', 'P'],
    description: 'Navigate to Pro Subscription Plans',
    actionName: 'Go to Pricing',
    isSequence: true,
  },
  {
    id: 'nav-dashboard',
    category: 'navigation',
    keys: ['g d', 'alt+d'],
    displayKeys: ['G', 'then', 'D'],
    description: 'Navigate to My Subscription / Dashboard',
    actionName: 'Go to Dashboard',
    isSequence: true,
  },
  {
    id: 'nav-blog',
    category: 'navigation',
    keys: ['g b', 'alt+b'],
    displayKeys: ['G', 'then', 'B'],
    description: 'Navigate to Blog & Knowledge Hub',
    actionName: 'Go to Blog',
    isSequence: true,
  },
  {
    id: 'nav-account',
    category: 'navigation',
    keys: ['g a', 'alt+a'],
    displayKeys: ['G', 'then', 'A'],
    description: 'Navigate to My Account Settings',
    actionName: 'Go to Account',
    isSequence: true,
  },

  // Productivity Actions
  {
    id: 'scroll-top',
    category: 'actions',
    keys: ['alt+arrowup'],
    displayKeys: ['Alt', '↑'],
    description: 'Scroll smoothly to top of current tool',
    actionName: 'Scroll to Top',
  },
  {
    id: 'copy-link',
    category: 'actions',
    keys: ['mod+shift+c', 'ctrl+shift+c'],
    displayKeys: ['⌘ / Ctrl', 'Shift', 'C'],
    description: 'Copy URL of current page or tool',
    actionName: 'Copy Page Link',
  },
];

interface KeyboardShortcutContextType {
  isCheatSheetOpen: boolean;
  openCheatSheet: () => void;
  closeCheatSheet: () => void;
  toggleCheatSheet: () => void;
  shortcutsEnabled: boolean;
  setShortcutsEnabled: (enabled: boolean) => void;
  activeSequence: string | null;
  lastPressedKey: string | null;
  registerShortcutHandler: (
    handlers: {
      onOpenSearch?: () => void;
      onNavigate?: (page: PageId) => void;
      onToggleDarkMode?: () => void;
      onScrollTop?: () => void;
      onCopyLink?: () => void;
    }
  ) => void;
}

const KeyboardShortcutContext = createContext<KeyboardShortcutContextType | undefined>(undefined);

export const KeyboardShortcutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('smarttoolhub_shortcuts_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [activeSequence, setActiveSequence] = useState<string | null>(null);
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);

  const [handlers, setHandlers] = useState<{
    onOpenSearch?: () => void;
    onNavigate?: (page: PageId) => void;
    onToggleDarkMode?: () => void;
    onScrollTop?: () => void;
    onCopyLink?: () => void;
  }>({});

  const setShortcutsEnabled = useCallback((enabled: boolean) => {
    setShortcutsEnabledState(enabled);
    try {
      localStorage.setItem('smarttoolhub_shortcuts_enabled', String(enabled));
    } catch {
      // ignore
    }
  }, []);

  const openCheatSheet = useCallback(() => setIsCheatSheetOpen(true), []);
  const closeCheatSheet = useCallback(() => setIsCheatSheetOpen(false), []);
  const toggleCheatSheet = useCallback(() => setIsCheatSheetOpen((prev) => !prev), []);

  const registerShortcutHandler = useCallback((newHandlers: typeof handlers) => {
    setHandlers((prev) => ({ ...prev, ...newHandlers }));
  }, []);

  // Sequence timeout reset
  useEffect(() => {
    if (activeSequence) {
      const timer = setTimeout(() => {
        setActiveSequence(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeSequence]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Record last key for cheat sheet visualization
      setLastPressedKey(e.key);

      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Always allow Escape, even inside inputs
      if (e.key === 'Escape') {
        if (isCheatSheetOpen) {
          e.preventDefault();
          setIsCheatSheetOpen(false);
          return;
        }
      }

      // Check for CMD/CTRL+K (always allowed)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handlers.onOpenSearch?.();
        return;
      }

      // Check for CMD/CTRL+/ (shortcut sheet toggle, always allowed)
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsCheatSheetOpen((prev) => !prev);
        return;
      }

      // If shortcuts are disabled by user, don't execute single key or sequence shortcuts
      if (!shortcutsEnabled) return;

      // If user is currently typing in an input/textarea/editable field, ignore all standard letter shortcuts
      if (isInput) return;

      // Check for '/' to open/focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handlers.onOpenSearch?.();
        return;
      }

      // Check for '?' to open shortcuts cheat sheet
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsCheatSheetOpen(true);
        return;
      }

      // Check for 'D' or Alt+M to toggle dark mode
      if ((e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey) || ((e.altKey) && e.key.toLowerCase() === 'm')) {
        e.preventDefault();
        handlers.onToggleDarkMode?.();
        return;
      }

      // Check for Alt+H (Home), Alt+P (Pricing), Alt+D (Dashboard), Alt+B (Blog), Alt+A (Account)
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'h') {
          e.preventDefault();
          handlers.onNavigate?.('home');
          return;
        } else if (key === 'p') {
          e.preventDefault();
          handlers.onNavigate?.('pricing');
          return;
        } else if (key === 'd') {
          e.preventDefault();
          handlers.onNavigate?.('dashboard');
          return;
        } else if (key === 'b') {
          e.preventDefault();
          handlers.onNavigate?.('blog');
          return;
        } else if (key === 'a') {
          e.preventDefault();
          handlers.onNavigate?.('account');
          return;
        } else if (key === 'arrowup') {
          e.preventDefault();
          handlers.onScrollTop?.();
          return;
        }
      }

      // Sequence handler: "G" then <key>
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey && !activeSequence) {
        e.preventDefault();
        setActiveSequence('g');
        return;
      }

      if (activeSequence === 'g') {
        const key = e.key.toLowerCase();
        setActiveSequence(null);

        if (key === 'h') {
          e.preventDefault();
          handlers.onNavigate?.('home');
        } else if (key === 'p') {
          e.preventDefault();
          handlers.onNavigate?.('pricing');
        } else if (key === 'd') {
          e.preventDefault();
          handlers.onNavigate?.('dashboard');
        } else if (key === 'b') {
          e.preventDefault();
          handlers.onNavigate?.('blog');
        } else if (key === 'a') {
          e.preventDefault();
          handlers.onNavigate?.('account');
        } else if (key === 't') {
          e.preventDefault();
          handlers.onNavigate?.('category-hub');
        }
        return;
      }

      // Copy link shortcut: Ctrl+Shift+C / Cmd+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handlers.onCopyLink?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheatSheetOpen, shortcutsEnabled, activeSequence, handlers]);

  return (
    <KeyboardShortcutContext.Provider
      value={{
        isCheatSheetOpen,
        openCheatSheet,
        closeCheatSheet,
        toggleCheatSheet,
        shortcutsEnabled,
        setShortcutsEnabled,
        activeSequence,
        lastPressedKey,
        registerShortcutHandler,
      }}
    >
      {children}
    </KeyboardShortcutContext.Provider>
  );
};

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutProvider');
  }
  return context;
};
