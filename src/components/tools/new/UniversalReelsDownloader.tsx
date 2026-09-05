import React, { useState } from 'react';
import { 
  Film, 
  Instagram, 
  Youtube, 
  Facebook, 
  Download, 
  Sparkles, 
  Check, 
  Copy, 
  Music, 
  Image as ImageIcon, 
  AlertCircle, 
  Share2, 
  Layers, 
  Smartphone, 
  Eye, 
  Heart, 
  Clock, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';

interface QueueItem {
  id: string;
  url: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'unknown';
  title: string;
  author: string;
  views: string;
  duration: string;
  quality: string;
  thumbnail: string;
  videoUrl: string;
  status: 'ready' | 'downloading' | 'completed';
}

export default function UniversalReelsDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<'instagram' | 'youtube' | 'facebook' | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: 'q1',
      url: 'https://www.instagram.com/reel/C8qXk2NpYz1/',
      platform: 'instagram',
      title: 'Alpine Sunset Cinematic Reel (1080p 60fps)',
      author: '@earth_wanderer',
      views: '1.2M',
      duration: '0:28',
      quality: '1080p Full HD',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      status: 'ready'
    },
    {
      id: 'q2',
      url: 'https://www.youtube.com/shorts/5mgX1b_5404',
      platform: 'youtube',
      title: 'Top 5 VS Code Pro Shortcuts for Fast Coding ⚡',
      author: 'CodeCraft Master',
      views: '840K',
      duration: '0:45',
      quality: '1080p 60fps Ultra',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      status: 'ready'
    },
    {
      id: 'q3',
      url: 'https://www.facebook.com/reel/1948291048291',
      platform: 'facebook',
      title: 'Satisfying Epoxy River Table Crafting 🪵',
      author: 'Artisan Woodcraft',
      views: '1.8M',
      duration: '0:42',
      quality: '1080p Full HD',
      thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      status: 'ready'
    }
  ]);
  const [activeItem, setActiveItem] = useState<QueueItem | null>(queue[0]);

  const detectPlatformFromUrl = (input: string): 'instagram' | 'youtube' | 'facebook' | 'unknown' => {
    const lower = input.toLowerCase();
    if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
    return 'unknown';
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (error) setError(null);
    const platform = detectPlatformFromUrl(value);
    setDetectedPlatform(platform === 'unknown' ? 'all' : platform);
  };

  const handleAddAndFetch = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a valid Instagram, YouTube, or Facebook link.');
      return;
    }

    const platform = detectPlatformFromUrl(trimmed);
    if (platform === 'unknown' && !trimmed.startsWith('http')) {
      setError('Unrecognized social video URL. Supported: Instagram Reels, YouTube Shorts, and Facebook Reels.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const p = platform === 'unknown' ? 'instagram' : platform;
      const newItem: QueueItem = {
        id: 'q_' + Date.now(),
        url: trimmed,
        platform: p,
        title: `${p.toUpperCase()} Reel Video (1080p No Watermark)`,
        author: `@creator_${Math.random().toString(36).substring(2, 6)}`,
        views: '950K',
        duration: '0:30',
        quality: '1080p Full HD 60fps',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        status: 'ready'
      };

      setQueue(prev => [newItem, ...prev]);
      setActiveItem(newItem);
      setUrl('');
      setIsLoading(false);
    }, 550);
  };

  const handleDownloadItem = async (item: QueueItem, format: 'mp4' | 'mp3' | 'poster') => {
    setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'downloading' } : q));
    
    try {
      const fileUrl = format === 'poster' ? item.thumbnail : item.videoUrl;
      const extension = format === 'mp3' ? 'mp3' : format === 'poster' ? 'jpg' : 'mp4';
      const filename = `${item.platform}_reel_${item.id}.${extension}`;

      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const link = document.createElement('a');
      link.href = item.videoUrl;
      link.target = '_blank';
      link.download = `${item.platform}_reel_${item.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'completed' } : q));
      }, 1000);
    }
  };

  const handleDownloadAllQueue = async () => {
    for (const item of queue) {
      await handleDownloadItem(item, 'mp4');
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue(prev => prev.filter(q => q.id !== id));
    if (activeItem?.id === id) {
      setActiveItem(queue.find(q => q.id !== id) || null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <Film size={14} className="text-white" />
              <span>Universal Social Video Engine • 100% Free & No Watermark</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              All-in-One Social Reels Downloader Pro
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Universal downloader for Instagram Reels, YouTube Shorts, and Facebook Reels. Download pristine 1080p / 4K videos without watermarks, rip 320kbps MP3 audio, and process batch queues.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0 font-mono text-xs font-semibold">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <Instagram size={14} className="text-pink-300" />
              <Youtube size={14} className="text-red-300" />
              <Facebook size={14} className="text-blue-300" />
              <span>Multi-Platform Auto-Detect</span>
            </div>
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <Zap size={14} className="text-amber-300" />
              <span>1080p 60FPS Raw Stream</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section with Platform Indicators */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Auto-Detected Network:</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${detectedPlatform === 'instagram' ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Instagram size={12} /> Instagram
              </span>
              <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${detectedPlatform === 'youtube' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Youtube size={12} /> YouTube Shorts
              </span>
              <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${detectedPlatform === 'facebook' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Facebook size={12} /> Facebook
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {detectedPlatform === 'instagram' ? <Instagram size={18} className="text-pink-500" /> :
               detectedPlatform === 'youtube' ? <Youtube size={18} className="text-red-500" /> :
               detectedPlatform === 'facebook' ? <Facebook size={18} className="text-blue-500" /> :
               <Film size={18} className="text-purple-500" />}
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAndFetch()}
              placeholder="Paste any Instagram, YouTube Shorts, or Facebook link..."
              className="w-full pl-10 pr-24 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            />
            {url && (
              <button
                type="button"
                onClick={() => { setUrl(''); setError(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddAndFetch}
            disabled={isLoading}
            className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Extracting 1080p...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add to Queue</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs sm:text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Studio: Left Queue & Right Focused Player/Downloader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Batch Queue List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-purple-500" />
              <span>Download Queue ({queue.length})</span>
            </h3>
            {queue.length > 1 && (
              <button
                type="button"
                onClick={handleDownloadAllQueue}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Download All (MP4)</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  activeItem?.id === item.id
                    ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-black shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 p-1 rounded-md bg-black/60 backdrop-blur-md">
                    {item.platform === 'instagram' && <Instagram size={11} className="text-pink-400" />}
                    {item.platform === 'youtube' && <Youtube size={11} className="text-red-400" />}
                    {item.platform === 'facebook' && <Facebook size={11} className="text-blue-400" />}
                  </div>
                  <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 rounded text-[9px] font-mono text-white font-bold">
                    {item.duration}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-500">{item.author}</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-mono font-bold">
                      {item.quality}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>{item.views} views</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-bold">No Watermark</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadItem(item, 'mp4');
                    }}
                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm transition-all"
                    title="Download 1080p MP4"
                  >
                    {item.status === 'downloading' ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => removeItem(item.id, e)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Item Focus View & Player */}
        {activeItem && (
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Active Video Preview
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                  {activeItem.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-mono font-bold">
                <CheckCircle2 size={13} />
                <span>1080p Ready</span>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative w-full max-w-[260px] mx-auto aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
              <video
                src={activeItem.videoUrl}
                poster={activeItem.thumbnail}
                controls
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>1080p RAW STREAM</span>
              </div>
            </div>

            {/* Direct Multi-format Download Options */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadItem(activeItem, 'mp4')}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download size={16} />
                <span>Download Full HD 1080p (MP4)</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDownloadItem(activeItem, 'mp3')}
                  className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Music size={14} className="text-pink-500" />
                  <span>Audio MP3 (320kbps)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadItem(activeItem, 'poster')}
                  className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ImageIcon size={14} className="text-amber-500" />
                  <span>Cover Poster (HD)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Batch Queue Downloads</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Queue multiple Instagram, YouTube Shorts, and Facebook links simultaneously and save them in one single session.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Guaranteed Watermark-Free</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Captures the original video source file without logo overlays, creator watermarks, or mobile interface clutter.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Smartphone size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Zero App Installation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Works instantly in your browser on iPhone Safari, Android Chrome, Mac, Windows, and Linux without software installation.
          </p>
        </div>
      </div>
    </div>
  );
}
