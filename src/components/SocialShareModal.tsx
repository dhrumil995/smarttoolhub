import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, MessageCircle, Copy, Check, Link2, Sparkles, X } from 'lucide-react';
import { Tool } from '../types';

interface SocialShareModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialShareModal({ tool, isOpen, onClose }: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/${tool.id}` : `https://smarttoolhub.net/${tool.id}`;
  const shareTitle = `Check out ${tool.name} on SmartToolHub - 100% Free & Client-Side Secure!`;
  const shareSummary = `${tool.description} No installation, no server latency.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-black text-white hover:bg-slate-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}&hashtags=webdev,tools,free`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0077b5] text-white hover:bg-[#006097]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] text-white hover:bg-[#20b858]',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + currentUrl)}`
    },
    {
      name: 'Reddit',
      icon: Sparkles,
      color: 'bg-[#FF4500] text-white hover:bg-[#e03d00]',
      url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] text-white hover:bg-[#1565cb]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-xl flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Share this Tool
              </h3>
              <p className="text-xs text-slate-500">
                Help friends and developers discover {tool.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Social Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {shareLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-xs ${item.color}`}
              >
                <Icon size={15} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Direct Tool Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Link2 size={16} className="text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none truncate font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Micro SEO / Community note */}
        <p className="text-[11px] text-center text-slate-400 leading-relaxed">
          SmartToolHub is 100% free and open to everyone. No sign-up required.
        </p>

      </div>
    </div>
  );
}
