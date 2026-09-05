import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, Calendar, ArrowRightLeft, Globe, Play, Pause, RefreshCw, Zap } from 'lucide-react';

export function TimestampEpochConverter() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState(true);
  const [inputTimestamp, setInputTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [inputDateString, setInputDateString] = useState<string>(new Date().toISOString().slice(0, 16));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live epoch clock ticking
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Parse input timestamp to Date
  const parseTimestamp = (val: string): Date => {
    const num = Number(val.trim());
    if (isNaN(num)) return new Date();
    // If greater than 10 digits, assume milliseconds
    if (val.trim().length > 11) {
      return new Date(num);
    }
    return new Date(num * 1000);
  };

  const parsedDate = parseTimestamp(inputTimestamp);
  const isValidDate = !isNaN(parsedDate.getTime());

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConvertDateToEpoch = () => {
    const d = new Date(inputDateString);
    if (!isNaN(d.getTime())) {
      setInputTimestamp(Math.floor(d.getTime() / 1000).toString());
    }
  };

  const timezones = [
    { label: 'UTC (Coordinated Universal Time)', zone: 'UTC' },
    { label: 'New York (EST/EDT)', zone: 'America/New_York' },
    { label: 'London (GMT/BST)', zone: 'Europe/London' },
    { label: 'Berlin / Paris (CET/CEST)', zone: 'Europe/Berlin' },
    { label: 'India (IST +05:30)', zone: 'Asia/Kolkata' },
    { label: 'Tokyo (JST +09:00)', zone: 'Asia/Tokyo' },
    { label: 'Sydney (AEST +10:00)', zone: 'Australia/Sydney' },
    { label: 'San Francisco (PST/PDT)', zone: 'America/Los_Angeles' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold">
          <Clock size={14} /> Ultra Pro Max Time Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Unix Epoch Timestamp & Timezone Studio
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Convert timestamps to human-readable dates, ISO 8601, RFC 2822, and compare across international time zones with a live high-precision epoch clock.
        </p>
      </div>

      {/* Live Epoch Clock Ticker */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Unix Epoch Clock
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
            {currentEpoch}
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {new Date(currentEpoch * 1000).toUTCString()}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setInputTimestamp(currentEpoch.toString())}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Insert Current Time
          </button>
          <button
            onClick={() => setIsLive(!isLive)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={isLive ? 'Pause clock' : 'Resume clock'}
          >
            {isLive ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => handleCopy(currentEpoch.toString(), 'live-epoch')}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Copy current timestamp"
          >
            {copiedKey === 'live-epoch' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Converter Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Timestamp to Date */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-amber-500" /> Epoch Timestamp to Human Date
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Timestamp (Seconds or Milliseconds)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputTimestamp}
                  onChange={(e) => setInputTimestamp(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 1773000000"
                />
                <button
                  onClick={() => setInputTimestamp('0')}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Epoch 0
                </button>
              </div>
            </div>

            {/* Quick conversion formats */}
            {isValidDate && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">GMT / UTC String</span>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{parsedDate.toUTCString()}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(parsedDate.toUTCString(), 'utc-str')}
                    className="p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                  >
                    {copiedKey === 'utc-str' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">ISO 8601 Extended</span>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{parsedDate.toISOString()}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(parsedDate.toISOString(), 'iso-str')}
                    className="p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                  >
                    {copiedKey === 'iso-str' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Local Browser Time</span>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{parsedDate.toString()}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(parsedDate.toString(), 'local-str')}
                    className="p-1.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                  >
                    {copiedKey === 'local-str' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Date to Epoch Converter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" /> Human Date to Epoch Timestamp
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date & Time Picker</label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={inputDateString}
                  onChange={(e) => setInputDateString(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleConvertDateToEpoch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Timezone Matrix Column */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={18} className="text-emerald-500" /> International Timezone Matrix
            </h2>
            <span className="text-xs font-mono text-slate-400">Target Time</span>
          </div>

          <div className="space-y-2.5">
            {timezones.map((tz) => {
              let formatted = 'Invalid Date';
              try {
                formatted = parsedDate.toLocaleString('en-US', {
                  timeZone: tz.zone,
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                });
              } catch (e) {
                formatted = 'Zone not supported';
              }

              return (
                <div
                  key={tz.zone}
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {tz.label}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 block">
                      {formatted}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(formatted, tz.zone)}
                    className="p-2 text-slate-400 hover:text-emerald-500 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy formatted time"
                  >
                    {copiedKey === tz.zone ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default TimestampEpochConverter;
