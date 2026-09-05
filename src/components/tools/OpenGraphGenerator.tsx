import React, { useState } from 'react';
import { Share2, Globe, Copy, Check, Eye, Code, Image as ImageIcon } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function OpenGraphGenerator() {
  const [title, setTitle] = useState('SmartToolHub - 80+ Free Online Developer & SEO Utilities');
  const [description, setDescription] = useState('Free online tool suite featuring AI generators, JSON tools, SEO keywords, image converters, and developer utilities.');
  const [url, setUrl] = useState('https://smarttoolhub.net');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80');
  const [siteName, setSiteName] = useState('SmartToolHub');
  const [twitterHandle, setTwitterHandle] = useState('@smarttoolhub');
  const [copied, setCopied] = useState(false);

  const metaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter Cards -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />
<meta property="twitter:site" content="${twitterHandle}" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(metaHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-extrabold uppercase tracking-widest border border-indigo-500/20">
          <Share2 size={14} /> Social SEO Tool
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Open Graph & Social Media Card Previewer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Generate perfectly formatted Open Graph meta tags and live preview how your link looks on Twitter, Facebook, LinkedIn, and Slack.
        </p>
      </div>

      <AdSenseSlot slot="open-graph-top" />

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Globe size={14} className="text-indigo-500" /> Meta Tags Settings
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Page Title ({title.length} chars)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description ({description.length} chars)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Canonical URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              OG Image Banner URL (1200x630px recommended)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Live Social Cards Preview */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Eye size={14} className="text-indigo-500" /> Live Social Card Preview
          </h3>

          {/* Social Card Mockup */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="OG Preview"
                className="w-full h-48 object-cover border-b border-slate-800"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-slate-800 flex items-center justify-center text-slate-500">
                <ImageIcon size={32} />
              </div>
            )}
            <div className="p-4 space-y-1 bg-slate-900">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {url ? new URL(url).hostname : 'example.com'}
              </span>
              <h4 className="font-bold text-sm text-white line-clamp-1">
                {title || 'Page Title Placeholder'}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {description || 'Page description preview goes here...'}
              </p>
            </div>
          </div>

          {/* HTML Output Code Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Generated HTML Meta Tags
              </span>
              <button
                onClick={handleCopy}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied HTML' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-xl font-mono text-[11px] text-indigo-300 overflow-x-auto whitespace-pre">
              {metaHtml}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
