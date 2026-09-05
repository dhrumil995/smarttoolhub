import React, { useState } from 'react';
import { 
  Calculator, Copy, Check, ArrowRightLeft, Sliders, Layers, RefreshCw
} from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'digital' | 'area';

const UNITS: Record<UnitCategory, { label: string; ratio: number }[]> = {
  length: [
    { label: 'Meters (m)', ratio: 1 },
    { label: 'Kilometers (km)', ratio: 1000 },
    { label: 'Centimeters (cm)', ratio: 0.01 },
    { label: 'Millimeters (mm)', ratio: 0.001 },
    { label: 'Inches (in)', ratio: 0.0254 },
    { label: 'Feet (ft)', ratio: 0.3048 },
    { label: 'Yards (yd)', ratio: 0.9144 },
    { label: 'Miles (mi)', ratio: 1609.34 },
  ],
  weight: [
    { label: 'Kilograms (kg)', ratio: 1 },
    { label: 'Grams (g)', ratio: 0.001 },
    { label: 'Milligrams (mg)', ratio: 0.000001 },
    { label: 'Pounds (lbs)', ratio: 0.453592 },
    { label: 'Ounces (oz)', ratio: 0.0283495 },
    { label: 'Metric Tons (t)', ratio: 1000 },
  ],
  temperature: [
    { label: 'Celsius (°C)', ratio: 1 },
    { label: 'Fahrenheit (°F)', ratio: 1 },
    { label: 'Kelvin (K)', ratio: 1 },
  ],
  digital: [
    { label: 'Bytes (B)', ratio: 1 },
    { label: 'Kilobytes (KB)', ratio: 1024 },
    { label: 'Megabytes (MB)', ratio: 1048576 },
    { label: 'Gigabytes (GB)', ratio: 1073741824 },
    { label: 'Terabytes (TB)', ratio: 1099511627776 },
  ],
  area: [
    { label: 'Square Meters (m²)', ratio: 1 },
    { label: 'Square Kilometers (km²)', ratio: 1000000 },
    { label: 'Square Feet (ft²)', ratio: 0.092903 },
    { label: 'Acres', ratio: 4046.86 },
    { label: 'Hectares', ratio: 10000 },
  ]
};

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [copied, setCopied] = useState(false);

  const calculateResult = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return 0;

    const currentUnits = UNITS[category];
    const fromUnit = currentUnits[fromIndex] || currentUnits[0];
    const toUnit = currentUnits[toIndex] || currentUnits[1];

    if (category === 'temperature') {
      // Temperature special formulas
      const fromName = fromUnit.label;
      const toName = toUnit.label;

      let celsius = val;
      if (fromName.includes('Fahrenheit')) {
        celsius = (val - 32) * (5 / 9);
      } else if (fromName.includes('Kelvin')) {
        celsius = val - 273.15;
      }

      if (toName.includes('Celsius')) return Number(celsius.toFixed(4));
      if (toName.includes('Fahrenheit')) return Number((celsius * (9 / 5) + 32).toFixed(4));
      if (toName.includes('Kelvin')) return Number((celsius + 273.15).toFixed(4));
      return celsius;
    }

    // Ratio based conversion
    const baseMeters = val * fromUnit.ratio;
    const result = baseMeters / toUnit.ratio;
    return Number(result.toFixed(6));
  };

  const convertedResult = calculateResult();

  const handleSwap = () => {
    const temp = fromIndex;
    setFromIndex(toIndex);
    setToIndex(temp);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${convertedResult}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-cyan-500/20">
            <Calculator size={12} className="text-cyan-500" />
            Universal Measurement Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Unit & Metric Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Convert length, weight, temperature, digital data storage, and surface area units instantly.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Converted Value'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['length', 'weight', 'temperature', 'digital', 'area'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setFromIndex(0);
              setToIndex(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              category === cat
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Converter Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
              {/* From Unit */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">From Unit</label>
                <select
                  value={fromIndex}
                  onChange={(e) => setFromIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {UNITS[category].map((u, idx) => (
                    <option key={u.label} value={idx}>{u.label}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-0">
                <button
                  onClick={handleSwap}
                  className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full transition-all cursor-pointer border border-cyan-500/20"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* To Unit */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">To Unit</label>
                <select
                  value={toIndex}
                  onChange={(e) => setToIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {UNITS[category].map((u, idx) => (
                    <option key={u.label} value={idx}>{u.label}</option>
                  ))}
                </select>

                <div className="w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl font-mono text-lg font-bold text-cyan-600 dark:text-cyan-400">
                  {convertedResult}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              Conversion Formula
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-500">
                {inputValue} {UNITS[category][fromIndex]?.label} =
              </div>
              <div className="text-cyan-600 dark:text-cyan-400 font-extrabold text-base">
                {convertedResult} {UNITS[category][toIndex]?.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitConverter;
