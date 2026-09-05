import React, { useState } from 'react';
import { Copy, Trash2, ArrowUpDown, AlertCircle, Check } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    if (!input) {
      setError("Please enter some text to encode.");
      return;
    }
    try {
      // Use standard btoa with UTF-8 support
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError(null);
    } catch (err: any) {
      setError("Failed to encode standard UTF-8 text.");
    }
  };

  const handleDecode = () => {
    if (!input) {
      setError("Please enter some Base64 text to decode.");
      return;
    }
    try {
      const trimmed = input.trim();
      const decoded = decodeURIComponent(escape(atob(trimmed)));
      setOutput(decoded);
      setError(null);
    } catch (err: any) {
      setError("Invalid Base64 string. Please make sure the string is a valid Base64 format.");
    }
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setOutput('');
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Quick actions for text Base64 processing:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEncode}
            className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
          >
            Encode Plain Text
          </button>
          <button
            onClick={handleDecode}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
          >
            Decode Base64
          </button>
          <button
            onClick={handleSwap}
            disabled={!output}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              output
                ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-800/30 dark:text-gray-600 cursor-not-allowed'
            }`}
            title="Use output as next input"
          >
            <ArrowUpDown size={14} />
            Swap Input/Output
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg transition-colors flex items-center gap-1"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Text Box */}
        <div className="flex flex-col h-[350px]">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-xl border-t border-x border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Source String
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste standard text here to encode, or paste Base64 text here to decode..."
            className="flex-1 p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 resize-none h-full"
          />
        </div>

        {/* Output Text Box */}
        <div className="flex flex-col h-[350px]">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-xl border-t border-x border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Processed Output
            </span>
            {output && (
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md transition-colors flex items-center gap-1 text-xs"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="relative flex-1 rounded-b-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
            {error && (
              <div className="absolute top-4 left-4 right-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-3 rounded-lg flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs font-mono">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase block mb-1">Conversion Error</span>
                  {error}
                </div>
              </div>
            )}
            <textarea
              readOnly
              value={output}
              placeholder={error ? "" : "Click Encode or Decode button to display processing results."}
              className="w-full h-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-200 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
