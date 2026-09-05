import React, { useState, useEffect } from 'react';
import { Home, Layers, Search, Star, Moon, Sun, ArrowUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../types';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onOpenSearch: () => void;
  onOpenCategories: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  favoritesCount: number;
  onFilterFavorites: () => void;
}

export default function MobileBottomNav({
  currentPage,
  setCurrentPage,
  onOpenSearch,
  onOpenCategories,
  darkMode,
  toggleDarkMode,
  favoritesCount,
  onFilterFavorites,
}: MobileBottomNavProps) {
  const { isAuthenticated, user } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomeActive = currentPage === 'home';
  const isAccountActive = currentPage === 'account' || currentPage === 'dashboard';

  return (
    <>
      {/* Floating Back to Top Button for Mobile */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="md:hidden fixed right-4 bottom-20 z-40 p-3 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer active:scale-95 transition-transform"
            aria-label="Scroll back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.3)] pb-safe transition-colors duration-200"
      >
        <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
          {/* 1. Home */}
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-h-[48px] min-w-[56px] transition-all cursor-pointer ${
              isHomeActive
                ? 'text-blue-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Home size={20} className={isHomeActive ? 'stroke-[2.5]' : 'stroke-2'} />
              {isHomeActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Home</span>
          </button>

          {/* 2. Categories Drawer */}
          <button
            onClick={onOpenCategories}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-h-[48px] min-w-[56px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
          >
            <Layers size={20} className="stroke-2" />
            <span className="text-[10px] mt-1 tracking-tight">Categories</span>
          </button>

          {/* 3. Central Search Button (Elevated) */}
          <button
            onClick={onOpenSearch}
            className="flex flex-col items-center justify-center -mt-4 py-1 px-3 rounded-2xl min-h-[52px] min-w-[52px] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
            aria-label="Search all tools"
          >
            <Search size={20} className="stroke-[2.5]" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Search</span>
          </button>

          {/* 4. Starred / Favorites */}
          <button
            onClick={() => {
              if (currentPage !== 'home') {
                setCurrentPage('home');
              }
              onFilterFavorites();
            }}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-h-[48px] min-w-[56px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer relative"
          >
            <div className="relative">
              <Star size={20} className="stroke-2" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 min-w-[14px] text-[9px] font-extrabold bg-amber-400 text-slate-950 rounded-full text-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Starred</span>
          </button>

          {/* 5. Theme or Profile */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setCurrentPage('account')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-h-[48px] min-w-[56px] transition-all cursor-pointer ${
                isAccountActive
                  ? 'text-blue-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <User size={20} className={isAccountActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {isAccountActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:text-cyan-400 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[48px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={toggleDarkMode}
              className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-h-[48px] min-w-[56px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun size={20} className="text-amber-400 stroke-2" />
              ) : (
                <Moon size={20} className="stroke-2" />
              )}
              <span className="text-[10px] mt-1 tracking-tight">
                {darkMode ? 'Light' : 'Dark'}
              </span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
