import React, { useState } from 'react';
import { Copy, Check, Download, Plus, Trash2, Network, Sparkles, Code } from 'lucide-react';

interface SitemapUrl {
  id: string;
  loc: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

export const SitemapGenerator: React.FC = () => {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { id: '1', loc: 'https://example.com/', priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
    { id: '2', loc: 'https://example.com/about', priority: '0.8', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { id: '3', loc: 'https://example.com/tools', priority: '0.9', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
  ]);

  const [copied, setCopied] = useState<boolean>(false);

  const addUrlRow = () => {
    setUrls([
      ...urls,
      {
        id: Date.now().toString(),
        loc: 'https://example.com/new-page',
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const removeUrlRow = (id: string) => {
    setUrls(urls.filter((u) => u.id !== id));
  };

  const updateUrlRow = (id: string, field: keyof SitemapUrl, value: string) => {
    setUrls(urls.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  const generateSitemapXml = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach((item) => {
      xml += `  <url>\n`;
      xml += `    <loc>${item.loc}</loc>\n`;
      xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      xml += `    <priority>${item.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    xml += `</urlset>`;
    return xml;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSitemapXml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const xml = generateSitemapXml();
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: URL Entries */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Network size={18} className="text-blue-500" />
              Sitemap URLs ({urls.length})
            </h2>
            <button
              onClick={addUrlRow}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add URL
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {urls.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={item.loc}
                    onChange={(e) => updateUrlRow(item.id, 'loc', e.target.value)}
                    placeholder="https://example.com/page"
                    className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono font-medium"
                  />
                  <button
                    onClick={() => removeUrlRow(item.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    title="Remove URL"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Priority</label>
                    <select
                      value={item.priority}
                      onChange={(e) => updateUrlRow(item.id, 'priority', e.target.value)}
                      className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                    >
                      <option value="1.0">1.0 (Highest)</option>
                      <option value="0.9">0.9</option>
                      <option value="0.8">0.8</option>
                      <option value="0.7">0.7</option>
                      <option value="0.5">0.5 (Medium)</option>
                      <option value="0.3">0.3</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Change Freq</label>
                    <select
                      value={item.changefreq}
                      onChange={(e) => updateUrlRow(item.id, 'changefreq', e.target.value)}
                      className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                    >
                      <option value="always">always</option>
                      <option value="hourly">hourly</option>
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                      <option value="never">never</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Last Modified</label>
                    <input
                      type="date"
                      value={item.lastmod}
                      onChange={(e) => updateUrlRow(item.id, 'lastmod', e.target.value)}
                      className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: XML Preview & Download */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="font-bold text-blue-400 flex items-center gap-1.5 text-xs">
                <Code size={14} /> sitemap.xml Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            </div>

            <pre className="h-80 font-mono text-xs text-emerald-400 overflow-auto p-2 leading-relaxed bg-slate-950 rounded-xl border border-slate-800">
              {generateSitemapXml()}
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Valid W3C Sitemap 0.9 XML Format</span>
            <span className="text-emerald-400 font-bold">Search Console Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
