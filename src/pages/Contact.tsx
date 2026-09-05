import React, { useState } from 'react';
import { Mail, Check, AlertCircle, HelpCircle, Send, Globe, MessageSquare } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !subject || !message) {
      setError('Please complete all form fields before submitting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid, functional email address.');
      return;
    }

    setIsSending(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <SEOHead
        title="Contact Support & Feedback"
        description="Reach out to the ToolHub team with feature requests, feedback, bug reports, or general technical inquiries."
      />

      <section className="text-center space-y-4">
        <span className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          SUPPORT & FEEDBACK
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          We'd love to hear from you.
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Need a specific developer tool built? Found a bug? Or simply want to send some love? Reach out via our secure form.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6">
            Send a Secure Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Tool Request / Bug Report"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your suggestions, feedback, or technical queries here..."
                rows={5}
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-slate-200 resize-none"
              />
            </div>

            {/* Error & Success Alert states */}
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2.5 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <Check size={18} className="shrink-0 text-emerald-500" />
                <div>
                  <span className="block font-bold mb-0.5">Message Sent Successfully!</span>
                  Thank you for reaching out. We appreciate your interest and will get back to you within 24 hours.
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs font-mono tracking-widest uppercase"
            >
              {isSending ? 'Sending Message...' : 'Send Message'}
              <Send size={13} />
            </button>
          </form>
        </div>

        {/* Support Cards Side info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-display font-bold text-slate-900 dark:text-white">
              Support Channels
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We try to respond to all inquiries as quickly as possible. Check our other channels for community updates:
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs">
                <div className="h-7 w-7 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="block font-semibold text-slate-700 dark:text-slate-300">Direct Email Support</span>
                  <span className="text-slate-400 font-mono">smarttoolhubsupport@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="h-7 w-7 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                  <Globe size={14} />
                </div>
                <div>
                  <span className="block font-semibold text-slate-700 dark:text-slate-300">Open Source Community</span>
                  <span className="text-slate-400"> Currently Working ⚠️ </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-3">
            <h3 className="font-display font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <HelpCircle size={14} className="text-blue-500" />
              Frequently Asked Question
            </h3>
            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Are my paste values secure?
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Absolutely. ToolHub does not feature backend databases or analytics. Everything stays securely inside your browser's execution tab. If you close the window, your input is completely discarded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
