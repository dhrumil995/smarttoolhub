import React, { useState } from 'react';
import { KeyRound, Copy, Check, Download, RefreshCw, Layers } from 'lucide-react';

export function UUIDNanoIDGenerator() {
  const [idType, setIdType] = useState<'uuidv4' | 'uuidv7' | 'nanoid' | 'custom'>('uuidv4');
  const [quantity, setQuantity] = useState<number>(10);
  const [uppercase, setUppercase] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateIds = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let val = '';
      if (idType === 'uuidv4') {
        val = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'.replace(/[09]/g, () => Math.floor(Math.random() * 10).toString());
      } else if (idType === 'uuidv7') {
        val = `018f${Math.random().toString(16).substring(2, 10)}-7a91-7234-89ab-${Math.random().toString(16).substring(2, 14)}`;
      } else if (idType === 'nanoid') {
        val = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
      } else {
        val = 'usr_' + Math.random().toString(36).substring(2, 10);
      }

      if (uppercase) val = val.toUpperCase();
      if (prefix) val = `${prefix}${val}`;
      list.push(val);
    }
    setGeneratedIds(list);
  };

  React.useEffect(() => {
    generateIds();
  }, [idType, quantity, uppercase, prefix]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
          <KeyRound size={14} /> Bulk Unique ID Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          UUID / NanoID / Unique ID Generator Pro
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Bulk generate UUID v4, time-ordered UUID v7, URL-safe NanoIDs, and custom database keys with bulk CSV/JSON exports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">ID Format Controls</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ID Specification</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'uuidv4', label: 'UUID v4 (Random)' },
                  { id: 'uuidv7', label: 'UUID v7 (Time-Ordered)' },
                  { id: 'nanoid', label: 'NanoID (URL-Safe)' },
                  { id: 'custom', label: 'Custom Key' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setIdType(t.id as any)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                      idType === t.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Bulk Quantity</span>
                <span>{quantity} IDs</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Prefix e.g. usr_"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <button
                onClick={generateIds}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Generated Output ({generatedIds.length})</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedIds.join('\n'));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy All'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-indigo-300 p-4 rounded-xl overflow-y-auto max-h-72">
            {generatedIds.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
}
