import React, { useState } from 'react';
import { Shield, Key, Copy, Check, Download, Plus, Trash2 } from 'lucide-react';

export function EnvFileGenerator() {
  const [envType, setEnvType] = useState<'.env.local' | '.env.staging' | '.env.production'>('.env.local');
  const [pairs, setPairs] = useState<Array<{ key: string; value: string; comment: string }>>([
    { key: 'PORT', value: '3000', comment: 'Server listener port' },
    { key: 'NODE_ENV', value: 'development', comment: 'Runtime environment mode' },
    { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/mydb', comment: 'Primary database connection string' },
    { key: 'GEMINI_API_KEY', value: 'AIzaSyA_ExampleSecretKey123', comment: 'AI Studio Gemini API key' },
  ]);
  const [copied, setCopied] = useState(false);

  const addPair = () => {
    setPairs([...pairs, { key: 'NEW_SECRET_VAR', value: '', comment: 'Description' }]);
  };

  const removePair = (idx: number) => {
    setPairs(pairs.filter((_, i) => i !== idx));
  };

  const updatePair = (idx: number, field: string, val: string) => {
    const updated = [...pairs];
    (updated[idx] as any)[field] = val;
    setPairs(updated);
  };

  const formattedOutput = `# Environment Config: ${envType}\n# Generated via SmartToolHub\n\n` +
    pairs.map(p => (p.comment ? `# ${p.comment}\n` : '') + `${p.key}=${p.value.includes(' ') ? `"${p.value}"` : p.value}`).join('\n\n');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Shield size={14} /> Environment Variable Config Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Environment Variable (.env) Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Generate clean, formatted, secure .env configuration files for local development, staging, and production with validation and secret keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Config Variables</span>
            <button
              onClick={addPair}
              className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Variable
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {pairs.map((p, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={p.key}
                    placeholder="VAR_KEY"
                    onChange={(e) => updatePair(idx, 'key', e.target.value.toUpperCase().replace(/[^A_Z0-9_]/g, ''))}
                    className="w-1/3 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono font-bold text-emerald-600"
                  />
                  <input
                    type="text"
                    value={p.value}
                    placeholder="value"
                    onChange={(e) => updatePair(idx, 'value', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                  />
                  <button
                    onClick={() => removePair(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={p.comment}
                  placeholder="Optional comment description"
                  onChange={(e) => updatePair(idx, 'comment', e.target.value)}
                  className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] text-slate-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Formatted Output */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Preview ({envType})</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(formattedOutput);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-emerald-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy .env'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-emerald-400 p-4 rounded-xl overflow-x-auto flex-1 min-h-[260px]">
            {formattedOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
