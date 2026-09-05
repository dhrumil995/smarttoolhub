import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Show after a brief delay if consent is not yet given
    const consent = localStorage.getItem('smarttoolhub_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('smarttoolhub_cookie_consent', 'accepted-all');
    setShowConsent(false);
    // Trigger Google Analytics enablement if exists
    const win = window as any;
    if (win.gtag) {
      win.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('smarttoolhub_cookie_consent', 'declined');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-100 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-800 dark:text-slate-200 space-y-4 backdrop-blur-lg"
          id="cookie-consent-container"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <Cookie size={20} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-950 dark:text-white flex items-center gap-1.5">
                  We value your privacy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We use cookies and local storage to save your custom tool configurations, favorites, recently used tools, and to measure anonymous platform performance.
                </p>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/85 transition-colors"
              title="Close cookie popup"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors text-center uppercase tracking-wider"
            >
              Accept All Cookies
            </button>
            <button
              onClick={handleDecline}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors text-center uppercase tracking-wider"
            >
              Decline Optional
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/60 pt-3">
            <a
              href="#/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400 underline transition-colors"
            >
              Read our Privacy Policy
            </a>
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-emerald-500 font-bold">
              <ShieldCheck size={10} />
              Secured Connection
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
