import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsletterBoxProps {
  variant?: 'inline' | 'card' | 'sticky';
  source?: string;
}

export const NewsletterBox: React.FC<NewsletterBoxProps> = ({ variant = 'card', source = 'blog' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setIsSuccess(true);
        setMessage(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (e: any) {
      setLoading(false);
      setIsSuccess(false);
      setMessage('Network error. Please try again.');
    }
  };

  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
              <Sparkles size={10} /> AI Weekly Digest
            </span>
            <h4 className="text-sm font-bold text-white">Subscribe to SmartToolHub</h4>
            <p className="text-xs text-slate-400">Get top AI business workflow guides every Tuesday.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter@email.com"
            required
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Join'}
          </button>
        </form>

        {message && (
          <p className={`mt-2 text-[11px] ${isSuccess ? 'text-emerald-400' : 'text-amber-400'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Mail size={14} />
          <span>SmartToolHub AI Insights</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
          Master AI Business Automation & GST Tools
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
          Join over 15,000+ finance leaders, CAs, and MSME owners receiving weekly tutorials on client-side OCR, tax automation, and supply chain tools.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email address"
            required
            className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <span>Subscribe Free</span>
              </>
            )}
          </button>
        </form>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs font-medium pt-2 flex items-center justify-center gap-1.5 ${
              isSuccess ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isSuccess && <CheckCircle2 size={14} />}
            <span>{message}</span>
          </motion.div>
        )}

        <p className="text-[11px] text-slate-400 pt-1">
          No spam ever. Unsubscribe anytime with 1-click.
        </p>
      </div>
    </div>
  );
};
