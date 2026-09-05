import React, { useState, useMemo } from 'react';
import { AlignLeft, Copy, Check, Info, FileText, LayoutTemplate, Trash2, ArrowRight, Sparkles, CheckSquare } from 'lucide-react';

interface TimestampItem {
  time: string;
  title: string;
}

type VideoTemplate = 'tech' | 'gaming' | 'tutorial' | 'vlog';

export default function YTDescriptionGenerator() {
  const [template, setTemplate] = useState<VideoTemplate>('tech');
  const [copied, setCopied] = useState(false);

  // Form Fields State
  const [intro, setIntro] = useState('In this video, we are breaking down the absolute best ways to design fluid utility layouts in Tailwind CSS without creating endless class chaos. From container grids to responsive fluid typography, let\'s dive in!');
  const [ctaText, setCtaText] = useState('Download the Source Code & Assets');
  const [ctaLink, setCtaLink] = useState('https://github.com/example/tailwind-fluid-grids');
  
  const [timestamps, setTimestamps] = useState<TimestampItem[]>([
    { time: '00:00', title: 'Introduction & Overview' },
    { time: '01:45', title: 'The Problem with Standard Grids' },
    { time: '04:12', title: 'Configuring Tailwind Fluid Utilities' },
    { time: '08:30', title: 'Testing Responsive Breakpoints' },
    { time: '11:55', title: 'Conclusion & Summary' },
  ]);

  const [aboutChannel, setAboutChannel] = useState('Our channel is dedicated to giving web developers clean, modern, and practical tutorials. We skip the fluff and focus purely on premium UI crafts, clean CSS systems, and frontend optimizations.');
  
  // Socials
  const [twitter, setTwitter] = useState('https://x.com/mydeveloperhandle');
  const [instagram, setInstagram] = useState('https://instagram.com/mydeveloperhandle');
  const [website, setWebsite] = useState('https://mydevsite.com');

  // Specs or products
  const [products, setProducts] = useState('1. MacBook Pro M3 Max (64GB RAM)\n2. VS Code (Github Dark Theme)\n3. Keychron K2 Mechanical Keyboard');

  // Hashtags
  const [rawHashtags, setRawHashtags] = useState('tailwind, webdesign, css, frontend, responsive');

  // Disclaimers
  const [includeAffiliate, setIncludeAffiliate] = useState(true);
  const [includeCopyright, setIncludeCopyright] = useState(true);

  // Handle template switch presets
  const handleTemplateChange = (type: VideoTemplate) => {
    setTemplate(type);
    if (type === 'tech') {
      setIntro('In this video, we are breaking down the absolute best ways to design fluid utility layouts in Tailwind CSS without creating endless class chaos. From container grids to responsive fluid typography, let\'s dive in!');
      setCtaText('Download the Source Code & Assets');
      setCtaLink('https://github.com/example/tailwind-fluid-grids');
      setRawHashtags('tailwind, webdesign, css, frontend, responsive');
    } else if (type === 'gaming') {
      setIntro('Today we are diving head-first into the hardest speedrun challenge in Elden Ring. I spent over 48 hours practicing this route to get it perfectly under 30 minutes. Let\'s see if we can secure the world record!');
      setCtaText('Join our Discord Gaming Community');
      setCtaLink('https://discord.gg/eldenringchallenge');
      setRawHashtags('eldenring, speedrun, gaming, gamer, playstation');
    } else if (type === 'tutorial') {
      setIntro('Learn how to build a complete full-stack React and Express dashboard from scratch! We will cover everything from initializing Vite, adding Tailwind, handling routing, and setting up persistent state managers.');
      setCtaText('Get the Complete Written Guide');
      setCtaLink('https://mydevsite.com/react-dashboard-tutorial');
      setRawHashtags('react, typescript, learnwebdev, coding, javascript');
    } else if (type === 'vlog') {
      setIntro('Spend a fully loaded creative day with me in Tokyo! Today we are exploring the best minimalist stationery shops in Ginza, drinking high-fidelity pour-overs in Shibuya, and talking about how to manage burnout.');
      setCtaText('Sign up for my Weekly Newsletter');
      setCtaLink('https://mydevsite.com/newsletter');
      setRawHashtags('tokyo, vlog, traveler, lifestyle, developerday');
    }
  };

  // Timestamp helpers
  const handleAddTimestamp = () => {
    setTimestamps([...timestamps, { time: '', title: '' }]);
  };

  const handleRemoveTimestamp = (index: number) => {
    const list = [...timestamps];
    list.splice(index, 1);
    setTimestamps(list);
  };

  const handleTimestampChange = (index: number, key: 'time' | 'title', val: string) => {
    const list = [...timestamps];
    list[index][key] = val;
    setTimestamps(list);
  };

  // Compile final description text block
  const fullDescription = useMemo(() => {
    let result = '';

    // 1. Hook / Intro
    if (intro.trim()) {
      result += `${intro.trim()}\n\n`;
    }

    // 2. Call to Action Links
    if (ctaText.trim() && ctaLink.trim()) {
      result += `🔥 ${ctaText.trim()}:\n👉 ${ctaLink.trim()}\n\n`;
    }

    result += `=========================================\n\n`;

    // 3. Timestamps Chapters
    const validTimestamps = timestamps.filter(t => t.time.trim() && t.title.trim());
    if (validTimestamps.length > 0) {
      result += `📌 TIMESTAMPS / CHAPTERS:\n`;
      validTimestamps.forEach(t => {
        result += `${t.time.trim()} - ${t.title.trim()}\n`;
      });
      result += `\n`;
    }

    // 4. Products / Gear used
    if (products.trim()) {
      result += `🛠️ MY HARDWARE & DEVELOPER GEAR:\n${products.trim()}\n\n`;
    }

    // 5. About Channel
    if (aboutChannel.trim()) {
      result += `👋 ABOUT THE CHANNEL:\n${aboutChannel.trim()}\n\n`;
    }

    // 6. Social Connects
    if (twitter.trim() || instagram.trim() || website.trim()) {
      result += `💬 LET'S CONNECT:\n`;
      if (website.trim()) result += `🌐 Website: ${website.trim()}\n`;
      if (twitter.trim()) result += `🐦 Twitter / X: ${twitter.trim()}\n`;
      if (instagram.trim()) result += `📸 Instagram: ${instagram.trim()}\n`;
      result += `\n`;
    }

    // 7. Legalese disclaimers
    if (includeAffiliate || includeCopyright) {
      result += `-----------------------------------------\n\n`;
      if (includeAffiliate) {
        result += `⚠️ AFFILIATE DISCLAIMER:\nSome of the links above may be affiliate links. If you purchase a product or service through one of these links, I may receive a small commission at no additional cost to you. Thank you for supporting the channel!\n\n`;
      }
      if (includeCopyright) {
        result += `© Copyright Info:\nAll content is property of the respective channel owners. Do not reproduce or re-upload without express written permission.\n\n`;
      }
    }

    // 8. Hashtags
    if (rawHashtags.trim()) {
      const tags = rawHashtags.split(',')
        .map(t => t.trim().replace(/#/g, ''))
        .filter(t => t.length > 0)
        .map(t => `#${t}`);
      if (tags.length > 0) {
        result += `${tags.join(' ')}\n`;
      }
    }

    return result;
  }, [intro, ctaText, ctaLink, timestamps, aboutChannel, twitter, instagram, website, products, rawHashtags, includeAffiliate, includeCopyright]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Template switcher row */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-1.5">
          <LayoutTemplate size={14} className="text-red-500" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select Video Niche:</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {(['tech', 'gaming', 'tutorial', 'vlog'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTemplateChange(type)}
              className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
                template === type
                  ? 'bg-red-600 dark:bg-red-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type === 'tech' ? '💻 Tech & Product' : type === 'gaming' ? '🎮 Gaming Content' : type === 'tutorial' ? '📚 Edu / Tutorial' : '📸 Vlogging Story'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: interactive fields */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
            <FileText size={16} className="text-red-500" />
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Video Context Variables
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Intro / Hook */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600 dark:text-slate-400">Video Hook / Introduction</label>
              <textarea
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                rows={3}
                placeholder="Write the first 2 lines summarizing the video..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200 resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Main CTA Links */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Main Call-To-Action Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Download the resources"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-850 dark:text-slate-200 font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Call-To-Action Link URL</label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="e.g. https://github.com..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-850 dark:text-slate-200 font-medium"
                />
              </div>
            </div>

            {/* Timestamps Chapters List */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Chapters & Timestamps</label>
                <button
                  type="button"
                  onClick={handleAddTimestamp}
                  className="px-2 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg cursor-pointer"
                >
                  + Add Chapter
                </button>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {timestamps.map((t, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={t.time}
                      onChange={(e) => handleTimestampChange(idx, 'time', e.target.value)}
                      placeholder="MM:SS"
                      className="w-20 px-2.5 py-1.5 text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-850 dark:text-slate-200 font-mono text-[11px]"
                    />
                    <input
                      type="text"
                      value={t.title}
                      onChange={(e) => handleTimestampChange(idx, 'title', e.target.value)}
                      placeholder="Chapter name/topic"
                      className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-850 dark:text-slate-200 font-medium text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTimestamp(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-full cursor-pointer"
                      title="Remove timestamp"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gear and Hardware */}
            <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-850 pt-4">
              <label className="block font-bold text-slate-600 dark:text-slate-400">Equipment / Tools Mentioned</label>
              <textarea
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                rows={2}
                placeholder="Hardware specs, mechanical keyboard, screen recorders..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200 font-medium leading-relaxed"
              />
            </div>

            {/* About Channel blurb */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-600 dark:text-slate-400">About Your Channel Mission</label>
              <textarea
                value={aboutChannel}
                onChange={(e) => setAboutChannel(e.target.value)}
                rows={2}
                placeholder="Channel mission, what subscribers can expect from you..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200 font-medium leading-relaxed"
              />
            </div>

            {/* Social Connect links */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
              <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Social Accounts Connect
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://mysite.com"
                    className="w-full px-2.5 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Twitter / X</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="Twitter handle"
                    className="w-full px-2.5 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Instagram</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram profile"
                    className="w-full px-2.5 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Hashtags and Legalese disclaimers */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Comma Hashtags</label>
                <input
                  type="text"
                  value={rawHashtags}
                  onChange={(e) => setRawHashtags(e.target.value)}
                  placeholder="e.g. tailwind, css, react"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-850 dark:text-slate-200 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-600 dark:text-slate-400">Legal Disclaimers</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAffiliate}
                      onChange={(e) => setIncludeAffiliate(e.target.checked)}
                      className="w-3.5 h-3.5 text-red-600 border-slate-300 rounded focus:ring-red-500"
                    />
                    <span>Affiliate warning</span>
                  </label>
                  <label className="flex items-center gap-2 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCopyright}
                      onChange={(e) => setIncludeCopyright(e.target.checked)}
                      className="w-3.5 h-3.5 text-red-600 border-slate-300 rounded focus:ring-red-500"
                    />
                    <span>Copyright details</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: compiled view container and YouTube mock display */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mock YouTube Description Panel */}
          <div className="bg-white dark:bg-[#1a1b1c] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-3.5">
            <h4 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3 text-xs">
              <Sparkles size={14} className="text-red-500" />
              Simulated YouTube Video Page View
            </h4>

            {/* YouTube styled metadata summary box */}
            <div className="bg-[#f2f2f2] dark:bg-[#272727] rounded-xl p-4 font-sans text-xs text-[#0f0f0f] dark:text-[#f1f1f1] space-y-2 text-left">
              <div className="flex gap-2.5 font-bold">
                <span>152,420 views</span>
                <span>Premiered Oct 24, 2026</span>
                <span className="text-slate-500 dark:text-slate-400">#TailwindCSS #Frontend</span>
              </div>

              {/* Text simulation with styling */}
              <div className="font-sans leading-relaxed whitespace-pre-wrap max-h-[170px] overflow-y-auto font-medium text-[#212121] dark:text-[#dfdfdf]">
                {fullDescription}
              </div>
            </div>
          </div>

          {/* Exporter code block */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="space-y-0.5">
                <span className="block font-mono text-xs font-bold text-slate-350">
                  Ready SEO Optimized Video Description
                </span>
                <span className="block text-[10px] text-slate-500 font-medium font-sans">
                  Use this completely formatted description block directly in YouTube Studio upload.
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl font-semibold font-sans text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer animate-none"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy Description'}
              </button>
            </div>

            <textarea
              readOnly
              value={fullDescription}
              className="w-full h-[180px] p-3 font-mono text-[11px] text-[#79c0ff] bg-slate-950/60 rounded-xl border border-slate-900 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
