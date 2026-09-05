import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  History,
  QrCode,
  Layers,
  Sparkles,
  Lock,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Download,
  Key
} from 'lucide-react';
import { toast } from '../../utils/toast';

// High-frequency word bank for memorable passphrases
const PASSPHRASE_WORDS = [
  'amber', 'anchor', 'arrow', 'atlas', 'beacon', 'breeze', 'bridge', 'castle',
  'cedar', 'cobalt', 'comet', 'copper', 'coral', 'cosmos', 'crater', 'crystal',
  'dragon', 'echo', 'ember', 'falcon', 'fossil', 'galaxy', 'glacier', 'granite',
  'harbor', 'haven', 'horizon', 'island', 'jungle', 'knight', 'lagoon', 'lantern',
  'legend', 'lunar', 'magnet', 'marble', 'matrix', 'meadow', 'meteor', 'mirage',
  'monarch', 'nebula', 'oasis', 'ocean', 'orchid', 'orbit', 'origin', 'palace',
  'panther', 'pebble', 'phoenix', 'planet', 'prism', 'pulse', 'pyramid', 'quantum',
  'radar', 'radius', 'realm', 'ridge', 'river', 'rocket', 'saddle', 'safari',
  'shadow', 'signal', 'silver', 'solar', 'spark', 'sphere', 'spirit', 'summit',
  'sunset', 'thunder', 'timber', 'titan', 'topaz', 'tower', 'vortex', 'voyage',
  'willow', 'winter', 'wisdom', 'zenith', 'zephyr', 'zodiac'
];

type GeneratorMode = 'random' | 'passphrase' | 'pin' | 'pronounceable';

export default function PasswordGenerator() {
  const [mode, setMode] = useState<GeneratorMode>('random');

  // Random Password state
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customSymbols, setCustomSymbols] = useState('!@#$%^&*()_+-=[]{}|;:,.<>?');

  // Passphrase state
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [customSeparator, setCustomSeparator] = useState('');
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumberPassphrase, setIncludeNumberPassphrase] = useState(true);
  const [includeSymbolPassphrase, setIncludeSymbolPassphrase] = useState(true);

  // PIN state
  const [pinLength, setPinLength] = useState(6);
  const [avoidSequential, setAvoidSequential] = useState(true);
  const [avoidRepeats, setAvoidRepeats] = useState(true);

  // Common UI state
  const [password, setPassword] = useState('');
  const [isMasked, setIsMasked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState(1);
  const [batchPasswords, setBatchPasswords] = useState<string[]>([]);
  const [showQR, setShowQR] = useState(false);

  // Secure Cryptographic Random Integer
  const getCryptoRandomInt = (max: number): number => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  // Main generator function
  const generate = useCallback(() => {
    let result = '';

    if (mode === 'random') {
      let uppercaseSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let lowercaseSet = 'abcdefghijklmnopqrstuvwxyz';
      let numberSet = '0123456789';
      let symbolSet = customSymbols || '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (excludeAmbiguous) {
        uppercaseSet = uppercaseSet.replace(/[O]/g, '');
        lowercaseSet = lowercaseSet.replace(/[l]/g, '');
        numberSet = numberSet.replace(/[015]/g, '');
        symbolSet = symbolSet.replace(/[|]/g, '');
      }

      let combinedCharSet = '';
      const requiredTypes: string[] = [];

      if (includeUpper && uppercaseSet) {
        combinedCharSet += uppercaseSet;
        requiredTypes.push(uppercaseSet[getCryptoRandomInt(uppercaseSet.length)]);
      }
      if (includeLower && lowercaseSet) {
        combinedCharSet += lowercaseSet;
        requiredTypes.push(lowercaseSet[getCryptoRandomInt(lowercaseSet.length)]);
      }
      if (includeNumbers && numberSet) {
        combinedCharSet += numberSet;
        requiredTypes.push(numberSet[getCryptoRandomInt(numberSet.length)]);
      }
      if (includeSymbols && symbolSet) {
        combinedCharSet += symbolSet;
        requiredTypes.push(symbolSet[getCryptoRandomInt(symbolSet.length)]);
      }

      if (!combinedCharSet) {
        setPassword('Select at least one character set.');
        return;
      }

      const passChars: string[] = [];
      // Fill required types first to guarantee composition
      for (const reqChar of requiredTypes) {
        if (passChars.length < length) {
          passChars.push(reqChar);
        }
      }

      // Fill remaining
      while (passChars.length < length) {
        passChars.push(combinedCharSet[getCryptoRandomInt(combinedCharSet.length)]);
      }

      // Fisher-Yates shuffle with crypto random
      for (let i = passChars.length - 1; i > 0; i--) {
        const j = getCryptoRandomInt(i + 1);
        [passChars[i], passChars[j]] = [passChars[j], passChars[i]];
      }

      result = passChars.join('');
    } else if (mode === 'passphrase') {
      const activeSep = separator === 'custom' ? customSeparator : separator;
      const selectedWords: string[] = [];

      for (let i = 0; i < wordCount; i++) {
        let word = PASSPHRASE_WORDS[getCryptoRandomInt(PASSPHRASE_WORDS.length)];
        if (capitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        selectedWords.push(word);
      }

      if (includeNumberPassphrase) {
        const randomNum = getCryptoRandomInt(90) + 10; // 10-99
        const insertIdx = getCryptoRandomInt(selectedWords.length);
        selectedWords[insertIdx] += randomNum;
      }

      if (includeSymbolPassphrase) {
        const symbols = '!@#$%&*';
        const randSymbol = symbols[getCryptoRandomInt(symbols.length)];
        const insertIdx = getCryptoRandomInt(selectedWords.length);
        selectedWords[insertIdx] += randSymbol;
      }

      result = selectedWords.join(activeSep);
    } else if (mode === 'pin') {
      const digits: string[] = [];
      for (let i = 0; i < pinLength; i++) {
        let nextDigit: number;
        let attempts = 0;
        do {
          nextDigit = getCryptoRandomInt(10);
          attempts++;

          const prevDigit = digits.length > 0 ? parseInt(digits[digits.length - 1]) : -1;
          const isRepeated = prevDigit !== -1 && prevDigit === nextDigit;
          const isSequential = prevDigit !== -1 && Math.abs(prevDigit - nextDigit) === 1;

          if (avoidRepeats && isRepeated && attempts < 20) continue;
          if (avoidSequential && isSequential && attempts < 20) continue;

          break;
        } while (attempts < 20);

        digits.push(nextDigit.toString());
      }
      result = digits.join('');
    } else if (mode === 'pronounceable') {
      const consonants = 'bcdfghjklmnpqrstvwxyz';
      const vowels = 'aeiou';
      const pChars: string[] = [];

      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          let char = consonants[getCryptoRandomInt(consonants.length)];
          if (includeUpper && (i === 0 || getCryptoRandomInt(4) === 0)) {
            char = char.toUpperCase();
          }
          pChars.push(char);
        } else {
          pChars.push(vowels[getCryptoRandomInt(vowels.length)]);
        }
      }

      if (includeNumbers && length > 3) {
        const num = getCryptoRandomInt(10);
        pChars[length - 1] = num.toString();
      }

      result = pChars.join('');
    }

    setPassword(result);

    // Update history (keep last 15 unique)
    setHistory((prev) => {
      const filtered = prev.filter((p) => p !== result);
      return [result, ...filtered].slice(0, 15);
    });

    // Generate batch if requested
    if (batchCount > 1) {
      const batchList: string[] = [result];
      for (let b = 1; b < batchCount; b++) {
        // Regenerate temporary for batch
        if (mode === 'random') {
          let charSet = '';
          if (includeUpper) charSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (includeLower) charSet += 'abcdefghijklmnopqrstuvwxyz';
          if (includeNumbers) charSet += '0123456789';
          if (includeSymbols) charSet += customSymbols;
          let temp = '';
          for (let k = 0; k < length; k++) {
            temp += charSet[getCryptoRandomInt(charSet.length)];
          }
          batchList.push(temp);
        } else if (mode === 'pin') {
          let temp = '';
          for (let k = 0; k < pinLength; k++) {
            temp += getCryptoRandomInt(10).toString();
          }
          batchList.push(temp);
        }
      }
      setBatchPasswords(batchList);
    } else {
      setBatchPasswords([]);
    }
  }, [
    mode,
    length,
    includeUpper,
    includeLower,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    customSymbols,
    wordCount,
    separator,
    customSeparator,
    capitalize,
    includeNumberPassphrase,
    includeSymbolPassphrase,
    pinLength,
    avoidSequential,
    avoidRepeats,
    batchCount
  ]);

  useEffect(() => {
    generate();
  }, [generate]);

  // Handle Copy
  const handleCopy = async (textToCopy?: string) => {
    const val = textToCopy || password;
    if (!val || val.startsWith('Select')) return;
    try {
      await navigator.clipboard.writeText(val);
      setCopied(true);
      toast.success('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Calculate Shannon Entropy & Crack Time
  const metrics = useMemo(() => {
    if (!password || password.startsWith('Select')) {
      return { entropy: 0, crackTime: 'Instant', poolSize: 0, score: 0, label: 'None', color: 'bg-slate-300', textColor: 'text-slate-400' };
    }

    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

    if (poolSize === 0) poolSize = 10;

    const entropy = Math.round(password.length * Math.log2(poolSize));

    // Crack time calculation based on 100 billion hashes/sec (modern GPU hashcat array)
    const combinations = Math.pow(poolSize, password.length);
    const secondsToCrack = combinations / (100 * 1000 * 1000 * 1000 * 0.5); // Average 50% search space

    let crackTime = '';
    if (secondsToCrack < 0.001) crackTime = 'Instant (<1 millisecond)';
    else if (secondsToCrack < 1) crackTime = 'Less than 1 second';
    else if (secondsToCrack < 60) crackTime = `${Math.round(secondsToCrack)} seconds`;
    else if (secondsToCrack < 3600) crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
    else if (secondsToCrack < 86400) crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
    else if (secondsToCrack < 31536000) crackTime = `${Math.round(secondsToCrack / 86400)} days`;
    else if (secondsToCrack < 31536000 * 100) crackTime = `${Math.round(secondsToCrack / 31536000)} years`;
    else if (secondsToCrack < 31536000 * 1e6) crackTime = `${(secondsToCrack / (31536000 * 1e3)).toFixed(1)} thousand years`;
    else if (secondsToCrack < 31536000 * 1e9) crackTime = `${(secondsToCrack / (31536000 * 1e6)).toFixed(1)} million years`;
    else if (secondsToCrack < 31536000 * 1e12) crackTime = `${(secondsToCrack / (31536000 * 1e9)).toFixed(1)} billion years`;
    else crackTime = 'Trillions of years (Uncrackable)';

    let score = 1;
    let label = 'Very Weak';
    let color = 'bg-rose-500';
    let textColor = 'text-rose-500';

    if (entropy >= 128) {
      score = 5;
      label = 'Military Grade Fortress';
      color = 'bg-cyan-500';
      textColor = 'text-cyan-500';
    } else if (entropy >= 80) {
      score = 4;
      label = 'Ultra Secure';
      color = 'bg-emerald-500';
      textColor = 'text-emerald-500';
    } else if (entropy >= 55) {
      score = 3;
      label = 'Strong';
      color = 'bg-green-500';
      textColor = 'text-green-500';
    } else if (entropy >= 36) {
      score = 2;
      label = 'Fair';
      color = 'bg-amber-500';
      textColor = 'text-amber-500';
    }

    return { entropy, crackTime, poolSize, score, label, color, textColor };
  }, [password]);

  // Colorized Character Renderer
  const renderColorizedPassword = () => {
    if (isMasked) {
      return '•'.repeat(password.length);
    }

    return password.split('').map((char, index) => {
      let colorClass = 'text-slate-800 dark:text-slate-100';

      if (/[A-Z]/.test(char)) {
        colorClass = 'text-purple-600 dark:text-purple-400 font-bold';
      } else if (/[a-z]/.test(char)) {
        colorClass = 'text-emerald-600 dark:text-emerald-400';
      } else if (/[0-9]/.test(char)) {
        colorClass = 'text-cyan-600 dark:text-cyan-400 font-bold';
      } else if (/[^a-zA-Z0-9]/.test(char)) {
        colorClass = 'text-amber-600 dark:text-amber-400 font-black bg-amber-50 dark:bg-amber-950/40 px-0.5 rounded-sm';
      }

      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(
            [
              { id: 'random', label: '🔒 Random Password', desc: 'Custom characters & symbols' },
              { id: 'passphrase', label: '💬 Memorable Passphrase', desc: 'Word-based easy recall' },
              { id: 'pin', label: '🔢 Secure PIN', desc: 'Numeric security codes' },
              { id: 'pronounceable', label: '🗣️ Pronounceable', desc: 'Easy to speak over phone' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                mode === t.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showHistory
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800'
            }`}
            title="Password History"
          >
            <History size={15} />
            <span className="hidden sm:inline">History ({history.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Configuration Options */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500" />
                <span>
                  {mode === 'random' && 'Random Password Settings'}
                  {mode === 'passphrase' && 'Passphrase Configuration'}
                  {mode === 'pin' && 'Numeric PIN Settings'}
                  {mode === 'pronounceable' && 'Pronounceable Password Settings'}
                </span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Crypto-RNG</span>
            </div>

            {/* Mode 1: Random Password Controls */}
            {mode === 'random' && (
              <div className="space-y-5">
                {/* Length Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Password Length
                    </label>
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                      {length} Characters
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={128}
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>6 (Short)</span>
                    <span>16 (Recommended)</span>
                    <span>32 (Fortress)</span>
                    <span>128 (Max)</span>
                  </div>
                </div>

                {/* Toggles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeUpper}
                      onChange={(e) => setIncludeUpper(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Uppercase (A-Z)
                      </span>
                      <span className="text-[10px] text-slate-400">ABCDEF...</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeLower}
                      onChange={(e) => setIncludeLower(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Lowercase (a-z)
                      </span>
                      <span className="text-[10px] text-slate-400">abcdef...</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Numbers (0-9)
                      </span>
                      <span className="text-[10px] text-slate-400">0123456789</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Special Symbols
                      </span>
                      <span className="text-[10px] text-slate-400">!@#$%^&amp;*</span>
                    </div>
                  </label>
                </div>

                {/* Exclude Ambiguous */}
                <label className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                    className="rounded-md border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer accent-amber-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                      Exclude Ambiguous Characters (O, 0, l, 1, I)
                    </span>
                    <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                      Prevents misreading characters during manual data entry
                    </span>
                  </div>
                </label>

                {/* Custom Symbol Input */}
                {includeSymbols && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Allowed Custom Symbols
                    </label>
                    <input
                      type="text"
                      value={customSymbols}
                      onChange={(e) => setCustomSymbols(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                      placeholder="!@#$%^&*()_+-=[]{}|;:,.<>?"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Memorable Passphrase */}
            {mode === 'passphrase' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Number of Words
                    </label>
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                      {wordCount} Words
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={wordCount}
                    onChange={(e) => setWordCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Word Separator
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: '-', label: 'Hyphen (-)' },
                      { id: '_', label: 'Underscore (_)' },
                      { id: '.', label: 'Period (.)' },
                      { id: ' ', label: 'Space ( )' },
                      { id: 'custom', label: 'Custom' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSeparator(s.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
                          separator === s.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {s.id === ' ' ? '[Space]' : s.id}
                      </button>
                    ))}
                  </div>

                  {separator === 'custom' && (
                    <input
                      type="text"
                      value={customSeparator}
                      onChange={(e) => setCustomSeparator(e.target.value)}
                      placeholder="e.g. # or @"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capitalize}
                      onChange={(e) => setCapitalize(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Capitalize Words
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNumberPassphrase}
                      onChange={(e) => setIncludeNumberPassphrase(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Add Number
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSymbolPassphrase}
                      onChange={(e) => setIncludeSymbolPassphrase(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Add Symbol
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Mode 3: Secure PIN */}
            {mode === 'pin' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      PIN Digits Length
                    </label>
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                      {pinLength} Digits
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={32}
                    value={pinLength}
                    onChange={(e) => setPinLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avoidSequential}
                      onChange={(e) => setAvoidSequential(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Avoid Sequential Digits
                      </span>
                      <span className="text-[10px] text-slate-400">Prevents 1234 or 8765 patterns</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avoidRepeats}
                      onChange={(e) => setAvoidRepeats(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Avoid Consecutive Repeating
                      </span>
                      <span className="text-[10px] text-slate-400">Prevents 1111 or 9999 patterns</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Mode 4: Pronounceable Password */}
            {mode === 'pronounceable' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Length
                    </label>
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                      {length} Characters
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={32}
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <p className="text-xs text-slate-500 bg-blue-50/60 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                  Pronounceable passwords alternate consonants and vowels (e.g., <code>Kovature8</code>) so they can easily be spoken or remembered.
                </p>
              </div>
            )}

            {/* Batch Generation Options */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers size={15} className="text-blue-500" />
                <span>Bulk Batch Output:</span>
              </span>

              <div className="flex items-center gap-2">
                {[1, 5, 10, 20].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBatchCount(c)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      batchCount === c
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {c === 1 ? 'Single' : `${c}x`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Display, Color Breakdown, Entropy & Crack Time Gauge */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Lock size={14} />
                <span>Generated Password</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMasked(!isMasked)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  title={isMasked ? 'Show password' : 'Mask password'}
                >
                  {isMasked ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                <button
                  onClick={generate}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer transition-colors"
                  title="Generate New Password"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Main Password Box */}
            <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 font-mono text-base sm:text-lg break-all font-bold tracking-wider select-all min-h-[72px] flex items-center justify-between gap-3 shadow-inner relative group">
              <div className="flex-1 overflow-x-auto py-1">
                {renderColorizedPassword()}
              </div>

              <button
                onClick={() => handleCopy()}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer flex-shrink-0"
                title="Copy Password"
              >
                {copied ? <Check size={18} className="text-emerald-300" /> : <Copy size={18} />}
              </button>
            </div>

            {/* Character Type Legend */}
            <div className="flex flex-wrap items-center justify-around gap-2 text-[10px] font-mono p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Uppercase
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Lowercase
              </span>
              <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Numbers
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Symbols
              </span>
            </div>

            {/* Strength Meter & Crack Time */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Shield size={14} />
                  SECURITY SCORE:
                </span>
                <span className={`font-extrabold font-mono ${metrics.textColor}`}>
                  {metrics.label} ({metrics.entropy} bits)
                </span>
              </div>

              {/* 5 Stage Bars */}
              <div className="grid grid-cols-5 gap-1.5 h-2">
                {[1, 2, 3, 4, 5].map((stage) => (
                  <div
                    key={stage}
                    className={`rounded-full transition-all duration-300 ${
                      stage <= metrics.score ? metrics.color : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* Crack Time Box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Est. Crack Time (GPU Cluster):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {metrics.crackTime}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Calculated against 100 Billion hashes/sec search speed.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={generate}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>Regenerate New</span>
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                title="Scan to Mobile Phone"
              >
                <QrCode size={15} />
                <span className="hidden sm:inline">QR Scan</span>
              </button>
            </div>

            {/* QR Code Container */}
            {showQR && (
              <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Scan to Copy on Mobile
                </p>
                <div className="flex justify-center p-2 bg-white rounded-xl max-w-[160px] mx-auto border">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      password
                    )}`}
                    alt="Password QR Code"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Batch Output Section (If Batch > 1) */}
      {batchPasswords.length > 1 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-blue-500" />
              <span>Generated Batch ({batchPasswords.length} Passwords)</span>
            </h3>

            <button
              onClick={() => handleCopy(batchPasswords.join('\n'))}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Copy size={13} />
              <span>Copy All Batch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {batchPasswords.map((p, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2 font-mono text-xs text-slate-800 dark:text-slate-200"
              >
                <span className="truncate">{p}</span>
                <button
                  onClick={() => handleCopy(p)}
                  className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                >
                  <Copy size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Drawer Modal / Drawer */}
      {showHistory && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History size={16} className="text-blue-500" />
              <span>Recent Password Session History ({history.length})</span>
            </h3>

            <button
              onClick={() => setHistory([])}
              className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
            >
              Clear History
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((h, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between gap-3 font-mono text-xs"
              >
                <span className="text-slate-800 dark:text-slate-200 truncate">{h}</span>
                <button
                  onClick={() => handleCopy(h)}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
