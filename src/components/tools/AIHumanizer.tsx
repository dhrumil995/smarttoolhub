import React, { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, RefreshCw, AlertCircle, Eye, Sliders, Type } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TONES = [
  { id: 'natural', label: '🍃 Natural & Flowing', desc: 'Standard human pacing and balanced phrasing.' },
  { id: 'conversational', label: '☕ Warm & Conversational', desc: 'Engaging, relaxed, and highly readable.' },
  { id: 'professional', label: '💼 Crisp & Professional', desc: 'Polished corporate speech, perfect for emails and posts.' },
  { id: 'creative', label: '🎨 Expressive & Creative', desc: 'Rich vocabulary and varied sentence rhythm.' },
  { id: 'academic', label: '🎓 Academic & Formal', desc: 'Rigorous structure and sophisticated style.' },
];

const INTENSITIES = [
  { id: 'low', label: 'Subtle Adjustments', desc: 'Keeps your phrasing intact; mostly fixes flow.' },
  { id: 'medium', label: 'Balanced Humanizing', desc: 'Deconstructs robotic syntax while preserving meaning.' },
  { id: 'high', label: 'Complete Reconstruction', desc: 'Deep restructuring for maximum bypass rate.' },
];

export default function AIHumanizer() {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('natural');
  const [intensity, setIntensity] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolType: 'ai-humanizer',
          payload: {
            text,
            tone,
            intensity,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to humanize text');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSample = () => {
    setText(`In conclusion, it is important to remember that artificial intelligence is a technology that is increasingly utilized in modern society. In order to optimize your marketing operations, one must delve deep into customer demographics. Furthermore, the paradigm shift represents a testament to the pinnacle of technological advancements.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            AI Content Creators
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Text Humanizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instantly transform stiff, ChatGPT-like machine sentences into elegant, organic, human-level content.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings and Input */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                AI-Generated Copy to Humanize
              </label>
              <button
                type="button"
                onClick={handleSample}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Load Sample Text
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste content here..."
              rows={8}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-4 text-sm text-slate-950 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />

            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Type size={16} className="text-slate-400" />
                Target Writing Tone
              </label>
              <div className="grid grid-cols-1 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                      tone === t.id
                        ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm font-bold">{t.label}</span>
                    <span className="text-xs opacity-80">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Level */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders size={16} className="text-slate-400" />
                Humanizing Depth
              </label>
              <div className="grid grid-cols-1 gap-2">
                {INTENSITIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIntensity(item.id)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                      intensity === item.id
                        ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm font-bold">{item.label}</span>
                    <span className="text-xs opacity-80">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Rewriting sentences...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Humanize Text Now
                </>
              )}
            </button>
          </div>
        </form>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 p-4 text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {result ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Humanized Output
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-950 dark:hover:text-slate-50 font-medium"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Output
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
              <Sparkles size={36} className="text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Awaiting Input Content
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                Your polished, fully organic and bypass-optimized content will appear right here after rewriting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
