import React, { useState } from 'react';
import { Download, Link, Image, Trash2, ArrowUpRight, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface ThumbnailOption {
  quality: string;
  resolution: string;
  url: string;
  filename: string;
  isAvailable: boolean;
}

export default function YTThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (input: string) => {
    if (!input.trim()) return null;
    
    // Support various formats: youtube.com/watch?v=..., youtu.be/..., shorts/..., embed/..., music.youtube.com/...
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = input.match(regExp);
    
    if (match && match[2].length === 11) {
      return match[2];
    }
    
    // Direct 11-char ID input
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
      setVideoId(null);
    }
  };

  const handleClear = () => {
    setUrl('');
    setVideoId(null);
    setError(null);
  };

  const getThumbnailOptions = (id: string): ThumbnailOption[] => [
    {
      quality: 'Maximum Quality (HD)',
      resolution: '1920 x 1080 (1080p)',
      url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      filename: `youtube_thumbnail_maxres_${id}.jpg`,
      isAvailable: true,
    },
    {
      quality: 'High Quality (720p)',
      resolution: '1280 x 720 (720p)',
      url: `https://img.youtube.com/vi/${id}/sddefault.jpg`,
      filename: `youtube_thumbnail_hq_${id}.jpg`,
      isAvailable: true,
    },
    {
      quality: 'Medium Quality',
      resolution: '640 x 480',
      url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      filename: `youtube_thumbnail_med_${id}.jpg`,
      isAvailable: true,
    },
    {
      quality: 'Standard Quality',
      resolution: '480 x 360',
      url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      filename: `youtube_thumbnail_std_${id}.jpg`,
      isAvailable: true,
    },
    {
      quality: 'Default Thumbnail',
      resolution: '120 x 90',
      url: `https://img.youtube.com/vi/${id}/default.jpg`,
      filename: `youtube_thumbnail_default_${id}.jpg`,
      isAvailable: true,
    },
  ];

  const downloadThumbnail = async (thumbnailUrl: string, filename: string) => {
    try {
      // Fetch the image as blob to trigger native download
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = localUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(localUrl);
    } catch (err) {
      // If CORS blocks fetch, open in a new tab as fallback
      window.open(thumbnailUrl, '_blank');
    }
  };

  const handleExampleLink = () => {
    setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setVideoId('dQw4w9WgXcQ');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleProcessUrl} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              YouTube Video URL / Video ID
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
                <Image size={14} />
                Extract Thumbnail
              </button>
              <button
                type="button"
                onClick={handleExampleLink}
                className="px-4 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Use Example Link
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

      {videoId && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main HD Preview Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles size={16} className="text-red-500" />
                HD Thumbnail Preview
              </h3>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-250/50 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 relative group">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt="YouTube Thumbnail Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to hqdefault if maxresdefault doesn't exist
                    e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white font-mono text-[10px] font-bold tracking-wider">
                  PREVIEW (1080p)
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150/40">
                <span className="font-mono">YouTube Video ID: <span className="text-red-500 dark:text-red-400 font-bold">{videoId}</span></span>
                <span className="flex items-center gap-1">
                  <HelpCircle size={12} />
                  Right-click image to "Save image as" directly
                </span>
              </div>
            </div>
          </div>

          {/* Resolutions Download List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white">
                Download Resolutions
              </h3>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {getThumbnailOptions(videoId).map((opt, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        {opt.quality}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {opt.resolution}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadThumbnail(opt.url, opt.filename)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                        title="Download Image File"
                      >
                        <Download size={12} />
                        Download
                      </button>
                      <a
                        href={opt.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-all cursor-pointer"
                        title="Open image in new tab"
                      >
                        <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
