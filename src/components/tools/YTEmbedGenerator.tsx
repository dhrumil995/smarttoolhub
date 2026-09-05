import React, { useState, useMemo } from 'react';
import { Code, Copy, Check, Play, Link, Trash2, Sparkles, RefreshCw, AlertCircle, Eye, Sliders, Info } from 'lucide-react';

export default function YTEmbedGenerator() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ'); // Default to Rickroll for high fidelity demo
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Embed Parameters state
  const [width, setWidth] = useState(560);
  const [height, setHeight] = useState(315);
  const [responsive, setResponsive] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1' | '9:16'>('16:9');
  
  const [autoplay, setAutoplay] = useState(false);
  const [mute, setMute] = useState(false);
  const [loop, setLoop] = useState(false);
  const [controls, setControls] = useState(true);
  const [modestBranding, setModestBranding] = useState(false);
  const [disableKb, setDisableKb] = useState(false);
  const [allowFullscreen, setAllowFullscreen] = useState(true);
  
  const [startMin, setStartMin] = useState('');
  const [startSec, setStartSec] = useState('');
  const [endMin, setEndMin] = useState('');
  const [endSec, setEndSec] = useState('');

  const extractVideoId = (input: string) => {
    if (!input.trim()) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = input.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    if (input.trim().length === 11 && !input.includes('/') && !input.includes('.')) {
      return input.trim();
    }
    return null;
  };

  const handleProcessUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      setError('Invalid YouTube URL. Please enter a valid video link, Shorts link, or video ID.');
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
  };

  // Calculate start and end seconds
  const startSeconds = useMemo(() => {
    const min = parseInt(startMin, 10) || 0;
    const sec = parseInt(startSec, 10) || 0;
    return min * 60 + sec || null;
  }, [startMin, startSec]);

  const endSeconds = useMemo(() => {
    const min = parseInt(endMin, 10) || 0;
    const sec = parseInt(endSec, 10) || 0;
    return min * 60 + sec || null;
  }, [endMin, endSec]);

  // Generate embed URL query parameters
  const embedUrl = useMemo(() => {
    const params: string[] = [];
    
    if (autoplay) params.push('autoplay=1');
    if (mute) params.push('mute=1');
    if (loop && videoId) {
      params.push('loop=1');
      params.push(`playlist=${videoId}`); // YouTube loop requires playlist param with the same ID
    }
    if (!controls) params.push('controls=0');
    if (modestBranding) params.push('modestbranding=1');
    if (disableKb) params.push('disablekb=1');
    if (startSeconds) params.push(`start=${startSeconds}`);
    if (endSeconds) params.push(`end=${endSeconds}`);

    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    return `https://www.youtube.com/embed/${videoId}${queryString}`;
  }, [videoId, autoplay, mute, loop, controls, modestBranding, disableKb, startSeconds, endSeconds]);

  // Generate complete iframe code block
  const iframeCode = useMemo(() => {
    const allowAttributes = [
      'accelerometer',
      autoplay ? 'autoplay' : '',
      'clipboard-write',
      'encrypted-media',
      'gyroscope',
      'picture-in-picture',
      'web-share'
    ].filter(Boolean).join('; ');

    const fullscreenAttr = allowFullscreen ? ' allowfullscreen' : '';

    if (responsive) {
      let aspectPadding = 'pb-[56.25%]'; // 16:9
      if (aspectRatio === '4:3') aspectPadding = 'pb-[75%]';
      if (aspectRatio === '1:1') aspectPadding = 'pb-[100%]';
      if (aspectRatio === '9:16') aspectPadding = 'pb-[177.78%]';

      return `<!-- Responsive YouTube Embed -->
<div style="position: relative; width: 100%; height: 0; ${aspectPadding === 'pb-[56.25%]' ? 'padding-bottom: 56.25%;' : aspectPadding === 'pb-[75%]' ? 'padding-bottom: 75%;' : aspectPadding === 'pb-[100%]' ? 'padding-bottom: 100%;' : 'padding-bottom: 177.78%;'}">
  <iframe
    src="${embedUrl}"
    title="YouTube video player"
    frameborder="0"
    allow="${allowAttributes}"${fullscreenAttr}
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"
  ></iframe>
</div>`;
    } else {
      return `<!-- Fixed Size YouTube Embed -->
<iframe
  width="${width}"
  height="${height}"
  src="${embedUrl}"
  title="YouTube video player"
  frameborder="0"
  allow="${allowAttributes}"${fullscreenAttr}
  style="border-radius: 12px;"
></iframe>`;
    }
  }, [embedUrl, width, height, responsive, aspectRatio, autoplay, allowFullscreen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setVideoId('dQw4w9WgXcQ');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Video URL Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleProcessUrl} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              YouTube Video Link / Video ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ, or video ID dQw4w9WgXcQ..."
                className="w-full pl-11 pr-10 py-3.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-850 dark:text-slate-200 placeholder-slate-400"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Link size={16} />
              </div>
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Play size={14} />
                Generate Embed
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-4 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Use Demo Video
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/5 border border-red-500/10 p-3 rounded-xl mt-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Customize Embed parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
            <Sliders size={16} className="text-red-500" />
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Player Customization
            </h3>
          </div>

          {/* Sizing options */}
          <div className="space-y-4">
            <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Dimension Settings
            </span>

            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Responsive Size</label>
              <input
                type="checkbox"
                checked={responsive}
                onChange={(e) => setResponsive(e.target.checked)}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
              />
            </div>

            {responsive ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['16:9', '4:3', '1:1', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 text-[10px] font-mono font-bold border rounded-xl cursor-pointer transition-all ${
                        aspectRatio === ratio
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Math.max(100, parseInt(e.target.value, 10) || 560))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(100, parseInt(e.target.value, 10) || 315))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Timing parameters */}
          <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-4">
            <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Timeline Triggers
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Start Time</label>
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={startMin}
                    onChange={(e) => setStartMin(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                  <span className="text-[10px] text-slate-400">:</span>
                  <input
                    type="number"
                    placeholder="Sec"
                    value={startSec}
                    onChange={(e) => setStartSec(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">End Time</label>
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={endMin}
                    onChange={(e) => setEndMin(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                  <span className="text-[10px] text-slate-400">:</span>
                  <input
                    type="number"
                    placeholder="Sec"
                    value={endSec}
                    onChange={(e) => setEndSec(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Behavior toggles */}
          <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-4 text-xs">
            <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Player Behavior Parameters
            </span>

            <div className="space-y-3">
              {/* Autoplay & Mute */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Autoplay Video</span>
                  <span className="text-[10px] text-slate-450 block">Requires "Mute Video" for browser allowance.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => {
                    setAutoplay(e.target.checked);
                    if (e.target.checked) setMute(true); // Browsers block sound autoplay
                  }}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Muted Audio</span>
                  <span className="text-[10px] text-slate-450 block">Starts player without playing audio.</span>
                </div>
                <input
                  type="checkbox"
                  checked={mute}
                  onChange={(e) => setMute(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              {/* Loop */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Loop Video Playback</span>
                  <span className="text-[10px] text-slate-450 block">Repeats the same video continuously.</span>
                </div>
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Show Player Controls</span>
                  <span className="text-[10px] text-slate-450 block">Show play, pause, progress slider overlays.</span>
                </div>
                <input
                  type="checkbox"
                  checked={controls}
                  onChange={(e) => setControls(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              {/* Modest Branding */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Modest Branding</span>
                  <span className="text-[10px] text-slate-450 block">Hides the standard red logo banner in play mode.</span>
                </div>
                <input
                  type="checkbox"
                  checked={modestBranding}
                  onChange={(e) => setModestBranding(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              {/* Disable KB */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Disable Keyboard Hotkeys</span>
                  <span className="text-[10px] text-slate-450 block">Ignore spacebar play/pause or numeric seeking.</span>
                </div>
                <input
                  type="checkbox"
                  checked={disableKb}
                  onChange={(e) => setDisableKb(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>

              {/* Fullscreen Allow */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Allow Full Screen</span>
                  <span className="text-[10px] text-slate-450 block">Allows users to maximize video dimensions.</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowFullscreen}
                  onChange={(e) => setAllowFullscreen(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Player Preview and Code Exporter */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Video Iframe Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Eye size={16} className="text-red-500" />
              Live Interactive Player Preview
            </h3>

            <div className="bg-slate-100 dark:bg-slate-950 p-4 border border-slate-200/60 dark:border-slate-850 rounded-2xl flex items-center justify-center">
              {videoId ? (
                <div className={`w-full ${responsive ? 'relative h-0 pb-[56.25%]' : ''}`} style={!responsive ? { width: `${width}px`, height: `${height}px` } : undefined}>
                  <iframe
                    src={embedUrl}
                    title="YouTube video player preview"
                    frameBorder="0"
                    allowFullScreen={allowFullscreen}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    className={responsive ? "absolute top-0 left-0 w-full h-full rounded-xl border border-slate-200/40" : "rounded-xl border border-slate-200/40"}
                    style={!responsive ? { width: '100%', height: '100%' } : undefined}
                  />
                </div>
              ) : (
                <div className="text-slate-400 py-12 text-xs text-center font-bold">
                  Enter a YouTube Video Link to generate player preview.
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50/60 dark:bg-slate-950/40 p-3.5 border border-slate-100 dark:border-slate-850 rounded-xl leading-normal">
              <Info size={13} className="shrink-0 text-red-400 mt-0.5" />
              <p>
                <strong>Browser Note:</strong> Modern browsers require the video to be <strong>muted</strong> for autoplay to work successfully. If autoplay is selected, the player starts muted by default.
              </p>
            </div>
          </div>

          {/* HTML Code Export Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="space-y-0.5">
                <span className="block font-mono text-xs font-bold text-slate-350">
                  Embeddable Responsive Code
                </span>
                <span className="block text-[10px] text-slate-500 font-medium font-sans">
                  Paste this clean code directly into your HTML / website editor
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl font-semibold font-sans text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            <pre className="text-[11px] font-mono text-[#79c0ff] p-4 bg-slate-950/40 rounded-xl overflow-x-auto max-h-[220px] border border-slate-900 text-left whitespace-pre">
              {iframeCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
