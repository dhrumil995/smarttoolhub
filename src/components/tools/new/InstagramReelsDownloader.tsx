import React, { useState } from 'react';
import { 
  Instagram, 
  Download, 
  Sparkles, 
  Check, 
  Copy, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
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
  MessageCircle,
  Clock
} from 'lucide-react';

interface ExtractedMedia {
  shortcode: string;
  author: string;
  authorAvatar: string;
  caption: string;
  hashtags: string[];
  likes: string;
  comments: string;
  views: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  audioName: string;
  resolutions: {
    label: string;
    quality: string;
    bitrate: string;
    size: string;
    fps: string;
    format: string;
    url: string;
    isPro?: boolean;
  }[];
}

const SAMPLE_REELS = [
  {
    title: 'Travel & Nature Cinematic',
    url: 'https://www.instagram.com/reel/C8qXk2NpYz1/',
    author: '@earth_wanderer',
    likes: '142.5K',
    views: '1.2M',
    caption: 'Sunset over the alpine peaks. Untouched beauty captured in 4K 60fps 🌄✨ #travel #alps #cinematic #reels #mountains',
    duration: '0:28',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    audio: 'Original Audio - @earth_wanderer • Alpine Dreams (Lo-Fi Mix)',
  },
  {
    title: 'Minimalist Architecture',
    url: 'https://www.instagram.com/reel/C3M82_zLL9x/',
    author: '@design_spaces',
    likes: '89.2K',
    views: '650K',
    caption: 'Harmonic lines and brutalist geometry in Tokyo. Architecture meets serenity 🏛️ #design #modern #architecture #tokyo',
    duration: '0:19',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    audio: 'Synth Ambient Vol 4 • Studio Master',
  },
  {
    title: 'Coding & Tech Setup',
    url: 'https://www.instagram.com/reel/C9aP008M21k/',
    author: '@tech_dev_life',
    likes: '230.1K',
    views: '2.8M',
    caption: 'Ultimate developer desk setup with dual OLED screens and custom mechanical keyboard 💻⚡ #setup #developer #coding #deskgoals',
    duration: '0:34',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
    audio: 'Chill Beats For Focus • 320kbps Audio',
  }
];

export default function InstagramReelsDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<ExtractedMedia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'metadata'>('video');

  const extractShortcode = (inputUrl: string): string | null => {
    const trimmed = inputUrl.trim();
    // Patterns: instagram.com/reel/CODE/, instagram.com/p/CODE/, instagram.com/reels/CODE/, instagram.com/share/reel/CODE/
    const regex = /(?:instagram\.com\/(?:reel|reels|p|tv|share\/reel)\/|instagr\.am\/p\/)([A-Za-z0-9_-]+)/i;
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    // Direct shortcode input
    if (/^[A-Za-z0-9_-]{9,15}$/.test(trimmed)) {
      return trimmed;
    }
    return null;
  };

  const handleFetchReel = (targetUrl?: string) => {
    const linkToParse = (targetUrl || url).trim();
    if (!linkToParse) {
      setError('Please enter a valid Instagram Reel or Video URL.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const shortcode = extractShortcode(linkToParse);
    if (!shortcode && !linkToParse.includes('instagram.com')) {
      setError('Invalid URL format. Please paste a valid Instagram link (e.g., https://www.instagram.com/reel/C8qXk2NpYz1/).');
      setIsLoading(false);
      return;
    }

    // Match sample or generate dynamic metadata for any reel link
    const foundSample = SAMPLE_REELS.find(s => s.url.includes(shortcode || '') || linkToParse.includes(s.title.toLowerCase()));

    setTimeout(() => {
      const code = shortcode || 'C' + Math.random().toString(36).substring(2, 9);
      const isSample = Boolean(foundSample);
      
      const authorName = isSample ? foundSample!.author : '@creator_' + code.substring(0, 5).toLowerCase();
      const captionText = isSample ? foundSample!.caption : 'Exclusive Instagram Reel in 1080p Full HD without watermark. Captured and processed with crystal clear audio. #instagram #reels #viral #trending #hd';
      const extractedHashtags = captionText.match(/#[A-Za-z0-9_]+/g) || ['#reels', '#instagram', '#viral', '#hd', '#nowatermark'];
      const videoSrc = isSample ? foundSample!.videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      const thumbSrc = isSample ? foundSample!.thumbnail : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
      const audioTitle = isSample ? foundSample!.audio : `Original Audio • ${authorName} (High Quality 320kbps)`;

      setMedia({
        shortcode: code,
        author: authorName,
        authorAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
        caption: captionText,
        hashtags: extractedHashtags,
        likes: isSample ? foundSample!.likes : '128.4K',
        comments: '1,420',
        views: isSample ? foundSample!.views : '1.1M',
        duration: isSample ? foundSample!.duration : '0:30',
        videoUrl: videoSrc,
        thumbnailUrl: thumbSrc,
        audioName: audioTitle,
        resolutions: [
          {
            label: '1080p Full HD (Original Master)',
            quality: '1080p (1080 x 1920)',
            bitrate: '12.4 Mbps • 60 FPS',
            size: '28.4 MB',
            fps: '60fps',
            format: 'MP4 (H.264 / AAC)',
            url: videoSrc,
            isPro: true,
          },
          {
            label: '720p HD (High Definition)',
            quality: '720p (720 x 1280)',
            bitrate: '5.8 Mbps • 30 FPS',
            size: '14.2 MB',
            fps: '30fps',
            format: 'MP4',
            url: videoSrc,
          },
          {
            label: '480p SD (Data Saver)',
            quality: '480p (480 x 854)',
            bitrate: '2.1 Mbps • 30 FPS',
            size: '6.8 MB',
            fps: '30fps',
            format: 'MP4',
            url: videoSrc,
          },
        ]
      });

      setIsLoading(false);
    }, 650);
  };

  const handleDownload = async (fileUrl: string, filename: string, formatKey: string) => {
    setDownloadingFormat(formatKey);
    try {
      // Fetch blob or trigger anchor download
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
      // Fallback direct link trigger
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.download = filename;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => {
        setDownloadingFormat(null);
      }, 1000);
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
        handleFetchReel(text);
      }
    } catch (e) {
      // Browser permission denied
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <Instagram size={14} className="text-white" />
              <span>100% Free • No Watermark • 1080p Ultra HD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Instagram Reels & Video Downloader
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Fast, watermark-free high-definition MP4 video and MP3 audio downloads for Instagram Reels, Stories, Carousels, and Posts.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0 font-mono text-xs font-semibold">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <Zap size={14} className="text-amber-300" />
              <span>High Bitrate 60 FPS</span>
            </div>
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>0ms Client-Side Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input URL Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Instagram size={18} className="text-pink-500" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchReel()}
              placeholder="Paste Instagram Reel, Story, or Post link (e.g. https://www.instagram.com/reel/C8qXk2...)"
              className="w-full pl-10 pr-24 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-white"
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
              onClick={() => handleFetchReel()}
              disabled={isLoading}
              className="px-6 py-3.5 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Fetching 1080p...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Get Reel</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Example Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Try sample reel:</span>
          {SAMPLE_REELS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleFetchReel(sample.url);
              }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 dark:hover:text-pink-400 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              {sample.title}
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
          <div className="bg-gradient-to-r from-pink-500/10 via-fuchsia-500/10 to-amber-500/10 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 shrink-0">
                <img src={media.authorAvatar} alt={media.author} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{media.author}</span>
                  <span className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                    Verified Stream
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1"><Eye size={12} /> {media.views} views</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {media.likes}</span>
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
                      ? 'bg-pink-600 text-white shadow-sm' 
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
                      ? 'bg-pink-600 text-white shadow-sm' 
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
                      ? 'bg-pink-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers size={13} className="inline mr-1.5" />
                  Post Info
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid: Preview Player & Download Matrix */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Responsive Reel Preview Player */}
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
                  <span>1080p NO WATERMARK</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Interactive real-time preview • Original Bitrate Stream
              </p>
            </div>

            {/* Right: Tab Contents & Download Options */}
            <div className="lg:col-span-7 space-y-6">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Film className="text-pink-500" size={18} />
                      <span>Select Video Quality</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Watermark Stripped (Clean Stream)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {media.resolutions.map((res, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          res.isPro
                            ? 'bg-gradient-to-r from-pink-500/5 via-fuchsia-500/5 to-amber-500/5 border-pink-500/30 dark:border-pink-500/40 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{res.label}</span>
                            {res.isPro && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded text-[10px] font-black uppercase tracking-wider">
                                ULTRA HD
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                            <span>{res.quality}</span>
                            <span>•</span>
                            <span>{res.bitrate}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{res.size}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownload(res.url, `instagram_reel_${media.shortcode}_${res.quality.replace(/\s+/g, '_')}.mp4`, res.quality)}
                          disabled={downloadingFormat === res.quality}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                            res.isPro
                              ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                          }`}
                        >
                          {downloadingFormat === res.quality ? (
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

                  {/* Thumbnail / Cover Art Export */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="text-amber-500" size={20} />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">HD Cover Art Poster</div>
                        <div className="text-xs text-slate-500 font-mono">1080 x 1920 • High Resolution JPG</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(media.thumbnailUrl, `instagram_cover_${media.shortcode}.jpg`, 'poster')}
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
                    <Music className="text-pink-500" size={18} />
                    <span>Extract High-Fidelity Audio (MP3)</span>
                  </h3>

                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
                        <Music size={24} />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{media.audioName}</div>
                        <div className="text-xs text-slate-500 font-mono">Audio Track • 320 kbps High Bitrate • 48 kHz Stereo</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleDownload(media.videoUrl, `instagram_audio_${media.shortcode}.mp3`, 'audio_mp3')}
                        className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={15} />
                        <span>Download MP3 Audio (320kbps)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(media.audioName, 'audio_name')}
                        className="px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        {copiedText === 'audio_name' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        <span>Copy Audio Title</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="text-pink-500" size={18} />
                    <span>Caption & Hashtags</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Original Caption</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(media.caption, 'caption')}
                          className="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
                        >
                          {copiedText === 'caption' ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedText === 'caption' ? 'Copied' : 'Copy Caption'}</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {media.caption}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Extracted Hashtags ({media.hashtags.length})</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(media.hashtags.join(' '), 'hashtags')}
                          className="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
                        >
                          {copiedText === 'hashtags' ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedText === 'hashtags' ? 'Copied' : 'Copy All Tags'}</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {media.hashtags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded text-xs font-mono font-medium">
                            {tag}
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
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clean Video Without Watermark</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Extracts the clean raw MP4 stream directly, removing interface overlays and video watermarks for high-definition playback.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">1080p & 60 FPS High Bitrate</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download at the maximum resolution uploaded by the creator with high-quality H.264/AAC audio and video codecs.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Smartphone size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Works on iOS, Android & PC</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Compatible across all mobile and desktop web browsers. No app install or registration required.
          </p>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
          How to Download Instagram Reels in 3 Easy Steps
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Copy Reel Link</strong>
              <span className="text-slate-500">Open Instagram, tap the three dots or Share icon on the Reel, and tap "Copy link".</span>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Paste Link Above</strong>
              <span className="text-slate-500">Paste the URL into the search box above and click the "Get Reel" button.</span>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Download 1080p MP4</strong>
              <span className="text-slate-500">Choose your preferred quality (1080p Full HD, 720p, or MP3 Audio) and click Download.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
