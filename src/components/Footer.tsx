import React, { useState } from 'react';
import { Cpu, Send, Check, ShieldCheck, Mail, Github, Heart, Keyboard } from 'lucide-react';
import { PageId } from '../types';
import Logo from './Logo';
import { useKeyboardShortcuts } from '../context/KeyboardShortcutContext';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const { openCheatSheet } = useKeyboardShortcuts();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setSubmitted(true);
    setEmail('');
    setError('');
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const handleLinkClick = (pageId: PageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-200 dark:border-slate-900/60">
          
          {/* Brand Intro Column */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleLinkClick('home')}>
              <Logo size={36} className="transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300" />
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                SmartToolHub<span className="text-blue-600 dark:text-blue-500">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              SmartToolHub is a clean, modern, and privacy-first collection of free client-side utility calculators, developers helpers, text manipulators, and design tools. Everything runs locally in your browser for absolute speed and secure data containment.
            </p>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full w-fit font-mono text-[9px] font-bold uppercase tracking-widest">
              <ShieldCheck size={11} className="text-blue-600 dark:text-blue-500" />
              100% Zero-Server Processing
            </div>
          </div>

          {/* Popular Tools Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Top Utilities
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="/json-formatter" onClick={(e) => { e.preventDefault(); handleLinkClick('json-formatter'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  JSON Formatter
                </a>
              </li>
              <li>
                <a href="/password-gen" onClick={(e) => { e.preventDefault(); handleLinkClick('password-gen'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Password Generator
                </a>
              </li>
              <li>
                <a href="/color-converter" onClick={(e) => { e.preventDefault(); handleLinkClick('color-converter'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Color Converter
                </a>
              </li>
              <li>
                <a href="/ai-invoice-ocr" onClick={(e) => { e.preventDefault(); handleLinkClick('ai-invoice-ocr'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  AI Invoice OCR
                </a>
              </li>
              <li>
                <a href="/qr-generator" onClick={(e) => { e.preventDefault(); handleLinkClick('qr-generator'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  QR Code Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Guides & Resources Column (Internal Topic Clusters) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Guides & Hubs
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="/blog" onClick={(e) => { e.preventDefault(); handleLinkClick('blog'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Knowledge Hub
                </a>
              </li>
              <li>
                <a href="/pricing" onClick={(e) => { e.preventDefault(); handleLinkClick('pricing'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Pro Plans
                </a>
              </li>
              <li>
                <a href="/ai-invoice-ocr" onClick={(e) => { e.preventDefault(); handleLinkClick('ai-invoice-ocr'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  AI Business Suite
                </a>
              </li>
              <li>
                <a href="/seo-keyword" onClick={(e) => { e.preventDefault(); handleLinkClick('seo-keyword'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  SEO & Auditing
                </a>
              </li>
              <li>
                <a href="/site-structure-visualizer" onClick={(e) => { e.preventDefault(); handleLinkClick('site-structure-visualizer'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Site Structure Map
                </a>
              </li>
              <li>
                <a href="/color-converter" onClick={(e) => { e.preventDefault(); handleLinkClick('color-converter'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Design & CSS
                </a>
              </li>
            </ul>
          </div>

          {/* About & Legal Nav */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Legal & Support
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); handleLinkClick('about'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); handleLinkClick('contact'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/help" onClick={(e) => { e.preventDefault(); handleLinkClick('help'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Help & FAQs
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCheatSheet}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer group"
                >
                  <Keyboard size={13} className="text-blue-500" />
                  <span>Keyboard Shortcuts</span>
                  <kbd className="ml-1 px-1 py-0.2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[9px] font-mono text-slate-600 dark:text-slate-400 font-bold group-hover:text-blue-500">
                    ?
                  </kbd>
                </button>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); handleLinkClick('privacy'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => { e.preventDefault(); handleLinkClick('terms'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/disclaimer" onClick={(e) => { e.preventDefault(); handleLinkClick('disclaimer'); }} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Legal Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Newsletter Signup
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Get notified of new free developer tools, converters, and major platform enhancements. Zero spam, unsubscribe anytime.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 h-4 w-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center cursor-pointer"
                >
                  {submitted ? <Check size={14} className="text-emerald-300" /> : <Send size={14} />}
                </button>
              </div>

              {error && (
                <p className="text-[10px] font-bold text-rose-500 font-mono">
                  {error}
                </p>
              )}
              {submitted && (
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <Check size={11} />
                  Subscribed successfully! Thank you.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Credits Row - Formatted with Geometric Balance precise specs */}
        <div className="pt-8 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs text-slate-500 font-medium">
              &copy; 2026 All rights reserved;{' '}
              <button onClick={() => handleLinkClick('privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 underline cursor-pointer inline-block">
                Privacy Policy
              </button>
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 space-x-1">
              <button onClick={() => handleLinkClick('terms')} className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer inline-block">
                Terms of Service
              </button>
              <span>,</span>
              <button onClick={() => handleLinkClick('privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer inline-block">
                Cookie Policy
              </button>
              <span>,</span>
              <button onClick={() => handleLinkClick('privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer inline-block">
                Data Usage
              </button>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <button onClick={openCheatSheet} className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              <Keyboard size={12} className="text-blue-500" />
              <span>Shortcuts</span>
              <kbd className="px-1 py-0.2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[9px] font-mono text-slate-600 dark:text-slate-400 font-bold">
                ?
              </kbd>
            </button>
            <span className="text-slate-300 dark:text-slate-800 hidden sm:inline">•</span>
            <button onClick={() => handleLinkClick('privacy')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleLinkClick('terms')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Terms
            </button>
            <button onClick={() => handleLinkClick('disclaimer')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Disclaimer
            </button>
            <span className="text-slate-300 dark:text-slate-800 hidden sm:inline">|</span>
            <span className="text-emerald-500 flex items-center gap-1">
              v2.4.0 Online
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
