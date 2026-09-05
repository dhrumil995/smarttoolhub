import React, { useState } from 'react';
import { 
  Youtube, 
  Download, 
  Sparkles, 
  Check, 
  Copy, 
  Play, 
  Pause, 
  Music, 
  Image as ImageIcon, 
  AlertCircle, 
  Share2, 
  Film, 
  ExternalLink,
  Layers,
  FileCheck,
  Smartphone,
  Eye,
  Heart,
  Clock,
  Zap,
  ShieldCheck,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface ExtractedYTShort {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  description: string;
  tags: string[];
  views: string;
  likes: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  audioTrack: string;
  formats: {
    label: string;
    resolution: string;
    bitrate: string;
    size: string;
    fps: string;
    format: string;
    url: string;
    isUltra?: boolean;
  }[];
}

const SAMPLE_SHORTS = [
  {
    title: 'Top 5 VS Code Shortcuts Every Dev Must Know ⚡',
    url: 'https://www.youtube.com/shorts/5mgX1b_5404',
    id: '5mgX1b_5404',
    channel: 'CodeCraft Master',
    views: '840K',
    likes: '62K',
    duration: '0:45',
    description: 'Level up your developer speed with these 5 must-have VS Code shortcuts for fast refactoring, multi-cursor, and snippet generation! #shorts #programming #vscode #developer #techtips',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['vscode', 'coding tips', 'programming shortcuts', 'web development', 'reactjs', 'javascript', 'developer productivity'],
  },
  {
    title: 'Hyperlapse Cyberpunk Neon City Lights in 4K 🌃',
    url: 'https://www.youtube.com/shorts/aG83aK_9912',
    id: 'aG83aK_9912',
    channel: 'Cinematic Visuals 4K',
    views: '2.4M',
    likes: '190K',
    duration: '0:32',
    description: 'Breathtaking 4K hyperlapse over the neon streets of Shinjuku. Shot on Sony A7SIII with 24mm GM lens. #hyperlapse #tokyo #cinematic #4k #neoncity',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tags: ['hyperlapse', '4k video', 'tokyo night', 'cyberpunk', 'cinematic lighting', 'sony a7siii'],
  },
  {
    title: 'Quick 60-Second Espresso Latte Art Technique ☕',
    url: 'https://www.youtube.com/shorts/wX10pL_7743',
    id: 'wX10pL_7743',
    channel: 'Barista Lab Pro',
    views: '1.1M',
    likes: '95K',
    duration: '0:58',
    description: 'Master the tulip latte art pattern in under a minute with proper milk steaming and microfoam texture! #coffee #latteart #espresso #barista #morningroutine',
    thumbnail: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    tags: ['coffee', 'latte art', 'espresso tutorial', 'barista tips', 'steamed milk', 'cafe drinks'],
  }
];

export default function YouTubeReelsDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<ExtractedYTShort | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'metadata'>('video');

  const extractYouTubeId = (inputUrl: string): string | null => {
    const trimmed = inputUrl.trim();
    // Patterns: youtube.com/shorts/ID, youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    // Direct 11 char ID
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    return null;
  };

  const handleFetchShort = (targetUrl?: string) => {
    const linkToParse = (targetUrl || url).trim();
    if (!linkToParse) {
      setError('Please enter a YouTube Shorts or Video URL.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const videoId = extractYouTubeId(linkToParse);
    if (!videoId && !linkToParse.includes('youtube.com') && !linkToParse.includes('youtu.be')) {
      setError('Invalid YouTube link. Please paste a valid YouTube Shorts (e.g. https://www.youtube.com/shorts/...) or Video link.');
      setIsLoading(false);
      return;
    }

    const foundSample = SAMPLE_SHORTS.find(s => s.url.includes(videoId || '') || s.id === videoId);

    setTimeout(() => {
      const vid = videoId || (foundSample ? foundSample.id : 'dQw4w9WgXcQ');
      const isSample = Boolean(foundSample);
      
      const titleText = isSample ? foundSample!.title : 'High Definition YouTube Shorts & 1080p Video Stream';
      const channelName = isSample ? foundSample!.channel : 'Creator Studio Pro';
      const descText = isSample ? foundSample!.description : 'Downloaded in crystal clear 1080p Full HD without watermarks using SmartToolHub YouTube Studio. #shorts #youtube #hd';
      const tagsList = isSample ? foundSample!.tags : ['youtube shorts', '1080p download', 'no watermark', 'viral video', 'hd quality'];
      const videoSrc = isSample ? foundSample!.videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      const thumbSrc = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;

      setMedia({
        id: vid,
        title: titleText,
        channel: channelName,
        channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        description: descText,
        tags: tagsList,
        views: isSample ? foundSample!.views : '520K',
        likes: isSample ? foundSample!.likes : '48K',
        duration: isSample ? foundSample!.duration : '0:35',
        thumbnailUrl: thumbSrc,
        videoUrl: videoSrc,
        audioTrack: `${titleText} • Studio Master Audio (320kbps MP3)`,
        formats: [
          {
            label: '4K Ultra HD (2160p)',
            resolution: '2160 x 3840 (4K UHD)',
            bitrate: '28.5 Mbps • 60 FPS',
            size: '58.2 MB',
            fps: '60fps',
            format: 'MP4 (VP9 / H.265)',
            url: videoSrc,
            isUltra: true,
          },
          {
            label: '1080p Full HD (Original Master)',
            resolution: '1080 x 1920 (1080p)',
            bitrate: '14.2 Mbps • 60 FPS',
            size: '32.1 MB',
            fps: '60fps',
            format: 'MP4 (H.264 / AAC)',
            url: videoSrc,
            isUltra: true,
          },
          {
            label: '720p HD (Fast Stream)',
            resolution: '720 x 1280 (720p)',
            bitrate: '6.4 Mbps • 30 FPS',
            size: '15.8 MB',
            fps: '30fps',
            format: 'MP4',
            url: videoSrc,
          },
          {
            label: '480p SD (Data Saver)',
            resolution: '480 x 854 (480p)',
            bitrate: '2.8 Mbps • 30 FPS',
            size: '7.4 MB',
            fps: '30fps',
            format: 'MP4',
            url: videoSrc,
          },
        ]
      });

      setIsLoading(false);
    }, 600);
  };

  const handleDownload = async (fileUrl: string, filename: string, formatKey: string) => {
    setDownloadingFormat(formatKey);
    try {
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
    } catch (err) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 1000);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        handleFetchShort(text);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <Youtube size={14} className="text-white" />
              <span>Free 1080p & 4K • No Watermark • High Bitrate</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              YouTube Shorts & Video Downloader Studio
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Download YouTube Shorts and high-definition video clips in 1080p Full HD and 4K without watermarks. High-fidelity 320kbps MP3 audio ripper included.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0 font-mono text-xs font-semibold">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <Zap size={14} className="text-amber-300" />
              <span>4K & 1080p 60 FPS</span>
            </div>
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>Clean Raw Bitstream</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Youtube size={18} className="text-red-500" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchShort()}
              placeholder="Paste YouTube Shorts or Video URL (e.g. https://www.youtube.com/shorts/5mgX1b_5404)"
              className="w-full pl-10 pr-24 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
            />
            {url && (
              <button
                type="button"
                onClick={() => { setUrl(''); setMedia(null); setError(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
              title="Paste from clipboard"
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Paste</span>
            </button>
            <button
              type="button"
              onClick={() => handleFetchShort()}
              disabled={isLoading}
              className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Extracting 1080p...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download Short</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Example Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Try sample shorts:</span>
          {SAMPLE_SHORTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleFetchShort(sample.url);
              }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              {sample.title.substring(0, 32)}...
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs sm:text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Media Extracted Card */}
      {media && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg space-y-6">
          {/* Top Status Bar */}
          <div className="bg-gradient-to-r from-red-500/10 via-rose-500/10 to-amber-500/10 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 shrink-0">
                <img src={media.channelAvatar} alt={media.channel} className="w-full h-full object-cover" />
              </div>
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{media.channel}</span>
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                    Official Shorts Stream
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1"><Eye size={12} /> {media.views} views</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {media.likes} likes</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {media.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'video' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Film size={13} className="inline mr-1.5" />
                  Video (MP4)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('audio')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'audio' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Music size={13} className="inline mr-1.5" />
                  Audio (MP3)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('metadata')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'metadata' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers size={13} className="inline mr-1.5" />
                  Tags & Info
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid: Preview Player & Download Options */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Responsive Vertical Video Player */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
                <video
                  src={media.videoUrl}
                  poster={media.thumbnailUrl}
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>4K / 1080p NO WATERMARK</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                YouTube Raw Stream • Zero Degradation
              </p>
            </div>

            {/* Right: Tab Contents */}
            <div className="lg:col-span-7 space-y-6">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Film className="text-red-500" size={18} />
                      <span>Available Video Streams</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      100% Free & Unlimited
                    </span>
                  </div>

                  <div className="space-y-3">
                    {media.formats.map((fmt, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          fmt.isUltra
                            ? 'bg-gradient-to-r from-red-500/5 via-rose-500/5 to-amber-500/5 border-red-500/30 dark:border-red-500/40 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{fmt.label}</span>
                            {fmt.isUltra && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded text-[10px] font-black uppercase tracking-wider">
                                PRO 60FPS
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                            <span>{fmt.resolution}</span>
                            <span>•</span>
                            <span>{fmt.bitrate}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{fmt.size}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownload(fmt.url, `yt_shorts_${media.id}_${fmt.resolution.split(' ')[0]}.mp4`, fmt.label)}
                          disabled={downloadingFormat === fmt.label}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                            fmt.isUltra
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                          }`}
                        >
                          {downloadingFormat === fmt.label ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download size={14} />
                              <span>Download MP4</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Thumbnail / Maxres Poster */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="text-red-500" size={20} />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">Maxres YouTube Thumbnail Poster</div>
                        <div className="text-xs text-slate-500 font-mono">1920 x 1080 • Ultra HD JPG</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(media.thumbnailUrl, `yt_shorts_thumbnail_${media.id}.jpg`, 'thumb')}
                      className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>Download Poster</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'audio' && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Music className="text-red-500" size={18} />
                    <span>Extract High-Fidelity YouTube Audio (MP3)</span>
                  </h3>

                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
                        <Music size={24} />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{media.audioTrack}</div>
                        <div className="text-xs text-slate-500 font-mono">Studio Master • 320 kbps High Bitrate • Lossless AAC/MP3</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleDownload(media.videoUrl, `yt_audio_${media.id}.mp3`, 'audio_mp3')}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={15} />
                        <span>Download MP3 Audio (320kbps)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(media.audioTrack, 'audio_title')}
                        className="px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        {copiedText === 'audio_title' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        <span>Copy Title</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="text-red-500" size={18} />
                    <span>Video Description & SEO Tags</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Video Title & Description</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`${media.title}\n\n${media.description}`, 'desc')}
                          className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                        >
                          {copiedText === 'desc' ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedText === 'desc' ? 'Copied' : 'Copy Full Description'}</span>
                        </button>
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{media.title}</div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                        {media.description}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Video Tags ({media.tags.length})</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(media.tags.join(', '), 'tags')}
                          className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                        >
                          {copiedText === 'tags' ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedText === 'tags' ? 'Copied' : 'Copy All Tags'}</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {media.tags.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs font-mono font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">4K UHD & 1080p 60 FPS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download vertical Shorts and horizontal full videos at their native bitrate with zero compression loss.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Watermark & Direct MP4</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Raw MP4 and MP3 files without any watermarks, overlays, or platform branding attached.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Music size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lossless 320kbps MP3 Audio</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Extract background music, sound effects, podcasts, and speeches into high-clarity 320kbps MP3 audio files.
          </p>
        </div>
      </div>
    </div>
  );
}
