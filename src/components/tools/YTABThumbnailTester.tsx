import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  Monitor,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Moon,
  Sun,
  Upload,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface ThumbnailVariant {
  id: 'A' | 'B' | 'C';
  label: string;
  url: string;
  textBadge?: string;
  hasFace: boolean;
  contrastScore: number; // 0-100
  title: string;
}

const DEFAULT_THUMBNAILS: ThumbnailVariant[] = [
  {
    id: 'A',
    label: 'Option A: High Contrast Glow',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&h=720&q=80',
    textBadge: 'DON’T DO THIS!',
    hasFace: true,
    contrastScore: 92,
    title: '5 Architecture Mistakes In Modern Web Apps That Destroy Performance',
  },
  {
    id: 'B',
    label: 'Option B: Clean Minimalist',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&h=720&q=80',
    textBadge: '10X FASTER',
    hasFace: false,
    contrastScore: 84,
    title: 'How Senior Engineers Structure Production Repositories in 2026',
  },
];

export default function YTABThumbnailTester() {
  const [variants, setVariants] = useState<ThumbnailVariant[]>(DEFAULT_THUMBNAILS);
  const [activeVariant, setActiveVariant] = useState<'A' | 'B' | 'C'>('A');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop' | 'search' | 'sidebar'>('mobile');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  const [channelName, setChannelName] = useState('DevTech Mastery');
  const [viewCount, setViewCount] = useState('84K views');
  const [timeAgo, setTimeAgo] = useState('2 days ago');
  const [videoDuration, setVideoDuration] = useState('14:28');

  const handleImageUpload = (variantId: 'A' | 'B' | 'C', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setVariants(
            variants.map((v) =>
              v.id === variantId ? { ...v, url: reader.result as string } : v
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (variantId: 'A' | 'B' | 'C', url: string) => {
    setVariants(variants.map((v) => (v.id === variantId ? { ...v, url } : v)));
  };

  const currentVariant = variants.find((v) => v.id === activeVariant) || variants[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                YouTube CTR Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                Thumbnail A/B Comparison
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              YouTube Thumbnail A/B Preview & CTR Tester
              <ImageIcon className="text-red-500" size={22} />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Preview your video thumbnail across realistic YouTube mobile feeds, desktop grids, and search results to prevent timestamp collisions and maximize click-through rate.
            </p>
          </div>

          {/* Theme & Device Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {previewTheme === 'dark' ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-amber-500" />}
              <span>{previewTheme === 'dark' ? 'YT Dark' : 'YT Light'}</span>
            </button>
          </div>
        </div>

        {/* Thumbnail A/B Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {variants.map((v) => (
            <div
              key={v.id}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                activeVariant === v.id
                  ? 'border-red-500 bg-red-500/5 dark:bg-red-950/10 ring-1 ring-red-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px]">
                    {v.id}
                  </span>
                  {v.label}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveVariant(v.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeVariant === v.id
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {activeVariant === v.id ? 'Viewing Active' : 'Select for Preview'}
                </button>
              </div>

              {/* URL or Upload */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={v.url}
                  onChange={(e) => handleUrlChange(v.id, e.target.value)}
                  placeholder="Paste thumbnail image URL..."
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />

                <label className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-bold cursor-pointer hover:border-red-500 transition-colors">
                  <Upload size={13} />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(v.id, e)}
                  />
                </label>
              </div>

              {/* Title per variant */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Tested Video Title
                </label>
                <input
                  type="text"
                  value={v.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setVariants(variants.map((varItem) => (varItem.id === v.id ? { ...varItem, title: newTitle } : varItem)));
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Realistic YouTube Feed Simulators */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Device Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Smartphone size={14} />
              <span>Mobile Feed</span>
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Monitor size={14} />
              <span>Desktop Grid</span>
            </button>
            <button
              onClick={() => setPreviewDevice('sidebar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewDevice === 'sidebar' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Layers size={14} />
              <span>Sidebar / Up Next</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Duration Badge:</span>
            <input
              type="text"
              value={videoDuration}
              onChange={(e) => setVideoDuration(e.target.value)}
              className="w-16 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-mono text-xs"
            />
          </div>
        </div>

        {/* FEED PREVIEW CONTAINER */}
        <div
          className={`p-6 rounded-2xl flex justify-center transition-colors ${
            previewTheme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-slate-100 text-slate-900'
          }`}
        >
          {/* 1. Mobile Feed Layout */}
          {previewDevice === 'mobile' && (
            <div className="w-full max-w-sm border border-slate-700/40 rounded-3xl p-3 bg-black/40 shadow-2xl space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 shadow-md">
                <img
                  src={currentVariant.url}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
                {/* Real YouTube Duration Badge */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold tracking-tight">
                  {videoDuration}
                </div>
              </div>

              <div className="flex items-start gap-3 px-1">
                <div className="h-9 w-9 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                  {channelName.slice(0, 1)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold leading-tight line-clamp-2">
                    {currentVariant.title}
                  </h4>
                  <p className="text-[11px] opacity-70">
                    {channelName} • {viewCount} • {timeAgo}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Desktop 3-Card Grid */}
          {previewDevice === 'desktop' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
              {/* Active Tested Video */}
              <div className="space-y-2.5">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 shadow-md ring-2 ring-red-500">
                  <img
                    src={currentVariant.url}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold">
                    {videoDuration}
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold uppercase">
                    Your Video ({currentVariant.id})
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {channelName.slice(0, 1)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold leading-tight line-clamp-2">
                      {currentVariant.title}
                    </h4>
                    <p className="text-[11px] opacity-70">
                      {channelName}
                    </p>
                    <p className="text-[11px] opacity-70">
                      {viewCount} • {timeAgo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulated Competitor Video 1 */}
              <div className="space-y-2.5 opacity-80">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
                    alt="Competitor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold">
                    22:15
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    F
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold leading-tight line-clamp-2">
                      Why Clean Code Architecture is Hard in 2026
                    </h4>
                    <p className="text-[11px] opacity-70">Fireship • 420K views • 3 days ago</p>
                  </div>
                </div>
              </div>

              {/* Simulated Competitor Video 2 */}
              <div className="space-y-2.5 opacity-80">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
                    alt="Competitor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold">
                    18:40
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    T
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold leading-tight line-clamp-2">
                      I Built an AI Agent in 1 Hour With New Tools
                    </h4>
                    <p className="text-[11px] opacity-70">TechLead • 180K views • 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Sidebar / Up Next */}
          {previewDevice === 'sidebar' && (
            <div className="w-full max-w-md space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={currentVariant.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white font-mono text-[9px] font-bold">
                    {videoDuration}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold leading-tight line-clamp-2">
                    {currentVariant.title}
                  </h4>
                  <p className="text-[10px] opacity-70">{channelName}</p>
                  <p className="text-[10px] opacity-70">{viewCount} • {timeAgo}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Check Alert */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="shrink-0 text-amber-500 mt-0.5" size={16} />
          <div>
            <strong className="font-bold">Timestamp Collision Check:</strong> The bottom-right duration badge (`{videoDuration}`) occupies roughly 15% of the bottom corner. Ensure no critical focal face or primary text is placed in that lower-right quad.
          </div>
        </div>
      </div>
    </div>
  );
}
