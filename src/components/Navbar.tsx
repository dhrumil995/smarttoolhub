import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Search, ChevronRight, Command, Sparkles, ShieldCheck, User, LogIn, LogOut, Settings, UserPlus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PageId } from '../types';
import Logo from './Logo';
import { TOOLS } from '../data/tools';
import { ToolIcon } from '../pages/Home';
import CommandPalette from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { useKeyboardShortcuts } from '../context/KeyboardShortcutContext';
import { searchTools, highlightSearchText } from '../utils/searchHelper';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, darkMode, toggleDarkMode }: NavbarProps) {
  const { subscription } = useSubscription();
  const { user, isAuthenticated, logout } = useAuth();
  const { openCheatSheet } = useKeyboardShortcuts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener & Mobile Search Event Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    const handleOpenSearchEvent = () => {
      setCommandPaletteOpen(true);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('smarttoolhub:openSearch', handleOpenSearchEvent);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('smarttoolhub:openSearch', handleOpenSearchEvent);
    };
  }, []);

  const navItems = [
    { id: 'home' as PageId, label: 'Home' },
    { id: 'blog' as PageId, label: 'Blog' },
    { id: 'pricing' as PageId, label: 'Pricing' },
    { id: 'dashboard' as PageId, label: 'My Subscription' },
    { id: 'about' as PageId, label: 'About' },
    { id: 'contact' as PageId, label: 'Contact' },
    { id: 'help' as PageId, label: 'Help' },
  ];


  const handleNavClick = (pageId: PageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setSearchQuery('');
    setShowDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToolSelect = (toolId: string) => {
    setCurrentPage(toolId as PageId);
    setSearchQuery('');
    setShowDropdown(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTools = searchQuery.trim() === ''
    ? []
    : searchTools(TOOLS, searchQuery, 'all', [], 'recommended').slice(0, 7);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-cyan-500/20 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Logo with Cyber Glow */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
          >
            <div className="p-1 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,212,255,0.4)]">
              <Logo size={32} />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-400 transition-colors">
              SmartToolHub<span className="text-cyan-400">.net</span>
            </span>
          </div>

          {/* Desktop Navigation Links with Magnetic Glow Hover */}
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || 
                (item.id === 'home' && !['about', 'contact', 'help', 'privacy', 'terms', 'disclaimer'].includes(currentPage) && !TOOLS.some(t => t.id === currentPage));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-all duration-200 cursor-pointer relative py-1 px-2 rounded-lg hover:bg-cyan-500/10 ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-cyan-300'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Input Bar with Glass Cyber Ring */}
          <div className="hidden md:block relative max-w-xs w-full mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cyan-400/70 h-4 w-4 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-9 pr-8 py-1.5 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/80 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700/60 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                  title="Quick Search Command Palette"
                >
                  <Command size={10} />
                  K
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            <AnimatePresence>
              {showDropdown && searchQuery.trim() !== '' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden z-20 max-h-80 overflow-y-auto"
                  >
                    {filteredTools.length > 0 ? (
                      <div className="p-1 space-y-0.5">
                        {filteredTools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => handleToolSelect(tool.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                              <ToolIcon name={tool.icon} className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                                {highlightSearchText(tool.name, searchQuery)}
                              </span>
                              <span className="block text-[10px] text-slate-400 truncate">
                                {highlightSearchText(tool.description, searchQuery)}
                              </span>
                            </div>
                            <ChevronRight size={12} className="text-slate-400" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-4 text-center text-xs text-slate-400">
                        No tools found
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Actions & Mobile menu toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Subscription CTA / Badge */}
            <button
              onClick={() => handleNavClick('pricing')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                subscription?.status === 'Active'
                  ? 'bg-amber-400/10 text-amber-500 border border-amber-400/30 hover:bg-amber-400/20'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
              }`}
            >
              <Sparkles size={12} />
              <span>{subscription?.status === 'Active' ? `${subscription.planName}` : 'Upgrade Premium'}</span>
            </button>

            {/* Admin Panel Quick Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Admin Panel"
            >
              <ShieldCheck size={18} className="text-blue-500" />
            </button>

            {/* Notification Center */}
            <NotificationCenter onNavigate={handleNavClick} />

            {/* Auth State: User Menu or Sign In/Sign Up */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-800"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 object-cover"
                  />
                  <span className="hidden lg:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* User Profile Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-30 p-2 space-y-1"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        <button
                          onClick={() => {
                            handleNavClick('account');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                        >
                          <User size={14} className="text-blue-500" />
                          <span>My Account</span>
                        </button>

                        <button
                          onClick={() => {
                            handleNavClick('dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                        >
                          <Sparkles size={14} className="text-amber-500" />
                          <span>My Subscriptions</span>
                        </button>

                        {user.role === 'admin' && (
                          <button
                            onClick={() => {
                              handleNavClick('admin');
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-colors text-left"
                          >
                            <ShieldCheck size={14} />
                            <span>Admin Portal</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            openCheatSheet();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Command size={14} className="text-purple-500" />
                            <span>Shortcuts</span>
                          </div>
                          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono text-slate-500">
                            ?
                          </kbd>
                        </button>

                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                              handleNavClick('home');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors text-left"
                          >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Mobile Search Results */}
            {searchQuery.trim() !== '' && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 p-2 max-h-48 overflow-y-auto space-y-1">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-left"
                    >
                      <ToolIcon name={tool.icon} className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{tool.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400">No results found</div>
                )}
              </div>
            )}

            {/* Nav Links */}
            <div className="space-y-1 pt-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Auth Links */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => handleNavClick('account')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2"
                    >
                      <User size={14} />
                      <span>My Account ({user.name.split(' ')[0]})</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        handleNavClick('home');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleNavClick('login')}
                      className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl text-center"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleNavClick('signup')}
                      className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl text-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTool={(toolId) => {
          setCurrentPage(toolId);
          setCommandPaletteOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </header>
  );
}
