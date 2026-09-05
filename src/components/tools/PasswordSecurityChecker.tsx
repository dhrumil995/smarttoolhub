import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, KeyRound, ShieldAlert, Sparkles, Lock } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function PasswordSecurityChecker() {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += charset[array[i] % charset.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  // Entropy Calculation & Crack Time Estimation
  const calculateEntropy = (pwd: string) => {
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;

    if (pool === 0 || pwd.length === 0) return { entropy: 0, score: 'Weak', crackTime: 'Instant' };

    const entropy = Math.round(pwd.length * Math.log2(pool));

    let score = 'Weak';
    let crackTime = 'A few seconds';

    if (entropy < 40) {
      score = 'Very Weak';
      crackTime = 'Instant';
    } else if (entropy < 60) {
      score = 'Moderate';
      crackTime = 'Few hours';
    } else if (entropy < 80) {
      score = 'Strong';
      crackTime = 'Several years';
    } else {
      score = 'Unbreakable';
      crackTime = 'Trillions of years';
    }

    return { entropy, score, crackTime };
  };

  const { entropy, score, crackTime } = calculateEntropy(password);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-extrabold uppercase tracking-widest border border-emerald-500/20">
          <ShieldCheck size={14} /> Cybersecurity Tool
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Secure Password Generator & Strength Auditor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Generate cryptographically secure passwords with instant entropy calculation and estimated brute-force crack resistance.
        </p>
      </div>

      <AdSenseSlot slot="password-gen-top" />

      {/* Password Display Box */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full pl-4 pr-24 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-widest focus:outline-none"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              onClick={generatePassword}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Regenerate"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleCopy}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider ${
              entropy > 80 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
              entropy > 60 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
              entropy > 40 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
              'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {score} ({entropy} Bits Entropy)
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                entropy > 80 ? 'bg-emerald-500' :
                entropy > 60 ? 'bg-blue-500' :
                entropy > 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (entropy / 100) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span>Estimated Brute-force crack time:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{crackTime}</span>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Password Length: {length} Characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {[
            { label: 'Uppercase (A-Z)', value: useUppercase, setter: setUseUppercase },
            { label: 'Lowercase (a-z)', value: useLowercase, setter: setUseLowercase },
            { label: 'Numbers (0-9)', value: useNumbers, setter: setUseNumbers },
            { label: 'Symbols (!@#$)', value: useSymbols, setter: setUseSymbols },
          ].map((item, idx) => (
            <label
              key={idx}
              className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all"
            >
              <input
                type="checkbox"
                checked={item.value}
                onChange={(e) => item.setter(e.target.checked)}
                className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
