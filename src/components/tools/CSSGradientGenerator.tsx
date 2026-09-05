import React, { useState } from 'react';
import { 
  Palette, Copy, Check, RefreshCw, Sparkles, Sliders, Layers, Plus, Trash2, Code2
} from 'lucide-react';

interface ColorStop {
  id: string;
  color: string;
  stop: number;
}

const PRESET_GRADIENTS = [
  { name: 'Hyper Dawn', type: 'linear', angle: 135, stops: [{ id: '1', color: '#8B5CF6', stop: 0 }, { id: '2', color: '#EC4899', stop: 100 }] },
  { name: 'Oceanic Depth', type: 'linear', angle: 90, stops: [{ id: '1', color: '#06B6D4', stop: 0 }, { id: '2', color: '#3B82F6', stop: 100 }] },
  { name: 'Emerald Luxe', type: 'linear', angle: 45, stops: [{ id: '1', color: '#10B981', stop: 0 }, { id: '2', color: '#059669', stop: 50 }, { id: '3', color: '#047857', stop: 100 }] },
  { name: 'Sunset Glow', type: 'linear', angle: 120, stops: [{ id: '1', color: '#F59E0B', stop: 0 }, { id: '2', color: '#EF4444', stop: 100 }] },
  { name: 'Cyberpunk Neon', type: 'linear', angle: 180, stops: [{ id: '1', color: '#F43F5E', stop: 0 }, { id: '2', color: '#8B5CF6', stop: 100 }] },
];

export function CSSGradientGenerator() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#6366F1', stop: 0 },
    { id: '2', color: '#A855F7', stop: 50 },
    { id: '3', color: '#EC4899', stop: 100 },
  ]);

  const [copied, setCopied] = useState(false);

  const sortedStops = [...stops].sort((a, b) => a.stop - b.stop);
  const stopsCss = sortedStops.map(s => `${s.color} ${s.stop}%`).join(', ');

  const cssGradientValue = gradientType === 'linear'
    ? `linear-gradient(${angle}deg, ${stopsCss})`
    : gradientType === 'radial'
    ? `radial-gradient(circle, ${stopsCss})`
    : `conic-gradient(from ${angle}deg, ${stopsCss})`;

  const fullCssSnippet = `background: ${stops[0]?.color || '#ffffff'};\nbackground: ${cssGradientValue};`;

  const addColorStop = () => {
    if (stops.length >= 6) return;
    setStops([
      ...stops,
      { id: Date.now().toString(), color: '#10B981', stop: 75 }
    ]);
  };

  const updateStop = (id: string, field: keyof ColorStop, value: any) => {
    setStops(stops.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter(s => s.id !== id));
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(fullCssSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-pink-500/20">
            <Palette size={12} className="text-pink-500" />
            UI Color & Style Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Gradient Generator & Color Picker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Create linear, radial, and conic CSS background gradients with real-time color stop controls and instant code generation.
          </p>
        </div>

        <button
          onClick={handleCopyCss}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied CSS' : 'Copy CSS Code'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Canvas & Code Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gradient Preview Canvas */}
          <div
            className="w-full h-72 sm:h-96 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl transition-all flex items-center justify-center p-6 text-white text-center font-bold"
            style={{ background: cssGradientValue }}
          >
            <div className="bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg">
              <span className="font-mono text-sm tracking-wider">{cssGradientValue}</span>
            </div>
          </div>

          {/* Generated Code Snippet */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Code2 size={14} className="text-pink-500" /> Generated CSS Property
              </span>
            </div>

            <pre className="p-4 bg-slate-900 text-pink-300 rounded-xl font-mono text-xs overflow-x-auto">
              {fullCssSnippet}
            </pre>
          </div>
        </div>

        {/* Right Column: Controls & Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sliders size={14} className="text-pink-500" /> Gradient Configuration
            </h3>

            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Gradient Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setGradientType(t)}
                    className={`py-2 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                      gradientType === t ? 'bg-pink-600 text-white border-pink-600' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Slider */}
            {gradientType !== 'radial' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-extrabold uppercase text-slate-400">
                  <span>Angle</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
            )}

            {/* Color Stops */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Color Stops</label>
                <button
                  onClick={addColorStop}
                  disabled={stops.length >= 6}
                  className="text-xs font-bold text-pink-600 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Plus size={12} /> Add Stop
                </button>
              </div>

              {stops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                    className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-xs uppercase"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.stop}
                    onChange={(e) => updateStop(stop.id, 'stop', Number(e.target.value))}
                    className="flex-1 accent-pink-600"
                  />
                  <span className="font-mono text-[10px] text-slate-400 w-8">{stop.stop}%</span>
                  <button
                    onClick={() => removeStop(stop.id)}
                    className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Trending Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Trending Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_GRADIENTS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setGradientType(p.type as any);
                      setAngle(p.angle);
                      setStops(p.stops);
                    }}
                    className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-pink-500 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className="w-5 h-5 rounded-md border border-white/20 shrink-0"
                      style={{ background: `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.color} ${s.stop}%`).join(', ')})` }}
                    />
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CSSGradientGenerator;
