import React, { useState, useMemo } from 'react';
import {
  Code,
  Check,
  Copy,
  AlertCircle,
  Sparkles,
  Replace,
  HelpCircle,
  FileText,
  Search,
  BookOpen,
  Zap,
  Info
} from 'lucide-react';
import { toast } from '../../utils/toast';

interface Preset {
  label: string;
  regex: string;
  flags: string;
  desc: string;
  sample: string;
}

export default function RegexTesterPro() {
  const [pattern, setPattern] = useState('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState(
    'Contact team at support@smarttoolhub.net or john.doe@company.org or sales@domain.co.uk'
  );
  const [replaceString, setReplaceString] = useState('***HIDDEN EMAIL ($2)***');
  const [showReplace, setShowReplace] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [copiedPattern, setCopiedPattern] = useState(false);
  const [copiedReplaced, setCopiedReplaced] = useState(false);

  const presets: Preset[] = [
    {
      label: 'Email Capture',
      regex: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
      flags: 'g',
      desc: 'Matches email addresses and splits username & domain into groups',
      sample: 'Hello user@example.com and contact@domain.org'
    },
    {
      label: 'URL / Web Links',
      regex: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      flags: 'gi',
      desc: 'Matches HTTP and HTTPS website links',
      sample: 'Visit https://smarttoolhub.net or http://github.com/aistudio'
    },
    {
      label: 'IPv4 Address',
      regex: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      flags: 'g',
      desc: 'Validates standard IPv4 addresses (0.0.0.0 - 255.255.255.255)',
      sample: 'Server IP is 192.168.1.1 and gateway 10.0.0.254'
    },
    {
      label: 'UUID v4',
      regex: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
      flags: 'gi',
      desc: 'Matches Universally Unique Identifiers (Version 4)',
      sample: 'Session key: 123e4567-e89b-42d3-a456-426614174000'
    },
    {
      label: 'Date (YYYY-MM-DD)',
      regex: '\\b(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b',
      flags: 'g',
      desc: 'Matches ISO 8601 formatted dates',
      sample: 'Project started on 2026-08-07 and ends on 2026-12-31'
    },
    {
      label: 'Hex Color Code',
      regex: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b',
      flags: 'g',
      desc: 'Matches 3-digit and 6-digit hex color codes',
      sample: 'Theme palette: #0f172a, #3b82f6, and #fff'
    },
    {
      label: 'Phone Number (Intl)',
      regex: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}',
      flags: 'g',
      desc: 'Matches phone numbers with optional country code',
      sample: 'Call +1 (555) 019-2834 or +44 20 7946 0912'
    }
  ];

  // Regex compilation & detail matching logic
  const analysis = useMemo(() => {
    if (!pattern) return { matches: [], error: null, replacedText: testText };

    try {
      const re = new RegExp(pattern, flags);
      const matchesList: { match: string; index: number; groups: string[] }[] = [];

      if (flags.includes('g')) {
        let match;
        // Safety guard against infinite loops on zero-length matches
        let maxLoop = 1000;
        while ((match = re.exec(testText)) !== null && maxLoop-- > 0) {
          matchesList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match[0].length === 0) re.lastIndex++;
        }
      } else {
        const match = re.exec(testText);
        if (match) {
          matchesList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      const replacedText = testText.replace(re, replaceString);

      return { matches: matchesList, error: null, replacedText };
    } catch (err: any) {
      return { matches: [], error: err.message || 'Invalid Regular Expression syntax', replacedText: testText };
    }
  }, [pattern, flags, testText, replaceString]);

  const handleCopyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopiedPattern(true);
    toast.success('Regex pattern copied to clipboard!');
    setTimeout(() => setCopiedPattern(false), 2000);
  };

  const handleCopyReplaced = () => {
    navigator.clipboard.writeText(analysis.replacedText);
    setCopiedReplaced(true);
    toast.success('Substituted text copied!');
    setTimeout(() => setCopiedReplaced(false), 2000);
  };

  // Flag Toggles
  const toggleFlag = (flagChar: string) => {
    if (flags.includes(flagChar)) {
      setFlags(flags.replace(flagChar, ''));
    } else {
      setFlags(flags + flagChar);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Presets & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Presets:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPattern(p.regex);
                setFlags(p.flags);
                setTestText(p.sample);
                toast.success(`Loaded preset: ${p.label}`);
              }}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowReplace(!showReplace)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showReplace
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Replace size={14} />
            <span>Replace Mode</span>
          </button>

          <button
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showCheatsheet
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <BookOpen size={14} />
            <span>Cheatsheet</span>
          </button>
        </div>
      </div>

      {/* Main Pattern Bar */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Regex Expression &amp; Flags</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">
              Matches: {analysis.matches.length}
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-mono font-bold text-lg sm:text-xl">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. ([a-z]+)@([a-z]+)"
              className="flex-1 min-w-[200px] px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-slate-400 font-mono font-bold text-lg sm:text-xl">/</span>

            {/* Flag Toggles */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {[
                { char: 'g', label: 'Global (g)' },
                { char: 'i', label: 'Case Insensitive (i)' },
                { char: 'm', label: 'Multiline (m)' },
                { char: 's', label: 'Dot All (s)' },
                { char: 'u', label: 'Unicode (u)' }
              ].map((f) => (
                <button
                  key={f.char}
                  onClick={() => toggleFlag(f.char)}
                  className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer transition-colors ${
                    flags.includes(f.char)
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title={f.label}
                >
                  {f.char}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyPattern}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {copiedPattern ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedPattern ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {analysis.error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            <AlertCircle size={16} className="shrink-0" />
            <span>{analysis.error}</span>
          </div>
        )}
      </div>

      {/* Replace Substitution Panel (if enabled) */}
      {showReplace && (
        <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <Replace size={15} />
              <span>Regex Substitution / Replacement</span>
            </h4>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
              Use $1, $2 for capture group references
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replaceString}
              onChange={(e) => setReplaceString(e.target.value)}
              placeholder="e.g. *** or REPLACED ($1)"
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs font-bold text-slate-900 dark:text-white"
            />
            <button
              onClick={handleCopyReplaced}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedReplaced ? <Check size={14} /> : <Copy size={14} />}
              <span>Copy Substituted Text</span>
            </button>
          </div>

          <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all whitespace-pre-wrap">
            {analysis.replacedText}
          </div>
        </div>
      )}

      {/* Main Grid: Input Test String vs Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Text Box */}
        <div className="lg:col-span-6 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Test Input Text
          </label>
          <textarea
            rows={12}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Paste text here to run instant regex matching..."
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-[380px]"
          />
        </div>

        {/* Matches & Group Details Table */}
        <div className="lg:col-span-6 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
            <span>Match Capture Breakdown</span>
            <span>{analysis.matches.length} Matches</span>
          </label>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 h-[380px] overflow-y-auto space-y-3">
            {analysis.matches.length > 0 ? (
              analysis.matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold border-b border-slate-200/50 dark:border-slate-800 pb-1.5">
                    <span className="truncate">
                      Match #{idx + 1}: "{m.match}"
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Index: {m.index}
                    </span>
                  </div>

                  {m.groups.length > 0 ? (
                    <div className="space-y-1 pt-1">
                      {m.groups.map((g, gIdx) => (
                        <div key={gIdx} className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Group ${gIdx + 1}:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            "{g}"
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No capture groups defined</p>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Search size={36} className="stroke-[1.5]" />
                <p className="text-xs">No regex matches found in test string.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cheatsheet Quick Reference Modal / Card */}
      {showCheatsheet && (
        <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <BookOpen size={16} />
              <span>Regex Quick Reference Cheatsheet</span>
            </h4>
            <button
              onClick={() => setShowCheatsheet(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-blue-400 font-bold block mb-1">Character Classes</span>
              <p>
                <code className="text-emerald-400">\d</code> - Digit (0-9)
              </p>
              <p>
                <code className="text-emerald-400">\w</code> - Word char (a-z, 0-9, _)
              </p>
              <p>
                <code className="text-emerald-400">\s</code> - Whitespace
              </p>
              <p>
                <code className="text-emerald-400">.</code> - Any char except newline
              </p>
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-blue-400 font-bold block mb-1">Quantifiers</span>
              <p>
                <code className="text-emerald-400">*</code> - 0 or more
              </p>
              <p>
                <code className="text-emerald-400">+</code> - 1 or more
              </p>
              <p>
                <code className="text-emerald-400">?</code> - 0 or 1 (Optional)
              </p>
              <p>
                <code className="text-emerald-400">&#123;n,m&#125;</code> - Between n and m
              </p>
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-blue-400 font-bold block mb-1">Anchors</span>
              <p>
                <code className="text-emerald-400">^</code> - Start of string/line
              </p>
              <p>
                <code className="text-emerald-400">$</code> - End of string/line
              </p>
              <p>
                <code className="text-emerald-400">\b</code> - Word boundary
              </p>
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-blue-400 font-bold block mb-1">Groups &amp; Lookarounds</span>
              <p>
                <code className="text-emerald-400">(...)</code> - Capture group
              </p>
              <p>
                <code className="text-emerald-400">(?:...)</code> - Non-capturing group
              </p>
              <p>
                <code className="text-emerald-400">(?=...)</code> - Positive lookahead
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
