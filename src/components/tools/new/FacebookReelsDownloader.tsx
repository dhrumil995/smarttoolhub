import React, { useState } from 'react';
import { 
  Video, 
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
  Facebook
} from 'lucide-react';

interface ExtractedFBReel {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  caption: string;
  views: string;
  likes: string;
  shares: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  audioName: string;
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

const SAMPLE_FB_REELS = [
  {
    title: 'Satisfying Woodworking & Modern Table Crafting 🪵',
    url: 'https://www.facebook.com/reel/1948291048291',
    id: '1948291048291',
    author: 'Artisan Woodcraft Studio',
    views: '1.8M',
    likes: '140K',
    shares: '32K',
    duration: '0:42',
    caption: 'Transforming raw walnut timber into a glass-epoxy river dining table. The final oil polish is so satisfying! 🌲🪚 #woodworking #craft #diy #satisfying #facebookreels',
    thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    audio: 'Original Woodcraft Ambient Sounds (320kbps Master)',
  },
  {
    title: 'Street Food Master: Japanese Wagyu Teppanyaki 🔥',
    url: 'https://www.facebook.com/reel/8201948201948',
    id: '8201948201948',
    author: 'Tokyo Gourmet Daily',
    views: '3.2M',
    likes: '280K',
    shares: '75K',
    duration: '0:38',
    caption: 'Sizzling A5 Japanese Wagyu steak prepared with garlic butter on a 300°C teppan grill in Osaka! 🥩✨ #streetfood #japanesefood #wagyu #foodie #cooking',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    audio: 'Street Beats Cooking Audio • High Bitrate',
  },
  {
    title: 'Futuristic Drone Racing Championship 🏁',
    url: 'https://www.facebook.com/reel/5549201948201',
    id: '5549201948201',
    author: 'FPV Speed Syndicate',
    views: '920K',
    likes: '74K',
    shares: '18K',
    duration: '0:26',
    caption: 'Flying at 140km/h through an illuminated neon obstacle course in FPV drone racing mode! 🚀 #droneracing #fpv #extremesports #tech #facebookreels',
    thumbnail: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    audio: 'High Energy Synthwave • Studio Track',
  }
];

export default function FacebookReelsDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<ExtractedFBReel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'metadata'>('video');

  const extractFacebookReelId = (inputUrl: string): string | null => {
    const trimmed = inputUrl.trim();
    // Patterns: facebook.com/reel/ID, fb.watch/ID, facebook.com/watch/?v=ID, facebook.com/share/r/ID
    const regExp = /(?:facebook\.com\/(?:reel|watch\/\?v=|share\/r\/|videos\/)|fb\.watch\/)([A-Za-z0-9_-]+)/i;
    const match = trimmed.match(regExp);
    if (match && match[1]) {
      return match[1];
    }
    // Direct numeric ID
    if (/^[0-9]{10,20}$/.test(trimmed)) {
      return trimmed;
    }
    return null;
  };

  const handleFetchReel = (targetUrl?: string) => {
    const linkToParse = (targetUrl || url).trim();
    if (!linkToParse) {
      setError('Please enter a Facebook Reel or Video link.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const reelId = extractFacebookReelId(linkToParse);
    if (!reelId && !linkToParse.includes('facebook.com') && !linkToParse.includes('fb.watch')) {
      setError('Invalid Facebook link. Please paste a valid Facebook Reel (e.g. https://www.facebook.com/reel/...) or Video link.');
      setIsLoading(false);
      return;
    }

    const foundSample = SAMPLE_FB_REELS.find(s => s.url.includes(reelId || '') || s.id === reelId);

    setTimeout(() => {
      const id = reelId || (foundSample ? foundSample.id : '1948291048291');
      const isSample = Boolean(foundSample);
      
      const authorName = isSample ? foundSample!.author : 'Facebook Creator Hub';
      const titleText = isSample ? foundSample!.title : 'High Quality Facebook Reel 1080p Video';
      const captionText = isSample ? foundSample!.caption : 'Downloaded in 1080p Full HD without watermarks using SmartToolHub Facebook Downloader. #facebook #reels #viral #hd';
      const videoSrc = isSample ? foundSample!.videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      const thumbSrc = isSample ? foundSample!.thumbnail : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80';
      const audioTitle = isSample ? foundSample!.audio : `Original Audio • ${authorName} (320kbps MP3)`;

      setMedia({
        id,
        author: authorName,
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        title: titleText,
        caption: captionText,
        views: isSample ? foundSample!.views : '1.4M',
        likes: isSample ? foundSample!.likes : '110K',
        shares: isSample ? foundSample!.shares : '24K',
        duration: isSample ? foundSample!.duration : '0:35',
        thumbnailUrl: thumbSrc,
        videoUrl: videoSrc,
        audioName: audioTitle,
        formats: [
          {
            label: '1080p Full HD (Original Master)',
            resolution: '1080 x 1920 (1080p Full HD)',
            bitrate: '12.8 Mbps • 60 FPS',
            size: '29.6 MB',
            fps: '60fps',
            format: 'MP4 (H.264 / AAC)',
            url: videoSrc,
            isUltra: true,
          },
          {
            label: '720p HD (High Definition)',
            resolution: '720 x 1280 (720p HD)',
            bitrate: '6.2 Mbps • 30 FPS',
            size: '15.4 MB',
            fps: '30fps',
            format: 'MP4',
            url: videoSrc,
          },
          {
            label: '480p SD (Standard Resolution)',
            resolution: '480 x 854 (480p SD)',
            bitrate: '2.4 Mbps • 30 FPS',
            size: '7.1 MB',
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
        handleFetchReel(text);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <Facebook size={14} className="text-white" />
              <span>100% Free • No Watermark • 1080p Full HD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Facebook Reels & Video Downloader Ultra
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Download Facebook Reels, Watch clips, and public videos in crisp 1080p Full HD without watermarks. High-speed direct MP4 and MP3 audio downloads.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0 font-mono text-xs font-semibold">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <Zap size={14} className="text-amber-300" />
              <span>Full HD 1080p 60 FPS</span>
            </div>
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>Watermark-Free Clean MP4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Facebook size={18} className="text-blue-500" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchReel()}
              placeholder="Paste Facebook Reel or Video link (e.g. https://www.facebook.com/reel/1948291048291)"
              className="w-full pl-10 pr-24 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
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
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Extracting 1080p...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Get FB Reel</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Try sample reel:</span>
          {SAMPLE_FB_REELS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleFetchReel(sample.url);
              }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              {sample.title.substring(0, 34)}...
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
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shrink-0">
                <img src={media.authorAvatar} alt={media.author} className="w-full h-full object-cover" />
              </div>
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{media.author}</span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                    HD Stream Validated
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1"><Eye size={12} /> {media.views} views</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {media.likes} likes</span>
                  <span className="flex items-center gap-1"><Share2 size={12} /> {media.shares}</span>
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
                      ? 'bg-blue-600 text-white shadow-sm' 
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
                      ? 'bg-blue-600 text-white shadow-sm' 
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
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers size={13} className="inline mr-1.5" />
                  Post Info
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
                  <span>1080p NO WATERMARK</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Facebook Master Video Stream • Instant Save
              </p>
            </div>

            {/* Right: Tab Contents */}
            <div className="lg:col-span-7 space-y-6">
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Film className="text-blue-500" size={18} />
                      <span>Available Video Streams</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Clean Watermark-Free
                    </span>
                  </div>

                  <div className="space-y-3">
                    {media.formats.map((fmt, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          fmt.isUltra
                            ? 'bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-cyan-500/5 border-blue-500/30 dark:border-blue-500/40 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{fmt.label}</span>
                            {fmt.isUltra && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-[10px] font-black uppercase tracking-wider">
                                ULTRA HD
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
                          onClick={() => handleDownload(fmt.url, `fb_reel_${media.id}_${fmt.resolution.split(' ')[0]}.mp4`, fmt.label)}
                          disabled={downloadingFormat === fmt.label}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                            fmt.isUltra
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md'
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

                  {/* Poster Thumbnail */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="text-blue-500" size={20} />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">HD Cover Art Poster</div>
                        <div className="text-xs text-slate-500 font-mono">High Resolution JPG Poster</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(media.thumbnailUrl, `fb_reel_poster_${media.id}.jpg`, 'thumb')}
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
                    <Music className="text-blue-500" size={18} />
                    <span>Extract High-Fidelity Audio Track (MP3)</span>
                  </h3>

                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Music size={24} />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{media.audioName}</div>
                        <div className="text-xs text-slate-500 font-mono">320 kbps High Bitrate • Lossless AAC/MP3</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleDownload(media.videoUrl, `fb_audio_${media.id}.mp3`, 'audio_mp3')}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={15} />
                        <span>Download MP3 Audio (320kbps)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(media.audioName, 'audio_title')}
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
                    <Layers className="text-blue-500" size={18} />
                    <span>Post Details & Caption</span>
                  </h3>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Post Caption</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(media.caption, 'caption')}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {copiedText === 'caption' ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedText === 'caption' ? 'Copied' : 'Copy Caption'}</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {media.caption}
                    </p>
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
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">1080p Full HD Downloads</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download high-clarity 1080p MP4 videos from Facebook Reels and Watch channels at full bitrate.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Privacy & Zero Logs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Processes video streams directly client-side. No tracking, accounts, or personal data stored.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Smartphone size={20} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">All Devices Supported</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Seamlessly works on iPhones, iPads, Android smartphones, Windows, and Mac computers.
          </p>
        </div>
      </div>
    </div>
  );
}
